import { Injectable } from '@angular/core';
import { Usuario } from '../variados/interfaces/usuario/usuario';
import { BehaviorSubject } from 'rxjs';


const KEY: string = 'authToken';


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  private nomeUsuario!: any;

constructor() { }



setToken(token: string) {
  window.localStorage.setItem(KEY, token);
}

getToken() {
  return window.localStorage.getItem(KEY);
}

removeToken() {
  window.localStorage.removeItem(KEY);

}



// public decodificaToken() {
//   const jwt_decode = require('jwt-decode');
//   const token: any = this.getToken();

//   if (token) {
//     const usuario: Usuario = jwt_decode(token) as Usuario;
//     this.nomeUsuario = usuario.login;
//     this.usuarioSubject.next(usuario);
//   }
//   /* O método decodificaToken() é responsável por
//      decodificar o token JWT armazenado no serviço
//      tokenService e extrair informações relevantes dele. */
// }

}
