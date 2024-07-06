import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
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

  constructor(private graficoAgendamentoDiaService: GraficoAgendamentoDiaService) {}

  ngOnInit() {
    this.graficoAgendamentoDiaService.BuscatodasAsConsultas().subscribe((dados) => {
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
      const datasContadas = this.contarConsultasPorData();
      const labels = datasContadas.map(data => data.data);
      const quantidadeConsultas = datasContadas.map(data => data.quantidade);

      this.chart = new Chart(this.elemento.nativeElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Agendamentos por Dia',
            data: quantidadeConsultas,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          }],
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
    this.DatasConsultas.forEach(data => {
      counts[data] = counts[data] ? counts[data] + 1 : 1;
    });
    return Object.keys(counts).map(data => ({ data, quantidade: counts[data] }));
  }
}
