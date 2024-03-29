import { TokenService } from './../../../util/Token/Token.service';
import { Usuario } from './../../../util/variados/interfaces/usuario/usuario';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Endereco } from 'src/app/util/variados/interfaces/endereco/endereco';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';



@Injectable({
  providedIn: 'root'
})
export class PacienteService {
//
//
//


private usuarioSubject: BehaviorSubject<Usuario | null> = new BehaviorSubject<Usuario | null>(null);

Usuario: Usuario = {
  id: 0,
  login:'',
  senha:'',
};
  private apiUrl = 'http://localhost:8080';
  public Token = this.tokenService.getToken();


  constructor(private http: HttpClient , private tokenService :TokenService) {
   this.decodificaToken();
   console.log(this.decodificaToken,'token decodificado');

  }

  public decodificaToken() {
    const jwt_decode = require('jwt-decode');
    const token: any = this.tokenService.getToken();

    if (token) {
      const usuario: Usuario = jwt_decode(token) as Usuario;
      this.usuarioSubject.next(usuario);
    }
    /* O método decodificaToken() é responsável por
       decodificar o token JWT armazenado no serviço
       tokenService e extrair informações relevantes dele. */
  }


  getDadosUsuario(): Observable<Usuario | null> {
    return this.usuarioSubject.asObservable();
  }



  dadosUsuario(dados: Usuario) {
    this.Usuario = dados;
  }



  cadastrarUsuario(usuario: Usuario): Observable<HttpResponse<any>> {
    return this.http.post<Usuario>(`${this.apiUrl}/Home/cadastralogin`, usuario, { observe: 'response' })
      .pipe(
        tap((response: HttpResponse<any>) => {
          // Verifica se a resposta contém o token JWT
          if (response.body && response.body.tokenJWT) {
            // Armazena o token JWT no serviço de token
            this.tokenService.setToken(response.body.tokenJWT);
          } else {
            // Se não houver token na resposta, exiba uma mensagem de erro ou trate conforme necessário
            console.error('Token JWT não encontrado na resposta');
          }
        })
      );
  }


  cadastraEndereco(Endereco: Endereco) :Observable<Endereco> {
    console.log('chegou no service');

    const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.Token}`};
    const options = { headers, withCredentials: true };
    return this.http.post<Endereco>(`${this.apiUrl}/endereco/post`,Endereco, options)
  }


  cadastrarPaciente(Paciente: Paciente):Observable<Paciente> {

    const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.Token}`};
    const options = { headers, withCredentials: true };
    return this.http.post<Paciente>(`${this.apiUrl}/paciente/post`,Paciente, options)
  }


}



