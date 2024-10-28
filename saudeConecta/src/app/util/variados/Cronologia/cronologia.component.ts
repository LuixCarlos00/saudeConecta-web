import { MedicosService } from './../../../service/medicos/medicos.service';
import { CronologiaService } from './../../../service/cronologia/Cronologia.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../dialogo-confirmação/dialog.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EspecialidadeMedicas } from '../options/options';
import { ConsultaService } from 'src/app/service/consulta/consulta.service';
import { Medico } from '../interfaces/medico/medico';

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

      this.CronologiaService.BuscandoTodasConsultasEmIntervaloDeDatas(
        DataInicioFormatada,
        DataFimFormatada
      ).subscribe((dados) => {
        this.ConsultaService.PassarDadosParaCronologiaDoDia(null);

        this.ConsultaService.PassarDadosParaCronologiaDoDia(dados);
      });
    }
  }

  PesquisaPorIntervaloDeDatasMaisEspecialidade(
    dataInicio: Date,
    dataFim: Date,
    especialidades: any
  ) {
    if (dataInicio && dataFim && especialidades) {
      const DataInicioFormatada = dataInicio.toISOString().split('T')[0];
      const DataFimFormatada = dataFim.toISOString().split('T')[0];
      this.CronologiaService.BuscandoTodasConsultasEmIntervaloDeDatasComEspecialidade(
        DataInicioFormatada,
        DataFimFormatada,
        especialidades
      ).subscribe((dados) => {
        this.ConsultaService.PassarDadosParaCronologiaDoDia(null);

        this.ConsultaService.PassarDadosParaCronologiaDoDia(dados);
      });
    }
  }

  PesquisaPorMedico(medico: any) {
    if (medico) {
      this.CronologiaService.BuscandoTodasConsultasPorMedico(
        medico.medCodigo
      ).subscribe((dados) => {
        this.ConsultaService.PassarDadosParaCronologiaDoDia(null);

        this.ConsultaService.PassarDadosParaCronologiaDoDia(dados);
      });
    }
  }

  PesquisarMedicoEmUmIntervaloDeDatas(
    medico: any,
    dataInicio: Date,
    dataFim: Date
  ) {
    if (medico && dataInicio && dataFim) {
      const DataInicioFormatada = dataInicio.toISOString().split('T')[0];
      const DataFimFormatada = dataFim.toISOString().split('T')[0];
      this.CronologiaService.BuscandoTodasConsultasPorMedicoEmIntervaloDeDatas(
        medico.medCodigo,
        DataInicioFormatada,
        DataFimFormatada
      ).subscribe((dados) => {
        this.ConsultaService.PassarDadosParaCronologiaDoDia(null);
        this.ConsultaService.PassarDadosParaCronologiaDoDia(dados);
      });
    }
  }

  PesquisaPorEspecialidade(especialidades: any) {
    if (especialidades) {
      this.CronologiaService.BuscandoTodasConsultasPorEspecialidade(
        especialidades
      ).subscribe((dados) => {
        this.ConsultaService.PassarDadosParaCronologiaDoDia(null);

        this.ConsultaService.PassarDadosParaCronologiaDoDia(dados);
      });
    }
  }

  VerificaTipoDePesquisa() {
    const medico = this.OpcoesMedicos.get('NomeMedico')?.value;
    const especialidades = this.OpcoesCategorias.get('Especialidade')?.value;
    const dataInicio: Date | null = this.IntervaloDeDatas.get('start')?.value;
    const dataFim: Date | null = this.IntervaloDeDatas.get('end')?.value;

    if (especialidades && dataInicio && dataFim) {
      this.PesquisaPorIntervaloDeDatasMaisEspecialidade(
        dataInicio,
        dataFim,
        especialidades
      );
    }
    if (dataInicio && dataFim && !especialidades) {
      this.PesquisaPorIntervaloDeDatas(dataInicio, dataFim);
    }
    if (medico) {
      this.PesquisaPorMedico(medico);
    }
    if (especialidades) {
      this.PesquisaPorEspecialidade(especialidades);
    }
    if (medico && dataInicio && dataFim) {
      this.PesquisarMedicoEmUmIntervaloDeDatas(medico, dataInicio, dataFim);
    }
  }
}
