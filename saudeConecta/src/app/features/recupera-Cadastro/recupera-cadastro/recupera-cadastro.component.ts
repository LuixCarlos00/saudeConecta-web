import { Medico } from 'src/app/util/variados/interfaces/medico/medico';

import { Paciente } from './../../../util/variados/interfaces/paciente/paciente';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecuperaCadastroService } from '../../../service/service-recuperaCadastro/recupera-cadastro.service';
import { tick } from '@angular/core/testing';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import Swal from 'sweetalert2';
import { Router, RouterConfigOptions } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';

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
  CampoEmail: Boolean = true;
  FormularioEmail!: FormGroup;
  FormularioCodigo!: FormGroup;
  FormularioNovaSenha!: FormGroup;

  isLoading: boolean = false;
  Paciente!: Boolean;
  Medico!: Boolean;

  InstanciaPaciente!: any;
  InstanciaMedico!: any;
  InstanciaUsuario!: any;

  constructor(
    private route: Router,
    private form: FormBuilder,
    private recuperaCadastroService: RecuperaCadastroService
  ) {}

  ngOnInit() {
    this.FormularioEmail = this.form.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.FormularioCodigo = this.form.group({
      codigo: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });

    this.FormularioNovaSenha = this.form.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        password2: ['', [Validators.required, Validators.minLength(8)]],
      },
      { validators: this.senhasCorrespondentes }
    );
  }

  senhasCorrespondentes(formGroup: FormGroup) {
    const senha = formGroup.get('password')?.value;
    const senha2 = formGroup.get('password2')?.value;

    if (senha !== senha2) {
      formGroup.get('password2')?.setErrors({ senhasNaoCorrespondem: true });
    } else {
      formGroup.get('password2')?.setErrors(null);
    }
  }

  mostrarRecuperarLogin() {
    this.mostralogin = true;
    this.mostraSenha = false;

    this.RecuperarLogin();
  }

  mostrarRecuperarSenha() {
    this.mostraSenha = true;
    this.mostralogin = false;
  }

  enviarEmail() {
    const email: string = this.FormularioEmail.get('email')?.value;
    this.isLoading = true;
    forkJoin([this.MedicoEmail(email), this.PacienteEmail(email)]).subscribe(
      ([medicoResult, pacienteResult]) => {
        if (medicoResult && medicoResult.success) {
          this.InstanciaUsuario = medicoResult;
          this.InstanciaMedico = medicoResult;
          this.Medico = true;
          this.CampoEmail = false;
        }

        if (pacienteResult && pacienteResult.success) {
          this.InstanciaUsuario = pacienteResult;
          this.InstanciaPaciente = pacienteResult;
          this.Paciente = true;
          this.CampoEmail = false;
        }

        this.verificarSucesso();
      },
      (error) => {
        console.log('Erro ao verificar email:', error);
        this.verificarSucesso();
      }
    );
  }

  MedicoEmail(email: string) {
    return this.recuperaCadastroService.recuperaCadastroMedico(email).pipe(
      map((dadosUsuario) => ({ success: true, usuario: dadosUsuario })),
      catchError((error) => {
        console.log('Erro ao verificar email de médico:', error);
        return of({ success: false });
      })
    );
  }

  PacienteEmail(email: string) {
    return this.recuperaCadastroService.recuperaCadastroPaciente(email).pipe(
      map((dadosUsuario) => ({ success: true, usuario: dadosUsuario })),
      catchError((error) => {
        console.log('Erro ao verificar email de paciente:', error);
        return of({ success: false });
      })
    );
  }

  verificarSucesso() {
    if (!this.Medico && !this.Paciente) {
      this.emailNaoEncontrado();
    } else {
      this.isLoading = false;
    }
  }

  emailNaoEncontrado() {
    alert(
      'Email não encontrado. \nPor Favor verifique se o \nEmail foi digitado corretamente.  '
    );
    this.isLoading = false;
    this.FormularioEmail.reset();
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
    console.log(codigo, 'codigp');

    this.recuperaCadastroService.codigoVerificacao(codigo).subscribe(
      (dadoDOCodigoVerificacao) => {
        this.Paciente = false;
        this.Medico = false;
        this.emailValido();

        this.FormularioAceito = true;
      },
      () => {
        alert('codigo invalido ');
        this.FormularioCodigo.reset();
      }
    );
  }

  Confirmar() {
    if (this.FormularioNovaSenha.valid) {
      const id: number = this.InstanciaUsuario.usuario.usuario.id;
      const senha: string = this.FormularioNovaSenha.get('password')?.value;
      const senha2: string = this.FormularioNovaSenha.get('password2')?.value;
      const login: string = this.InstanciaUsuario.usuario.usuario.username;

      const usuario = {
        id: id,
        login: login,
        senha: senha,
        tipoUsuario: '',
        status: ''
      };



      if (senha === senha2) {
        this.recuperaCadastroService.trocaSenhaUsuario(id, usuario).subscribe(
          (dados) => {
            Swal.fire({
              icon: 'success',
              title: 'OK',
              text: 'Senhas foram salvas com sucesso .',
            }).then((result) => {
              if (result.isConfirmed) {
                this.route.navigate(['']);
              }
            });
          },
          (erros) => {
            Swal.fire({
              icon: 'error',
              title: 'ops',
              text: 'Erro inesperado.',
            });
          }
        );
      } else {
        Swal.fire({
          icon: 'warning',
          title: '!',
          text: 'Formulario Invalido ',
        });
      }
    }
  }

  RecuperarLogin() {
    const id: number = this.InstanciaUsuario.usuario.usuario.id;
    console.log(this.InstanciaUsuario);

    if (this.InstanciaUsuario.usuario.paciNome) {
      this.recuperaCadastroService.recuperaLogin(id, 'Paciente').subscribe(
        () => {
        console.log('deu certo Pa ');
        this.route.navigate(['']);
        },

      );
    } else if (this.InstanciaUsuario.usuario.MedNome) {
      this.recuperaCadastroService.recuperaLogin(id, 'Medico').subscribe(
        () => {
          console.log('deu certo Me ');
          this.route.navigate(['']);
        },

      );
    }
  }
}
