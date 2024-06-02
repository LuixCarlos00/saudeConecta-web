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
        this.EditarDadoDaTabela(this.DadoSelecionadoParaEdicao);
      } else if (dados === true && this.DadoSelecionadoParaEdicao.length > 1) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Selecione apenas um item para editar!',
        });
      }
    });


    this.consultaService.dadosFiltrados$.subscribe((dados) => {
      if (!dados.toString()) {
        //Filtra e pesquisar Tabela
        this.consultaService
          .BuscarTodosRegistrosDeConsulta()
          .subscribe((response) => {
            this.DadosDeConsulta.push(...response.content);
            this.dataSource = response.content;
          });
      } else if (dados.toString()) {
        // pesquisa por dado filtrado
        this.filtrandoDadosDoBancoPassadoParametros(dados);
      }
    });
  }


  BuscarTodosRegistrosDeConsulta() {
    this.consultaService
      .BuscarTodosRegistrosDeConsulta()
      .pipe(take(1))
      .subscribe((response) => {
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



  DadoSelecionadoParaDeletar(dados: any, event: any) {
    if (event.checked) {
      this.DadoSelecionaParaExclusao.push(dados);
      console.log(this.DadoSelecionadoParaEdicao);

      if (this.DadoSelecionadoParaEdicao.length >= 1) {
        this.DadoSelecionadoParaEdicao.push(dados);
      } else {
        this.DadoSelecionadoParaEdicao.push(dados);
      }
    } else {
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
      title: 'Tem certeza que deseja excluir esses dados?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
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
      }else{
        this.consultaService.ExcluirDadosDaTabelaSubject(false);
      }
    });
  }



  EditarDadoDaTabela(DadoSelecionadoParaEdicao: any) {

    this.dialog.open(EditarConsultasComponent, {
      width: '800px',
      height: '550px',
      data: {
        DadoSelecionadoParaEdicao: DadoSelecionadoParaEdicao,
      },
    });
  }




}
