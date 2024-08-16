import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs';
import { Paciente } from './../../../util/variados/interfaces/paciente/paciente';
import { Medico } from './../../../util/variados/interfaces/medico/medico';
import { MatDialog } from '@angular/material/dialog';
import { el } from 'date-fns/locale';
import { DialogService } from 'src/app/util/variados/dialogo-confirmação/dialog.service';
import Swal from 'sweetalert2';
import { lastDayOfDecade } from 'date-fns';
import { ObservacoesComponent } from '../tabela-agenda/Observacoes/Observacoes.component';
import { EditarConsultasComponent } from '../tabela-agenda/Editar-Consultas/Editar-Consultas.component';
import { ConsultaStatus } from 'src/app/util/variados/interfaces/consultaStatus/consultaStatus';
import { ConsultaStatusService } from 'src/app/service/service-consulta-status/consulta-status.service';
import { Template_PDFComponent } from '../template_PDF/template_PDF.component';
import { Template_PDF_ConcluidosComponent } from '../template_PDF_Concluidos/template_PDF_Concluidos.component';

@Component({
  selector: 'app-tabela-agenda-status',
  templateUrl: './tabela-agenda-status.component.html',
  styleUrls: ['./tabela-agenda-status.component.css'],
})
export class TabelaAgendaStatusComponent implements OnInit {
  //
  //
  //
  Medicos: Medico = {
    MedCodigo: 0,
    MedNome: '',
    MedSexo: 0,
    MedDataNacimento: '',
    MedCrm: '',
    MedCpf: '',
    MedRg: '',
    MedEspecialidade: '',
    MedEmail: '',
    MedTelefone: '',
    endereco: 0,
    usuario: 0,
  };
  Pacientes: Paciente = {
    PaciCodigo: 0,
    PaciNome: '',
    PaciSexo: 0,
    PaciDataNacimento: '',
    PaciCpf: '',
    PaciRg: '',
    PaciEmail: '',
    PaciTelefone: '',
    endereco: 0,
    PaciStatus: 0
  };

  displayedColumns = [
    'ConCodigoConsulta',
    'ConMedico.medNome',
    'ConPaciente.paciNome',
    'ConDia_semana',
    'ConData',
    'ConHorario',
    'ConObservacoes',
    'Seleciona',
  ];

  DadoSelecionaParaExclusao: any = [];
  DadoSelecionadoParaEdicao: any = [];
  DadoSelecionadoParaConclusao: any = [];
  ParametroDeFiltragem: any;
  dataSource: ConsultaStatus[] = [];
  DadosDeConsulta: any[] = [];
  clickedRows = new Set<any>();
  DadoSelecionadoParaGerarPDF: any = [];

  constructor(
    private consultaStatusService: ConsultaStatusService,
    public dialog: MatDialog,
    protected DialogService: DialogService
  ) {}

  ngOnInit() {




    this.consultaStatusService.RecarregarStatusTabela$.subscribe((dados) => {
      if (dados) {
        this.RecaregarTabela();
        this.LimparTabela();
      }
    });

    this.consultaStatusService.GeraPDFRegistroTabela$.subscribe((dados) => {
      if (dados === true && this.DadoSelecionadoParaGerarPDF.length > 0) {
        this.GerarPDF(this.DadoSelecionadoParaGerarPDF);
      }
    });

    this.consultaStatusService.dadosStatusFiltrados$.subscribe((dados) => {
      if (!dados) {
        this.BuscarTodosRegistrosDeConsulta();
      } else {
        this.filtrandoDadosDoBancoPassadoParametros(dados);
      }
    });



  }
 BuscarTodosRegistrosDeConsulta() {
    this.consultaStatusService.BuscarTodosRegistrosDeConsultaStatus().pipe(take(1)).subscribe((response) => {
        console.log( response.content, ' response.content response.content');

        this.DadosDeConsulta = response.content;
        this.dataSource = response.content;
        console.log(this.DadosDeConsulta, 'this.DadosDeConsulta');

      });
  }

  // filtrandoDadosDoBancoPassadoParametros(dados: any) {
  //   const normalizeString = (str: string) => {
  //     return str
  //       .normalize('NFD')
  //       .replace(/[\u0300-\u036f]/g, '')
  //       .toUpperCase();
  //   };
  //   const dadosUpper = normalizeString(dados.toString());

  //   const resultadoFiltrado = this.DadosDeConsulta.filter(
  //     (item) =>
  //       normalizeString(item.ConSttCodigoConsulata.toString()).includes(
  //         dadosUpper
  //       ) ||
  //       normalizeString(item.ConSttMedico.medNome).includes(dadosUpper) ||
  //       normalizeString(item.ConSttPaciente.paciNome).includes(dadosUpper) ||
  //       normalizeString(item.ConSttDia_semana).includes(dadosUpper) ||
  //       normalizeString(item.ConSttData).includes(dadosUpper) ||
  //       normalizeString(item.ConSttHorario).includes(dadosUpper) ||
  //       normalizeString(item.ConSttObservacao).includes(dadosUpper)
  //   );

  //   if (resultadoFiltrado.length > 0) {

  //     this.dataSource = resultadoFiltrado;

  //   } else {
  //     this.DialogService.NaoFoiEncontradoConsultasComEssesParametros();
  //     this.BuscarTodosRegistrosDeConsulta();
  //     this.consultaStatusService.FiltraDadosTabelaStatusSubject('');
  //   }
  // }

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


    const dadosUpper = safeNormalize(dados);
    console.log('DadosDeConsulta', this.DadosDeConsulta);

    // Filtrar os dados da consulta, comparando as strings normalizadas e tratando a data e o horário de forma específica
    let resultadoFiltrado = this.DadosDeConsulta.filter(
      (item) =>
        safeNormalize(item.ConCodigoConsulta).includes(dadosUpper) ||
        safeNormalize(item.ConMedico?.medNome).includes(dadosUpper) || // Verifica se ConMedico existe antes de acessar medNome
        safeNormalize(item.ConPaciente?.paciNome).includes(dadosUpper) || // Verifica se ConPaciente existe antes de acessar paciNome
        safeNormalize(item.ConDia_semana).includes(dadosUpper) ||
        isDateMatch(item.ConData, dados) || // Compara as datas sem normalizar
        isTimeMatch(item.ConHorario, dados) || // Compara os horários diretamente
        safeNormalize(item.ConObservacoes).includes(dadosUpper)
    );

    console.log('resultadoFiltrado', resultadoFiltrado);

    if (resultadoFiltrado.length > 0) {
      this.LimparTabela();
      this.dataSource = resultadoFiltrado;
    } else {
      this.DialogService.NaoFoiEncontradoConsultasComEssesParametros();
      this.BuscarTodosRegistrosDeConsulta();
      this.consultaStatusService.FiltraDadosTabelaStatusSubject('');
    }
  }






















































  openObservacoesDialog(observacoes: string): void {
    this.dialog.open(ObservacoesComponent, {
      width: '550px',
      data: { observacoes: observacoes },
    });
  }

  GerarPDF(DadoSelecionadoParaGerarPDF: any) {
    this.dialog.open(Template_PDF_ConcluidosComponent, {
      width: '800px',
      height: '550px',
      data: { DadoSelecionadoParaGerarPDF: DadoSelecionadoParaGerarPDF },
    });
  }

  LimparTabela() {
    this.DadoSelecionadoParaConclusao = [];
    this.DadoSelecionadoParaGerarPDF = [];
    this.DadoSelecionaParaExclusao = [];
    this.DadoSelecionadoParaEdicao = [];
    this.DadosDeConsulta = [];
    this.dataSource = [];
  }

  DadoSelecionadoParaAcao(dados: any, event: any) {
    if (event.checked) {
      this.DadoSelecionaParaExclusao.push(dados);
      this.DadoSelecionadoParaConclusao.push(dados);
      this.DadoSelecionadoParaEdicao.push(dados);
      this.DadoSelecionadoParaGerarPDF.push(dados);
    } else {
      this.DadoSelecionadoParaConclusao = this.DadoSelecionadoParaConclusao.filter(
        (item: any) => item.ConCodigoConsulta !== dados.ConCodigoConsulta
      );
      this.DadoSelecionadoParaGerarPDF = this.DadoSelecionadoParaGerarPDF.filter(
        (item: any) => item.ConCodigoConsulta !== dados.ConCodigoConsulta
      );
      this.DadoSelecionaParaExclusao = this.DadoSelecionaParaExclusao.filter(
        (item: any) => item.ConCodigoConsulta !== dados.ConCodigoConsulta
      );
      this.DadoSelecionadoParaEdicao = this.DadoSelecionadoParaEdicao.filter(
        (item: any) => item.ConCodigoConsulta !== dados.ConCodigoConsulta
      );
    }
  }

  RecaregarTabela() {
    this.LimparTabela();
    this.BuscarTodosRegistrosDeConsulta();
  //  this.consultaStatusService.ExcluirDadosDaTabelaStatusSubject(false);
  }


}
