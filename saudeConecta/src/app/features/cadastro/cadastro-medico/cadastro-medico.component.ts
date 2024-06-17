import { EspecialidadeMedicas } from './../../../util/variados/options/options';
import { tokenService } from 'src/app/util/Token/token.service';
import { MedicosService } from 'src/app/service/medicos/medicos.service';
import { Usuario } from './../../../util/variados/interfaces/usuario/usuario';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Endereco } from 'src/app/util/variados/interfaces/endereco/endereco';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';

import { ufOptions } from 'src/app/util/variados/options/options';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ModelService } from '../../../service/Model_service/Model.service';
import { UsuariosService } from 'src/app/service/usuario/usuarios.service';

@Component({
  selector: 'app-cadastro-medico',

  templateUrl: './cadastro-medico.component.html',
  styleUrl: './cadastro-medico.component.css',
})
export class CadastroMedicoComponent {

  //
  //
  //
  private usuarioSubscription: Subscription | undefined;
  FormularioMedico!: FormGroup;
  FormularioEndereco!: FormGroup;
  FormularioUsuario!: FormGroup;
  IdUsuario: number = 0;
  EspecialidadeMedicas = EspecialidadeMedicas;

  ufOptions = ufOptions;

  NovoUsuario: any;
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
    EndEstado: '',
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
    public modelService: ModelService,
    private usuarioService: UsuariosService,
    private MedicosService: MedicosService,

    private route: Router
  ) {
    this.modelService.iniciarObservacaoDadosUsuario();
  }

  ngOnInit(): void {
    this.usuarioService.NovoUsuariocadastradoValue$.subscribe((value) => {
      if (value) {
        this.NovoUsuario = value;
      }
    });

    this.FormularioMedico = this.form.group({
      nome: ['', Validators.required],
      sexo: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      cpf: ['', Validators.required ],
      crm: ['', Validators.required],
      rg: ['', Validators.required],
      Especialidade: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.FormularioEndereco = this.form.group({
      nacionalidade: ['', Validators.required],
      estado: ['', Validators.required],
      uf: ['',[Validators.required, Validators.maxLength(2) ] ],
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
      console.log(this.Endereco);
      this.usuarioService.cadastraEndereco(this.Endereco).subscribe(
        (endereco: Endereco) => {
          console.log(endereco);

          const EnderecoID = endereco.EndCodigo as number;
          this.Medico.endereco = EnderecoID;
          this.Medico.usuario = this.NovoUsuario.id;

          console.log(this.Medico);

          this.MedicosService.cadastrarMedico(this.Medico).subscribe(
            (dados) => {
              Swal.fire({
                icon: 'success',
                title: 'OK',
                text: 'Cadastro realizado com sucesso.',
              }).then((result) => {
                if (result.isConfirmed) {
                  if (this.modelService.estaLogado()) {
                    this.route.navigate(['home']);
                  } else {
                    this.modelService.deslogar();
                    this.route.navigate(['']);
                  }
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
      (errors: any) => {
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'Dados do formulário inválido. Por favor, verifique os dados informados.',
        });

      };
    }
  }


  private handleHttpError(error: any) {
    console.log(error); // Exibir o erro completo no console para depuração

    let errorMessage = 'Erro desconhecido ao realizar o cadastro.';

    if (error.error) {
      if (error.error.includes('Duplicate entry') && error.error.includes('medico.MedCpf_UNIQUE')) {
        errorMessage = 'Já existe um Medico registrado com esse email.';
      } else if (error.error.includes('Duplicate entry') && error.error.includes('medico.MedCpf_UNIQUE')) {
        errorMessage = 'Já existe um Medico registrado com esse CPF.';
      } else if (error.error.includes('Duplicate entry') && error.error.includes('medico.MedRg_UNIQUE')) {
        errorMessage = 'Já existe um Medico registrado com esse RG.';
      } else if (error.error.includes('Duplicate entry') && error.error.includes(' medico.MedCrm_UNIQUE')) {
        errorMessage = 'Já existe um Medico registrado com esse CRM.';
      } else {
        errorMessage = error.error; // Usar a mensagem de erro específica retornada pelo servidor
      }
    }

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });
  }


  voltarParaHome() {
    this.route.navigate(['cadastro']);
    }
}
