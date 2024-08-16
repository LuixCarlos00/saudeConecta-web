import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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

  ModeloExame: string = '';
  TituloExame: string = '';
  DataExame: string = '';
  ExameText: string = '';

  @Input() Finalizar: boolean = false;

  myControl = new FormControl('');
  options: Tuss_terminologia_Unificada_Saude_Suplementar[] =
    Tuss_terminologia_Unificada_Saude_Suplementar;
  filteredOptions: Tuss_terminologia_Unificada_Saude_Suplementar[] = [];
  primeiraColuna: Tuss_terminologia_Unificada_Saude_Suplementar[] = [];
  segundaColuna: Tuss_terminologia_Unificada_Saude_Suplementar[] = [];
  selectedOptions: Tuss_terminologia_Unificada_Saude_Suplementar[] = [];

  pageSize = 20; // Número de itens por página
  currentPage = 1; // Página atual
  totalPages = 1; // Total de páginas

  constructor(private ProntuarioService: ProntuarioService) {}

  ngOnInit() {
    this.filtrandoDadosCid();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['Finalizar'] && this.Finalizar) {
      this.enviandoAquivos();
    }
  }

  enviandoAquivos() {
    const prontPrescricao = this.selectedOptions
      .map((option) => option.descricao)
      .join(', ');
    const prontuario: Prontuario = {
      prontPrescricao: prontPrescricao,
      prontDataPrescricao: this.DataPrescricao,
      prontModeloPrescricao: this.ModeloPrescricao,
      prontTituloPrescricao: this.TituloPrescricao,

      prontExame: this.ExameText,
      prontDataExame: this.DataExame,
      prontModeloExame: this.ModeloExame,
      prontTituloExame: this.TituloExame,
    };

    this.ProntuarioService.chagePrescricao(prontuario);
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
    const currentOptions = this.filteredOptions.slice(startIndex, endIndex);

    // Garantindo que a primeira coluna tenha 10 itens
    const primeiraColunaLength = Math.min(10, currentOptions.length);
    this.primeiraColuna = currentOptions.slice(0, primeiraColunaLength);

    // Colocando os itens restantes na segunda coluna
    this.segundaColuna = currentOptions.slice(primeiraColunaLength);
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
