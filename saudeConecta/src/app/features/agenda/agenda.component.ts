import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultaService } from 'src/app/service/service-consulta/consulta.service';
import { TabelaAgendaComponent } from './tabela-agenda/tabela-agenda.component';
import { ConsultaStatus } from 'src/app/util/variados/interfaces/consultaStatus/consultaStatus';
import { ConsultaStatusService } from 'src/app/service/service-consulta-status/consulta-status.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
})
export class AgendaComponent implements OnInit {
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
    private consultastatusService: ConsultaStatusService
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

    if (this.ConsultaStatus) {
      this.consultastatusService.FiltraDadosTabelaStatusSubject(busca);
      this.FormularioAgenda.reset();
    } else if (this.Consulta) {
      this.consultaService.FiltraDadosSubject(busca);
      this.FormularioAgenda.reset();
    }
  }

  Recarregar() {
    this.Consulta = true;
    this.ConsultaStatus = false;
    this.FormularioAgenda.reset();
    this.consultaService.RecarregarDadosTabelaSubject(true);
    this.consultastatusService.RecarregarDadosTabelaStatusSubject(true);
    window.location.reload();
  }

  Concluido() {
    this.Consulta = true;
    this.ConsultaStatus = false;
    this.consultaService.ConcluidoTabelaSubject(true);
  }

  Editar() {
    this.Consulta = true;
    this.ConsultaStatus = false;
    this.consultaService.EditarDadosDaTabelaSubject(true);
  }

  Deletar() {
    this.Consulta = true;
    this.ConsultaStatus = false;
    this.consultaService.ExcluirDadosDaTabelaSubject(true);
  }




  GerarPDF() {
    if (this.ConsultaStatus) {
      this.consultastatusService.Gera_PDF_DeRegistroDaTabelaSubject(true);
    } else if (this.Consulta) {
      this.consultaService.Gera_PDF_DeRegistroDaTabelaSubject(true);
    }
  }


  MostraTabelaDeConcluidos() {
    this.Consulta = false;
    this.ConsultaStatus = true;
    this.FormularioAgenda.reset();
  }


  voltarParaHome() {
    this.router.navigate(['home']);
  }
}
