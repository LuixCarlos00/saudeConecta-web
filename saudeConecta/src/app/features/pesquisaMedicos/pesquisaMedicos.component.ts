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
    private gerenciamentoService: GerenciamentoService,
    private consultaService: ConsultaService
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

  async PesquisarMedicosFiltro() {
    const pesquisa: string = this.FormularioPesquisa.get('PesquisaMedico')?.value;

    const FiltroPesquisa: number = this.FormularioPesquisa.get('FiltroPesquisaMedico')?.value;

    try {
      const dados = await this.medicosService.PesquisaMedicoFiltro(
        FiltroPesquisa,
        pesquisa
      );
      this.showResultadoMedico = true;
      this.dadosMedico = dados;
    } catch (error) {
      this.medicosService.exibirMensagemErro();
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

  LimparFormulario() {
    this.FormularioPesquisa.reset();
    this.MedicoEscolhido = null;
  }
}
