import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

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

}
