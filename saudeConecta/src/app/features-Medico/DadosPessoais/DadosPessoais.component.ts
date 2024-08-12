import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DadosPessoaisService } from 'src/app/service/MEDICO-dados-pessoais/DadosPessoais.service';
import { tokenService } from 'src/app/util/Token/Token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-DadosPessoais',
  templateUrl: './DadosPessoais.component.html',
  styleUrls: ['./DadosPessoais.component.css'],
})
export class DadosPessoaisComponent implements OnInit {
  UsuarioLogado: any = {
    id: 0,
    aud: '',
    exp: '',
    iss: '',
    sub: '',
  };

  dadosPessoaisForm: FormGroup;
  enderecoForm: FormGroup;
  IdRegistroMedico: number = 0;
  IdEndereco: number = 0;

  constructor(
    private tokenService: tokenService,
    private dadosPessoaisService: DadosPessoaisService,
    private fb: FormBuilder
  ) {
    this.dadosPessoaisForm = this.fb.group({
      MedNome: [''],
      MedSexo: [''],
      MedCrm: [''],
      MedRg: [''],
      MedEmail: [''],
      MedDataNacimento: [''],
      MedCpf: [''],
      MedEspecialidade: [''],
      MedTelefone: [''],
      MedTempoDeConsulta: [''],
    });
    this.enderecoForm = this.fb.group({
      EndRua: [''],
      EndNumero: [''],
      EndComplemento: [''],
      EndBairro: [''],
      EndCep: [''],
      EndMunicipio: [''],
      EndUF: [''],
      EndNacionalidade: [''],
    });

    this.tokenService.decodificaToken();
    this.tokenService.UsuarioLogadoValue$.subscribe((paciente) => {
      if (paciente) {
        this.UsuarioLogado = paciente;
        console.log(this.UsuarioLogado, 'paciente');
      }
    });
  }

  ngOnInit() {
    this.dadosPessoaisService
      .BuscarDadosPessoais(this.UsuarioLogado.id)
      .subscribe((dados) => {
        this.IdRegistroMedico = dados.MedCodigo;
        this.IdEndereco = dados.endereco.endCodigo;

        console.log('dados', dados, this.IdRegistroMedico, this.IdEndereco);

        // Preencher o formulário com os dados recebidos
        this.dadosPessoaisForm.patchValue({
          MedNome: dados.MedNome,
          MedSexo: dados.MedSexo,
          MedCrm: dados.MedCrm,
          MedRg: dados.MedRg,
          MedEmail: dados.MedEmail,
          MedDataNacimento: dados.MedDataNacimento,
          MedCpf: dados.MedCpf,
          MedEspecialidade: dados.MedEspecialidade,
          MedTelefone: dados.MedTelefone,
          MedTempoDeConsulta: dados.MedTempoDeConsulta,
        });

        this.enderecoForm.patchValue({
          EndRua: dados.endereco.endRua,
          EndNumero: dados.endereco.endNumero,
          EndComplemento: dados.endereco.endComplemento,
          EndBairro: dados.endereco.endBairro,
          EndCep: dados.endereco.endCep,
          EndMunicipio: dados.endereco.endMunicipio,
          EndUF: dados.endereco.endUF,
          EndNacionalidade: dados.endereco.endNacionalidade,
        });
      });
  }

  salvar() {
    const dadosPessoais = this.dadosPessoaisForm.value;
    const endereco = this.enderecoForm.value;

    // Adiciona IDs ao dadosPessoais e endereco
    const dadosAtualizados = {
      ...dadosPessoais,
      MedCodigo: this.IdRegistroMedico,
      Usuario: this.UsuarioLogado.id,
      Endereco: this.IdEndereco,
    };

    const enderecoAtualizado = {
      ...endereco,
      endCodigo: this.IdEndereco,
    };
     this.dadosPessoaisService
      .AtualizarDadosPessoais(dadosAtualizados)
      .subscribe({
        next: (res) => {
           this.dadosPessoaisService
            .AtualizarEnderecoMedico(enderecoAtualizado)
            .subscribe({
              next: (res) => {
                 Swal.fire({

                  icon: 'success',
                  title: 'Dados pessoais e endereço atualizados com sucesso',
                  showConfirmButton: false,
                  timer: 2500,
                });
              },
              error: (error) => {
                console.error('Erro ao atualizar endereço:', error);
              },
            });
        },
        error: (error) => {
          console.error('Erro ao atualizar dados pessoais:', error);
        },
      });
  }
}
