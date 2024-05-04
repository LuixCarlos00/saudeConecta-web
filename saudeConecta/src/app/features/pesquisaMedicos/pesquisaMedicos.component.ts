import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PacienteService } from 'src/app/service/paciente_service/paciente.service';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';

@Component({
  selector: 'app-pesquisaMedicos',
  templateUrl: './pesquisaMedicos.component.html',
  styleUrls: ['./pesquisaMedicos.component.css'],
})
export class PesquisaMedicosComponent implements OnInit {




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
    private pacienteService: PacienteService,
    private _snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
    this.pacienteService.currentMedicoData$.subscribe(medico => {
      console.log(medico);
      if (medico) {
      this.Medico = medico;
      }
    });




    this.FormularioPesquisa = this.form.group({
      Pesquisa: ['', Validators.required],
      FiltroPesquisa: ['', Validators.required],
    });
    this.mostraTabela = this.pacienteService.MostraCamposDePEsquisa;
  }

  PesquisarMedicosFiltro() {


    const pesquisa: string = this.FormularioPesquisa.get('Pesquisa')?.value;
    const FiltroPesquisa: number = this.FormularioPesquisa.get('FiltroPesquisa')?.value;

    if (FiltroPesquisa === 1) {
      this.pacienteService.buscarListaMedicosPorNome(pesquisa).subscribe(
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
      this.pacienteService.buscarListaMedicosPorCRM(pesquisa).subscribe(
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
      this.pacienteService.buscarListaMedicosPorCidade(pesquisa).subscribe(
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
      this.pacienteService
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
    this._snackBar.open('Não ha registros com esse parametro.', 'Fechar', {
      duration: 3000,
    });
  }
}
