import { tokenService } from './../../util/Token/Token.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Adiministrador } from 'src/app/util/variados/interfaces/administrado/adiministrador';


import { Endereco } from 'src/app/util/variados/interfaces/endereco/endereco';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';
import { Secretaria } from 'src/app/util/variados/interfaces/secretaria/secretaria';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {



  private apiUrl = '';
  private Token = this.tokenService.retornaToken();

  private NovoUsuariocadastradoSubject = new BehaviorSubject<any | null>(null);
  NovoUsuariocadastradoValue$ = this.NovoUsuariocadastradoSubject.asObservable();


  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService,
    private apiUrl_Global : ApiUrlService
  ) {
   this.apiUrl = this.apiUrl_Global.getUrl()
  }


cadastraEndereco(Endereco: Endereco): Observable<Endereco> {
  const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.tokenService.retornaToken()}`, };
  const options = { headers, withCredentials: true };
  return this.http.post<Endereco>( `${this.apiUrl}/endereco/post`, Endereco, options);
}



cadastrarUsuario(usuario: any): Observable<HttpResponse<any>> {
  return this.http.post<Usuario>(`${this.apiUrl}/Home/cadastralogin`, usuario, { observe: 'response', })
    .pipe(
      tap((response: HttpResponse<any>) => {
        if (response.body && response.body.tokenJWT) {
        this.NovoUsuariocadastradoSubject.next(response.body.usuarioView);
        } else {
          console.error('Token JWT não encontrado na resposta');
        }
      })
    );
}


BuscarTodosUsuarios(): Observable<{ paciente: Paciente[], medico: Medico[], secretaria: Secretaria[], administrador: Adiministrador[] }> {

  const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.tokenService.retornaToken()}`, };
  const options = { headers, withCredentials: true };
  return this.http.get<{ paciente: Paciente[], medico: Medico[], secretaria: Secretaria[], administrador: Adiministrador[] }>( `${this.apiUrl}/Home/BuscarTodosUsuarios`, options);
}


deletarUsuario(codigo: number) {
  const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.tokenService.retornaToken()}`, };
  const options = { headers, withCredentials: true };
  return this.http.delete<Usuario>( `${this.apiUrl}/Home/deletarPorId/${codigo}`, options);
}


}


