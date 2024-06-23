import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModelService } from 'src/app/service/Model_service/Model.service';
import { tokenService } from '../../Token/token.service';

@Component({
  selector: 'app-barra-Latera',
  templateUrl: './barra-Latera.component.html',
  styleUrls: ['./barra-Latera.component.css']
})
export class BarraLateraComponent implements OnInit {




AcessoPermitido: string = '';

Usuario: any;

constructor(
  public ModelService: ModelService,
  private router: Router,
  private tokenService: tokenService
) {}

ngOnInit() {
  this.tokenService.token();
  this.tokenService.UsuarioLogadoValue$.subscribe((paciente) => {
    if (paciente) this.Usuario = paciente;
    console.log(paciente, 'paciente');
  });


}

redirecionamentoDePaginas(rota: string) {



  if (rota === 'Home') {
    this.router.navigate(['home']);
  }

 else if (rota === 'agenda') {

    this.router.navigate(['gerenciamento']);
  }

  else if (rota === 'PlanoDeEnsino') {

    this.router.navigate(['plano_ensino']);
  }

  else if (rota === 'Quadro_Disponibilidade') {
    this.router.navigate(['Quadro_Disponibilidade']);
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
  console.log('Logout clicked');
  this.ModelService.logout();
}


}
