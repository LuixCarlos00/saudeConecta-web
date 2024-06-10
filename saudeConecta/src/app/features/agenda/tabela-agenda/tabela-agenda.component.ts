import { map, take } from 'rxjs';
import { Paciente } from './../../../util/variados/interfaces/paciente/paciente';
import { Medico } from './../../../util/variados/interfaces/medico/medico';
import { Component, Input, OnInit } from '@angular/core';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { MatDialog } from '@angular/material/dialog';
import { ObservacoesComponent } from './Observacoes/Observacoes.component';
import { ConsultaService } from 'src/app/service/service-consulta/consulta.service';
import { el } from 'date-fns/locale';
import { DialogService } from 'src/app/util/variados/dialogo-confirmação/dialog.service';
import Swal from 'sweetalert2';
import { lastDayOfDecade } from 'date-fns';
import { EditarConsultasComponent } from './Editar-Consultas/Editar-Consultas.component';
import { Template_PDFComponent } from '../template_PDF/template_PDF.component';

@Component({
  selector: 'app-tabela-agenda',
  templateUrl: './tabela-agenda.component.html',
  styleUrls: ['./tabela-agenda.component.css'],
})
export class TabelaAgendaComponent implements OnInit {
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
    usuario: 0,
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
  DadoSelecionadoParaGerarPDF: any = [];

  ParametroDeFiltragem: any;
  dataSource: Consulta[] = [];
  DadosDeConsulta: any[] = [];
  BuscarUmaVez: boolean = false;

  constructor(
    private consultaService: ConsultaService,
    public dialog: MatDialog,
    protected DialogService: DialogService
  ) {}

  ngOnInit() {
    if (!this.BuscarUmaVez) {
      this.BuscarTodosRegistrosDeConsulta();
    }




    this.consultaService.DeletarDadosDaTabela$.subscribe((dados) => {
      //deletar Itens
      if (dados === true && this.DadoSelecionaParaExclusao.length > 0) {
        this.DeletarDadoDaTabela(this.DadoSelecionaParaExclusao, dados);
      }
    });




    this.consultaService.RecarregarTabela$.subscribe((dados) => {
      // Recarregar Tabela
      if (dados) {
        this.RecaregarTabela();
      }
    });




    this.consultaService.EditarDadosDaTabela$.subscribe((dados) => {
      if (dados === true && this.DadoSelecionadoParaEdicao.length === 1) {
        this.EditarDadoDaTabela(this.DadoSelecionadoParaEdicao); //Edita dado selecionado
      } else if (dados === true && this.DadoSelecionadoParaEdicao.length > 1) {
        Swal.fire({
          icon: 'error',
          title: 'Selecione apenas um item para editar!...',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
        this.consultaService.EditarDadosDaTabelaSubject(false);
        window.location.reload();
          }
        });
      }
    });




    this.consultaService.ConcluidoRegistroTabela$.subscribe((dados) => {
      if (dados === true && this.DadoSelecionadoParaConclusao.length > 0) {
        this.ConcluirDadosDaTabela();// concluir dados
      }
    });




    this.consultaService.dadosFiltrados$.subscribe((dados) => {
      if (!dados.toString()) {
        //Filtra e pesquisar Tabela
        this.consultaService
          .BuscarTodosRegistrosDeConsulta()
          .subscribe((response) => {
            this.dataSource = response.content;
          });
      } else if (dados.toString()) {
        // pesquisa por dado filtrado
        this.filtrandoDadosDoBancoPassadoParametros(dados);
      }
    });


    this.consultaService.GeraPDFRegistroTabela$.subscribe((dados) => {
      if (dados === true && this.DadoSelecionadoParaGerarPDF.length > 0) {
        this.GerarPDF(this.DadoSelecionadoParaGerarPDF);
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
      }
      else  if (result.dismiss === Swal.DismissReason.cancel) {
        this.consultaService.ConcluidoTabelaSubject(false);
        window.location.reload();
        }

    });
  }

  BuscarTodosRegistrosDeConsulta() {
    this.consultaService
      .BuscarTodosRegistrosDeConsulta()
      .pipe(take(1))
      .subscribe((response) => {
        this.DadosDeConsulta = [];
        this.DadosDeConsulta.push(...response.content);
        this.dataSource = response.content;
      });
  }

  filtrandoDadosDoBancoPassadoParametros(dados: any) {
    // Função para normalizar e remover acentos e caracteres especiais
    const normalizeString = (str: string) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
        .toUpperCase(); // Converte para maiúsculas
    };
    const dadosUpper = normalizeString(dados.toString());

    // Filtrar os dados da consulta, comparando as strings normalizadas
    let resultadoFiltrado = this.DadosDeConsulta.filter(
      (item) =>
        normalizeString(item.ConCodigoConsulta.toString()).includes(
          dadosUpper
        ) ||
        normalizeString(item.ConMedico.medNome).includes(dadosUpper) ||
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
      this.consultaService
        .BuscarTodosRegistrosDeConsulta()
        .pipe(take(1))
        .subscribe((response) => {
          this.DadosDeConsulta.push(...response.content);
          this.dataSource = response.content;
        });
    }
  }

  openObservacoesDialog(observacoes: string): void {
    this.dialog.open(ObservacoesComponent, {
      width: '550px',
      data: { observacoes: observacoes },
    });
  }

  LimparTabela() {
    this.dataSource = [];
    this.DadosDeConsulta = [];
  }

  DadoSelecionadoParaAcao(dados: any, event: any) {
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
      this.DadoSelecionadoParaConclusao = this.DadoSelecionadoParaConclusao.filter(
          (item: any) => item.ConCodigoConsulta !== dados.ConCodigoConsulta
        );

      this.DadoSelecionaParaExclusao = this.DadoSelecionaParaExclusao.filter(
        (item: any) => item.ConCodigoConsulta !== dados.ConCodigoConsulta
      );

      this.DadoSelecionadoParaGerarPDF = this.DadoSelecionadoParaGerarPDF.filter(
        (item: any) => item.ConCodigoConsulta !== dados.ConCodigoConsulta
      );

      this.DadoSelecionadoParaEdicao = this.DadoSelecionadoParaEdicao.filter(
        (item: any) => item.ConCodigoConsulta !== dados.ConCodigoConsulta
      );

    }
  }

  RecaregarTabela() {
    this.LimparTabela();
    this.consultaService
      .BuscarTodosRegistrosDeConsulta()
      .subscribe((response) => {
        this.DadosDeConsulta.push(...response.content);
        this.dataSource = response.content;
      });
    this.consultaService.ExcluirDadosDaTabelaSubject(false);
  }

  DeletarDadoDaTabela(DadoSelecionaParaExclusao: any, dados: Boolean) {
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
            .subscribe(() => {
              // Limpe a seleção e atualize a tabela após a exclusão bem-sucedida
              if (i === this.DadoSelecionaParaExclusao.length - 1) {
                this.DadoSelecionaParaExclusao = [];
                this.LimparTabela();
                this.consultaService
                  .BuscarTodosRegistrosDeConsulta()
                  .subscribe((response) => {
                    this.DadosDeConsulta = response.content;
                    this.dataSource = response.content;
                  });
              }
            });
        }
      } else {
        this.consultaService.ExcluirDadosDaTabelaSubject(false);
        window.location.reload();
      }
    });
  }



  GerarPDF(DadoSelecionadoParaGerarPDF: any) {
    this.dialog.open(Template_PDFComponent, {
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
}
