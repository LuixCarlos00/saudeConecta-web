import { Prontuario } from './../../util/variados/interfaces/Prontuario/Prontuario';
import { ConsultaStatusService } from 'src/app/service/service-consulta-status/consulta-status.service';
import { ConsultaStatus } from './../../util/variados/interfaces/consultaStatus/consultaStatus';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ProntuarioService } from 'src/app/service/MEDICO-prontuario/prontuario.service';
import { TabelaAgendaMedicoService } from 'src/app/service/MEDICO-tabela-agenda-medico/tabelaAgendaMedico.service';
import { tokenService } from 'src/app/util/Token/Token.service';
import { DialogService } from 'src/app/util/variados/dialogo-confirmação/dialog.service';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import Swal from 'sweetalert2';
import { ObservacoesComponent } from 'src/app/features/agenda/tabela-agenda/Observacoes/Observacoes.component';
import { id, is } from 'date-fns/locale';
import { ImprimirPrescricaoComponent } from '../impressoes-PDF/ImprimirPrescricao/ImprimirPrescricao.component';
import { ImprimirSoliciatacaoDeExamesComponent } from '../impressoes-PDF/ImprimirSoliciatacaoDeExames/ImprimirSoliciatacaoDeExames.component';

@Component({
  selector: 'app-historicos',
  templateUrl: './historicos.component.html',
  styleUrls: ['./historicos.component.css'],
})
export class HistoricosComponent implements OnInit {
  // @Output() selecionaMedico = new EventEmitter<any>();
  // @Output() fechar = new EventEmitter<void>();

  highValue: number = 5;
  lowValue: number = 0;
  dataSource: ConsultaStatus[] = [];
  filteredDataSource: any[] = [];
  clickedRows = new Set<any>();
  pesquisa: string = '';

  UsuarioLogado: Usuario = {
    id: 0,
    aud: '',
    exp: '',
    iss: '',
    sub: '',
  };

  constructor(
    private tokenService: tokenService,
    private ConsultaStatusService: ConsultaStatusService,
    public dialog: MatDialog,
    private ProntuarioService: ProntuarioService,
    private DialogService: DialogService
  ) {
    this.tokenService.decodificaToken();
    this.tokenService.UsuarioLogadoValue$.subscribe((Usuario) => {
      if (Usuario) {
        this.UsuarioLogado = Usuario;
      }
    });

    this.BuscarDadosDeAgendaDoMedico();
  }

  ngOnInit() {}

  filtrandoDadosDoBancoPassadoParametros_Pesquisa(dados: any) {
    // Função para normalizar e remover acentos e caracteres especiais
    const normalizeString = (str: string) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
        .toUpperCase(); // Converte para maiúsculas
    };
    const dadosUpper = normalizeString(dados.toString());

    // Filtrar os dados da consulta, comparando as strings normalizadas
    let resultadoFiltrado = this.filteredDataSource.filter(
      (item) =>
        normalizeString(item.ConSttCodigoConsulata.toString()).includes(
          dadosUpper
        ) ||
        normalizeString(item.ConSttPaciente.paciNome).includes(dadosUpper) ||
        normalizeString(item.ConSttDia_semana).includes(dadosUpper) ||
        normalizeString(item.ConSttData).includes(dadosUpper) ||
        normalizeString(item.ConSttHorario).includes(dadosUpper) ||
        normalizeString(item.ConSttObservacao).includes(dadosUpper)
    );

    if (resultadoFiltrado.length > 0) {
      this.LimparTabela();
      this.dataSource = resultadoFiltrado;
    } else {
      this.DialogService.NaoFoiEncontradoConsultasComEssesParametros();
      this.LimparTabela();
      this.BuscarDadosDeAgendaDoMedico();
    }
  }

  LimparTabela() {
    this.dataSource = [];
    this.filteredDataSource = [];
  }

  chamandoPesquisa() {
    this.filtrandoDadosDoBancoPassadoParametros_Pesquisa(this.pesquisa);
  }

  BuscarDadosDeAgendaDoMedico() {
    this.ConsultaStatusService.BuscarHistoricoDeAgendaDoMedico(
      this.UsuarioLogado.id
    ).subscribe((dados) => {
      console.log('dados', dados);

      let Consulta: ConsultaStatus[] = [];
      for (let i = 0; i < dados.length; i++) {
        Consulta[i] = {
          ConSttCodigoConsulata: dados[i].ConSttCodigoConsulata,
          ConSttMedico: dados[i].ConSttMedico,
          ConSttPaciente: dados[i].ConSttPaciente,
          ConSttDia_semana: dados[i].ConSttDia_semana,
          ConSttHorario: dados[i].ConSttHorario,
          ConSttData: dados[i].ConSttData,
          ConSttObservacao: dados[i].ConSttObservacao,
          ConSttDataCriacao: dados[i].ConSttDataCriacao,
          ConSttFormaPagamento: dados[i].ConSttFormaPagamento,
          ConSttAdm: dados[i].ConSttStatus,
          ConSttStatus: dados[i].conAdm,
        };
      }

      // Ordenar a novaConsulta pelo horário
      Consulta.sort((a, b) => {
        const horaA = a.ConSttData.split('-').map(Number);
        const horaB = b.ConSttData.split('-').map(Number);

        // Comparar horas
        if (horaA[0] !== horaB[0]) {
          return horaA[0] - horaB[0];
        }
        // Comparar minutos se horas forem iguais
        return horaA[1] - horaB[1];
      });

      if (Consulta.length > 0) {
        console.log(Consulta);
        this.dataSource = Consulta;
        this.filteredDataSource = Consulta; // Inicializa o filtro
      } else {
        Swal.fire('Nenhuma consulta encontrada', 'Tente novamente', 'warning');
        Consulta[0] = {
          ConSttCodigoConsulata: 0,
          ConSttMedico: 0,
          ConSttPaciente: 0,
          ConSttDia_semana: 'Sem Dados',
          ConSttHorario: 'Sem Dados',
          ConSttData: 'Sem Dados',
          ConSttObservacao: 'Sem Dados',
          ConSttDataCriacao: 'Sem Dados',
          ConSttFormaPagamento: 0,
          ConSttStatus: 0,
          ConSttAdm: 0,
        };
        this.dataSource = Consulta;
        this.filteredDataSource = Consulta; // Inicializa o filtro
      }
    });
  }

  resetarPesquisa() {
    this.pesquisa = '';
    this.BuscarDadosDeAgendaDoMedico();
  }

  limparPesquisa() {
    this.resetarPesquisa();
    this.pesquisa = '';
  }

  openObservacoesDialog(observacoes: string): void {
    this.dialog.open(ObservacoesComponent, {
      width: '550px',
      data: { observacoes: observacoes },
    });
  }

  //   ImprimirPrescricao() {
  //     this.dialog.open(ImprimirPrescricaoComponent, {
  //       width: '60%',
  //       height: '90%',
  //       data: { prontuario: this.Prontuario, Consulta: this.Consultas },
  //     });
  //   }

  ImprimirSOlicitacaoDeExames(prontuario: any) {
    this.dialog.open(ImprimirSoliciatacaoDeExamesComponent, {
      width: '60%',
      height: '90%',
      data:  { prontuario: prontuario , Consulta: prontuario.prontCodigoConsulta}
    });
  }


  openImprimirDialog(value: any) {
    this.ProntuarioService.BuscarPorProntuarioPassadoIdDeConsultaStatus(
      value
    ).subscribe((dados) => {
      console.log('dados', dados);

      Swal.fire({
        title: 'Selecione uma opção para imprimir',
        input: 'select',
        inputOptions: {
          '1': 'Solicitação de Exames',
          '2': 'Prescrição',
          '3': 'Relatório',
          '4': 'Atestado de Paciente',
        },
        showCancelButton: true,
        inputValidator: (value) => {
          if (value === '1') {
            console.log('Imprimir Solicitação de Exames');
            this.ImprimirSOlicitacaoDeExames(dados);
          } else if (value === '2') {
            console.log('Imprimir Prescrição');
          } else if (value === '3') {
            console.log('Imprimir Relatório');
          } else if (value === '4') {
            console.log('Imprimir Paciente');
          }
          if (!value) {
            return null;
          }
          return null;
        },
      });
    });
  }

  getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    this.highValue = Math.min(this.highValue, this.filteredDataSource.length);
    return event;
  }

  displayedColumns = [
    'ConCodigoConsulta',
    'NomePaciente',
    'ConDia_semana',
    'ConData',
    'ConHorario',
    'ConObservacoes',
    'Imprimir',
  ];
}
