import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Medico } from './../../../util/variados/interfaces/medico/medico';
import { MedicosService } from 'src/app/service/medicos/medicos.service';

@Component({
  selector: 'app-tabelas-Pesquisas-Medicos',
  templateUrl: './tabelas-Pesquisas-Medicos.component.html',
  styleUrls: ['./tabelas-Pesquisas-Medicos.component.css'],
})
export class TabelasPesquisasMedicosComponent implements OnInit, OnDestroy {



  dataSource: Medico[] = [];
  highValue: number = 5;
  lowValue: number = 0;
  private subscription: Subscription = new Subscription();
  clickedRows = new Set<Medico>();

  @Input() dadosMedico: any;
  @Output() selecionaMedico = new EventEmitter<any>();
  @Output() fechar = new EventEmitter<void>();

  constructor(private medicosService: MedicosService, private router: Router) {}

  ngOnInit() {

    this.dataSource = this.dadosMedico;

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    this.highValue = Math.min(this.highValue, this.dataSource.length);
    return event;
  }

  displayedColumns: string[] = ['position', 'Especialidade', 'MarcaConsulta'];

  marcarConsulta(elemento: Medico) {
    this.fecharTabela()
    this.selecionaMedico.emit(elemento )
  }


  clicked(Medico: Medico) {
    this.selecionaMedico.emit(Medico);
  }

  fecharTabela() {
    this.fechar.emit();
  }
}
