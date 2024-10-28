import { MedicosService } from './../../../service/medicos/medicos.service';
import { CronologiaService } from './../../../service/cronologia/Cronologia.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../dialogo-confirmação/dialog.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EspecialidadeMedicas } from '../options/options';
import { ConsultaService } from 'src/app/service/consulta/consulta.service';
import { Medico } from '../interfaces/medico/medico';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cronologia',
  templateUrl: 'cronologia.component.html',
  styleUrls: ['./cronologia.component.css'],
})
export class CalendarDialogComponent implements OnInit {
  IntervaloDeDatas!: FormGroup;
  OpcoesCategorias!: FormGroup;
  OpcoesMedicos!: FormGroup;
  EspecialidadeMedicas = EspecialidadeMedicas;
  ListaMedicos: Medico[] = [];

  disableSelect: FormControl = new FormControl(false);

  constructor(
    public dialogRef: MatDialogRef<CalendarDialogComponent>,
    private MedicosService: MedicosService,
    private formBuilder: FormBuilder,
    private CronologiaService: CronologiaService,
    private ConsultaService: ConsultaService
  ) { }

  ngOnInit() {
    this.MedicosService.buscarPorTodosOsMedicos().subscribe((dados) => {
      this.ListaMedicos = dados;

    });

    this.IntervaloDeDatas = this.formBuilder.group({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    });

    this.OpcoesCategorias = this.formBuilder.group({
      Especialidade: new FormControl(null),
    });
    this.OpcoesMedicos = this.formBuilder.group({
      NomeMedico: new FormControl(null),
    });
  }


  PesquisaPorIntervaloDeDatas(dataInicio: Date, dataFim: Date) {

    if (dataInicio && dataFim) {
      const DataInicioFormatada = dataInicio.toISOString().split('T')[0];
      const DataFimFormatada = dataFim.toISOString().split('T')[0];

      this.CronologiaService.BuscandoTodasConsultasEmIntervaloDeDatas(DataInicioFormatada, DataFimFormatada).subscribe((dados) => {

        if (Object.keys(dados).length > 0) {
          this.ConsultaService.PassarDadosParaCronologiaDoDia(dados);
        } else {
          Swal.fire('Erro', 'Erro ao filtrar parametros na tabela.', 'error');
        }
      },
        (error) => {
          Swal.fire('Erro', 'Erro ao filtrar parametros na tabela.', 'error');
        }
      );
    }
  }

  PesquisaPorIntervaloDeDatasMaisEspecialidade(dataInicio: Date, dataFim: Date, especialidades: any) {
    if (dataInicio && dataFim && especialidades) {
      const DataInicioFormatada = dataInicio.toISOString().split('T')[0];
      const DataFimFormatada = dataFim.toISOString().split('T')[0];
      this.CronologiaService.BuscandoTodasConsultasEmIntervaloDeDatasComEspecialidade(DataInicioFormatada, DataFimFormatada, especialidades).subscribe((dados) => {
        if (Object.keys(dados).length > 0) {
          this.ConsultaService.PassarDadosParaCronologiaDoDia(dados);
        } else {
          Swal.fire('Erro', 'Erro ao filtrar parametros na tabela.', 'error');
        }
      },
        (error) => {
          Swal.fire('Erro', 'Erro ao filtrar parametros na tabela.', 'error');
        }
      );
    }
  }



  PesquisaPorMedico(medico: any) {
    if (medico) {
      this.CronologiaService.BuscandoTodasConsultasPorMedico(medico.medCodigo).subscribe((dados) => {
        if (Object.keys(dados).length > 0) {
          this.ConsultaService.PassarDadosParaCronologiaDoDia(dados);
        } else {
          Swal.fire('Erro', 'Erro ao filtrar parametros na tabela.', 'error');
        }
      },
        (error) => {
          Swal.fire('Erro', 'Erro ao filtrar parametros na tabela.', 'error');
        }
      );
    }
  }


  PesquisarMedicoEmUmIntervaloDeDatas(medico: any, dataInicio: Date, dataFim: Date) {

    if (medico && dataInicio && dataFim) {
      const DataInicioFormatada = dataInicio.toISOString().split('T')[0];
      const DataFimFormatada = dataFim.toISOString().split('T')[0];
      this.CronologiaService.BuscandoTodasConsultasPorMedicoEmIntervaloDeDatas(medico.medCodigo, DataInicioFormatada, DataFimFormatada).subscribe((dados) => {
        if (Object.keys(dados).length > 0) {
          this.ConsultaService.PassarDadosParaCronologiaDoDia(dados);
        } else {
          Swal.fire('Erro', 'Erro ao filtrar parametros na tabela.', 'error');
        }
      },
        (error) => {
          Swal.fire('Erro', 'Erro ao filtrar parametros na tabela.', 'error');
        }
      );
    }
  }





  PesquisaPorEspecialidade(especialidades: any) {
    if (especialidades) {
      this.CronologiaService.BuscandoTodasConsultasPorEspecialidade(especialidades).subscribe((dados) => {
        if (Object.keys(dados).length > 0) {
          this.ConsultaService.PassarDadosParaCronologiaDoDia(dados);
        } else {
          Swal.fire('Erro', 'Erro ao filtrar parametros na tabela.', 'error');
        }
      },
        (error) => {
          Swal.fire('Erro', 'Erro ao filtrar parametros na tabela.', 'error');
        }
      );
    }
  }

  VerificaTipoDePesquisa() {
    const medico = this.OpcoesMedicos.get('NomeMedico')?.value;
    const especialidades = this.OpcoesCategorias.get('Especialidade')?.value;
    const dataInicio: Date | null = this.IntervaloDeDatas.get('start')?.value;
    const dataFim: Date | null = this.IntervaloDeDatas.get('end')?.value;
    if (especialidades && dataInicio && dataFim) {// busca por intervalo de datas e especialidade
      this.PesquisaPorIntervaloDeDatasMaisEspecialidade(
        dataInicio,
        dataFim,
        especialidades
      );
    }
    if (dataInicio && dataFim && !especialidades) {// busca por intervalo de datas
      this.PesquisaPorIntervaloDeDatas(dataInicio, dataFim);
    }
    if (medico) { // busca por medico
      this.PesquisaPorMedico(medico);
    }
    if (especialidades) {// busca por especialidade
      this.PesquisaPorEspecialidade(especialidades);
    }
    if (medico && dataInicio && dataFim) { // busca por medico e intervalo de datas
      this.PesquisarMedicoEmUmIntervaloDeDatas(medico, dataInicio, dataFim);
    }
  }
}
