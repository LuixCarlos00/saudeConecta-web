import { DialogService } from './../../util/variados/dialogo-confirmação/dialog.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MedicosService } from 'src/app/service/medicos/medicos.service';


@Component({
  selector: 'app-pesquisaMedicos',
  templateUrl: './pesquisaMedicos.component.html',
  styleUrls: ['./pesquisaMedicos.component.css'],
})
export class PesquisaMedicosComponent implements OnInit {
PesquisarPacientes() {
throw new Error('Method not implemented.');
}




  FormularioPesquisa!: FormGroup;


  mostraTabela: boolean = false;
  @Input() MostraCamposDePEsquisa: boolean = true;
  @Input() MostraDadosMedicos : boolean = false;
  @Input() Medico!: any;


  mostrarCamposPesquisa(value: boolean) {
    this.mostraTabela = false;
    this.MostraCamposDePEsquisa = value;
    this.MostraDadosMedicos = false;
  }

  constructor(
    private form: FormBuilder,
    private medicosService: MedicosService,
    private DialogService: DialogService

  ) {

  }

  ngOnInit() {
    this.medicosService.MedicoValue$.subscribe(medico => {
      if (medico) {
      this.Medico = medico;
      }
    });




    this.FormularioPesquisa = this.form.group({
      Pesquisa: ['', Validators.required],
      FiltroPesquisaMedico: ['', Validators.required],
    });




    this.mostraTabela = this.medicosService.MostraCamposDePEsquisa;
  }

  PesquisarMedicosFiltro() {


    const pesquisa: string = this.FormularioPesquisa.get('Pesquisa')?.value;
    const FiltroPesquisa: number = this.FormularioPesquisa.get('FiltroPesquisaMedico')?.value;

    if (FiltroPesquisa === 1) {
      this.medicosService.buscarListaMedicosPorNome(pesquisa).subscribe(
        (dados) => {
          if (dados && dados.length > 0) {
            // Se houver dados, exibe a tabela
            this.mostraTabela = true;
            this.MostraCamposDePEsquisa = false;
          } else {
            // Se não houver dados, exibe a mensagem de erro
            this.exibirMensagemErro();
          }
        },
        (erros) => {
          this.exibirMensagemErro();
        }
      );
    } else if (FiltroPesquisa === 2) {
      this.medicosService.buscarListaMedicosPorCRM (pesquisa).subscribe(
        (dados) => {
          if (dados && dados.length > 0) {
            // Se houver dados, exibe a tabela
            this.mostraTabela = true;
            this.MostraCamposDePEsquisa = false;
          } else {
            // Se não houver dados, exibe a mensagem de erro
            this.exibirMensagemErro();
          }
        },
        (erros) => {
          this.exibirMensagemErro();
        }
      );
    } else if (FiltroPesquisa === 3) {
      this.medicosService.buscarListaMedicosPorCidade(pesquisa).subscribe(
        (dados) => {
          if (dados && dados.length > 0) {
            // Se houver dados, exibe a tabela
            this.mostraTabela = true;
            this.MostraCamposDePEsquisa = false;
          } else {
            // Se não houver dados, exibe a mensagem de erro
            this.exibirMensagemErro();
          }
        },
        (erros) => {
          this.exibirMensagemErro();
        }
      );
    } else if (FiltroPesquisa === 4) {
      this.medicosService
        .buscarListaMedicosPorEspecialidade(pesquisa)
        .subscribe(
          (dados) => {
            console.log(dados);

            if (dados && dados.length > 0) {
              // Se houver dados, exibe a tabela
              this.mostraTabela = true;
              this.MostraCamposDePEsquisa = false;
            } else {
              // Se não houver dados, exibe a mensagem de erro
              this.exibirMensagemErro();
            }
          },
          (erros) => {
            this.exibirMensagemErro();
          }
        );
    }

    console.log(pesquisa, FiltroPesquisa);
  }

  exibirMensagemErro() {
    this.DialogService.exibirMensagemErro( )
  }
}
