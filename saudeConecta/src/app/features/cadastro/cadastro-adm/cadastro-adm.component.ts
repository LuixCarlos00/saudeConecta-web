import { Usuario } from './../../../util/variados/interfaces/usuario/usuario';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/service-login/login.service';
import { UsuarioAdmService } from 'src/app/service/service-usuario-adm/usuario-adm.service';
import { UsuariosService } from 'src/app/service/usuario/usuarios.service';
import { tokenService } from 'src/app/util/Token/Token.service';
import { Adiministrador } from 'src/app/util/variados/interfaces/administrado/adiministrador';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro-adm',
  templateUrl: './cadastro-adm.component.html',
  styleUrls: ['./cadastro-adm.component.css'],
})
export class CadastroAdmComponent implements OnInit {
  FormularioADM!: FormGroup;
  RolesUsuarioAdministrador: any = 1;
  NovoUsuariocadastrado_Administrador: any;
  FormularioUsuaroValido = false;
  Administracao: Adiministrador = {
    AdmCodigo: 0,
    AdmNome: '',
    AdmUsuario: 0,
    AdmStatus: 0,
    AdmDataCriacao: '',
    AdmEmail: '',
    AdmCodigoAtorizacao: '',
  };

  UsuarioLogado: Usuario = {
    id: 0,
    aud: '',
    exp: '',
    iss: '',
    sub: '',
  };

  constructor(
    private router: Router,
    private form: FormBuilder,
    private usuarioAdmService: UsuarioAdmService,
    private tokenService: tokenService,
    private LoginService: LoginService,
    private usuarioService: UsuariosService
  ) {
    this.FormularioUsuaroValido = false;
    this.NovoUsuariocadastrado_Administrador = false;

    this.usuarioService.NovoUsuariocadastradoValue$.subscribe((value) => {
      if (value) {
        this.NovoUsuariocadastrado_Administrador = false;
        this.NovoUsuariocadastrado_Administrador = value;
        this.FormularioUsuaroValido = false;
      } else {
        this.FormularioUsuaroValido = true;
      }
    });
  }

  ngOnInit() {
    this.LoginService.iniciarObservacaoDadosUsuario();
    this.tokenService.UsuarioLogadoValue$.subscribe((UsuarioLogado) => {
      if (UsuarioLogado) this.UsuarioLogado = UsuarioLogado;
    });

    this.RolesUsuarioAdministrador = 1;

    this.FormularioADM = this.form.group({
      nome: ['', Validators.required],
      Email: ['', Validators.required],
    });
  }

  cadastra() {
    const nome = this.FormularioADM.get('nome')?.value;
    const email = this.FormularioADM.get('Email')?.value;

    const data = new Date();
    const dataAtual = data.toISOString().split('T')[0];

    this.Administracao.AdmNome = nome;
    this.Administracao.AdmEmail = email;
    this.Administracao.AdmDataCriacao = dataAtual;
    this.Administracao.AdmStatus = 1;
    this.Administracao.AdmUsuario = this.NovoUsuariocadastrado_Administrador.id;

    this.usuarioAdmService.cadastrarAdministrador(this.Administracao).subscribe(
      (dados) => {
        Swal.fire({
          icon: 'success',
          title: 'OK',
          text: 'Cadastro realizado com sucesso.',
        }).then((result) => {
          if (result.isConfirmed) {
            this.FormularioADM.disable();

            this.FormularioUsuaroValido = false;

            this.NovoUsuariocadastrado_Administrador = null;
            this.NovoUsuariocadastrado_Administrador = false;
          }
        });
      },
      (error) => {
        this.handleHttpError(error); // Usando handleHttpError para lidar com erros
      }
    );
  }

  private handleHttpError(error: any) {
    console.log(error); // Exibir o erro completo no console para depuração

    let errorMessage = 'Erro desconhecido ao realizar o cadastro.';

    if (error.error) {
      if (
        error.error.includes('Duplicate entry') &&
        error.error.includes('administrador.AdmEmail_UNIQUE')
      ) {
        errorMessage =
          'Já existe um(a) administrador(a) registrado com esse email.';
      } else {
        errorMessage = error.error;
      }
    }

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });

    console.error('Erro ao cadastrar:', error);
  }

  voltarParaHome() {
    this.router.navigate(['cadastro']);
  }
}
