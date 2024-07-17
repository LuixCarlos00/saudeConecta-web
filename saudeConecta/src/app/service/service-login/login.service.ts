import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';


import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tokenService } from './../../util/Token/Token.service';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';


@Injectable({ providedIn: 'root' })
export class LoginService {

  constructor(
    private http: HttpClient,
    private TOkenService: tokenService
  ) {
    this.TOkenService.retornaToken()
  }


  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  private nomeUsuario!: any;




  deslogar() {
    this.TOkenService.removeToken();
    this.usuarioSubject.next(null);
  }


  estaLogado() {
    const token = this.TOkenService.retornaToken();

    if (!token) {
      return false; // nao ta logado
    } else if (this.TOkenService.oTokenEstavalido(token)) {
      return true; // token é valido e retorna  true
    } else return false; // user nao ta logado retorna false

  }


  pussuiToken():boolean{
    return this.TOkenService.possuiToken();
  }



}
