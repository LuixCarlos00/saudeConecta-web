import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';
import { log } from 'node:console';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicosService } from 'src/app/service/medicos/medicos.service';
import { MatDialog } from '@angular/material/dialog';
import { TabelasPesquisasMedicosComponent } from '../pesquisaMedicos/tabelas-Pesquisas-Medicos/tabelas-Pesquisas-Medicos.component';
import { PacientesService } from 'src/app/service/pacientes/Pacientes.service';
import { TabelaDePacientesComponent } from '../pesquisaPaciente/tabela-de-pacientes/tabela-de-pacientes.component';

@Component({
  selector: 'app-agenda-dados',
  templateUrl: './agenda-dados.component.html',
  styleUrls: ['./agenda-dados.component.css']
})
export class AgendaDadosComponent implements OnInit {



  FormularioPaciente!: FormGroup
  FormularioMedicos!: FormGroup

  Medico: Medico = {
    MedCodigo: 0,
    MedNome: '',
    MedSexo: 0,
    MedDataNacimento: '',
    MedCrm: '',
    MedCpf: '',
    MedRg: '',
    MedEspecialidade: '',
    MedEmail: '',
    MedTelefone: ''
  }
  Paciente: Paciente = {
    PaciCodigo: 0,
    PaciNome: '',
    PaciSexo: 0,
    PaciDataNacimento: '',
    PaciCpf: '',
    PaciRg: '',
    PaciEmail: '',
    PaciTelefone: '',
    endereco: 0,
    PaciStatus: 0
  }

  constructor(
    private router: Router,
    private FormBuilder: FormBuilder,
    private medicosService: MedicosService,
    private dialog: MatDialog,
    private pacientesService: PacientesService,
  ) { }

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


  async Pesquisar(value: string) {
    if (value === 'paciente') {
      const FiltroPesquisa = this.FormularioPaciente.get('OptionsFindPaciente')?.value;
      const pesquisa: string = this.FormularioPaciente.get('PesquisaPaciente')?.value;
      try {
        const dados = await this.pacientesService.PesquisarPacientesFiltro(FiltroPesquisa, pesquisa);
        this.AbirTabela(dados, 'paciente');
      } catch (error) {
        this.medicosService.exibirMensagemErro();
      }
    }
    if (value === 'medico') {
      const FiltroPesquisa = this.FormularioMedicos.get('OptionsFindMedicos')?.value;
      const pesquisa: string = this.FormularioMedicos.get('PesquisaMedicos')?.value;
      try {
        const dados = await this.medicosService.PesquisaMedicoFiltro(FiltroPesquisa, pesquisa);
        this.AbirTabela(dados, 'medico');
      } catch (error) {
        this.medicosService.exibirMensagemErro();
      }
    }

  }







  AbirTabela(Dados: any, value: string) {

    if (value === 'paciente') {
      const dialogRef = this.dialog.open(TabelaDePacientesComponent, {
        width: '800px',
        data: { datasource: Dados, },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log(result);
          this.Paciente = result;
        }
      })
    }

    if (value === 'medico') {
      const dialogRef = this.dialog.open(TabelasPesquisasMedicosComponent, {
        width: '800px',
        data: { datasource: Dados, },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log(result);
          this.Medico = result;
        }
      })
    }
  }








































  voltarParaHome() {
    this.router.navigate(['/Dashboard']);
  }
}
