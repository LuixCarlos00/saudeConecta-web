
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Medico } from '../../../../util/variados/interfaces/medico/medico';
import { MedicosService } from 'src/app/service/medicos/medicos.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tabelas-Pesquisas-Medicos',
  templateUrl: './tabelas-Pesquisas-Medicos.component.html',
  styleUrls: ['./tabelas-Pesquisas-Medicos.component.css'],
})
export class TabelasPesquisasMedicosComponent implements OnInit {

  dataSource: Medico[] = [];
  highValue: number = 5;
  lowValue: number = 0;
  clickedRows = new Set<Medico>();


  constructor(
    public dialogRef: MatDialogRef<TabelasPesquisasMedicosComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { datasource: any; },
  ) { }

  ngOnInit() {
    this.dataSource = this.data.datasource;
  }



  getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    this.highValue = Math.min(this.highValue, this.dataSource.length);
    return event;
  }

  displayedColumns: string[] = ['position', 'Especialidade', 'MarcaConsulta'];

  marcarConsulta(elemento: Medico) {
    this.dialogRef.close(elemento);
  }



}
