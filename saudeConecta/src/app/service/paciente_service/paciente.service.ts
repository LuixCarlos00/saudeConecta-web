import { Paciente } from './../../util/variados/interfaces/paciente/paciente';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';

import { HttpClient, HttpResponse } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { tokenService } from 'src/app/util/Token/token.service';

import { Endereco } from 'src/app/util/variados/interfaces/endereco/endereco';


import * as jwt_decode from 'jwt-decode';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';
import { Router } from '@angular/router';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {

  //
  //
  //

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  PacienteValue$ = this.usuarioSubject.asObservable();



  private medicoData = new BehaviorSubject<Medico | null>(null);
  MedicoValue$ = this.medicoData.asObservable();

  Usuario: Usuario = {
    id: 0,
    login: '',
    senha: '',
    roles: '',
  };
  private apiUrl = 'http://localhost:8080';
  private Token = this.tokenService.retornaToken();

  public UsuarioEstaLogado : boolean = false;
  public MedicoCidade: Medico[] | undefined;
  public MedicoCRM :Medico[]|undefined;
  public MedicoNome:Medico[]|undefined;
  public MedicoEspecialidade : Medico[]|undefined;
  public MostraCamposDePEsquisa: boolean = false;


  constructor(
    private router : Router ,
    private http: HttpClient,
    private tokenService: tokenService) {}



    LimparDadosPesquisa(): void {
      this.MedicoCRM = [];
      this.MedicoCidade = [];
      this.MedicoNome = [];
      this.MedicoEspecialidade = [];
    }





  iniciarObservacaoDadosUsuario(): void {
    if (this.tokenService.possuiToken()) {
      this.decodificaToken();
    }
  }


  changeMedicoData(medico: Medico): void {
    this.medicoData.next(medico);
  }



  public decodificaToken(): void {
    const token = this.tokenService.retornaToken();
    if (token) {
      const Usuario = jwt_decode.jwtDecode(token) as Usuario;
      this.usuarioSubject.next(Usuario);
    }
  }

  getDadosUsuario(): Observable<Usuario | null> {
    return this.usuarioSubject.asObservable();
  }

  salvarToken(token: string) {
    this.tokenService.salvarToken(token);
    this.decodificaToken();
  }

  deslogar(): void {
    this.tokenService.excluirToken();
    this.usuarioSubject.next(null);
  }

  estaLogado(): boolean {
    return this.tokenService.possuiToken();
  }

  dadosUsuario(dados: Usuario)  : void {
    this.Usuario = dados;
    console.log(dados);
  }






  fazerLogin(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Home/login`, usuario, { observe: 'response' }).pipe(
      tap((response: HttpResponse<any>) => {
        const tokenJWT = response.body.token;
        if (tokenJWT) {
          this.tokenService.salvarToken(tokenJWT);
          this.tokenService.setAuthTwof(true);
        } else {
          console.error('Token JWT não encontrado no cabeçalho de resposta');
        }
      })
    );
  }

  verificarLogin(): boolean {
    const userToken = this.tokenService.retornaToken()
    return !!userToken; // Verificar se o token está presente no localStorage
  }

  logout(): void {
    this.tokenService.excluirToken();
    this.router.navigate(['']);
  }




  cadastrarUsuario(usuario: Usuario): Observable<HttpResponse<any>> {
    return this.http.post<Usuario>(`${this.apiUrl}/Home/cadastralogin`, usuario, {
        observe: 'response',
      }).pipe(
        tap((response: HttpResponse<any>) => {
          if (response.body && response.body.tokenJWT) {
            this.tokenService.salvarToken(response.body.tokenJWT);
            console.log(this.tokenService.retornaToken(), 'o token ');
          } else {
            console.error('Token JWT não encontrado na resposta');
          }
        })
      );
  }

  cadastraEndereco(Endereco: Endereco): Observable<Endereco> {
    const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.tokenService.retornaToken()}`, };
    const options = { headers, withCredentials: true };
    return this.http.post<Endereco>(`${this.apiUrl}/endereco/post`, Endereco, options);
  }

  cadastrarPaciente(Paciente: Paciente): Observable<Paciente> {
    const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};const options = { headers, withCredentials: true };return this.http.post<Paciente>(`${this.apiUrl}/paciente/post`,Paciente,options);
  }

  cadastrarMedico(Paciente: Medico): Observable<Medico> {
  const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
  const options = { headers, withCredentials: true };
  return this.http.post<Medico>(`${this.apiUrl}/medico/post`,Paciente,options );
  }



  buscarListaMedicosPorEspecialidade(pesquisa: string): Observable<Medico[]> {
    const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
    const options = { headers, withCredentials: true };
    return this.http.get<Medico[]>(`${this.apiUrl}/medico/buscarPorMedEspecialidade/${pesquisa}` ,options ) .pipe(
      tap((medicos: Medico[]) => {
        this.MedicoEspecialidade = medicos;
      })
    );
  }


  buscarListaMedicosPorCidade(pesquisa: string) : Observable<Medico[]>{
    const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
    const options = { headers, withCredentials: true };
    return this.http.get<Medico[]>(`${this.apiUrl}/medico/buscarPorCidade/${pesquisa}`, options ) .pipe(
      tap((medicos: Medico[]) => {
        this.MedicoCidade = medicos;
      })
    );
  }

  buscarListaMedicosPorCRM(pesquisa: string) : Observable<Medico[]>{
    const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
    const options = { headers, withCredentials: true };
    return this.http.get<Medico[]>(`${this.apiUrl}/medico/buscarPorCRM/${pesquisa}`, options ) .pipe(
      tap((medicos: Medico[]) => {
        this.MedicoCRM = medicos;
      })
    );
  }

  buscarListaMedicosPorNome(pesquisa: string): Observable<Medico[]> {
    const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
    const options = { headers, withCredentials: true };
    return this.http.get<Medico[]>(`${this.apiUrl}/medico/buscarPorNome/${pesquisa}`, options ) .pipe(
      tap((medicos: Medico[]) => {
        this.MedicoNome = medicos;
      })
    );
  }



}
