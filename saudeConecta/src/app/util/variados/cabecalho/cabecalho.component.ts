import { Component, OnInit } from '@angular/core';
import { PacienteService } from 'src/app/service/paciente_service/paciente.service';

@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.css']
})
export class CabecalhoComponent implements OnInit {
aaa() {
console.log('Logout clicked22');

}
console: any;

  constructor(public pacienteService: PacienteService) { }

  ngOnInit() { }

  estaLogado(): Boolean {
    return this.pacienteService.verificarLogin();
  }

  logout() {
    console.log('Logout clicked');
    this.pacienteService.logout();
  }
}
