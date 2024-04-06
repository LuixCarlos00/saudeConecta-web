import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';

import { HttpClient, HttpResponse } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { tokenService } from 'src/app/util/Token/token.service';

import { Endereco } from 'src/app/util/variados/interfaces/endereco/endereco';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';

import * as jwt_decode from 'jwt-decode';

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
    roles: undefined,
  };
  private apiUrl = 'http://localhost:8080';
  private Token = this.tokenService.retornaToken();




  constructor(private http: HttpClient, private tokenService: tokenService) {

  }


  iniciarObservacaoDadosUsuario() {
    if (this.tokenService.possuiToken()) {
      this.decodificaToken();
    }
  }

  public decodificaToken() {
    const token = this.tokenService.retornaToken();
    const Usuario =  jwt_decode.jwtDecode(token) as Usuario;
    console.log('o usuario sssssssssss ', Usuario);

    this.usuarioSubject.next(Usuario);
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




  estaLogado(){
    return this.tokenService.possuiToken();
  }




  dadosUsuario(dados: Usuario) {
    this.Usuario = dados;
    console.log(dados);
  }





  cadastrarUsuario(usuario: Usuario): Observable<HttpResponse<any>> {
    return this.http
      .post<Usuario>(`${this.apiUrl}/Home/cadastralogin`, usuario, {
        observe: 'response',
      })
      .pipe(
        tap((response: HttpResponse<any>) => {
          if (response.body && response.body.tokenJWT) {
            this.tokenService.salvarToken(response.body.tokenJWT);

          } else {

            console.error('Token JWT não encontrado na resposta');
          }
        })
      );
  }

  cadastraEndereco(Endereco: Endereco): Observable<Endereco> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http.post<Endereco>(
      `${this.apiUrl}/endereco/post`,
      Endereco,
      options
    );
  }

  cadastrarPaciente(Paciente: Paciente): Observable<Paciente> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http.post<Paciente>(
      `${this.apiUrl}/paciente/post`,
      Paciente,
      options
    );
  }
}
