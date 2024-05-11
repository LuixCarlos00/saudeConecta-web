import { Route, Router } from '@angular/router';
import { MESSAGES_CONTAINER_ID } from '@angular/cdk/a11y';
import { Medico } from './../../../util/variados/interfaces/medico/medico';
import { PesquisaMedicosComponent } from './../pesquisaMedicos.component';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PacienteService } from 'src/app/service/paciente_service/paciente.service';



@Component({
  selector: 'app-tabelas-Pesquisas-Medicos',
  templateUrl: './tabelas-Pesquisas-Medicos.component.html',
  styleUrls: ['./tabelas-Pesquisas-Medicos.component.css']
})
export class TabelasPesquisasMedicosComponent implements OnInit {




  private MedicoCidade: Medico[] | undefined;
  private MedicoCRM :Medico[]|undefined;
  private MedicoNome:Medico[]|undefined;
  private MedicoEspecialidade : Medico[]|undefined
  clickedRows = new Set<any>();;

  dataSource: Medico[] = [];
  highValue: number = 5;
  lowValue!: number;







  constructor(
    private pacienteService: PacienteService ,
    private PesquisaMedicosComponent:PesquisaMedicosComponent,
    private route :Router
   ) {



    this.MedicoCidade = pacienteService.MedicoCidade;
    this.MedicoCRM = pacienteService.MedicoCRM;
    this.MedicoNome = pacienteService.MedicoNome;
    this.MedicoEspecialidade = pacienteService.MedicoEspecialidade;



    this.dataSource = [];


    this.dataSource = [
      ...(this.MedicoCidade ?? []),
      ...(this.MedicoCRM ?? []),
      ...(this.MedicoNome ?? []),
      ...(this.MedicoEspecialidade ?? [])
    ];


  }

  ngOnInit() {
  }


  getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    this.highValue = Math.min(this.highValue, this.dataSource.length);
    return event;
  }


  displayedColumns: string[] = ['position' ,'MarcaConsulta'];



  marcarConsulta(elemento: Medico,index: number) {
    this.route.navigate(['addconsulta']);
    this.pacienteService.changeMedicoData(elemento);

    }

    pesquisarNovamente() {
      this.PesquisaMedicosComponent.mostrarCamposPesquisa(true);
      this.MedicoCidade=[];
      this.MedicoCRM=[];
      this.MedicoNome=[];
      this.MedicoEspecialidade=[];
      this.dataSource = [];
      this.pacienteService.LimparDadosPesquisa();
    }


    clicked(Medico: Medico) {
console.log(Medico);

      this.pacienteService.changeMedicoData(Medico);
      this.PesquisaMedicosComponent.MostraDadosMedicos = true;
      this.PesquisaMedicosComponent.Medico = Medico;
    }


  }


