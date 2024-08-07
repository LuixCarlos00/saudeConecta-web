import { ControleAcessoService } from './../../../service/_controleAcesso/controle-acesso.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
 import { tokenService } from 'src/app/util/Token/Token.service';
import { Usuario } from '../interfaces/usuario/usuario';
import { LoginService } from 'src/app/service/service-login/login.service';

@Component({
  selector: 'app-barra-Latera',
  templateUrl: './barra-Latera.component.html',
  styleUrls: ['./barra-Latera.component.css'],
})
export class BarraLateraComponent implements OnInit {
  AcessoPermitido: string = '';

  UsuarioLogado: Usuario = {
    id: 0,
    aud: '',
    exp: '',
    iss: '',
    sub: ''
  };

  constructor(
    public LoginService: LoginService,
    private router: Router,
    private tokenService: tokenService,
    public ControleAcessoService: ControleAcessoService
  ) {}

  ngOnInit() {
    this.LoginService.iniciarObservacaoDadosUsuario();
    this.tokenService.UsuarioLogadoValue$.subscribe((UsuarioLogado) => {
      if (UsuarioLogado) this.UsuarioLogado = UsuarioLogado;
      console.log(UsuarioLogado, 'paciente');
    });
  }

  redirecionamentoDePaginas(rota: string) {
    if (rota === 'Dashboard') {

      this.router.navigate(['Dashboard']);

    } else if (rota === 'gerenciamento') {

      this.router.navigate(['gerenciamento']);

    } else if (rota === 'cadastroPaciente') {

      this.router.navigate(['cadastroPaciente']);

    } else if (rota === 'Usuarios') {

      this.router.navigate(['Gerenciamento-Usuarios']);

    } else if (rota === 'prontuario') {

      this.router.navigate(['Prontuario']);

    }
    else if (rota === 'Historico') {

    this.router.navigate(['Historico']);

  }



    else if (rota === 'trocar_senha') {

      this.router.navigate(['trocaSenha']);

   } else {
      this.router.navigate(['**']); // pagina 404
    }
  }

  estaLogado(): Boolean {
    return this.LoginService.verificarLogin();
  }

  Deslogar() {
    this.LoginService.logout();
  }
}
