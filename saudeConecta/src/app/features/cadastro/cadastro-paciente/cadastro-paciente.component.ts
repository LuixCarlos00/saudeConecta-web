
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import {   Router } from '@angular/router';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';
import { ModelService } from '../../../service/Model_service/Model.service';
import { Endereco } from 'src/app/util/variados/interfaces/endereco/endereco';
import { ufOptions } from 'src/app/util/variados/options/options';
import { UsuariosService } from 'src/app/service/usuario/usuarios.service';
import { PacientesService } from 'src/app/service/pacientes/Pacientes.service';

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

  ufOptions =  ufOptions;

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
    usuario: 0,
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
    private usuariosService: UsuariosService,
    private ModelService :ModelService,
    private route : Router,
    private PacienteService :PacientesService,
    private modelService: ModelService,
  ) {
    this.ModelService.iniciarObservacaoDadosUsuario();
  }

  ngOnInit(): void {
    this.usuariosService.NovoUsuariocadastradoValue$.subscribe((value) => {
      if (value) {
        this.NovoUsuario = value;
      }
    });


    this.FormularioPaciente = this.form.group({
      nome: ['', Validators.required],
      sexo: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      cpf: ['', Validators.required],
      rg: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.FormularioEndereco = this.form.group({
      nacionalidade: ['', Validators.required],
      estado: ['', Validators.required],
      uf: ['',Validators.maxLength(2)],
      cep: ['',Validators.required],
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
          this.Paciente.usuario = this.NovoUsuario.id;
          console.log('dados ', this.Paciente);

          this.PacienteService.cadastrarPaciente(this.Paciente)
          .subscribe(
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
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Erro ao cadastrar paciente',
              });
              console.error('Erro ao cadastrar paciente:', erro);
            }
          );

        },
        (erro) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Erro ao cadastrar Endereco',
          });
          console.error('Erro ao cadastrar Endereco:', erro);
        }
      );

    } else {
      (errors: any)=>{
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'Dados do formulario invalido \n Por favor verifique os dados informados.',
        });
        console.log('Erros', errors);
      }
    }

  }




}

