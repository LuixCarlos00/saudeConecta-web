import { log } from 'node:console';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicosService } from 'src/app/service/medicos/medicos.service';
import { MatDialog } from '@angular/material/dialog';
import { TabelasPesquisasMedicosComponent } from '../pesquisaMedicos/tabelas-Pesquisas-Medicos/tabelas-Pesquisas-Medicos.component';

@Component({
  selector: 'app-agenda-dados',
  templateUrl: './agenda-dados.component.html',
  styleUrls: ['./agenda-dados.component.css']
})
export class AgendaDadosComponent implements OnInit {



  FormularioPaciente!: FormGroup
  FormularioMedicos!: FormGroup



  constructor(private router: Router, private FormBuilder: FormBuilder, private medicosService: MedicosService, private dialog: MatDialog) { }

  ngOnInit() {

    this.FormularioMedicos = this.FormBuilder.group({
      PesquisaMedicos: [''],
      OptionsFindMedicos: [''],
    });

    this.FormularioPaciente = this.FormBuilder.group({
      PesquisaPaciente: [''],
      OptionsFindPaciente: [''],
    });
  }


  async PesquisarMedicos() {
    const FiltroPesquisa = this.FormularioMedicos.get('OptionsFindMedicos')?.value;
    const pesquisa: string = this.FormularioMedicos.get('PesquisaMedicos')?.value;
    try {
      const dados = await this.medicosService.PesquisaMedicoFiltro(FiltroPesquisa, pesquisa);
      this.AbirTabela(dados);
    } catch (error) {
      this.medicosService.exibirMensagemErro();
    }
  }







  AbirTabela(Dados: any) {
    this.dialog.open(TabelasPesquisasMedicosComponent, {
      width: '800px',

      data: { datasource: Dados, },
    });

    this.dialog.afterAllClosed.subscribe((result) => {
      console.log('result', result);
    })
  }





















































  voltarParaHome() {
    this.router.navigate(['/Dashboard']);
  }
}
