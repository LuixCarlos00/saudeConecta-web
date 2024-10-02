import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UsuariosService } from 'src/app/service/usuario/usuarios.service';
import { MedicosService } from 'src/app/service/medicos/medicos.service';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { Endereco } from 'src/app/util/variados/interfaces/endereco/endereco';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';

import { EspecialidadeMedicas, ufOptions } from 'src/app/util/variados/options/options';
 import { LoginService } from 'src/app/service/service-login/login.service';

@Component({
  selector: 'app-cadastro-medico',
  templateUrl: './cadastro-medico.component.html',
  styleUrls: ['./cadastro-medico.component.css'],
})
export class CadastroMedicoComponent implements OnInit, OnDestroy {

  RolesUsuarioMedico: any = 3;
  private usuarioSubscription: Subscription | undefined;
  FormularioMedico!: FormGroup;
  FormularioEndereco!: FormGroup;
  IdUsuario: number = 0;
  EspecialidadeMedicas = EspecialidadeMedicas;
   FormularioUsuaroValido = false;
  ufOptions = ufOptions;

  NovoUsuariocadastrado_Medico: any;

  Medico: Medico = {
    MedCodigo: 0,
    MedNome: '',
    MedSexo: 0,
    MedDataNacimento: '',
    MedCrm: '',
    MedCpf: '',
    MedRg: '',
    MedEmail: '',
    MedTelefone: '',
    endereco: 0,
    usuario: 0,
    MedEspecialidade: '',
  };
  Endereco: Endereco = {
    EndCodigo: 0,
    EndNacionalidade: '',
    EndUF: '',
    EndMunicipio: '',
    EndBairro: '',
    EndCep: '',
    EndRua: '',
    EndNumero: 0,
    EndComplemento: 0,
  };

  constructor(
    private form: FormBuilder,
    private usuarioService: UsuariosService,
    private MedicosService: MedicosService,
    private route: Router,
    public LoginService: LoginService,
  ) {
    this. FormularioUsuaroValido = false;
    this.NovoUsuariocadastrado_Medico = false;


    // É necessario cadastra e pega o id do usuario cadastrado  e associa ao medico
    this.usuarioService.NovoUsuariocadastradoValue$.subscribe((value) => {
      if (value) {
         this.NovoUsuariocadastrado_Medico = false;
        this.NovoUsuariocadastrado_Medico = value;


        this.FormularioUsuaroValido = false;
      } else {
         this.FormularioUsuaroValido = true;
      }
    });
  }

  ngOnInit(): void {
    this.RolesUsuarioMedico = 3;

    this.FormularioMedico = this.form.group({
      nome: ['', Validators.required],
      sexo: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      cpf: [''],
      rg: [''],
      crm: ['', Validators.required],
      Especialidade: ['', Validators.required],
      telefone: [''],
      email: ['', [Validators.required, Validators.email]],
    });

    this.FormularioEndereco = this.form.group({
      nacionalidade: ['', Validators.required],
      uf: ['', [Validators.required, Validators.maxLength(2)]],
      cep: ['', Validators.required],
      rua: ['', Validators.required],
      municipio: ['', Validators.required],
      bairro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
    });
  }

  ngOnDestroy(): void {
    if (this.usuarioSubscription) {
      this.usuarioSubscription.unsubscribe();
    }
  }

  cadastra() {
    if (this.FormularioEndereco.valid && this.FormularioMedico.valid) {
      this.usuarioService.cadastraEndereco(this.Endereco).subscribe(
        (endereco: Endereco) => {
          const EnderecoID = endereco.EndCodigo as number;
          this.Medico.endereco = EnderecoID;
          this.Medico.usuario = this.NovoUsuariocadastrado_Medico.id;

          this.MedicosService.cadastrarMedico(this.Medico).subscribe(
            (dados) => {
              Swal.fire({
                icon: 'success',
                title: 'OK',
                text: 'Cadastro realizado com sucesso.',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.FormularioMedico.reset();
                  this.FormularioEndereco.reset();

              //    this.CadastroValidoMedico = true;
                  this.FormularioUsuaroValido = false;

                  this.NovoUsuariocadastrado_Medico = false;
                }
              });
            },
            (erro) => {
              this.handleHttpError(erro);
            }
          );
        },
        (erro) => {
          this.handleHttpError(erro);
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Dados do formulário inválido. Por favor, verifique os dados informados.',
      });
    }
  }

  private handleHttpError(error: any) {

    let errorMessage = 'Erro desconhecido ao realizar o cadastro.';

    if (error.error) {
      if (error.error.includes('Duplicate entry') && error.error.includes('medico.MedEmail_UNIQUE')) {
        errorMessage = 'Já existe um Medico registrado com esse email.';
      } else if (error.error.includes('Duplicate entry') && error.error.includes('medico.MedCrm_UNIQUE')) {
        errorMessage = 'Já existe um Medico registrado com esse CRM.';
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

  onUsuarioCadastrado(usuario: Usuario) {

    //this.NovoUsuariocadastrado_Medico = usuario;
    this.FormularioUsuaroValido = false;
  }
}
