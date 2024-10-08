import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { ProntuarioService } from 'src/app/service/MEDICO-prontuario/prontuario.service';
import { Prontuario } from 'src/app/util/variados/interfaces/Prontuario/Prontuario';
import { Cid_codigo_internaciona_doecas } from 'src/app/util/variados/options/cid-codigo-internaciona-doecas';

@Component({
  selector: 'app-diagnostico',
  templateUrl: './diagnostico.component.html',
  styleUrls: ['./diagnostico.component.css'],
})
export class DiagnosticoComponent implements OnInit {
  @Input() Finalizar = false;

  myControl = new FormControl('');
  options: Cid_codigo_internaciona_doecas[] = Cid_codigo_internaciona_doecas;
  filteredOptions: Cid_codigo_internaciona_doecas[] = [];

  // Paginação
  pageSize = 20; // Número de itens por página
  currentPage = 1; // Página atual
  totalPages = 1; // Total de páginas
  primeiraColuna: Cid_codigo_internaciona_doecas[] = [];
  segundaColuna: Cid_codigo_internaciona_doecas[] = [];
  selectedOptions: Cid_codigo_internaciona_doecas[] = [];

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
    const prontDiagnostico = this.selectedOptions
      .map((option) => option.label)
      .join(', ');
    const prontuario: Prontuario = {
      prontDiagnostico: prontDiagnostico,
    };

    this.ProntuarioService.chageDiagnostico(prontuario);
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

  private _filter(value: string): Cid_codigo_internaciona_doecas[] {
    if (!value.trim()) {
      return this.options; // Retorna todas as opções se o valor estiver vazio
    }
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.label.toLowerCase().includes(filterValue)
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

  selectOption(option: Cid_codigo_internaciona_doecas) {
    this.selectedOptions.push(option);
   }

  resetarPesquisa() {
    this.filtrandoDadosCid();
    this.myControl = new FormControl('');
  }

  limparPesquisa() {
    this.resetarPesquisa();
    this.myControl = new FormControl('');
  }
}

export interface Cid_codigo_internaciona_doecas {
  codigo: string;
  label: string;
}
