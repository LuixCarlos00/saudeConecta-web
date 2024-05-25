import { tokenService } from './../../../util/Token/token.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModelService } from 'src/app/service/Model_service/Model.service';
import { UsuarioAdmService } from 'src/app/service/service-usuario-adm/usuario-adm.service';
import { UsuariosService } from 'src/app/service/usuario/usuarios.service';
import { Adiministrador } from 'src/app/util/variados/interfaces/administrado/adiministrador';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro-adm',
  templateUrl: './cadastro-adm.component.html',
  styleUrls: ['./cadastro-adm.component.css'],
})
export class CadastroAdmComponent implements OnInit {
  FormularioADM!: FormGroup;
  Administracao: Adiministrador = {
    AdmCodigo: 0,
    AdmNome: '',
    AdmUsuario: 0,
    AdmStatus: 0,
    AdmDataCriacao: '',
    AdmEmail: '',
    AdmCodigoAtorizacao: '',
  };

  Usuario: Usuario = {
    id: 0,
    login: '',
    senha: '',
    roles: '',
  };

  constructor(
    private router: Router,
    private form: FormBuilder,
    private usuarioAdmService: UsuarioAdmService,
    private tokenService: tokenService,
    private ModelService: ModelService
  ) {
    this.ModelService.iniciarObservacaoDadosUsuario();
  }

  ngOnInit() {
    this.ModelService.getDadosUsuario().subscribe((dadosUsuario) => {
      if (dadosUsuario) {
        this.Usuario = dadosUsuario;
      }
    });

    this.FormularioADM = this.form.group({
      nome: ['', Validators.required],
      codAutorizacao: ['', Validators.required],
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
    this.Administracao.AdmUsuario = this.Usuario.id;

    console.log(this.Administracao);

    const codigoAutorizacao = this.FormularioADM.get('codAutorizacao')?.value;
    this.usuarioAdmService.cadastrarUsuarioADM(codigoAutorizacao).subscribe(
      (dados) => {
        this.usuarioAdmService
          .cadastrarAdministrador(this.Administracao)
          .subscribe(
            (dados) => {
              Swal.fire({
                icon: 'success',
                title: 'OK',
                text: 'Cadastro realizado com sucesso.',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['']);
                  this.tokenService.removeToken();
                }
              });

            },
            (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Erro ao cadastrar.\n ${error}`,
              });
            }
          );
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Codigo de autorização inválido',
        });
      }
    );
  }
}
