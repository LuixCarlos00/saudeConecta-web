import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService } from 'src/app/service/paciente_service/paciente.service';
import {MatMenuModule} from '@angular/material/menu';



@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.css'],

})
export class CabecalhoComponent implements OnInit {

  Usuario: Usuario | undefined;

user = 'usuario';
  constructor(public pacienteService: PacienteService,private router: Router, private tokenService: PacienteService) { }

  ngOnInit() {

    this.tokenService.PacienteValue$.subscribe((paciente) => {
      console.log(paciente, 'paciente');

      if (paciente)
      this.Usuario = paciente;
    });
    this.estaLogado();
  }

  estaLogado(): Boolean {
    return this.pacienteService.verificarLogin();
  }

  logout() {
    console.log('Logout clicked');
    this.pacienteService.logout();
  }


  Menu() {
    this.router.navigate(['home']);
    }
}
