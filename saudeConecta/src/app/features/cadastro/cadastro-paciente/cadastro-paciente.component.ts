import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

import {   Router } from '@angular/router';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';
import { PacienteService } from '../../../service/paciente_service/paciente.service';
import { Endereco } from 'src/app/util/variados/interfaces/endereco/endereco';
import { ufOptions } from 'src/app/util/variados/options/options';

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

  Usuario: Usuario = {
    id: 0,
    login: '',
    senha: '',
    roles: '',
  };
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
    private CadastroPaciete_Medico: PacienteService,
    private route : Router
  ) {
    this.CadastroPaciete_Medico.iniciarObservacaoDadosUsuario();
  }

  ngOnInit(): void {
    this.CadastroPaciete_Medico.getDadosUsuario().subscribe((dadosUsuario) => {
      if(dadosUsuario){
        this.Usuario = dadosUsuario;
        console.log(dadosUsuario, '22222222222');
      }
    });


    this.FormularioPaciente = this.form.group({
      nome: ['', Validators.required],
      sexo: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      cpf: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
        ],
      ],
      rg: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.FormularioEndereco = this.form.group({
      nacionalidade: ['', Validators.required],
      estado: ['', Validators.required],
      uf: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(2),
          Validators.pattern('[a-zA-Z]{2}'),
        ],
      ],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
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
console.log(this.FormularioEndereco.valid && this.FormularioPaciente.valid)


    if (this.FormularioEndereco.valid && this.FormularioPaciente.valid) {

      this.CadastroPaciete_Medico.cadastraEndereco(this.Endereco).subscribe(
        (endereco: Endereco) => {
          const EnderecoID = endereco.EndCodigo as number;
          this.Paciente.endereco = EnderecoID;
          this.Paciente.usuario = this.Usuario.id;
          console.log('dados ', this.Paciente);

          this.CadastroPaciete_Medico.cadastrarPaciente(this.Paciente)
          .subscribe(
            (dados) => {
              Swal.fire({
                icon: 'success',
                title: 'OK',
                text: 'Cadastro realizado com sucesso.',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.CadastroPaciete_Medico.deslogar()
                  this.route.navigate(['']);
                }
              })

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




  placeholderRG(event: any): void {
    const input = event.target;
    setTimeout(() => {
      let inputValue = input.value.replace(/\W/g, '');
      if (inputValue.length > 15) {
        inputValue = inputValue.substring(0, 15);
      }
      const firstTwoChars = inputValue.substring(0, 2);
      if (!/^[a-zA-Z]*$/.test(firstTwoChars)) {
        input.value = '';
        return;
      }
      if (inputValue.length >= 2 && inputValue.length <= 15) {
        input.value = inputValue.replace(
          /^(\w{0,2})[-]?(\d{0,2})[.]?(\d{0,3})[.]?(\d{0,3})[-]?(\d{0,1})?/,
          (match: any, p1: any, p2: any, p3: any, p4: any, p5: string) => {
            if (p5 && p5 !== '-') {
              return `${p1}-${p2}.${p3}.${p4}-${p5}`;
            } else {
              return `${p1}-${p2}.${p3}.${p4}`;
            }
          }
        );
      }
    }, 0);
  }

  placeholderTelefone(event: any): void {
    const input = event.target;
    setTimeout(() => {
      const inputValue = input.value.replace(/\D/g, '');
      input.value = inputValue.replace(
        /^(\d{0,2})(\d{0,2})(\d{0,5})(\d{0,4})/,
        '$1($2) $3-$4'
      );
    }, 0);
  }

  placeholderCEP(event: any): void {
    const input = event.target;
    setTimeout(() => {
      let inputValue = input.value.replace(/\D/g, '');
      inputValue = inputValue.substring(0, 8);
      if (inputValue.length >= 5 && inputValue.length <= 8) {
        input.value = inputValue.replace(/^(\d{5})(\d{3})/, '$1-$2');
      }
    }, 0);
  }

  placeholderCPF(event: any): void {
    const input = event.target;
    setTimeout(() => {
      let inputValue = input.value.replace(/\D/g, '');
      if (inputValue.length > 11) {
        inputValue = inputValue.substring(0, 11);
      }
      if (inputValue.length <= 11) {
        input.value = inputValue.replace(
          /^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/,
          '$1.$2.$3-$4'
        );
      }
    }, 0);
  }
}

