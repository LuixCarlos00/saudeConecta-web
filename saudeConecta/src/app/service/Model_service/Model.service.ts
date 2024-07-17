import { Paciente } from '../../util/variados/interfaces/paciente/paciente';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';

import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';



import { Router } from '@angular/router';
import { tokenService } from 'src/app/util/Token/Token.service';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';


@Injectable({
  providedIn: 'root',
})
export class ModelService {


  //
  //
  //




  Usuario: Usuario = {
    id: 0,
    aud: '',
    exp: '',
    iss: '',
    sub: ''
  };
  private apiUrl = '';
  private Token = this.tokenService.retornaToken();

  public UsuarioEstaLogado : boolean = false;




  constructor(private http: HttpClient, private tokenService: tokenService, private apiUrl_Global: ApiUrlService ,private router : Router) {
    this.apiUrl = this.apiUrl_Global.getUrl();
  }







  iniciarObservacaoDadosUsuario(): void {
    if (this.tokenService.possuiToken()) {
      this.tokenService.decodificaToken();
    }
  }








  deslogar(): void {
    this.tokenService.excluirToken();
    this.tokenService.changeDadosUsuarioLogado(null);
  }

  estaLogado(): boolean {
    return this.tokenService.possuiToken();
  }

  dadosUsuario(dados: Usuario)  : void {
    this.Usuario = dados;
    console.log(dados);
  }

  fazerLogin(usuario: any) {
    return this.http.post<any>(`${this.apiUrl}/Home/login`, usuario, { observe: 'response' });
  }

  buscarUsuarioExistente(username: any) {
    console.log('serviço', username);
    return this.http.get<Usuario>(`${this.apiUrl}/Home/buscarUsuarioExistente/${username}`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something went wrong; please try again later.';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
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
