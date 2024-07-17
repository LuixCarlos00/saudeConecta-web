import { Usuario } from './../variados/interfaces/usuario/usuario';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Paciente } from '../variados/interfaces/paciente/paciente';
import { Adiministrador } from '../variados/interfaces/administrado/adiministrador';
import { Medico } from '../variados/interfaces/medico/medico';
import * as jwt_decode from 'jwt-decode';
import { ApiUrlService } from 'src/app/service/_Url-Global/Api-Url.service';

const KEY: string = 'authToken';
const authTwof: string = 'authTwof';

@Injectable({ providedIn: 'root' })
export class tokenService {
  //
  //
  //

  constructor(
    private apiUrl_Global : ApiUrlService
  ) {
   this.apiUrl = this.apiUrl_Global.getUrl()
  }

  private apiUrl = '';

  private UsuarioLogadoSubject = new BehaviorSubject<any | null>(null);
  UsuarioLogadoValue$ = this.UsuarioLogadoSubject.asObservable();


  private Usuario = {
    id: 0,
    login: '',
    senha: '',
    roles: '',
  };

  salvarToken(token: string) {
    window.localStorage.setItem(KEY, token);
  }

  excluirToken() {
    localStorage.removeItem(KEY);
  }

  retornaToken() {
    return localStorage.getItem(KEY) ?? '';
  }

  possuiToken(): boolean {
    const token = localStorage.getItem(KEY);
    if (token) {
      return true;
    } else {
      return false;
    }
  }

  removeToken() {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(authTwof);
  }

  setAuthTwof(authTwof: boolean): void {
    window.localStorage.setItem('authTwof', authTwof.toString());
  }

  getAuthTwof(): boolean {
    if (!localStorage.getItem(authTwof)) {
      return false;
    } else return true;
  }

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


  public decodificaToken(): void {
    const token = this.retornaToken();
    if (token) {
      const Usuario = jwt_decode.jwtDecode(token) as Usuario;
      this.UsuarioLogadoSubject.next(Usuario);
    }
  }

  getDadosUsuario(): Observable<Usuario | null> {
    return this.UsuarioLogadoSubject.asObservable();
  }

  changeDadosUsuarioLogado(Usuario: any) {
    this.UsuarioLogadoSubject.next(Usuario);
  }




}
