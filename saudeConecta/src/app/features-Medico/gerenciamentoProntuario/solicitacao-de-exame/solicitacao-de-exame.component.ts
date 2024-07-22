import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs';
import { Tuss_terminologia_Unificada_Saude_Suplementar } from 'src/app/util/variados/options/tuss-Terminologia-unificada-saude-splementar';

@Component({
  selector: 'app-solicitacao-de-exame',
  templateUrl: './solicitacao-de-exame.component.html',
  styleUrls: ['./solicitacao-de-exame.component.css']
})
export class SolicitacaoDeExameComponent implements OnInit {

  myControl = new FormControl('');
  options: Tuss_terminologia_Unificada_Saude_Suplementar[] = Tuss_terminologia_Unificada_Saude_Suplementar;
  filteredOptions: Tuss_terminologia_Unificada_Saude_Suplementar[] = [];
  selectedOptions: Tuss_terminologia_Unificada_Saude_Suplementar[] = [];

  // Paginação
  pageSize = 10; // Número de itens por página
  currentPage = 1; // Página atual
  totalPages = 1; // Total de páginas
  paginatedOptions: Tuss_terminologia_Unificada_Saude_Suplementar[] = [];

  constructor() {}

  ngOnInit() {
    this.filtrandoDadosCid();
  }

  filtrandoDadosCid() {
    this.filteredOptions = this.options;
    this.totalPages = Math.ceil(this.filteredOptions.length / this.pageSize);
    this.updatePaginatedOptions();

    this.myControl.valueChanges
      .pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      )
      .subscribe((filteredData) => {
        this.filteredOptions = filteredData;
        this.totalPages = Math.ceil(
          this.filteredOptions.length / this.pageSize
        );
        this.currentPage = 1; // Resetar para a primeira página após a pesquisa
        this.updatePaginatedOptions();
      });
  }

  private _filter(value: string): Tuss_terminologia_Unificada_Saude_Suplementar[] {
    if (!value.trim()) {
      return this.options; // Retorna todas as opções se o valor estiver vazio
    }
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.descricao.toLowerCase().includes(filterValue)
    );
  }

  private updatePaginatedOptions() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedOptions = this.filteredOptions.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedOptions();
    }
  }

  selectOption(option: Tuss_terminologia_Unificada_Saude_Suplementar, event: any) {
    if (event.target.checked) {
      this.selectedOptions.push(option);
    } else {
      const index = this.selectedOptions.findIndex(o => o.codigo === option.codigo);
      if (index !== -1) {
        this.selectedOptions.splice(index, 1);
      }
    }
    console.log('Selecionado:', this.selectedOptions);
  }

  Proximo() {
    console.log('Selecionados:', this.selectedOptions);
  }

  resetarPesquisa() {
    this.filtrandoDadosCid();
    this.myControl.setValue('');
  }

  limparPesquisa() {
    this.resetarPesquisa();
  }
}

export interface Tuss_terminologia_Unificada_Saude_Suplementar {
  codigo: string;
  descricao: string;
  fabricante: string;
  tabela: number;
}
