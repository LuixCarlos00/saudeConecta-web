import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultaService } from 'src/app/service/consulta/consulta.service';
import { TabelaAgendaComponent } from './tabela-agenda/tabela-agenda.component';
import { ConsultaStatus } from 'src/app/util/variados/interfaces/consultaStatus/consultaStatus';
import { ConsultaStatusService } from 'src/app/service/service-consulta-status/consulta-status.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from 'src/app/util/variados/dialogo-confirmação/dialog.service';
import { CadastroMedicoComponent } from '../cadastro/cadastro-medico/cadastro-medico.component';
import { CadastroPacienteComponent } from '../cadastro/cadastro-paciente/cadastro-paciente.component';
import { CadastroSecretariaComponent } from '../cadastro/cadastro-secretaria/cadastro-secretaria.component';
import { CalendarDialogComponent } from 'src/app/util/variados/Cronologia/cronologia.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CdkTableDataSourceInput } from '@angular/cdk/table';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs';
import { da } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { EditarConsultasComponent } from './tabela-agenda/Editar-Consultas/Editar-Consultas.component';
import { Template_PDFComponent } from './template_PDF/template_PDF.component';

interface Tabela {
  consulta: string;
  medico: string;
  paciente: string;
  diaSemana: string;
  data: string;
  horario: string;
  observacao: string;
}

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
})
export class AgendaComponent implements OnInit {
  FormularioAgenda!: FormGroup;
  dataSource = new MatTableDataSource<Tabela>([]);
  displayedColumns: string[] = ['consulta', 'medico', 'paciente', 'diaSemana', 'data', 'horario', 'observacao', 'observar', 'seleciona','deletar','Edicao','PDF'];
  Finalizadas = false;
  clickedRows = new Set<Tabela>();
  ValorOpcao: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private consultaService: ConsultaService,
    public dialog: MatDialog,
    private consultaStatusService : ConsultaStatusService
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
        this.dataSource.data = this.tratarDadosParaTabela(dados);
      }
     } catch (error) {
      console.error(error);
      Swal.fire('Erro', 'Erro ao buscar dados', 'error');
    }
  }




  async PesquisarNaTabelaConcluidos() {
    this.Finalizadas = true

    try {
      const dados = await   this.consultaStatusService.BuscarTodosRegistrosDeConsultaStatus().pipe(take(1)).toPromise()
      console.log('PesquisarNaTabelaConcluidos', dados);
      if (dados) {
        this.dataSource.data = this.tratarDadosParaTabela(dados);
      }
      console.log('this.PesquisarNaTabelaConcluidos', this.dataSource.data);
    } catch (error) {
      console.error(error);
    }
    }






  async Pesquisar() {
    const busca = this.FormularioAgenda.get('busca')?.value;
    this.FormularioAgenda.reset();

    try {
      const dados = await this.consultaService.filtrandoDadosDoBancoPassadoParametros_Pesquisa(busca,this.dataSource.data)
      if (dados) {
        this.dataSource.data = dados;
      }else{
        this.buscarDados()
        Swal.fire('Erro', 'Pesquisa não  encontrada', 'error');
       }

    } catch (error) {
      console.error(error);
    }
  }





  Recarregar() {
    this.Finalizadas = false
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






  GerarPDF(consulta : any) {
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
    return dados.map(dado => ({
      consulta: dado.conCodigoConsulta || dado.conSttCodigoConsulta,
      medico: dado.conMedico?.medNome || dado.conSttMedico?.medNome,
      paciente: dado.conPaciente?.paciNome || dado.conSttPaciente?.paciNome,
      diaSemana: dado.conDia_semana || dado.conSttDia_semana,
      data: dado.conData || dado.conSttData,
      horario: dado.conHorario || dado.conSttHorario,
      observacao: dado.conObservacoes || dado.conSttObservacao,
    }));
  }



  DadoSelecionadoParaAcao(info: any, $event: MatCheckboxChange) {

    console.log('info', info);
    console.log('$event', $event);



   }
  openAvisosDialog(_t164: any) {
    console.log('_t177', _t164);

   }
  openObservacoesDialog(arg0: any) {
    console.log('_t177', arg0);

   }
}
