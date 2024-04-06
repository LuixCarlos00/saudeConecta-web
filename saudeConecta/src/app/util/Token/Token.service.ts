import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../variados/interfaces/usuario/usuario';


const KEY: string = 'authToken';
const authTwof: string = 'authTwof';

@Injectable({ providedIn: 'root' })
export class tokenService {


  //
  //
  //
  private Subject = new BehaviorSubject<Usuario | null>(null);

  salvarToken(token: string) {
    window.localStorage.setItem(KEY, token);
  }


  excluirToken() {
    localStorage.removeItem(KEY);
  }

  retornaToken(){
    return localStorage.getItem(KEY)  ?? ""
  }

  possuiToken() {
   return !!this.retornaToken()
  }

  //!===========================================================================================================
  removeToken() {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(authTwof);
  }

  //!===========================================================================================================

  setAuthTwof(authTwof: boolean): void {
    window.localStorage.setItem('authTwof', authTwof.toString());
  }

  //!===========================================================================================================

  getAuthTwof(): boolean {
    if (!localStorage.getItem(authTwof)) {
      return false;
    } else return true;
  }

  //!===========================================================================================================

  oTokenEstavalido(token: any): boolean {
    if (!token) {
      // Tratar o caso em que token é null
      return false;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const TempoDoToken = decodedToken.exp;

      if (typeof TempoDoToken !== 'undefined') {
        return Math.floor(new Date().getTime() / 1000) < TempoDoToken; ///retorna true se valido
      } else {
        return false; /// retorna false se invalido
      }
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return false;
    }
  }

  //!===========================================================================================================

  public decodificaTokenPROFESSOR() {
    const jwt_decode = require('jwt-decode');
    const token: any = this.retornaToken();

    if (token) {
      const usuario: Usuario = jwt_decode(token) as Usuario;

      this.Subject.next(usuario);
    }

    /* O método decodificaToken() é responsável por
       decodificar o token JWT armazenado no serviço
       tokenService e extrair informações relevantes dele. */
  }
  //!===========================================================================================================
}
