import { Medico } from './../../../util/variados/interfaces/medico/medico';
import { Paciente } from './../../../util/variados/interfaces/paciente/paciente';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecuperaCadastroService } from '../service/recupera-cadastro.service';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-recupera-cadastro',
  templateUrl: './recupera-cadastro.component.html',
  styleUrls: ['./recupera-cadastro.component.css'],
})
export class RecuperaCadastroComponent implements OnInit {
  //
  //
  //

  mostralogin: boolean = false;
  mostraSenha: boolean = false;
  FormularioAceito: boolean = false;
  CampoEmail:Boolean=true;
  FormularioEmail!: FormGroup;
  FormularioCodigo!: FormGroup;
  isLoading: boolean = false;
  Paciente!: Boolean;
  Medico!: Boolean;

  constructor(
    private form: FormBuilder,
    private recuperaCadastroService: RecuperaCadastroService
  ) {}



  ngOnInit() {
    this.FormularioEmail = this.form.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.FormularioCodigo = this.form.group({
      codigo: ['', Validators.required],
    });
  }




  mostrarRecuperarLogin() {
    this.mostralogin = true;
    this.mostraSenha = false;
  }

  mostrarRecuperarSenha() {
    this.mostraSenha = true;
    this.mostralogin = false;
  }



  enviarEmail() {
    const email: string = this.FormularioEmail.get('email')?.value;
    this.isLoading = true; // Mostra o spinner

    this.recuperaCadastroService.recuperaCadastroMedico(email)
      .subscribe((dadosUsuario) => {
        console.log('dados são de um médico', dadosUsuario);
        this.Medico = true;
        this.CampoEmail = false;
        this.isLoading = false; // Esconde o spinner
      });

    this.recuperaCadastroService.recuperaCadastroPaciente(email)
      .subscribe((dadosUsuario) => {
        console.log('dados são de um paciente', dadosUsuario);
        this.Paciente = true;
        this.CampoEmail = false;
        this.isLoading = false; // Esconde o spinner
      });
  }





  emailValido(): Boolean {
    if (this.Paciente) {
      return true;
    }
    if (this.Medico) {
      return true;
    }
    return false;
  }





  enviaCodigoVerificacao() {
    const codigo: string = this.FormularioCodigo.get('codigo')?.value;
    console.log( codigo ,'codigp');

    this.recuperaCadastroService.codigoVerificacao(codigo).subscribe(
      (dadoDOCodigoVerificacao) => {
        this.Paciente=false;
        this.Medico=false
        this.emailValido();

        this.FormularioAceito = true;
      },
      () => {
        alert('codigo invalido ');
      }
    );
  }
}
