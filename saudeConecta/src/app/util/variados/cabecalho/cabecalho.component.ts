import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModelService } from 'src/app/service/Model_service/Model.service';




@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.css'],

})
export class CabecalhoComponent implements OnInit {


  Usuario: Usuario | undefined;

user = 'usuario';
  constructor(
    public pacienteService: ModelService,
    private router: Router,
     private tokenService: ModelService) { }

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


    TrocaSenha() {
      this.router.navigate(['trocaSenha'])
      }

}
