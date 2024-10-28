import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
import { Tabela } from 'src/app/util/variados/interfaces/tabela/Tabela';
import { el } from 'date-fns/locale';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
})
export class AgendaComponent implements OnInit {
  FormularioAgenda!: FormGroup;
  dataSource: Tabela[] = [];
  displayedColumns: string[] = ['consulta', 'medico', 'paciente', 'diaSemana', 'data', 'horario', 'Seleciona',];
  Finalizadas = false;
  clickedRows = new Set<Tabela>();
  ValorOpcao: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private consultaService: ConsultaService,
    public dialog: MatDialog,
    private consultaStatusService: ConsultaStatusService
  ) { }



  async ngOnInit() {
    this.buscarDadosParaTabela();
    this.FormularioAgenda = this.formBuilder.group({
      busca: [''],
    });


    this.consultaService.BuscarDadoParaCronologia$.subscribe((dados) => {
      if (dados) {
        this.dataSource = this.tratarDadosParaTabela(dados);
      }
    })


  }

  async buscarDadosParaTabela() {
    try {
      const dados = await this.consultaService.BuscarTodosRegistrosDeConsulta().toPromise();
      if (dados) {
        this.dataSource = []
        this.dataSource = this.tratarDadosParaTabela(dados);
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Erro', 'Erro ao buscar dados da tabela.', 'error');
    }
  }




  async PesquisarNaTabelaConcluidos() {
    this.Finalizadas = true;

    try {
      const dados = await this.consultaStatusService.BuscarTodosRegistrosDeConsultaStatus().pipe(take(1)).toPromise();
      if (dados) {
        this.dataSource = this.tratarDadosParaTabela(dados);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async Pesquisar() {
    const busca = this.FormularioAgenda.get('busca')?.value;
    this.FormularioAgenda.reset();

    try {
      const dados = await this.consultaService.filtrandoDadosDoBancoPassadoParametros_Pesquisa(busca, this.dataSource);
      if (dados) {
        this.dataSource = dados;
      } else {
        this.buscarDadosParaTabela();
        Swal.fire('Erro', 'Pesquisa não encontrada.', 'error');
      }
    } catch (error) {
      Swal.fire('Erro', 'Pesquisa falha ao fazer a busca.  ', 'error');
      console.error(error);
    }
  }

  Recarregar() {
    this.Finalizadas = false;
    this.buscarDadosParaTabela();
  }


  async Deletar(consulta: Tabela) {
    try {
      await this.consultaService.DeletarConsulas(consulta.consulta).toPromise();
      Swal.fire('Deletado', 'Consulta deletada com sucesso', 'success');
      this.buscarDadosParaTabela(); // Atualizar a tabela após deletar
    } catch (error) {
      console.error(error);
      Swal.fire('Erro', 'Erro ao deletar consulta', 'error');
    }
  }

  Editar(consulta: any) {
    this.dialog.open(EditarConsultasComponent, {
      width: '800px',
      height: '550px',
      data: { DadoSelecionadoParaEdicao: consulta, },
    });

    this.dialog.afterAllClosed.subscribe(() => {
      this.buscarDadosParaTabela();
    })
  }

  Concluido(elemento: Tabela) {
    Swal.fire({
      title: 'Tem certeza que deseja concluir esses registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5ccf6c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Concluir!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.consultaService.ConcluirDadosDaTabela(elemento.consulta).subscribe((dados) => {
          this.consultaService.DeletarConsulas(elemento.consulta).subscribe((dados) => {
            Swal.fire('Concluido', 'Concluido com sucesso', 'success');
            this.buscarDadosParaTabela();
          }, (error) => {
            Swal.fire('Erro', 'Erro ao concluir', 'error');
            console.error(error);
          });
        }, (error) => {
          Swal.fire('Erro', 'Erro ao concluir', 'error');
          console.error(error);
        })
      } else {
        this.buscarDadosParaTabela();
      }
    });
  }

  EnviarAviso(Consulta: Tabela) {
    this.dialog.open(AvisosLembretesComponent, {
      width: '550px',
      data: { Consulta: Consulta },
    });
  }

  Observacoes(observacoes: string): void {
    this.dialog.open(ObservacoesComponent, {
      width: '550px',
      data: { observacoes: observacoes },
    });
  }

  GerarPDF(consulta: Tabela) {
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

}
