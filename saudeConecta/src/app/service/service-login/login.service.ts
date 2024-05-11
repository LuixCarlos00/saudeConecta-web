import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';


import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tokenService } from 'src/app/util/Token/token.service';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';


@Injectable({ providedIn: 'root' })
export class LoginService {

  constructor(private http: HttpClient, private TOkenService: tokenService) {
    this.TOkenService.retornaToken()
  }

  private apiUrl = 'http://localhost:8080';

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  private nomeUsuario!: any;






  // TemToken(): boolean {
  //   const token = this.TOkenService.retornaToken();
  //   if (!token) {
  //     ///token é nulo
  //     return false;
  //   } else return true;
  //   ///possui um token
  // }








  // getUsuarioAtual(): Usuario | undefined {
  //   const usuario = this.usuarioSubject.getValue();
  //   console.log(usuario, 'sssss');

  //   return usuario !== null ? usuario : undefined;
  // }



  // getUsuario(): Observable<Usuario | null> {
  //   console.log(this.usuarioSubject.asObservable());

  //   return this.usuarioSubject.asObservable();
  // }




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
