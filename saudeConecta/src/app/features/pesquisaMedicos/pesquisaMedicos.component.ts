import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from 'src/app/service/paciente_service/paciente.service';

@Component({
  selector: 'app-pesquisaMedicos',
  templateUrl: './pesquisaMedicos.component.html',
  styleUrls: ['./pesquisaMedicos.component.css'],
})
export class PesquisaMedicosComponent implements OnInit {
  FormularioPesquisa!: FormGroup;

  constructor(
    private form: FormBuilder,
    private pacienteService: PacienteService
  ) {}

  ngOnInit() {
    this.FormularioPesquisa = this.form.group({
      Pesquisa: ['', Validators.required],
      FiltroPesquisa: ['', Validators.required],
    });
  }

  PesquisarMedicosFiltro() {
    const pesquisa: string = this.FormularioPesquisa.get('Pesquisa')?.value;
    const FiltroPesquisa: number =
      this.FormularioPesquisa.get('FiltroPesquisa')?.value;

    if (FiltroPesquisa === 1) {
      this.pacienteService.buscarListaMedicosPorNome(pesquisa).subscribe(
        (dados) => {
          console.log('deu certo ', dados);
        },
        (erros) => {
          console.log('deu erro', erros);
        }
      );
    } else if (FiltroPesquisa === 2) {
      this.pacienteService.buscarListaMedicosPorCRM(pesquisa).subscribe(
        (dados) => {
          console.log('deu certo ', dados);
        },
        (erros) => {
          console.log('deu erro', erros);
        }
      );
    } else if (FiltroPesquisa === 3) {
      this.pacienteService.buscarListaMedicosPorCidade(pesquisa).subscribe(
        (dados) => {
          console.log('deu certo ', dados);
        },
        (erros) => {
          console.log('deu erro', erros);
        }
      );
    } else if (FiltroPesquisa === 4) {
      this.pacienteService
        .buscarListaMedicosPorEspecialidade(pesquisa)
        .subscribe(
          (dados) => {
            console.log('deu certo ', dados);
          },
          (erros) => {
            console.log('deu erro', erros);
          }
        );
    }

    console.log(pesquisa, FiltroPesquisa);
  }
}
