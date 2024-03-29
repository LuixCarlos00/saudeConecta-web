import { Paciente } from './../../../../util/variados/interfaces/paciente/paciente';
import { Usuario } from './../../../../util/variados/interfaces/usuario/usuario';
import { Endereco } from './../../../../util/variados/interfaces/endereco/endereco';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PacienteService } from '../../paciente_service/paciente.service';
import { Subscription } from 'rxjs';

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
  FormularioUsuario!: FormGroup ;
  IdUsuario :number =0;
  Usuario: Usuario = {
    id: 0,
    login:'',
    senha:'',
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


  constructor(private form: FormBuilder, private   CadastroPaciete_Medico :PacienteService) {}

  ngOnInit(): void {

    this.usuarioSubscription = this.CadastroPaciete_Medico.getDadosUsuario()
    .subscribe((usuario: Usuario | null) => {
      if (usuario) {
        this.IdUsuario = usuario.id;

      }
    });

    this.FormularioPaciente = this.form.group({
      nome: ['', Validators.required],
      sexo: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      cpf: ['', Validators.required],
      rg: ['', Validators.required],
      telefone: [''],
      email: ['', (Validators.required, Validators.email)],
    });

    this.FormularioEndereco = this.form.group({
      nacionalidade: ['', Validators.required],
      estado: ['', Validators.required],
      uf: ['', Validators.required],
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
    console.log(this.Endereco,'--',this.Paciente);

    if (this.FormularioEndereco.valid && this.FormularioPaciente.valid) {
      this.CadastroPaciete_Medico.cadastraEndereco(this.Endereco)
        .subscribe((endereco: Endereco) => {
         const EnderecoID= endereco.EndCodigo as number
         this.Paciente.endereco=EnderecoID;
         this.Paciente.usuario = this.IdUsuario;
         console.log(this.Paciente,'PKPK' );
         console.log(this.IdUsuario,'mjmj',EnderecoID);
          this.CadastroPaciete_Medico.cadastrarPaciente(this.Paciente)
            .subscribe(
              (dados) => {
                console.log('Paciente cadastrado com sucesso:', dados);
                // Limpar formulários ou redirecionar para outra página, se necessário
              },
              (erro) => {
                console.error('Erro ao cadastrar paciente:', erro);
              }
            );
        },
        (erro) => {
          console.error('Erro ao cadastrar endereço:', erro);
        });
    }
  }
}
