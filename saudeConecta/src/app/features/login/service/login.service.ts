import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';


import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tokenService } from 'src/app/util/Token/token.service';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';



@Injectable({ providedIn: 'root' })
export class LoginService {
  private apiUrl = 'http://localhost:8080';

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  private nomeUsuario!: any;

  constructor(private http: HttpClient, private tokenService: tokenService) {
    this.tokenService.retornaToken() && this.decodificaToken();
  }

  //!==============================================================================================================
  TemToken(): boolean {
    const token = this.tokenService.retornaToken();
    if (!token) {
      ///token é nulo
      return false;
    } else return true;
    ///possui um token
  }

  //!==============================================================================================================
  getUsuarioAtual(): Usuario | undefined {
    const usuario = this.usuarioSubject.getValue();
    return usuario !== null ? usuario : undefined;
  }

  //!==============================================================================================================

  getUsuario(): Observable<Usuario | null> {
    return this.usuarioSubject.asObservable();
  }

  //!==============================================================================================================

  public decodificaToken() {
    const jwt_decode = require('jwt-decode');
    const token: any = this.tokenService.retornaToken();

    if (token) {
      const usuario: Usuario = jwt_decode(token) as Usuario;
      this.nomeUsuario = usuario.login;
      this.usuarioSubject.next(usuario);
    }
    /* O método decodificaToken() é responsável por
       decodificar o token JWT armazenado no serviço
       tokenService e extrair informações relevantes dele. */
  }

  //!==============================================================================================================

  deslogar() {
    this.tokenService.removeToken();
    this.usuarioSubject.next(null);
  }

  //!==============================================================================================================
  obterAutorizacao() {
    this.decodificaToken();
    const usuario = this.usuarioSubject.getValue();
    return usuario ? usuario.
    roles : [];
  }

  //!==============================================================================================================
  estaLogado(): boolean {
    const token = this.tokenService.retornaToken();

    if (!token) {
      return false; // nao ta logado
    } else if (this.tokenService.oTokenEstavalido(token)) {
      return true; // token é valido e retorna  true
    } else return false; // user nao ta logado retorna false
  }

  //!==============================================================================================================
  authenticateLogin(
    login: string,
    senha: string,
    tipoUsuario: string
  ): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/login`,
        {
          PROUsuario: 'prof',
          PROSenha: '1234567',
          TipoAcesso: 'PROFESSOR',
        },
        { observe: 'response', responseType: 'text' }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Usuário ou senha incorretos
            return throwError('Usuário ou senha incorretos.');
          } else if (error.status === 400) {
            // Campos em branco ou formato inválido
            return throwError('Preencha todos os campos corretamente.');
          } else {
            // Outros erros
            return throwError('Erro no login. Tente novamente.');
          }
        }),
        tap((response) => {
          const authTokenBody: any = response.body;
          this.tokenService.salvarToken(authTokenBody);
        })
      );
  }

  //!==============================================================================================================

  authentificacao2FA(verificationCode: string): Observable<any> {
    const token = this.tokenService.retornaToken();
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const options = { headers, withCredentials: true };

    return this.http
      .post(
        `${this.apiUrl}/autentificado/verificarlogin`,
        { chaveAutentificacao: verificationCode },
        options
      )
      .pipe(
        catchError((erro: HttpErrorResponse) => {
          if (erro.status === 401) {
            return throwError('Chave de acesso inválida.');
          } else {
            // Outros erros
            return throwError('Erro no login. Tente novamente.');
          }
        }),
        // Adiciona o operador tap para executar a ação após a conclusão bem-sucedida
        tap(() => {
          this.decodificaToken();
          const authTwof: boolean = true;
          this.tokenService.setAuthTwof(authTwof);
        })
      );
  }
}
