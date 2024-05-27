import { Paciente } from '../../util/variados/interfaces/paciente/paciente';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';

import { HttpClient, HttpResponse } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { tokenService } from 'src/app/util/Token/token.service';




import * as jwt_decode from 'jwt-decode';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class ModelService {


  //
  //
  //

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  PacienteValue$ = this.usuarioSubject.asObservable();



  Usuario: Usuario = {
    id: 0,
    login: '',
    senha: '',
    roles: '',
  };
  private apiUrl = 'http://localhost:8080';
  private Token = this.tokenService.retornaToken();

  public UsuarioEstaLogado : boolean = false;




  constructor(
    private router : Router ,
    private http: HttpClient,
    private tokenService: tokenService) {}








  iniciarObservacaoDadosUsuario(): void {
    if (this.tokenService.possuiToken()) {
      this.decodificaToken();
    }
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


  buscarUsuarioExistente(username: any) {
    return this.http.get<Usuario>(`${this.apiUrl}/Home/buscarUsuarioExistente/${username}` );
  }

  verificarLogin(): boolean {
    const userToken = this.tokenService.retornaToken()
    return !!userToken; // Verificar se o token está presente no localStorage
  }

  logout(): void {
    this.tokenService.excluirToken();
    this.tokenService.setAuthTwof(false);
    this.router.navigate(['']);
  }



}
