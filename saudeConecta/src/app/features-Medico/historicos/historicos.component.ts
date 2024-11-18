import { ImprimirPrescricaoComponent } from './../impressoes-PDF/ImprimirPrescricao/ImprimirPrescricao.component';
import { Prontuario } from './../../util/variados/interfaces/Prontuario/Prontuario';
import { ConsultaStatusService } from 'src/app/service/service-consulta-status/consulta-status.service';
import { ConsultaStatus } from './../../util/variados/interfaces/consultaStatus/consultaStatus';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ProntuarioService } from 'src/app/service/MEDICO-prontuario/prontuario.service';
import { tokenService } from 'src/app/util/Token/Token.service';
import { DialogService } from 'src/app/util/variados/dialogo-confirmação/dialog.service';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import Swal from 'sweetalert2';
import { ObservacoesComponent } from 'src/app/features/gerenciamento/agenda/Observacoes/Observacoes.component';
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
  ) { }


  ngOnInit(): void {
    this.tokenService.decodificaToken();
    this.tokenService.UsuarioLogadoValue$.subscribe((Usuario) => {
      if (Usuario) {
        this.UsuarioLogado = Usuario;
      }
    });
    if (this.UsuarioLogado.aud == '[ROLE_Medico]') {
      this.BuscarAgendaMedica();
      this.displayedColumnsMedico();
    }

    if (this.UsuarioLogado.aud == '[ROLE_ADMIN]') {
      this.BuscarDadosDeComoAdmin();
      this.displayedColumnsAdmin();
    }
  }

  async BuscarDadosDeComoAdmin() {
    this.dataSource = await this.ConsultaStatusService.BuscarDadosDeComoAdmin(this.dataSource, this.filteredDataSource)
  }




  filtrandoDadosDoBancoPassadoParametros(dados: any) {

    const normalizeString = (str: string) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase();
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

    // Filtrar os dados da consulta, comparando as strings normalizadas e tratando a data e o horário de forma específica
    let resultadoFiltrado = this.filteredDataSource.filter(
      (item) =>

        safeNormalize(item.conSttMedico?.medNome).includes(dadosUpper) || // Verifica se ConMedico existe antes de acessar medNome
        safeNormalize(item.conSttPaciente?.paciNome).includes(dadosUpper) || // Verifica se ConPaciente existe antes de acessar paciNome
        safeNormalize(item.conSttDia_semana).includes(dadosUpper) ||
        isDateMatch(item.conSttData, dados.trim()) || // Compara as datas sem normalizar
        isTimeMatch(item.conSttHorario, dados.trim()) || // Compara os horários diretamente
        safeNormalize(item.conSttObservacao).includes(dadosUpper)
    );


    if (resultadoFiltrado.length > 0) {
      this.LimparTabela();
      this.dataSource = resultadoFiltrado;
    } else {
      this.DialogService.NaoFoiEncontradoConsultasComEssesParametros();
      this.LimparTabela();
      if (this.UsuarioLogado.aud == '[ROLE_Medico]') {
        this.BuscarAgendaMedica();
        this.displayedColumnsMedico();
      }
      if (this.UsuarioLogado.aud == '[ROLE_ADMIN]') {
        this.BuscarDadosDeComoAdmin();
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

  async BuscarAgendaMedica() {
    this.dataSource = await this.ConsultaStatusService.BuscarDadosDoMedico(this.UsuarioLogado.id, this.dataSource, this.filteredDataSource);
  }


  resetarPesquisa() {
    this.pesquisa = '';

    if (this.UsuarioLogado.aud == '[ROLE_Medico]') {
      this.BuscarAgendaMedica();
    }

    if (this.UsuarioLogado.aud == '[ROLE_ADMIN]') {
      this.BuscarDadosDeComoAdmin();
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
            this.ImprimirSolicitacaoDeExames(dados);
          } else if (value === '2') {
            this.ImprimirPrescricaoComponent(dados);
          } else if (value === '3') {
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
