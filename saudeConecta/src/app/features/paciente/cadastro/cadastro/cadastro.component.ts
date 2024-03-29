import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {

  constructor(private router: Router){}

  cadastraMedico() {
   this.router.navigate(['cadastroMedico'])
    }


    cadastraPaciente() {
      this.router.navigate(['cadastroPaciente'])
    }


}
