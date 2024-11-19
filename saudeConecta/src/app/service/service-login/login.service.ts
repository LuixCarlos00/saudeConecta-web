import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tokenService } from './../../util/Token/Token.service';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoginService {

  //
  //
  //
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  private nomeUsuario!: any;
  private apiUrl = '';
  private Token = this.tokenService.retornaToken();
  public UsuarioEstaLogado: boolean = false;

  constructor(
    private apiUrl_Global: ApiUrlService,
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService
  ) {
    this.tokenService.retornaToken();
  }





  deslogar() {
    this.tokenService.removeToken();
    this.usuarioSubject.next(null);
  }




  estaLogado() {
    const token = this.tokenService.retornaToken();

    if (!token) {
      return false; // nao ta logado
    } else if (this.tokenService.oTokenEstavalido(token)) {
      return true; // token é valido e retorna  true
    } else return false; // user nao ta logado retorna false
  }



  pussuiToken(): boolean {
    return this.tokenService.possuiToken();
  }



  iniciarObservacaoDadosUsuario(): void {
    if (this.tokenService.possuiToken()) {
      this.tokenService.decodificaToken();
    }
  }



  fazerLogin(usuario: any) {
    return this.http.post<any>(`${this.apiUrl}/Home/login`, usuario, { observe: 'response', });
  }



  buscarUsuarioExistente(username: any) {
    return this.http.get<Usuario>(`${this.apiUrl}/Home/buscarUsuarioExistente/${username}`);
  }




  verificarLogin(): boolean {
    const userToken = this.tokenService.retornaToken();
    return !!userToken; // Verificar se o token está presente no localStorage
  }




  logout(): void {
    this.tokenService.excluirToken();
    this.tokenService.setAuthTwof(false);
    this.router.navigate(['']);
  }
}
