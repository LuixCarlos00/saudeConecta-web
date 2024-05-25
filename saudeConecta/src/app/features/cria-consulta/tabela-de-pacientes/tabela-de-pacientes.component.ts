import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';

@Component({
  selector: 'app-tabela-de-pacientes',
  templateUrl: './tabela-de-pacientes.component.html',
  styleUrls: ['./tabela-de-pacientes.component.css']
})
export class TabelaDePacientesComponent implements OnInit {


  dataSource: Paciente[] = [];
  highValue: number = 5;
  lowValue!: number;

  constructor() { }

  ngOnInit() {
  }

  displayedColumns: string[] = ['position' ,'MarcaConsulta'];

  getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    this.highValue = Math.min(this.highValue, this.dataSource.length);
    return event;
  }


}
