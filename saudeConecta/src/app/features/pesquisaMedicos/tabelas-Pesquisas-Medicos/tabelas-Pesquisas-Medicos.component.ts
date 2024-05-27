import { Route, Router } from '@angular/router';
import { MESSAGES_CONTAINER_ID } from '@angular/cdk/a11y';
import { Medico } from './../../../util/variados/interfaces/medico/medico';
import { PesquisaMedicosComponent } from './../pesquisaMedicos.component';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ModelService } from 'src/app/service/Model_service/Model.service';
import { MedicosService } from 'src/app/service/medicos/medicos.service';

@Component({
  selector: 'app-tabelas-Pesquisas-Medicos',
  templateUrl: './tabelas-Pesquisas-Medicos.component.html',
  styleUrls: ['./tabelas-Pesquisas-Medicos.component.css'],
})
export class TabelasPesquisasMedicosComponent implements OnInit {
  private MedicoCidade: Medico[] | undefined;
  private MedicoCRM: Medico[] | undefined;
  private MedicoNome: Medico[] | undefined;
  private MedicoEspecialidade: Medico[] | undefined;
  clickedRows = new Set<any>();

  dataSource: Medico[] = [];
  highValue: number = 5;
  lowValue!: number;

  constructor(
    private medicosService: MedicosService,
    private PesquisaMedicosComponent: PesquisaMedicosComponent,
    private route: Router
  ) {
    this.MedicoCidade = medicosService.MedicoCidade;
    this.MedicoCRM = medicosService.MedicoCRM;
    this.MedicoNome = medicosService.MedicoNome;
    this.MedicoEspecialidade = medicosService.MedicoEspecialidade;

    this.dataSource = [];

    this.dataSource = [
      ...(this.MedicoCidade ?? []),
      ...(this.MedicoCRM ?? []),
      ...(this.MedicoNome ?? []),
      ...(this.MedicoEspecialidade ?? []),
    ];
  }

  ngOnInit() {}

  getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    this.highValue = Math.min(this.highValue, this.dataSource.length);
    return event;
  }

  displayedColumns: string[] = ['position', 'MarcaConsulta'];

  marcarConsulta(elemento: Medico, index: number) {
    this.route.navigate(['addconsulta']);
    this.medicosService.changeMedicoData(elemento);
  }

  pesquisarNovamente() {
    this.PesquisaMedicosComponent.mostrarCamposPesquisa(true);
    this.MedicoCidade = [];
    this.MedicoCRM = [];
    this.MedicoNome = [];
    this.MedicoEspecialidade = [];
    this.dataSource = [];
    this.medicosService.LimparDadosPesquisa();
  }

  clicked(Medico: Medico) {


    this.medicosService.changeMedicoData(Medico);
    this.PesquisaMedicosComponent.MostraDadosMedicos = true;
    this.PesquisaMedicosComponent.Medico = Medico;
  }
}
