import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { Chart } from 'chart.js';
import { GraficoConsultasPorCategoriasService } from 'src/app/service/grafico-consultas-por-categorias/grafico-consultas-por-categorias.service';

@Component({
  selector: 'app-grafico-qnt-consultas-dia-anterior',
  templateUrl: './grafico-qnt-consultas-dia-anterior.component.html',
  styleUrls: ['./grafico-qnt-consultas-dia-anterior.component.css'],
})
export class GraficoQntConsultasDiaAnteriorComponent implements OnInit {
  @ViewChild('menuCanvas', { static: true }) elemento: ElementRef | undefined;
  chart: any;

  DatasConsultas: string[] = [];
  TodasConsultas: any[] = [];

  diaSelecionado = 1;

  IntervaloDeDatas!: FormGroup;

  constructor(
    private graficoConsultasPorCategoriaService: GraficoConsultasPorCategoriasService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.IntervaloDeDatas = this.formBuilder.group({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    });

    this.fetchConsultasPadronizadas(this.diaSelecionado);
  }

  fetchConsultasPadronizadas(data: number) {
      let paramentrosBusca: string = '';
      const dateHoje = new Date();
      const date = new Date();

      if (data === 1) {
        date.setDate(date.getDate() - 7);
        paramentrosBusca = date.toISOString().split('T')[0];
      }
      if (data === 2) {
        date.setDate(date.getDate() - 30);
        paramentrosBusca = date.toISOString().split('T')[0];
      }
      if (data === 3) {
        date.setDate(date.getDate() - 60);
        paramentrosBusca = date.toISOString().split('T')[0];
      }

      this.graficoConsultasPorCategoriaService.BuscandoTodasConsultasEmIntervaloDeDatas(
       paramentrosBusca ,dateHoje.toISOString().split('T')[0].toString())
        .subscribe((dados) => {
          this.TodasConsultas = [];
          this.TodasConsultas = dados;

          this.apurandoDados();
          this.criarGrafico();
        });

  }

  fetchConsultasPersonalizadas() {
    let dataInicio: Date = this.IntervaloDeDatas?.get('start')?.value;
    let dataFim: Date = this.IntervaloDeDatas?.get('end')?.value;
    this.diaSelecionado = 0;
    const DataFimFormatada = dataFim?.toISOString().split('T')[0];
    const DataInicioFormatada2 = dataInicio?.toISOString().split('T')[0];


    this.graficoConsultasPorCategoriaService
      .BuscandoTodasConsultasEmIntervaloDeDatas(
        DataInicioFormatada2,
        DataFimFormatada
      )
      .subscribe((dados) => {
        this.TodasConsultas = dados;
        this.apurandoDados();
        this.criarGrafico();
      });

  }

  apurandoDados() {
    this.DatasConsultas = [];
    this.TodasConsultas.forEach((consulta) => {
      this.DatasConsultas.push(consulta.conData.toString());
      });
    }

  criarGrafico() {
    if (this.elemento) {
      if (this.chart) {
        this.chart.destroy();
      }

      const dadosPorEspecialidade = this.contarConsultasPorEspecialidade();
      const labels = dadosPorEspecialidade.map((dados) => dados.especialidade);
      const quantidadeConsultas = dadosPorEspecialidade.map(
        (dados) => dados.quantidade
      );

      this.chart = new Chart(this.elemento.nativeElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Consultas por Especialidade Médica',
              data: quantidadeConsultas,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Número de Consultas',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Especialidade Médica',
              },
            },
          },
        },
      });
    }
  }

  contarConsultasPorEspecialidade(): any[] {
    const counts: { [especialidade: string]: number } = {};

    this.TodasConsultas.forEach((consulta) => {
      const especialidade = consulta.conMedico.medEspecialidade;
      if (counts[especialidade]) {
        counts[especialidade]++;
      } else {
        counts[especialidade] = 1;
      }
    });

    return Object.keys(counts).map((especialidade) => ({
      especialidade,
      quantidade: counts[especialidade],
    }));
  }

  atualizarGrafico() {
    this.fetchConsultasPadronizadas(this.diaSelecionado);
  }
  atualizarGraficoPersonalizado() {
    this.fetchConsultasPersonalizadas();
  }
}
