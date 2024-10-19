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

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
})
export class AgendaComponent implements OnInit {
  ValorOpcao: any;
  //
  //
  //
  Consulta: boolean = false;
  ConsultaStatus: boolean = false;
  FormularioAgenda!: FormGroup;

  constructor(
    private router: Router,
    private form: FormBuilder,
    private consultaService: ConsultaService,
    private consultastatusService: ConsultaStatusService,
    public dialog: MatDialog,
    protected DialogService: DialogService
  ) {}

  ngOnInit() {
    this.Consulta = true;
    this.ConsultaStatus = false;
    this.FormularioAgenda = this.form.group({
      busca: [''],
    });
  }

  Pesquisar() {
    const busca = this.FormularioAgenda.get('busca')?.value;
    const Dados: any = {
      date: busca,
      tipo: 1,
    };
    this.ValorOpcao = Dados;
    this.FormularioAgenda.reset();
  }

  PesquisarNaTabelaConcluidos() {
    this.Consulta = false;
    this.ConsultaStatus = true;
    const busca = this.FormularioAgenda.get('busca')?.value;
    const Dados: any = {
      date: busca,
      tipo: 2,
    };
    this.ValorOpcao = Dados;
    this.FormularioAgenda.reset();
  }




  Recarregar() {
    this.Consulta = true;
    this.ConsultaStatus = false;
    const Dados: any = {
      tipo: 3,
    };
    this.ValorOpcao = Dados;
  }



  Concluido() {
    this.Consulta = true;
    this.ConsultaStatus = false;
    const Dados: any = {
      tipo: 6,
    };
    this.ValorOpcao = Dados;
  }




  Editar() {
    this.Consulta = true;
    this.ConsultaStatus = false;
    const Dados: any = {
      tipo: 5,
    };
    this.ValorOpcao = Dados;
  }



  Deletar() {
    this.Consulta = true;
    this.ConsultaStatus = false;
    const Dados: any = {
      tipo: 4,
    };
    this.ValorOpcao = Dados;
  }

  GerarPDF() {

    this.Consulta = true;
    this.ConsultaStatus = false;
    const Dados: any = {
      tipo: 7,
    };
    this.ValorOpcao = Dados;

    if (this.ConsultaStatus) {
      this.consultastatusService.Gera_PDF_DeRegistroDaTabelaSubject(true);
    } else if (this.Consulta) {
      //this.consultaService.Gera_PDF_DeRegistroDaTabelaSubject(true);
    }
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
}
