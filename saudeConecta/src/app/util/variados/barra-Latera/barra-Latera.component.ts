import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModelService } from 'src/app/service/Model_service/Model.service';
import { tokenService } from "src/app/util/Token/Token.service";
import { Usuario } from '../interfaces/usuario/usuario';

@Component({
  selector: 'app-barra-Latera',
  templateUrl: './barra-Latera.component.html',
  styleUrls: ['./barra-Latera.component.css']
})
export class BarraLateraComponent implements OnInit {




AcessoPermitido: string = '';

UsuarioLogado: Usuario = {
  id: 0,
  login: '',
  senha: '',
  roles: '',
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



  if (rota === 'Home') {
    this.router.navigate(['home']);
  }

 else if (rota === 'cadastroUsuario') {

    this.router.navigate(['cadastroUsuario']);
  }

  else if (rota === 'cadastroPaciente') {

    this.router.navigate(['cadastroPaciente']);
  }

  else if (rota === 'trocaSenha') {
    this.router.navigate(['trocaSenha']);
  }

  else if (rota === 'Arquivos_Diversos') {
    this.router.navigate(['Arquivos_Diversos']);
  }


  else{
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
