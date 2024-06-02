import { Route, Router } from '@angular/router';
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
    private DialogService: DialogService,

    private router: Router

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
            this.mostraTabela = true;
            this.MostraCamposDePEsquisa = false;
          } else {
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
            this.mostraTabela = true;
            this.MostraCamposDePEsquisa = false;
          } else {
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
            this.mostraTabela = true;
            this.MostraCamposDePEsquisa = false;
          } else {
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

              this.mostraTabela = true;
              this.MostraCamposDePEsquisa = false;
            } else {

              this.exibirMensagemErro();
            }
          },
          (erros) => {
            this.exibirMensagemErro();
          }
        );
      } else if (FiltroPesquisa === 5) {
        this.medicosService
          .buscarPorTodosOsMedicos()
          .subscribe(
            (dados) => {

              if (dados && dados.length > 0) {

                this.mostraTabela = true;
                this.MostraCamposDePEsquisa = false;
              } else {

                this.exibirMensagemErro();
              }
            },
            (erros) => {
              this.exibirMensagemErro();
            }
          );
      }

  }





  exibirMensagemErro() {
    this.DialogService.exibirMensagemErro( )
  }

  voltarParaHome() {
    this.router.navigate(['/home'])
    }
}
