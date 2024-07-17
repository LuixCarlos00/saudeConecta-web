import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModelService } from 'src/app/service/Model_service/Model.service';
import { tokenService } from 'src/app/util/Token/Token.service';
import { Usuario } from '../interfaces/usuario/usuario';

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
    public ModelService: ModelService,
    private router: Router,
    private tokenService: tokenService
  ) {}

  ngOnInit() {
    this.ModelService.iniciarObservacaoDadosUsuario();
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

    }



    else if (rota === 'trocar_senha') {

      this.router.navigate(['trocaSenha']);

   } else {
      this.router.navigate(['**']); // pagina 404
    }
  }

  estaLogado(): Boolean {
    return this.ModelService.verificarLogin();
  }

  Deslogar() {
    this.ModelService.logout();
  }
}
