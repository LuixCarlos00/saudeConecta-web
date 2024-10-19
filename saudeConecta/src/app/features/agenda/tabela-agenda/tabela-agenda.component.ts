import { Consulta } from './../../../util/variados/interfaces/consulta/consulta';
import { map, take } from 'rxjs';
import { Paciente } from './../../../util/variados/interfaces/paciente/paciente';
import { Medico } from './../../../util/variados/interfaces/medico/medico';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ObservacoesComponent } from './Observacoes/Observacoes.component';
import { ConsultaService } from 'src/app/service/consulta/consulta.service';
import { da, el } from 'date-fns/locale';
import { DialogService } from 'src/app/util/variados/dialogo-confirmação/dialog.service';
import Swal from 'sweetalert2';
import { lastDayOfDecade } from 'date-fns';
import { EditarConsultasComponent } from './Editar-Consultas/Editar-Consultas.component';
import { Template_PDFComponent } from '../template_PDF/template_PDF.component';
import { AvisosLembretesComponent } from './Avisos-Lembretes/Avisos-Lembretes.component';
import { ConsultaStatusService } from 'src/app/service/service-consulta-status/consulta-status.service';
import { Template_PDF_ConcluidosComponent } from '../template_PDF_Concluidos/template_PDF_Concluidos.component';

@Component({
  selector: 'app-tabela-agenda',
  templateUrl: './tabela-agenda.component.html',
  styleUrls: ['./tabela-agenda.component.css'],
})
export class TabelaAgendaComponent implements OnInit, OnChanges {
  //
  //
  //

  @Input() ValorOpcao: any;
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
    medNome: '',
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
    PaciStatus: 0,
  };

  displayedColumns = [
    'ConCodigoConsulta',
    'NomeMedico',
    'NomePaciente',
    'ConDia_semana',
    'ConData',
    'ConHorario',
    'ConObservacoes',
    'Observar',
    'Seleciona',
  ];

  DadoSelecionaParaExclusao: any = [];
  DadoSelecionadoParaEdicao: any = [];
  DadoSelecionadoParaConclusao: any = [];
  DadoSelecionadoParaGerarPDF: any = [];

  ParametroDeFiltragem: any;
  dataSource: any[] = [];
  DadosDeConsulta: any[] = [];
  clickedRows = new Set<any>();
  constructor(
    private consultaService: ConsultaService,
    public dialog: MatDialog,
    protected DialogService: DialogService,
    private consultaStatusService: ConsultaStatusService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ValorOpcao'].currentValue) {
      if (this.ValorOpcao.tipo == 1) {
        //pesquisa
     //   this.filtrandoDadosDoBancoPassadoParametros_Pesquisa(
          this.ValorOpcao.date
       // );
      }
      if (this.ValorOpcao.tipo == 2) {
        // pesquisa concluida
        this.LimparTabela();
        this.BuscarTodosRegistrosDeConsultaCONCLUIDADS();
      }
      if (this.ValorOpcao.tipo == 3) {
        //Recarregar
        this.LimparTabela();
        this.RecaregarTabela();
      }
      if (this.ValorOpcao.tipo == 4) {
        //Deletar
        this.LimparTabela();

        this.DeletarDadoDaTabela(this.ValorOpcao.date);
      }
      if (this.ValorOpcao.tipo == 5) {
        //Editar
        this.LimparTabela();
        if (this.DadoSelecionadoParaEdicao.length === 1) {
          this.EditarDadoDaTabela(this.DadoSelecionadoParaEdicao);
        } else if (this.DadoSelecionadoParaEdicao.length > 1) {
          Swal.fire({
            icon: 'error',
            title: 'Selecione apenas um item para editar!...',
          });
          this.RecaregarTabela();
        }
      }
      if (this.ValorOpcao.tipo == 6) {
        if (this.DadoSelecionadoParaConclusao.length > 0) {
          this.ConcluirDadosDaTabela();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Selecione pelo menos um item para concluir!...',
          });
          this.RecaregarTabela();
        }
      }
      if (this.ValorOpcao.tipo == 7) {
        console.log('Gerar PDF 7 ',this.ValorOpcao.tipo ,this.DadoSelecionadoParaGerarPDF);

        //Gerar PDF
        if (this.DadoSelecionadoParaGerarPDF.length > 0) {
          this.GerarPDF(this.DadoSelecionadoParaGerarPDF);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Selecione pelo menos um item para gerar PDF!...',
          });
          this.RecaregarTabela();
        }
      }

      if (this.ValorOpcao.tipo == 8) {
        console.log('Gerar PDF 8',this.ValorOpcao.tipo , this.DadoSelecionadoParaGerarPDF);

        if (this.DadoSelecionadoParaGerarPDF.length > 0) {
          this.GerarPDFConcluidos(this.DadoSelecionadoParaGerarPDF);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Selecione pelo menos um item para gerar PDF!...',
          });
          this.RecaregarTabela();
        }

      }

      if (this.ValorOpcao.tipo == 9) {
      }
    }
  }

  ngOnInit() {
    console.log('ValorOpcao', this.ValorOpcao);
    this.BuscarTodosRegistrosDeConsulta();

    //buscar todos os registros
    // this.consultaService.CadastroRealizadoComSucesso$.subscribe((dados) => {
    //   if (dados) this.BuscarTodosRegistrosDeConsulta();
    // });

    //deletar Itens
    // this.consultaService.DeletarDadosDaTabela$.subscribe((dados) => {
    //   if (dados === true && this.DadoSelecionaParaExclusao.length > 0)
    //     this.DeletarDadoDaTabela(this.DadoSelecionaParaExclusao );
    // });

    // Recarregar Tabela
    // this.consultaService.RecarregarTabela$.subscribe((dados) => {
    //   if (dados) this.RecaregarTabela();
    // });

    // //Edita dado selecionado
    // this.consultaService.EditarDadosDaTabela$.subscribe((dados) => {
    //   if (dados === true && this.DadoSelecionadoParaEdicao.length === 1) {
    //     this.EditarDadoDaTabela(this.DadoSelecionadoParaEdicao);
    //   } else if (dados === true && this.DadoSelecionadoParaEdicao.length > 1) {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Selecione apenas um item para editar!...',
    //       confirmButtonText: 'Ok',
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //         this.consultaService.EditarDadosDaTabelaSubject(false);
    //         window.location.reload();
    //       }
    //     });
    //   }
    // });

    // concluir dados
    // this.consultaService.ConcluidoRegistroTabela$.subscribe((dados) => {
    //   if (dados === true && this.DadoSelecionadoParaConclusao.length > 0) {
    //     this.ConcluirDadosDaTabela();
    //   }
    // });

    //Filtra e pesquisar Tabela
    // this.consultaService.dadosFiltrados$.subscribe((dados) => {
    //   if (!dados.toString()) {
    //     this.consultaService
    //       .BuscarTodosRegistrosDeConsulta()
    //       .subscribe((response) => {
    //         this.dataSource = response.content;
    //       });
    //   } else if (dados.toString()) {
    //     // pesquisa por dado filtrado
    //     console.log('tentou 1');

    //     //this.filtrandoDadosDoBancoPassadoParametros_Pesquisa(dados);
    //   }
    // });

    //Gerar PDF
    this.consultaService.GeraPDFRegistroTabela$.subscribe((dados) => {
      if (dados === true && this.DadoSelecionadoParaGerarPDF.length > 0) {
        this.GerarPDF(this.DadoSelecionadoParaGerarPDF);
      }
    });

    //cronologia
    this.consultaService.BuscarDadoParaCronologia$.subscribe((dados) => {
      if (dados) {
        this.filtrandoDadosDoBancoPassadoParametros_Cronologia(dados);
      }
    });
  }

  ConcluirDadosDaTabela() {
    Swal.fire({
      title: 'Tem certeza que deseja concluir esses registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5ccf6c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Concluir!',
    }).then((result) => {
      if (result.isConfirmed) {
        for (let i = 0; i < this.DadoSelecionadoParaConclusao.length; i++) {
          this.consultaService
            .ConcluirDadosDaTabela(
              this.DadoSelecionadoParaConclusao[i].ConCodigoConsulta
            )
            .pipe(take(1))
            .subscribe(
              (dados) => {
                console.log(dados);
              },
              (error) => {
                console.error('Erro ao concluir dados:', error);
              }
            );
        }
        for (let i = 0; i < this.DadoSelecionadoParaConclusao.length; i++) {
          this.consultaService
            .DeletarConsulas(
              this.DadoSelecionadoParaConclusao[i].ConCodigoConsulta
            )
            .pipe(take(1))
            .subscribe(
              (dados) => {
                this.RecaregarTabela();
              },
              (error) => {
                console.error('Erro ao concluir dados:', error);
              }
            );
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.consultaService.ConcluidoTabelaSubject(false);
        window.location.reload();
      }
    });
  }

  BuscarTodosRegistrosDeConsulta() {
    // this.consultaService
    //   .BuscarTodosRegistrosDeConsulta()
    //   .pipe(take(1))
    //   .subscribe((response) => {
    //     console.log(response.content, 'consulta');

    //     this.DadosDeConsulta = [];
    //     this.DadosDeConsulta.push(...response.content);
    //     this.dataSource = response.content;
    //   });
  }

  filtrandoDadosDoBancoPassadoParametros_Cronologia(dados: any) {
    this.LimparTabela();

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

    if (novaConsulta.length > 0) {
      this.dataSource = [];
      this.LimparTabela();

      this.dataSource = novaConsulta;
    } else {
      this.DialogService.NaoFoiEncontradoConsultasComEssesParametros();
      this.LimparTabela();
      // this.consultaService
      //   .BuscarTodosRegistrosDeConsulta()
      //   .pipe(take(1))
      //   .subscribe((response) => {
      //     this.DadosDeConsulta.push(...response.content);
      //     this.dataSource = response.content;
      //   });
    }
  }





  openObservacoesDialog(observacoes: string): void {
    this.dialog.open(ObservacoesComponent, {
      width: '550px',
      data: { observacoes: observacoes },
    });
  }

  openAvisosDialog(Consulta: any) {
    const medico = Consulta.ConMedico;
    const paciente = Consulta.ConPaciente;
    this.dialog.open(AvisosLembretesComponent, {
      width: '550px',
      data: { Consulta: Consulta, Medico: medico, Paciente: paciente },
    });
  }

  LimparTabela() {
    this.dataSource = [];
    this.DadosDeConsulta = [];
  }

  DadoSelecionadoParaAcao(dados: any, event: any) {
    console.log('DadoSelecionadoParaAcao', dados);

    if (event.checked) {
      this.DadoSelecionaParaExclusao.push(dados);
      this.DadoSelecionadoParaConclusao.push(dados);

      if (this.DadoSelecionadoParaEdicao.length >= 1) {
        this.DadoSelecionadoParaEdicao.push(dados);
      } else {
        this.DadoSelecionadoParaEdicao.push(dados);
      }

      if (this.DadoSelecionadoParaGerarPDF.length >= 1) {
        this.DadoSelecionadoParaGerarPDF.push(dados);
      } else {
        this.DadoSelecionadoParaGerarPDF.push(dados);
      }
    } else {
      this.DadoSelecionadoParaConclusao =
        this.DadoSelecionadoParaConclusao.filter(
          (item: any) => item.ConCodigoConsulta !== dados.ConCodigoConsulta
        );

      this.DadoSelecionaParaExclusao = this.DadoSelecionaParaExclusao.filter(
        (item: any) => item.ConCodigoConsulta !== dados.ConCodigoConsulta
      );

      this.DadoSelecionadoParaGerarPDF =
        this.DadoSelecionadoParaGerarPDF.filter(
          (item: any) => item.ConCodigoConsulta !== dados.ConCodigoConsulta
        );

      this.DadoSelecionadoParaEdicao = this.DadoSelecionadoParaEdicao.filter(
        (item: any) => item.ConCodigoConsulta !== dados.ConCodigoConsulta
      );
    }
  }

  RecaregarTabela() {
    this.LimparTabela();
    // this.consultaService
    //   .BuscarTodosRegistrosDeConsulta()
    //   .subscribe((response) => {
    //     this.DadosDeConsulta.push(...response.content);
    //     this.dataSource = response.content;
    //   });
    this.consultaService.ExcluirDadosDaTabelaSubject(false);
  }

  DeletarDadoDaTabela(DadoSelecionaParaExclusao: any) {
    console.log('DadoSelecionaParaExclusao', DadoSelecionaParaExclusao);

    Swal.fire({
      title: 'Tem certeza que deseja excluir esses registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5ccf6c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
    }).then((result) => {
      if (result.isConfirmed) {
        for (let i = 0; i < this.DadoSelecionaParaExclusao.length; i++) {
          this.consultaService
            .DeletarConsulas(
              this.DadoSelecionaParaExclusao[i].ConCodigoConsulta
            )
            .pipe(take(1))
            .subscribe(
              (dados) => {
                this.DadoSelecionaParaExclusao = [];
                this.RecaregarTabela();
              },
              (error) => {
                this.DadoSelecionaParaExclusao = [];
                this.RecaregarTabela();
              }
            );
        }
      } else {
        // this.consultaService.ExcluirDadosDaTabelaSubject(false);
        this.DadoSelecionaParaExclusao = [];
      }
    });
    this.LimparTabela();
    this.RecaregarTabela();
  }

  GerarPDF(DadoSelecionadoParaGerarPDF: any) {
    console.log(DadoSelecionadoParaGerarPDF, 'DadoSelecionadoParaGerarPDF');
    this.dialog.open(Template_PDFComponent, {
      width: '800px',
      height: '550px',
      data: { DadoSelecionadoParaGerarPDF: DadoSelecionadoParaGerarPDF },
    });
  }

  GerarPDFConcluidos(DadoSelecionadoParaGerarPDF: any) {
    this.dialog.open(Template_PDF_ConcluidosComponent, {
      width: '800px',
      height: '550px',
      data: { DadoSelecionadoParaGerarPDF: DadoSelecionadoParaGerarPDF },
    });
  }


  EditarDadoDaTabela(DadoSelecionadoParaEdicao: any) {
    this.dialog.open(EditarConsultasComponent, {
      width: '800px',
      height: '550px',
      data: { DadoSelecionadoParaEdicao: DadoSelecionadoParaEdicao },
    });
  }

  BuscarTodosRegistrosDeConsultaCONCLUIDADS() {
    this.consultaStatusService.BuscarTodosRegistrosDeConsultaStatus().pipe(take(1)).subscribe((response) => {
      this.LimparTabela();

        // this.DadosDeConsulta = response.content;
        // console.log('this.DadosDeConsulta', this.DadosDeConsulta);

        // this.dataSource = response.content;
        // console.log('this.dataSource', this.dataSource);

      });
  }
}
