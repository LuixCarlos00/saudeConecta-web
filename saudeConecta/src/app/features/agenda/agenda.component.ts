import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultaService } from 'src/app/service/consulta/consulta.service';
import { ConsultaStatusService } from 'src/app/service/service-consulta-status/consulta-status.service';
import { MatDialog } from '@angular/material/dialog';
import { CadastroMedicoComponent } from '../cadastro/cadastro-medico/cadastro-medico.component';
import { CadastroPacienteComponent } from '../cadastro/cadastro-paciente/cadastro-paciente.component';
import { CadastroSecretariaComponent } from '../cadastro/cadastro-secretaria/cadastro-secretaria.component';
import { CalendarDialogComponent } from 'src/app/util/variados/Cronologia/cronologia.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import Swal from 'sweetalert2';
import { EditarConsultasComponent } from './tabela-agenda/Editar-Consultas/Editar-Consultas.component';
import { Template_PDFComponent } from './template_PDF/template_PDF.component';
import { AvisosLembretesComponent } from './tabela-agenda/Avisos-Lembretes/Avisos-Lembretes.component';
import { ObservacoesComponent } from './tabela-agenda/Observacoes/Observacoes.component';
import { Tabela } from 'src/app/util/variados/interfaces/tabela/tabela';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
})
export class AgendaComponent implements OnInit {
  FormularioAgenda!: FormGroup;
  dataSource: Tabela[] = [];
  displayedColumns: string[] = [
    'consulta',
    'medico',
    'paciente',
    'diaSemana',
    'data',
    'horario',
    'Seleciona',
  ];
  Finalizadas = false;
  clickedRows = new Set<Tabela>();
  ValorOpcao: any;
  observacoesOptions = [
    { value: 'opcao1', viewValue: 'Opção 1' },
    { value: 'opcao2', viewValue: 'Opção 2' },
    // adicione mais opções conforme necessário
  ];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private consultaService: ConsultaService,
    public dialog: MatDialog,
    private consultaStatusService: ConsultaStatusService
  ) {}

  async ngOnInit() {
    this.buscarDados();

    this.FormularioAgenda = this.formBuilder.group({
      busca: [''],
    });
  }

  async buscarDados() {
    try {
      const dados = await this.consultaService.BuscarTodosRegistrosDeConsulta().toPromise();
      if (dados) {
        this.dataSource = this.tratarDadosParaTabela(dados);
        console.log('this.dataSource', this.dataSource);

      }
    } catch (error) {
      console.error(error);
      Swal.fire('Erro', 'Erro ao buscar dados', 'error');
    }
  }

  async PesquisarNaTabelaConcluidos() {
    this.Finalizadas = true;

    try {
      const dados = await this.consultaStatusService
        .BuscarTodosRegistrosDeConsultaStatus()
        .pipe(take(1))
        .toPromise();
      console.log('PesquisarNaTabelaConcluidos', dados);
      if (dados) {
        this.dataSource = this.tratarDadosParaTabela(dados);
      }
      console.log('this.PesquisarNaTabelaConcluidos', this.dataSource);
    } catch (error) {
      console.error(error);
    }
  }

  async Pesquisar() {
    const busca = this.FormularioAgenda.get('busca')?.value;
    this.FormularioAgenda.reset();

    try {
      const dados =
        await this.consultaService.filtrandoDadosDoBancoPassadoParametros_Pesquisa(
          busca,
          this.dataSource
        );
      if (dados) {
        this.dataSource = dados;
      } else {
        this.buscarDados();
        Swal.fire('Erro', 'Pesquisa não  encontrada', 'error');
      }
    } catch (error) {
      console.error(error);
    }
  }

  Recarregar() {
    this.Finalizadas = false;
    this.buscarDados();
  }

  Concluido() {
    const Dados: any = {
      tipo: 6,
    };
    this.ValorOpcao = Dados;
  }

  async Deletar(consulta: Tabela) {
    try {
      await this.consultaService.DeletarConsulas(consulta.consulta).toPromise();
      Swal.fire('Deletado', 'Consulta deletada com sucesso', 'success');
      this.buscarDados(); // Atualizar a tabela após deletar
    } catch (error) {
      console.error(error);
      Swal.fire('Erro', 'Erro ao deletar consulta', 'error');
    }
  }

  Editar(consulta: any) {
    this.dialog.open(EditarConsultasComponent, {
      width: '800px',
      height: '550px',
      data: { DadoSelecionadoParaEdicao: consulta },
    });
  }

  GerarPDF(consulta: any) {
    this.dialog.open(Template_PDFComponent, {
      width: '800px',
      height: '550px',
      data: { DadoSelecionadoParaGerarPDF: consulta },
    });
  }

  CronogramaDoDia() {
    this.dialog.open(CalendarDialogComponent, {
      width: '300px',
      height: '300px',
    });
  }

  voltarParaHome() {
    this.router.navigate(['home']);
  }

  AdicionarMedico() {
    this.dialog.open(CadastroMedicoComponent, {
      width: '800px',
      height: '600px',
    });
  }

  AdicionarPaciente() {
    this.dialog.open(CadastroPacienteComponent, {
      width: '800px',
      height: '600px',
    });
  }

  AdicionarSecretaria() {
    this.dialog.open(CadastroSecretariaComponent, {
      width: '800px',
    });
  }

  tratarDadosParaTabela(dados: any[]): Tabela[] {
     return dados.map((dado) => ({
      consulta: dado.conCodigoConsulta || dado.conSttCodigoConsulta,
      medico: dado.conMedico || dado.conSttMedico,
      paciente: dado.conPaciente || dado.conSttPaciente,
      diaSemana: dado.conDia_semana || dado.conSttDia_semana,
      data: dado.conData || dado.conSttData,
      horario: dado.conHorario || dado.conSttHorario,
      observacao: dado.conObservacoes || dado.conSttObservacao,
      dadaCriacao: dado.conDataCriacao || dado.conSttDataCriacao,
      status: dado.conStatus || dado.conSttStatus,
      adm: dado.conAdm || dado.conSttAdm,
      formaPagamento: dado.conFormaPagamento || dado.conSttFormaPagamento,
    }));
  }

  DadoSelecionadoParaAcao(info: any, $event: MatCheckboxChange) {
    console.log('info', info);
    console.log('$event', $event);
  }

  openAvisosDialog(Consulta: any) {
    const medico = Consulta.ConMedico;
    const paciente = Consulta.ConPaciente;
    this.dialog.open(AvisosLembretesComponent, {
      width: '550px',
      data: { Consulta: Consulta, Medico: medico, Paciente: paciente },
    });
  }

  openObservacoesDialog(observacoes: string): void {
    this.dialog.open(ObservacoesComponent, {
      width: '550px',
      data: { observacoes: observacoes },
    });
  }
}
