import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';
 import { Endereco } from 'src/app/util/variados/interfaces/endereco/endereco';
import { ufOptions } from 'src/app/util/variados/options/options';
import { UsuariosService } from 'src/app/service/usuario/usuarios.service';
import { PacientesService } from 'src/app/service/pacientes/Pacientes.service';
import { LoginService } from 'src/app/service/service-login/login.service';

@Component({
  selector: 'app-cadastro-paciente',

  templateUrl: './cadastro-paciente.component.html',
  styleUrl: './cadastro-paciente.component.css',
})
export class CadastroPacienteComponent implements OnInit {
  //
  //
  //
  private usuarioSubscription: Subscription | undefined;
  FormularioPaciente!: FormGroup;
  FormularioEndereco!: FormGroup;
  FormularioUsuario!: FormGroup;
  IdUsuario: number = 0;

  ufOptions = ufOptions;

  NovoUsuario: any;

  Paciente: Paciente = {
    PaciCodigo: 0,
    PaciNome: '',
    PaciSexo: 0,
    PaciDataNacimento: '',
    PaciCpf: '',
    PaciRg: '',
    PaciEmail: '',
    PaciTelefone: '',
    endereco: 0,
    PaciStatus: 0
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

  RolesUsuarioMedico: any=0;

  constructor(
    private form: FormBuilder,
    private usuariosService: UsuariosService,
    private LoginService: LoginService,
    private route: Router,
    private PacienteService: PacientesService,

  ) {
    this.LoginService.iniciarObservacaoDadosUsuario();
  }

  ngOnInit(): void {
    this.RolesUsuarioMedico = 0;
    this.usuariosService.NovoUsuariocadastradoValue$.subscribe((value) => {
      if (value) {
        this.NovoUsuario = value;
      }
    });

    this.FormularioPaciente = this.form.group({
      nome: ['', Validators.required],
      sexo: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      cpf: [''],
      rg: [''],
      telefone: [''],
      email: ['', [Validators.required, Validators.email]],
    });

    this.FormularioEndereco = this.form.group({
      nacionalidade: ['', Validators.required],
      uf: ['', Validators.maxLength(2)],
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


    if (this.FormularioEndereco.valid && this.FormularioPaciente.valid) {
      this.usuariosService.cadastraEndereco(this.Endereco).subscribe(
        (endereco: Endereco) => {
          const EnderecoID = endereco.EndCodigo as number;
          this.Paciente.endereco = EnderecoID;
          this.Paciente.PaciStatus = 1;

          this.PacienteService.cadastrarPaciente(this.Paciente).subscribe(
            () => {
              Swal.fire({
                icon: 'success',
                title: 'OK',
                text: 'Cadastro realizado com sucesso.',
              }).then((result) => {
                if (result.isConfirmed) {
                 this.FormularioPaciente.reset();
                 this.FormularioEndereco.reset();
                }
              });
            },
            (erro) => {
              // Tratamento de erro ao cadastrar paciente
              this.handleHttpError(erro);
            }
          );
        },
        (erro) => {
          // Tratamento de erro ao cadastrar endereço
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
    console.log(error); // Exibir o erro completo no console para depuração

    let errorMessage = 'Erro desconhecido ao realizar o cadastro.';

    if (error.error) {
      if (error.error.includes('Duplicate entry') && error.error.includes('paciente.PaciEmail_UNIQUE')) {
        errorMessage = 'Já existe um paciente registrado com esse email.';
      } else if (error.error.includes('Duplicate entry') && error.error.includes('paciente.PaciCpf_UNIQUE')) {
        errorMessage = 'Já existe um paciente registrado com esse CPF.';
      } else if (error.error.includes('Duplicate entry') && error.error.includes('paciente.PaciRg_UNIQUE')) {
        errorMessage = 'Já existe um paciente registrado com esse RG.';
      } else {
        errorMessage = error.error; // Usar a mensagem de erro específica retornada pelo servidor
      }
    }

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });

    console.error('Erro ao cadastrar:', error);
  }

}
