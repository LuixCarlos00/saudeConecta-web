import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';

@Component({
  selector: 'app-tabela-editar-Medicos-Consultas',
  templateUrl: './tabela-editar-Medicos-Consultas.component.html',
  styleUrls: ['./tabela-editar-Medicos-Consultas.component.css'],
})
export class TabelaEditarMedicosConsultasComponent implements OnInit {
  //
  //
  //
  @Input() dadosMedicos: any;
  @Output() fechar = new EventEmitter<void>();
  @Output() selecionaMedico = new EventEmitter<any>();


  clickedRows: any;
  dataSource: Medico[] = [];
  highValue: number = 5;
  lowValue!: number;

  constructor() {}

  ngOnInit() {

    this.dataSource = this.dadosMedicos
  }




  SelecionaMedico(elemento: Medico) {
    this.fecharTabela();

    this.selecionaMedico.emit(elemento);
  }

  fecharTabela() {
    this.fechar.emit();
  }

  displayedColumns: string[] = ['position', 'Especialidade', 'MarcaConsulta'];


  getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    this.highValue = Math.min(this.highValue, this.dataSource.length);
    return event;
  }
}
