import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tokenService } from "src/app/util/Token/Token.service";
import { Adiministrador } from 'src/app/util/variados/interfaces/administrado/adiministrador';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioAdmService {





  private apiUrl = '';
  private Token = this.tokenService.retornaToken();


  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService,
    private apiUrl_Global : ApiUrlService
  ) {
   this.apiUrl = this.apiUrl_Global.getUrl()

  }






cadastrarAdministrador(Administracao: Adiministrador) {

  const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.tokenService.retornaToken()}`, };
  const options = { headers, withCredentials: true };
  return this.http.post<Adiministrador>( `${this.apiUrl}/administrador/post`, Administracao, options);

}


ObeterCodigoParaRecuperacaoDeSenhaPassandoOEmail(Administracao: Adiministrador): Observable<any> {

  const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.tokenService.retornaToken()}`, };
  const options = { headers, withCredentials: true };
  return this.http.get<Adiministrador>( `${this.apiUrl}/administrador/buscarPorEmail/${Administracao}`, options);

}

ConfirmaCodigoDeSeguraca(codigo: any) {

  const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.tokenService.retornaToken()}`, };
  const options = { headers, withCredentials: true };
  return this.http.get<Adiministrador>( `${this.apiUrl}/administrador/InserirCodigo/${codigo}`, options);

}

esqueciMinhaSenha(Administrador: any) {
  const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.tokenService.retornaToken()}`, };
  const options = { headers, withCredentials: true };
  return this.http.put<any>( `${this.apiUrl}/Home/esqueciMinhaSenha`,Administrador, options);

}


TrocaSenha(Administrador: any) {
  const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.tokenService.retornaToken()}`, };
  const options = { headers, withCredentials: true };
  return this.http.put<any>( `${this.apiUrl}/Home/TrocaSenhaADM`,Administrador, options);

}


TrocaSenhaDoUsuario(codigo: any, senhaNovaDTO: any) {
  const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.tokenService.retornaToken()}`, };
  const options = { headers, withCredentials: true };
  return this.http.put<any>( `${this.apiUrl}/Home/TrocaSenhaDoUsuario/${codigo}`,senhaNovaDTO, options);

}



}
