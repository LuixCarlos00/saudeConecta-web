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
  BuscarUmaVez: boolean = false;
  DadoSelecionadoParaGerarPDF: any = [];

  constructor(
    private consultaStatusService: ConsultaStatusService,
    public dialog: MatDialog,
    protected DialogService: DialogService
  ) {}

  ngOnInit() {
    // this.consultaStatusService.DeletarDadosDaTabelaStatus$.subscribe((dados) => {
    //   //deletar Itens
    //   if (dados === true && this.DadoSelecionaParaExclusao.length > 0) {
    //     this.DeletarDadoDaTabela(this.DadoSelecionaParaExclusao, dados);
    //   }
    // });
    // this.consultaStatusService.EditarDadosDaTabelaStatus$.subscribe((dados) => {
    //   if (dados === true && this.DadoSelecionadoParaEdicao.length === 1) {
    //     this.EditarDadoDaTabela(this.DadoSelecionadoParaEdicao); //Edita dado selecionado
    //   } else if (dados === true && this.DadoSelecionadoParaEdicao.length > 1) {
    //      Swal.fire({
    //     icon: 'error',
    //     title: 'Selecione apenas um item para editar!...',
    //     confirmButtonText: 'Ok',
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //   this.consultaService.EditarDadosDaTabelaSubject(false);
    //   window.location.reload();
    //     }
    //   });
    // }
    // });
    // this.consultaStatusService.ConcluidoRegistroTabelaStatus$.subscribe((dados) => {
    //   if (dados === true && this.DadoSelecionadoParaConclusao.length > 0) {
    //     this.ConcluirDadosDaTabela();
    //   }
    // });

    if (!this.BuscarUmaVez) {
      this.BuscarTodosRegistrosDeConsulta();
      this.BuscarUmaVez = true;
    }

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
    this.consultaStatusService
      .BuscarTodosRegistrosDeConsultaStatus()
      .pipe(take(1))
      .subscribe((response) => {
        this.DadosDeConsulta = response.content;
        this.dataSource = response.content;
      });
  }

  filtrandoDadosDoBancoPassadoParametros(dados: any) {
    const normalizeString = (str: string) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase();
    };
    const dadosUpper = normalizeString(dados.toString());

    const resultadoFiltrado = this.DadosDeConsulta.filter(
      (item) =>
        normalizeString(item.ConSttCodigoConsulata.toString()).includes(
          dadosUpper
        ) ||
        normalizeString(item.ConSttMedico.medNome).includes(dadosUpper) ||
        normalizeString(item.ConSttPaciente.paciNome).includes(dadosUpper) ||
        normalizeString(item.ConSttDia_semana).includes(dadosUpper) ||
        normalizeString(item.ConSttData).includes(dadosUpper) ||
        normalizeString(item.ConSttHorario).includes(dadosUpper) ||
        normalizeString(item.ConSttObservacao).includes(dadosUpper)
    );

    if (resultadoFiltrado.length > 0) {

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
    this.consultaStatusService.ExcluirDadosDaTabelaStatusSubject(false);
  }

  //   ConcluirDadosDaTabela() {
    // Swal.fire({
    //   title: 'Tem certeza que deseja concluir esses registro?',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#5ccf6c',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Sim, Concluir!',
    // }).then((result) => {
    //   if (result.isConfirmed) {
  //     for (let i = 0; i < this.DadoSelecionadoParaConclusao.length; i++) {
  //         this.consultaStatusService.ConcluirDadosDaTabelaStatus(this.DadoSelecionadoParaConclusao[i].ConCodigoConsulta).pipe(take(1))
  //         .subscribe(
  //             (dados) => { console.log(dados); },
  //             (error) => { console.error('Erro ao concluir dados:', error); }
  //         );
  //     }
  //     for (let i = 0; i < this.DadoSelecionadoParaConclusao.length; i++) {
  //         this.consultaStatusService.DeletarConsulasStatus(this.DadoSelecionadoParaConclusao[i].ConCodigoConsulta).pipe(take(1))
  //         .subscribe(
  //             (dados) => { this.RecaregarTabela(); },
  //             (error) => { console.error('Erro ao concluir dados:', error); }
  //         );
  //     } }
  //     else  if (result.dismiss === Swal.DismissReason.cancel) {
  //       this.consultaService.ConcluidoTabelaSubject(false);
  //       window.location.reload();
  //       }

  //   });
  // }

  // DeletarDadoDaTabela(DadoSelecionaParaExclusao: any, dados: Boolean) {
  //   Swal.fire({
  //     title: 'Tem certeza que deseja excluir esses dados?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Sim, excluir!',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       for (let i = 0; i < this.DadoSelecionaParaExclusao.length; i++) {
  //         this.consultaStatusService
  //           .DeletarConsulasStatus(
  //             this.DadoSelecionaParaExclusao[i].ConCodigoConsulta
  //           )
  //           .pipe(take(1))
  //           .subscribe(() => {
  //             // Limpe a seleção e atualize a tabela após a exclusão bem-sucedida
  //             if (i === this.DadoSelecionaParaExclusao.length - 1) {
  //               this.DadoSelecionaParaExclusao = [];
  //               this.LimparTabela();
  //               this.consultaStatusService
  //                 .BuscarTodosRegistrosDeConsultaStatus()
  //                 .subscribe((response) => {
  //                   this.DadosDeConsulta = response.content;
  //                   this.dataSource = response.content;
  //                 });
  //             }
  //           });
  //       }
  //     } else {
  //       this.consultaStatusService.ExcluirDadosDaTabelaStatusSubject(false);
  //       window.location.reload();
  //     }
  //   });
  // }

  // EditarDadoDaTabela(DadoSelecionadoParaEdicao: any) {
  //   this.dialog.open(EditarConsultasComponent, {
  //     width: '800px',
  //     height: '550px',
  //     data: {
  //       DadoSelecionadoParaEdicao: DadoSelecionadoParaEdicao,
  //     },
  //   });
  // }
}
