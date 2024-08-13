import { ConsultaService } from 'src/app/service/consulta/consulta.service';
import { Medico } from './../../util/variados/interfaces/medico/medico';
import { Route, Router } from '@angular/router';
import { DialogService } from './../../util/variados/dialogo-confirmação/dialog.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MedicosService } from 'src/app/service/medicos/medicos.service';
import { GerenciamentoService } from 'src/app/service/gerenciamento/gerenciamento.service';

@Component({
  selector: 'app-pesquisaMedicos',
  templateUrl: './pesquisaMedicos.component.html',
  styleUrls: ['./pesquisaMedicos.component.css'],
})
export class PesquisaMedicosComponent implements OnInit {


  showResultadoMedico: boolean = false;
  dadosMedico: any;
  MedicoEscolhido!: any;
  FormularioPesquisa!: FormGroup;

  @Input() MostraDadosMedicos: boolean = false;
  @Input() Medico!: any;

  constructor(
    private form: FormBuilder,
    private medicosService: MedicosService,
    private DialogService: DialogService,
    private router: Router,
    private gerenciamentoService :GerenciamentoService,
    private consultaService  : ConsultaService
  ) {

    this.consultaService.CadastroRealizadoComSucesso$.subscribe((cadastro) => {
      if (cadastro) {
        this.LimparFormulario();
      }
    });


  }

  ngOnInit() {
    this.FormularioPesquisa = this.form.group({
      Pesquisa: ['', Validators.required],
      FiltroPesquisaMedico: ['', Validators.required],
    });
  }

  PesquisarMedicosFiltro() {


    const pesquisa: string = this.FormularioPesquisa.get('Pesquisa')?.value;
    const FiltroPesquisa: number = this.FormularioPesquisa.get('FiltroPesquisaMedico')?.value;

    if (FiltroPesquisa === 1) {


      this.medicosService.buscarListaMedicosPorNome(pesquisa).subscribe(
        (dados) => {
          if (dados && dados.length > 0) {
            this.showResultadoMedico = true;
            this.dadosMedico = dados;
          } else {
            this.exibirMensagemErro();
          }
        },
        () => this.exibirMensagemErro()
      );
    } else if (FiltroPesquisa === 2) {
      this.medicosService.buscarListaMedicosPorCRM(pesquisa).subscribe(
        (dados) => {
          if (dados && dados.length > 0) {
            this.showResultadoMedico = true;
            this.dadosMedico = dados;
          } else {
            this.exibirMensagemErro();
          }
        },
        () => this.exibirMensagemErro()
      );
    } else if (FiltroPesquisa === 3) {
      this.medicosService.buscarListaMedicosPorCidade(pesquisa).subscribe(
        (dados) => {
          if (dados && dados.length > 0) {
            this.showResultadoMedico = true;
            this.dadosMedico = dados;
          } else {
            this.exibirMensagemErro();
          }
        },
        () => this.exibirMensagemErro()
      );
    } else if (FiltroPesquisa === 4) {
      this.medicosService
        .buscarListaMedicosPorEspecialidade(pesquisa)
        .subscribe(
          (dados) => {
            if (dados && dados.length > 0) {
              this.showResultadoMedico = true;
              this.dadosMedico = dados;
            } else {
              this.exibirMensagemErro();
            }
          },
          () => this.exibirMensagemErro()
        );
    } else if (FiltroPesquisa === 5) {
      this.medicosService.buscarPorTodosOsMedicos().subscribe(
        (dados) => {
          if (dados && dados.length > 0) {
            this.showResultadoMedico = true;
            this.dadosMedico = dados;
          } else {
            this.exibirMensagemErro();
          }
        },
        () => this.exibirMensagemErro()
      );
    }
  }

  exibirMensagemErro() {
    this.DialogService.exibirMensagemErro();
  }

  voltarParaHome() {
    this.router.navigate(['/Dashboard']);
  }

  fecharTabela() {
    this.showResultadoMedico = false;
  }

  MedicoSelecionado(event: any) {
    this.MedicoEscolhido = event;
    this.gerenciamentoService.setMedicoEscolhido(event); // Adicionado
  }

  LimparFormulario(){
    this.FormularioPesquisa.reset();
    this.MedicoEscolhido = null;
  }
}
