import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tokenService } from 'src/app/util/Token/token.service';
import { Adiministrador } from 'src/app/util/variados/interfaces/administrado/adiministrador';

@Injectable({
  providedIn: 'root'
})
export class UsuarioAdmService {





  private apiUrl = 'http://localhost:8080';
  private Token = this.tokenService.retornaToken();


  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService
  ) {}




cadastrarUsuarioADM(codigo: string): Observable<Adiministrador> {
  return this.http.get<Adiministrador>( `${this.apiUrl}/administrador/buscarPorCoigoAutorizacao/${codigo}` );
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
  return this.http.put<any>( `${this.apiUrl}/administrador/esqueciMinhaSenhaADM`,Administrador, options);

}


TrocaSenha(Administrador: any) {
  const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.tokenService.retornaToken()}`, };
  const options = { headers, withCredentials: true };
  return this.http.put<any>( `${this.apiUrl}/administrador/TrocaSenhaADM`,Administrador, options);

}


}
