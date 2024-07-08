import { Paciente } from '../../util/variados/interfaces/paciente/paciente';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';

import { HttpClient, HttpResponse } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';



import { Router } from '@angular/router';
import { tokenService } from 'src/app/util/Token/Token.service';


@Injectable({
  providedIn: 'root',
})
export class ModelService {


  //
  //
  //




  Usuario: Usuario = {
    id: 0,
    login: '',
    senha: '',
    tipoUsuario: '',
    status: ''
  };
  private apiUrl = 'http://localhost:8080';
  private Token = this.tokenService.retornaToken();

  public UsuarioEstaLogado : boolean = false;




  constructor(
    private router : Router ,
    private http: HttpClient,
    private tokenService: tokenService) {}








  iniciarObservacaoDadosUsuario(): void {
    if (this.tokenService.possuiToken()) {
      this.tokenService.decodificaToken();
    }
  }








  deslogar(): void {
    this.tokenService.excluirToken();
    this.tokenService.changeDadosUsuarioLogado(null);
  }

  estaLogado(): boolean {
    return this.tokenService.possuiToken();
  }

  dadosUsuario(dados: Usuario)  : void {
    this.Usuario = dados;
    console.log(dados);
  }


  fazerLogin(usuario: Usuario) {
    return this.http.post<any>(`${this.apiUrl}/Home/login`, usuario, { observe: 'response' })

  }


  buscarUsuarioExistente(username: any) {
    return this.http.get<Usuario>(`${this.apiUrl}/Home/buscarUsuarioExistente/${username}` );
  }

  verificarLogin(): boolean {
    const userToken = this.tokenService.retornaToken()
    return !!userToken; // Verificar se o token está presente no localStorage
  }

  logout(): void {
    this.tokenService.excluirToken();
    this.tokenService.setAuthTwof(false);
    this.router.navigate(['']);
  }



}
