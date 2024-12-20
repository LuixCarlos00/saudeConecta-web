import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Chart } from 'chart.js';
import { da } from 'date-fns/locale';
import { GraficoAgendamentoDiaService } from 'src/app/service/grafico-agendmentos-dia/grafico-agendamento-dia.service';

@Component({
  selector: 'app-grafico-agendamentos-dias-semanas-mes',
  templateUrl: './grafico-agendamentos-dias-semanas-mes.component.html',
  styleUrls: ['./grafico-agendamentos-dias-semanas-mes.component.css'],
})
export class GraficoAgendamentosDiasSemanasMesComponent implements OnInit {
  DatasConsultas: string[] = [];
  TodasConsultas: any[] = [];

  @ViewChild('menuCanvas', { static: true }) elemento: ElementRef | undefined;
  chart: any;
  diaSelecionado = 1;
  IntervaloDeDatas!: FormGroup;

  constructor(
    private graficoAgendamentoDiaService: GraficoAgendamentoDiaService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.IntervaloDeDatas = this.formBuilder.group({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    });

    this.fetchConsultas(this.diaSelecionado);
  }

  fetchConsultas(data: number) {
    let paramentrosBusca: string = '';
    const dateHoje = new Date();
    const date = new Date();

    if (data == 1) {
      date.setDate(date.getDate() - 7);
      paramentrosBusca = date.toISOString().split('T')[0];
    }
    if (data == 2) {
      date.setDate(date.getDate() - 30);
      paramentrosBusca = date.toISOString().split('T')[0];
    }
    if (data == 3) {
      date.setDate(date.getDate() - 60);
      paramentrosBusca = date.toISOString().split('T')[0];
    }

    this.graficoAgendamentoDiaService
      .BuscandoTodasConsultasEmIntervaloDeDatas(
        paramentrosBusca,
        dateHoje.toISOString().split('T')[0].toString()
      )
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

    this.graficoAgendamentoDiaService
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
    // Limpa o array de datas antes de adicionar novas
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

      const datasContadas = this.contarConsultasPorData();
      const labels = datasContadas.map((data) => data.data);
      const quantidadeConsultas = datasContadas.map((data) => data.quantidade);

      this.chart = new Chart(this.elemento.nativeElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Agendamentos por Dia',
              data: quantidadeConsultas,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
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
                text: 'Data das Consultas',
              },
            },
          },
        },
      });
    }
  }

  contarConsultasPorData(): any[] {
    const counts: { [data: string]: number } = {};
    this.DatasConsultas.forEach((data) => {
      counts[data] = counts[data] ? counts[data] + 1 : 1;
    });
    return Object.keys(counts).map((data) => ({
      data,
      quantidade: counts[data],
    }));
  }

  atualizarGrafico() {
    this.fetchConsultas(this.diaSelecionado);
  }
  atualizarGraficoPersonalizado() {
    this.fetchConsultasPersonalizadas();
  }
}
