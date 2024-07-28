import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs';
import { ProntuarioService } from 'src/app/service/MEDICO-prontuario/prontuario.service';
import { Prontuario } from 'src/app/util/variados/interfaces/Prontuario/Prontuario';
import { Tuss_terminologia_Unificada_Saude_Suplementar } from 'src/app/util/variados/options/tuss-Terminologia-unificada-saude-splementar';

@Component({
  selector: 'app-prescricao',
  templateUrl: './prescricao.component.html',
  styleUrls: ['./prescricao.component.css'],
})
export class PrescricaoComponent implements OnInit {
  //
  //
  ///
  PrescricaoText: string = '';
  DataPrescricao: string = '';
  ModeloPrescricao: string = '';
  TituloPrescricao: string = '';

  @Output() mudarAba = new EventEmitter<number>();
  myControl = new FormControl('');
  options: Tuss_terminologia_Unificada_Saude_Suplementar[] =
    Tuss_terminologia_Unificada_Saude_Suplementar;
  filteredOptions: Tuss_terminologia_Unificada_Saude_Suplementar[] = [];
  selectedOptions: Tuss_terminologia_Unificada_Saude_Suplementar[] = [];

  pageSize = 10; // Número de itens por página
  currentPage = 1; // Página atual
  totalPages = 1; // Total de páginas
  paginatedOptions: Tuss_terminologia_Unificada_Saude_Suplementar[] = [];

  constructor(private ProntuarioService: ProntuarioService) {}

  ngOnInit() {
    this.filtrandoDadosCid();
  }


  Proximo() {

    const prontPrescricao = this.selectedOptions.map(option => option.descricao).join(', ');
    const prontuario: Prontuario = {
      prontPrescricao: prontPrescricao,
      prontDataPrescricao: this.DataPrescricao,
      prontModeloPrescricao: this.ModeloPrescricao,
      prontTituloPrescricao: this.TituloPrescricao
    };
    console.log(prontuario,'aqui');

    this.ProntuarioService.chageSolicitacaoExame(prontuario);
    this.mudarAba.emit(5);
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

  private _filter(
    value: string
  ): Tuss_terminologia_Unificada_Saude_Suplementar[] {
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

  selectOption(
    option: Tuss_terminologia_Unificada_Saude_Suplementar,
    event: any
  ) {
    if (event.target.checked) {
      this.selectedOptions.push(option);
    } else {
      const index = this.selectedOptions.findIndex(
        (o) => o.codigo === option.codigo
      );
      if (index !== -1) {
        this.selectedOptions.splice(index, 1);
      }
    }
    this.updatePrescricaoText();
  }

  updatePrescricaoText() {
    this.PrescricaoText = this.selectedOptions
      .map((option) => option.descricao)
      .join('\n');
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
