import { Usuario } from './../../../util/variados/interfaces/usuario/usuario';
import { Medico } from './../../../util/variados/interfaces/medico/medico';
import { Paciente } from './../../../util/variados/interfaces/paciente/paciente';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecuperaCadastroService } from '../service/recupera-cadastro.service';

@Component({
  selector: 'app-recupera-senha',
  templateUrl: './recupera-senha.component.html',
  styleUrls: ['./recupera-senha.component.css'],
})
export class RecuperaSenhaComponent implements OnInit {
  novaSenha!: FormGroup;
  Paciente!: Paciente;
  Medico!: Medico;
  Usuario!: Usuario;

  constructor(
    private recuperaCadastroService: RecuperaCadastroService,
    private form: FormBuilder
  ) {
    this.novaSenha = this.form.group({
      password2: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.Medico = this.recuperaCadastroService.GEtdadosIstanciaMedico();
    this.Paciente = this.recuperaCadastroService.GetdadosIstanciaPaciente();
  }

  Confirma() {
if(this.novaSenha.valid){






}



  }
}
