import { ImprimirPrescricaoComponent } from './../impressoes-PDF/ImprimirPrescricao/ImprimirPrescricao.component';
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
import { ImprimirSoliciatacaoDeExamesComponent } from '../impressoes-PDF/ImprimirSoliciatacaoDeExames/ImprimirSoliciatacaoDeExames.component';
import { AtestadoPacienteComponent } from '../impressoes-PDF/AtestadoPaciente/AtestadoPaciente.component';
import { HistoricoCompletoComponent } from '../impressoes-PDF/historicoCompleto/historicoCompleto.component';

@Component({
  selector: 'app-historicos',
  templateUrl: './historicos.component.html',
  styleUrls: ['./historicos.component.css'],
})
export class HistoricosComponent implements OnInit {
  highValue: number = 5;
  lowValue: number = 0;
  dataSource: ConsultaStatus[] = [];
  filteredDataSource: any[] = [];
  clickedRows = new Set<any>();
  pesquisa: string = '';
  displayedColumns: any = [];
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
  ) {}


  ngOnInit(): void {
    this.tokenService.decodificaToken();
    this.tokenService.UsuarioLogadoValue$.subscribe((Usuario) => {
      if (Usuario) {
        this.UsuarioLogado = Usuario;
        console.log('this.UsuarioLogado', this.UsuarioLogado);
      }
    });
    if (this.UsuarioLogado.aud == '[ROLE_Medico]') {
      this.BuscarDadosDeAgendaDoMedico();
      this.displayedColumnsMedico();
    }

    if (this.UsuarioLogado.aud == '[ROLE_ADMIN]') {
      this.BuscarDadosDeAgendaDeTodosOsMedicos();
      this.displayedColumnsAdmin();
    }
  }

  BuscarDadosDeAgendaDeTodosOsMedicos() {
    this.ConsultaStatusService.BuscarDadosDeAgendaDeTodosOsMedicos().subscribe(
      (dados) => {
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
          Swal.fire(
            'Nenhuma consulta encontrada',
            'Tente novamente',
            'warning'
          );
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
          console.log('dataSource', this.dataSource);

          this.filteredDataSource = Consulta; // Inicializa o filtro
        }
      }
    );
  }




  filtrandoDadosDoBancoPassadoParametros(dados: any) {
    // Função para normalizar e remover acentos e caracteres especiais
    const normalizeString = (str: string) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
        .toUpperCase(); // Converte para maiúsculas
    };

    const safeNormalize = (value: any) => {
      return value ? normalizeString(value.toString()) : ''; // Verifica se o valor não é nulo ou undefined
    };

    const isDateMatch = (date1: string, date2: string) => {
      const parseDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date;
      };

      const parsedDate1 = parseDate(date1);
      const parsedDate2 = parseDate(date2);

      if (!parsedDate1 || !parsedDate2) {
        return false; // Se qualquer data for inválida, retorne false
      }

      return parsedDate1.toISOString().split('T')[0] === parsedDate2.toISOString().split('T')[0];
    };


    const isTimeMatch = (time1: string, time2: string) => {
      const formatTime = (time: string) => {
        let [hour, minute] = time.split(':');
        if (!hour || !minute) {
          return null; // Se não for possível dividir corretamente, retorne null
        }
        hour = hour.padStart(2, '0'); // Garante que a hora tenha 2 dígitos
        minute = minute.padStart(2, '0'); // Garante que os minutos tenham 2 dígitos
        return `${hour}:${minute}`;
      };

      const formattedTime1 = formatTime(time1.trim());
      const formattedTime2 = formatTime(time2.trim());

      if (!formattedTime1 || !formattedTime2) {
        return false; // Se qualquer hora for inválida, retorne false
      }

      return formattedTime1 === formattedTime2;
    };


    const dadosUpper = safeNormalize(dados.trim());
    console.log('DadosDeConsulta', this.filteredDataSource);

    // Filtrar os dados da consulta, comparando as strings normalizadas e tratando a data e o horário de forma específica
    let resultadoFiltrado = this.filteredDataSource.filter(
      (item) =>

        safeNormalize(item.ConSttMedico?.medNome).includes(dadosUpper) || // Verifica se ConMedico existe antes de acessar medNome
        safeNormalize(item.ConSttPaciente?.paciNome).includes(dadosUpper) || // Verifica se ConPaciente existe antes de acessar paciNome
        safeNormalize(item.ConSttDia_semana).includes(dadosUpper) ||
        isDateMatch(item.ConSttData, dados.trim()) || // Compara as datas sem normalizar
        isTimeMatch(item.ConSttHorario, dados.trim()) || // Compara os horários diretamente
        safeNormalize(item.ConSttObservacao).includes(dadosUpper)
    );

    console.log('resultadoFiltrado', resultadoFiltrado);

    if (resultadoFiltrado.length > 0) {
      this.LimparTabela();
      this.dataSource = resultadoFiltrado;
    } else {
      this.DialogService.NaoFoiEncontradoConsultasComEssesParametros();
      this.LimparTabela();
      if (this.UsuarioLogado.aud == '[ROLE_Medico]') {
        this.BuscarDadosDeAgendaDoMedico();
        this.displayedColumnsMedico();
      }
      if (this.UsuarioLogado.aud == '[ROLE_ADMIN]') {
        this.BuscarDadosDeAgendaDeTodosOsMedicos();
        this.displayedColumnsAdmin();
      }
    }
  }





  LimparTabela() {
    this.dataSource = [];
    this.filteredDataSource = [];
  }

  chamandoPesquisa() {
    this.filtrandoDadosDoBancoPassadoParametros(this.pesquisa);
  }

  BuscarDadosDeAgendaDoMedico() {
    this.ConsultaStatusService.BuscarHistoricoDeAgendaDoMedico(
      this.UsuarioLogado.id
    ).subscribe((dados) => {
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

    if (this.UsuarioLogado.aud == '[ROLE_Medico]') {
      this.BuscarDadosDeAgendaDoMedico();
    }

    if (this.UsuarioLogado.aud == '[ROLE_ADMIN]') {
      this.BuscarDadosDeAgendaDeTodosOsMedicos();
    }
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

  ImprimirPrescricaoComponent(prontuario: any) {
    this.dialog.open(ImprimirPrescricaoComponent, {
      width: '60%',
      height: '90%',
      data: {
        prontuario: prontuario,
        Consulta: prontuario.prontCodigoConsulta,
      },
    });
  }

  ImprimirSolicitacaoDeExames(prontuario: any) {
    this.dialog.open(ImprimirSoliciatacaoDeExamesComponent, {
      width: '60%',
      height: '90%',
      data: {
        prontuario: prontuario,
        Consulta: prontuario.prontCodigoConsulta,
      },
    });
  }

  ImprimirAtestadoPacienteComponent(prontuario: any) {
    this.dialog.open(AtestadoPacienteComponent, {
      width: '60%',
      height: '90%',
      data: { Consulta: prontuario.prontCodigoConsulta },
    });
  }

  ImprimirHistorioCompleto(prontuario: Prontuario) {
    this.dialog.open(HistoricoCompletoComponent, {
      width: '60%',
      height: '90%',
      data: { Consulta: prontuario.prontCodigoConsulta },
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
          '3': 'Imprimir Histórico Completo',
          '4': 'Atestado de Paciente',
        },
        showCancelButton: true,
        inputValidator: (value) => {
          if (value === '1') {
            console.log('Imprimir Solicitação de Exames');
            this.ImprimirSolicitacaoDeExames(dados);
          } else if (value === '2') {
            console.log('Imprimir Prescrição');
            this.ImprimirPrescricaoComponent(dados);
          } else if (value === '3') {
            console.log('Imprimir Histórico Completo');
            this.ImprimirHistorioCompleto(dados);
          } else if (value === '4') {
            this.ImprimirAtestadoPacienteComponent(dados);
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


  displayedColumnsAdmin() {
    this.displayedColumns = [
      'ConCodigoConsulta',
      'NomeMedico',
      'NomePaciente',
      'ConDia_semana',
      'ConData',
      'ConHorario',
      'ConObservacoes',
      'Imprimir',
    ];
  }
  displayedColumnsMedico() {
    this.displayedColumns = [
      'ConCodigoConsulta',
      'NomePaciente',
      'ConDia_semana',
      'ConData',
      'ConHorario',
      'ConObservacoes',
      'Imprimir',
    ];
  }
}
