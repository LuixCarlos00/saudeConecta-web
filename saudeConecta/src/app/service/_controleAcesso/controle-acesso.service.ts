import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { tokenService } from './../../util/Token/Token.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ControleAcessoService {
  UsuarioLogado: Usuario = {
    id: 0,
    aud: '',
    exp: '',
    iss: '',
    sub: '',
  };
  constructor(private tokenService: tokenService) {
    this.tokenService.decodificaToken();
    this.tokenService.UsuarioLogadoValue$.subscribe((paciente) => {
      if (paciente) {
        this.UsuarioLogado = paciente;
      }
    });
  }

  AcessoMedico() {
    if (this.tokenService.obterAutorizacao() === '[ROLE_Medico]') {
      return true;
    } else {
      return false;
    }
  }

  AcessoAdministrador() {
    if (this.tokenService.obterAutorizacao() === '[ROLE_ADMIN]') {
      return true;
    } else {
      return false;
    }
  }

  AcessoSecretaria() {
    if (this.tokenService.obterAutorizacao() === '[ROLE_Secretaria]') {
      return true;
    } else {
      return false;
    }
  }
}
