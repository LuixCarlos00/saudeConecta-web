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
        this.filtrandoDadosDoBancoPassadoParametros_Pesquisa(this.ValorOpcao.date);
      }
      if (this.ValorOpcao.tipo == 2) {
        this.LimparTabela();
        this.BuscarTodosRegistrosDeConsultaCONCLUIDADS();
      }
      if (this.ValorOpcao.tipo == 2) {
        this.LimparTabela();
        this.BuscarTodosRegistrosDeConsultaCONCLUIDADS();
      }
      if (this.ValorOpcao.tipo == 3) {
        this.LimparTabela();
        this.RecaregarTabela();
      }
      if (this.ValorOpcao.tipo == 4) {
        this.LimparTabela();
        this.DeletarDadoDaTabela(this.ValorOpcao.date)
      }
      if (this.ValorOpcao.tipo == 5) {
        this.LimparTabela();
        this.BuscarTodosRegistrosDeConsultaCONCLUIDADS();
      }
    }
  }

  ngOnInit() {
    console.log('ValorOpcao', this.ValorOpcao);

    //buscar todos os registros
    this.consultaService.CadastroRealizadoComSucesso$.subscribe((dados) => {
      if (dados) this.BuscarTodosRegistrosDeConsulta();
    });

    //deletar Itens
    this.consultaService.DeletarDadosDaTabela$.subscribe((dados) => {
      if (dados === true && this.DadoSelecionaParaExclusao.length > 0)
        this.DeletarDadoDaTabela(this.DadoSelecionaParaExclusao );
    });

    // Recarregar Tabela
    // this.consultaService.RecarregarTabela$.subscribe((dados) => {
    //   if (dados) this.RecaregarTabela();
    // });

    //Edita dado selecionado
    this.consultaService.EditarDadosDaTabela$.subscribe((dados) => {
      if (dados === true && this.DadoSelecionadoParaEdicao.length === 1) {
        this.EditarDadoDaTabela(this.DadoSelecionadoParaEdicao);
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

    // concluir dados
    this.consultaService.ConcluidoRegistroTabela$.subscribe((dados) => {
      if (dados === true && this.DadoSelecionadoParaConclusao.length > 0) {
        this.ConcluirDadosDaTabela();
      }
    });

    //Filtra e pesquisar Tabela
    this.consultaService.dadosFiltrados$.subscribe((dados) => {
      if (!dados.toString()) {
        this.consultaService
          .BuscarTodosRegistrosDeConsulta()
          .subscribe((response) => {
            this.dataSource = response.content;
          });
      } else if (dados.toString()) {
        // pesquisa por dado filtrado
        console.log('tentou 1');

        //this.filtrandoDadosDoBancoPassadoParametros_Pesquisa(dados);
      }
    });

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
    this.consultaService
      .BuscarTodosRegistrosDeConsulta()
      .pipe(take(1))
      .subscribe((response) => {
        console.log(response, 'consulta');

        this.DadosDeConsulta = [];
        this.DadosDeConsulta.push(...response.content);
        this.dataSource = response.content;
      });
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
      this.consultaService
        .BuscarTodosRegistrosDeConsulta()
        .pipe(take(1))
        .subscribe((response) => {
          this.DadosDeConsulta.push(...response.content);
          this.dataSource = response.content;
        });
    }
  }

  filtrandoDadosDoBancoPassadoParametros_Pesquisa(dados: any) {
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

      return (
        parsedDate1.toISOString().split('T')[0] ===
        parsedDate2.toISOString().split('T')[0]
      );
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
    console.log('DadosDeConsulta', this.DadosDeConsulta);

    // Filtrar os dados da consulta, comparando as strings normalizadas e tratando a data e o horário de forma específica
    let resultadoFiltrado = this.DadosDeConsulta.filter(
      (item) =>
        safeNormalize(item.ConCodigoConsulta).includes(dadosUpper) ||
        safeNormalize(item.ConMedico?.medNome).includes(dadosUpper) || // Verifica se ConMedico existe antes de acessar medNome
        safeNormalize(item.ConPaciente?.paciNome).includes(dadosUpper) || // Verifica se ConPaciente existe antes de acessar paciNome
        safeNormalize(item.ConDia_semana).includes(dadosUpper) ||
        isDateMatch(item.ConData, dados.trim()) || // Compara as datas sem normalizar
        isTimeMatch(item.ConHorario, dados.trim()) || // Compara os horários diretamente
        safeNormalize(item.ConObservacoes).includes(dadosUpper)
    );

    console.log('resultadoFiltrado', resultadoFiltrado);

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
    this.consultaService
      .BuscarTodosRegistrosDeConsulta()
      .subscribe((response) => {
        this.DadosDeConsulta.push(...response.content);
        this.dataSource = response.content;
      });
    this.consultaService.ExcluirDadosDaTabelaSubject(false);
  }

  DeletarDadoDaTabela(DadoSelecionaParaExclusao: any ) {
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
    console.log(DadoSelecionadoParaGerarPDF, 'DadoSelecionadoParaGerarPDF');
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

  BuscarTodosRegistrosDeConsultaCONCLUIDADS() {
    this.consultaStatusService
      .BuscarTodosRegistrosDeConsultaStatus()
      .pipe(take(1))
      .subscribe((response) => {
        this.DadosDeConsulta = response.content;
        this.dataSource = response.content;
      });
  }
}
