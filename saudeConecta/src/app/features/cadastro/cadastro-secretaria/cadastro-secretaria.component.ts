import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ufOptions } from 'src/app/util/variados/options/options';
import { UsuariosService } from 'src/app/service/usuario/usuarios.service';
import { Secretaria } from 'src/app/util/variados/interfaces/secretaria/secretaria';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';

import { SecretariaService } from 'src/app/service/secretaria-service/secretaria.service';
import { tokenService } from 'src/app/util/Token/Token.service';
@Component({
  selector: 'app-cadastro-secretaria',
  templateUrl: './cadastro-secretaria.component.html',
  styleUrls: ['./cadastro-secretaria.component.css'],
})
export class CadastroSecretariaComponent implements OnInit {
  //
  //
  //
  private usuarioSubscription: Subscription | undefined;
  FormularioSecretaria!: FormGroup;
  FormularioUsuario!: FormGroup;
  IdUsuario: number = 0;
  NovoUsuariocadastrado_Secretaria: any;
  ufOptions = ufOptions;
  FormularioUsuaroValido = false;

  Secretaria: Secretaria = {
    SecreCodigo: 0,
    SecreNome: '',
    SecreEmail: '',
    SecreUsuario: 0,
    SecreStatus: 0,
    SecreCodigoAtorizacao: '',
    SecreDataCriacao: '',
  };

  RolesUsuarioSecretaria: any = 2;

  constructor(
    private router: Router,
    private form: FormBuilder,
    private SecretariamService: SecretariaService,
    private usuarioService: UsuariosService
  ) {
    this.FormularioUsuaroValido = false;
    this.NovoUsuariocadastrado_Secretaria = false;

    this.usuarioService.NovoUsuariocadastradoValue$.subscribe((value) => {
      if (value) {
        this.NovoUsuariocadastrado_Secretaria = false;
        this.NovoUsuariocadastrado_Secretaria = value;
        this.FormularioUsuaroValido = false;
      } else {
        this.FormularioUsuaroValido = true;
      }
    });
  }

  ngOnInit() {
    this.RolesUsuarioSecretaria = 2;

    this.FormularioSecretaria = this.form.group({
      nome: ['', Validators.required],

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
    this.Secretaria.SecreUsuario = this.NovoUsuariocadastrado_Secretaria.id;

    this.SecretariamService.cadastrarSecretaria(this.Secretaria).subscribe(
      (dados) => {
        Swal.fire({
          icon: 'success',
          title: 'OK',
          text: 'Cadastro realizado com sucesso.',
        }).then((result) => {
          if (result.isConfirmed) {
            this.FormularioSecretaria.disable();

            this.FormularioUsuaroValido = false;

            this.NovoUsuariocadastrado_Secretaria = null;
            this.NovoUsuariocadastrado_Secretaria = false;
          }
        });
      }
    );
  }

  private handleHttpError(error: any) {
    console.log(error); // Exibir o erro completo no console para depuração

    let errorMessage = 'Erro desconhecido ao realizar o cadastro.';

    if (error.error) {
      if (
        error.error.includes('Duplicate entry') &&
        error.error.includes('secretaria.SecreEmail_UNIQUE')
      ) {
        errorMessage =
          'Já existe um(a) secretári(a) registrado com esse email.';
      } else {
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

  onUsuarioCadastrado(usuario: Usuario) {
    //this.NovoUsuariocadastrado_Secretaria = usuario;
    this.FormularioUsuaroValido = false;
  }
}
