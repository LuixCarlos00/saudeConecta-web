import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Endereco } from 'src/app/util/variados/interfaces/endereco/endereco';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { ufOptions } from 'src/app/util/variados/options/options';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PacienteService } from '../../paciente_service/paciente.service';

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

  ufOptions = ufOptions;

  Usuario: Usuario = {
    id: 0,
    login: '',
    senha: '',
    roles: undefined,
  };
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
    usuario: 0
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
    private route: Router
  ) {
    this.CadastroPaciete_Medico.iniciarObservacaoDadosUsuario();
  }

  ngOnInit(): void {
    this.CadastroPaciete_Medico.getDadosUsuario().subscribe((dadosUsuario) => {
      if (dadosUsuario) {
        this.Usuario = dadosUsuario;
        console.log(dadosUsuario, '22222222222');
      }
    });

    this.FormularioMedico = this.form.group({
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

      crm:['',Validators.required,],
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
    console.log(this.Medico ,"------", this.Endereco);

    if (this.FormularioEndereco.valid && this.FormularioMedico.valid) {
      this.CadastroPaciete_Medico.cadastraEndereco(this.Endereco).subscribe(
        (endereco: Endereco) => {
          const EnderecoID = endereco.EndCodigo as number;
          this.Medico.endereco = EnderecoID;
          this.Medico.usuario = this.Usuario.id;
          console.log('dados ', this.Medico);

          this.CadastroPaciete_Medico.cadastrarMedico(
            this.Medico
          ).subscribe(
            (dados) => {
              Swal.fire({
                icon: 'success',
                title: 'OK',
                text: 'Cadastro realizado com sucesso.',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.CadastroPaciete_Medico.deslogar();
                  this.route.navigate(['']);
                }
              });
            },
            (erro) => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Erro ao se cadastrar ',
              });
              console.error('Erro ao cadastrar medico:', erro);
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
      (errors: any) => {
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'Dados do formulario invalido \n Por favor verifique os dados informados.',
        });
        console.log('Erros', errors);
      };
    }
  }

  placeholderRG(event: any): void {
    const input = event.target;
    setTimeout(() => {
      let inputValue = input.value.replace(/\W/g, '');

      // Limitando a entrada para 15 caracteres
      if (inputValue.length > 15) {
        inputValue = inputValue.substring(0, 15);
      }

      // Verificando se os dois primeiros caracteres são letras
      const firstTwoChars = inputValue.substring(0, 2);
      if (!/^[a-zA-Z]*$/.test(firstTwoChars)) {
        // Se os dois primeiros caracteres não forem letras, limpe o campo
        input.value = '';
        return;
      }

      // Formato XX-YY.HHH.HHH-Z
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

      // Formato XX(XX) XXXXX-XXXX
      input.value = inputValue.replace(
        /^(\d{0,2})(\d{0,2})(\d{0,5})(\d{0,4})/,
        '$1($2) $3-$4'
      );
    }, 0);
  }

  placeholderCEP(event: any): void {
    const input = event.target;
    setTimeout(() => {
      let inputValue = input.value.replace(/\D/g, ''); // Remover todos os caracteres que não são dígitos

      // Limitar a entrada para 8 caracteres
      inputValue = inputValue.substring(0, 8);

      // Formato XXXXX-XXX
      if (inputValue.length >= 5 && inputValue.length <= 8) {
        input.value = inputValue.replace(/^(\d{5})(\d{3})/, '$1-$2');
      }
    }, 0);
  }

  placeholderCPF(event: any): void {
    const input = event.target;
    setTimeout(() => {
      let inputValue = input.value.replace(/\D/g, '');

      // Limitando a entrada para 11 caracteres
      if (inputValue.length > 11) {
        inputValue = inputValue.substring(0, 11);
      }

      // Formato XXX.XXX.XXX-XX
      if (inputValue.length <= 11) {
        input.value = inputValue.replace(
          /^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/,
          '$1.$2.$3-$4'
        );
      }
    }, 0);
  }
}
