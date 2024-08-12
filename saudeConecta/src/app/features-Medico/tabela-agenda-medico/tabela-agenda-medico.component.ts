import { ProntuarioService } from 'src/app/service/MEDICO-prontuario/prontuario.service';
import { Consulta } from './../../util/variados/interfaces/consulta/consulta';
import { TabelaAgendaMedicoService } from './../../service/MEDICO-tabela-agenda-medico/tabelaAgendaMedico.service';
import { Usuario } from './../../util/variados/interfaces/usuario/usuario';
import { tokenService } from './../../util/Token/Token.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ObservacoesComponent } from 'src/app/features/agenda/tabela-agenda/Observacoes/Observacoes.component';
import { DialogService } from 'src/app/util/variados/dialogo-confirmação/dialog.service';
import { elements } from 'chart.js';
import { el } from 'date-fns/locale';
import { GerenciamentoComponent } from 'src/app/features/gerenciamento/gerenciamento.component';
import { GerenciamentoProntuarioComponent } from '../gerenciamentoProntuario/gerenciamentoProntuario.component';

@Component({
  selector: 'app-tabela-agenda-medico',
  templateUrl: './tabela-agenda-medico.component.html',
  styleUrls: ['./tabela-agenda-medico.component.css'],
})
export class TabelaAgendaMedicoComponent implements OnInit {

  @Output() selecionaMedico = new EventEmitter<any>();
  @Output() fechar = new EventEmitter<void>();
  highValue: number = 5;
  lowValue: number = 0;
  dataSource: Consulta[] = [];
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
    private TabelaAgendaMedicoService: TabelaAgendaMedicoService,
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

    this.BuscarDadosDeAgendaDoMedicoDoDia();


  }

  ngOnInit() {}


  DesejaAbrirConsulta(element: any) {
    Swal.fire({
      title: 'Tem certeza que deseja abrir essa consulta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5ccf6c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, abrir!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.AbrirConsulta(element);
      }else{
        this.BuscarDadosDeAgendaDoMedicoDoDia();
      }
    });
   }



   AbrirConsulta(element: any) {
    this.ProntuarioService.changeObjetoConsulta(element);
    this.dialog.open(GerenciamentoProntuarioComponent, {
      width: '1200px',
      height: '600px',
      data: { element: element },
    });

   }




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
        normalizeString(item.ConCodigoConsulta.toString()).includes(
          dadosUpper
        ) ||
        normalizeString(item.ConPaciente.paciNome).includes(dadosUpper) ||
        normalizeString(item.ConDia_semana).includes(dadosUpper) ||
        normalizeString(item.ConData).includes(dadosUpper) ||
        normalizeString(item.ConHorario).includes(dadosUpper) ||
        normalizeString(item.ConObservacoes).includes(dadosUpper)
    );

    if (resultadoFiltrado.length > 0) {
      this.LimparTabela();
      this.dataSource = resultadoFiltrado;
    } else {
      this.DialogService.NaoFoiEncontradoConsultasComEssesParametros();
      this.LimparTabela();
      this.BuscarDadosDeAgendaDoMedicoDoDia();
    }
  }

  LimparTabela() {
    this.dataSource = [];
    this.filteredDataSource = [];
  }

  chamandoPesquisa() {
    this.filtrandoDadosDoBancoPassadoParametros_Pesquisa(this.pesquisa);
  }
  ///tras todos os dados e organiza pelo dia  e mostra apenas os que sao do dia de hoje

  BuscarDadosDeAgendaDoMedicoDoDia() {
    const dataHoje = new Date();
    this.TabelaAgendaMedicoService.BuscarTodaAgendaDeMedicoDoDia(
      this.UsuarioLogado.id,
      dataHoje.toISOString().split('T')[0]
    ).subscribe((dados) => {
      let novaConsulta: Consulta[] = [];
      for (let i = 0; i < dados.length; i++) {
        novaConsulta[i] = {
          ConCodigoConsulta: dados[i].conCodigoConsulta,
          ConMedico: dados[i].conMedico,
          ConPaciente: dados[i].conPaciente,
          ConDia_semana: dados[i].conDia_semana,
          ConHorario: dados[i].conHorario,
          ConData: dados[i].conData,
          ConObservacoes: dados[i].conObservacoes,
          ConDadaCriacao: dados[i].conDataCriacao,
          ConFormaPagamento: dados[i].conFormaPagamento,
          ConStatus: dados[i].conStatus,
          ConAdm: dados[i].conAdm,
        };
      }

      // Ordenar a novaConsulta pelo horário
      novaConsulta.sort((a, b) => {
        const horaA = a.ConHorario.split(':').map(Number);
        const horaB = b.ConHorario.split(':').map(Number);

        // Comparar horas
        if (horaA[0] !== horaB[0]) {
          return horaA[0] - horaB[0];
        }
        // Comparar minutos se horas forem iguais
        return horaA[1] - horaB[1];
      });

      if (novaConsulta.length > 0) {
        console.log(novaConsulta);
        this.dataSource = novaConsulta;
        this.filteredDataSource = novaConsulta; // Inicializa o filtro
      } else {
        Swal.fire('Nenhuma consulta encontrada', 'Tente novamente', 'warning');
        novaConsulta[0] = {
          ConCodigoConsulta: 0,
          ConMedico: 0,
          ConPaciente: 0,
          ConDia_semana: 'Sem Dados',
          ConHorario: 'Sem Dados',
          ConData: 'Sem Dados',
          ConObservacoes: 'Sem Dados',
          ConDadaCriacao: 'Sem Dados',
          ConFormaPagamento: 0,
          ConStatus: 0,
          ConAdm: 0,
        };
        this.dataSource = novaConsulta;
        this.filteredDataSource = novaConsulta; // Inicializa o filtro
      }
    });
  }

  resetarPesquisa() {
    this.pesquisa = '';
    this.BuscarDadosDeAgendaDoMedicoDoDia();
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
    'Consulta',
  ];
}
