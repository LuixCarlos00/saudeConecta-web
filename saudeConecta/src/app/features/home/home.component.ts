import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
Deslogar() {
throw new Error('Method not implemented.');
}



  constructor(private router :Router) {}

  PesquisarMedicos() {
  this.router.navigate(['pesquisar'])
  }
  VerificarAgenda() {
    this.router.navigate(['agenda'])
  }

  VerificarHistorico() {
    this.router.navigate(['historico'])
    }

    redirecionamentoDePaginas(arg0: string) {
      throw new Error('Method not implemented.');
      }

}
