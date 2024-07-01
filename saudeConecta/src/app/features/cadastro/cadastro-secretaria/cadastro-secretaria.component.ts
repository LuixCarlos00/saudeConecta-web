

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';
import { ModelService } from '../../../service/Model_service/Model.service';
import { Endereco } from 'src/app/util/variados/interfaces/endereco/endereco';
import { ufOptions } from 'src/app/util/variados/options/options';
import { UsuariosService } from 'src/app/service/usuario/usuarios.service';
import { PacientesService } from 'src/app/service/pacientes/Pacientes.service';
import { Secretaria } from 'src/app/util/variados/interfaces/secretaria/secretaria';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';

import { SecretariaService } from 'src/app/service/secretaria-service/secretaria.service';
import { tokenService } from 'src/app/util/Token/Token.service';
@Component({
  selector: 'app-cadastro-secretaria',
  templateUrl: './cadastro-secretaria.component.html',
  styleUrls: ['./cadastro-secretaria.component.css']
})
export class CadastroSecretariaComponent implements OnInit {
//
  //
  //
  private usuarioSubscription: Subscription | undefined;
  FormularioSecretaria!: FormGroup;
  FormularioUsuario!: FormGroup;
  IdUsuario: number = 0;

  ufOptions = ufOptions;

  NovoUsuario: any;

  Secretaria: Secretaria = {
    SecreCodigo: 0,
    SecreNome: '',
    SecreEmail: '',
    SecreUsuario: 0,
    SecreStatus: 0,
    SecreCodigoAtorizacao: '',
    SecreDataCriacao: ''
  };

  UsuarioLogado: Usuario = {
    id: 0,
    login: '',
    senha: '',
    tipoUsuario: '',
  };


  constructor(
    private router: Router,
    private form: FormBuilder,
    private SecretariamService: SecretariaService,
    private tokenService: tokenService,
    private ModelService: ModelService
  ) {
    this.ModelService.iniciarObservacaoDadosUsuario();
  }

  ngOnInit() {
    this.ModelService.iniciarObservacaoDadosUsuario();
  this.tokenService.UsuarioLogadoValue$.subscribe((UsuarioLogado) => {
    if (UsuarioLogado) this.UsuarioLogado = UsuarioLogado;
    console.log(UsuarioLogado, 'paciente');
  });

    this.FormularioSecretaria = this.form.group({
      nome: ['', Validators.required],
      codAutorizacao: ['', Validators.required],
      Email: ['', Validators.required],
    });
  }



  ngOnDestroy(): void {
    if (this.usuarioSubscription) {
      this.usuarioSubscription.unsubscribe();
    }
  }

  cadastra() {
    const nome = this.FormularioSecretaria.get('nome')?.value;
    const email = this.FormularioSecretaria.get('Email')?.value;

    const data = new Date();
    const dataAtual = data.toISOString().split('T')[0];

    this.Secretaria.SecreNome = nome;
    this.Secretaria.SecreEmail = email;
    this.Secretaria.SecreDataCriacao = dataAtual;
    this.Secretaria.SecreStatus = 1;
    this.Secretaria.SecreUsuario = this.UsuarioLogado.id;

    console.log(this.Secretaria, 'Secretaria');

    const codigoAutorizacao = this.FormularioSecretaria.get('codAutorizacao')?.value;
    this.SecretariamService.VerificarCodicodeAutorizacaoParaCadastraSecretaria(codigoAutorizacao).subscribe(
      (dados) => {
        this.SecretariamService.cadastrarSecretaria(this.Secretaria).subscribe(
          (dados) => {
            Swal.fire({
              icon: 'success',
              title: 'OK',
              text: 'Cadastro realizado com sucesso.',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['home']);
              }
            });
          },
          (error) => {
            this.handleHttpError(error); // Usando handleHttpError para lidar com erros
          }
        );
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Código de autorização inválido',
        });
      }
    );
  }




  private handleHttpError(error: any) {
    console.log(error); // Exibir o erro completo no console para depuração

    let errorMessage = 'Erro desconhecido ao realizar o cadastro.';

    if (error.error) {
      if (error.error.includes('Duplicate entry') && error.error.includes('secretaria.SecreEmail_UNIQUE')) {
        errorMessage = 'Já existe um(a) secretári(a) registrado com esse email.';
      }   else {
        errorMessage = error.error;
      }
    }

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });


  }



  voltarParaHome() {
    this.router.navigate(['cadastro']);
    }


}
