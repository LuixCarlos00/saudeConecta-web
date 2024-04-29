import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';

import { HttpClient, HttpResponse } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { tokenService } from 'src/app/util/Token/token.service';

import { Endereco } from 'src/app/util/variados/interfaces/endereco/endereco';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';

import * as jwt_decode from 'jwt-decode';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {

  //
  //
  //

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);

  Usuario: Usuario = {
    id: 0,
    login: '',
    senha: '',
    roles: '',
  };
  private apiUrl = 'http://localhost:8080';
  private Token = this.tokenService.retornaToken();

  public Login : boolean = false;
  public MedicoCidade: Medico[] | undefined;
  public MedicoCRM :Medico[]|undefined;
  public MedicoNome:Medico[]|undefined;
  public MedicoEspecialidade : Medico[]|undefined;

  constructor(private http: HttpClient, private tokenService: tokenService) {}

  iniciarObservacaoDadosUsuario() {
    if (this.tokenService.possuiToken()) {
      this.decodificaToken();
    }
  }

  public decodificaToken() {
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

  deslogar() {
    this.tokenService.excluirToken();
    this.usuarioSubject.next(null);
  }

  estaLogado() {
    return this.tokenService.possuiToken();
  }

  dadosUsuario(dados: Usuario) {
    this.Usuario = dados;
    console.log(dados);
  }

  fazerLogin(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Home/login`, usuario, { observe: 'response' }).pipe(
      tap((response: HttpResponse<any>) => {
        const tokenJWT = response.body.token
        if (response.body.token) {
          this.tokenService.salvarToken(tokenJWT);
          this.Login= true;
        } else {
          console.error('Token JWT não encontrado no cabeçalho de resposta');
        }
      })
    );
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
