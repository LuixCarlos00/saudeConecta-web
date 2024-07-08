
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, CategoryScale, LinearScale } from 'chart.js';
import { GraficoConsultasPorCategoriasService } from 'src/app/service/grafico-consultas-por-categorias/grafico-consultas-por-categorias.service';

@Component({
  selector: 'app-grafico-qnt-consultas-dia-anterior',
  templateUrl: './grafico-qnt-consultas-dia-anterior.component.html',
  styleUrls: ['./grafico-qnt-consultas-dia-anterior.component.css']
})
export class GraficoQntConsultasDiaAnteriorComponent implements OnInit {
  DatasConsultas: string[] = [];
  TodasConsultas: any[] = [];

  @ViewChild('menuCanvas', { static: true }) elemento: ElementRef | undefined;
  chart: any;
  diaSelecionado = 1;

  constructor(private graficoConsultasPorCategoriaService: GraficoConsultasPorCategoriasService) {}

  ngOnInit() {
  this.fetchConsultas(this.diaSelecionado)
  }



  fetchConsultas(data:number) {
    let paramentrosBusca : string =''
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


     this.graficoConsultasPorCategoriaService.BuscatodasAsConsultasPorDataSelecionada(paramentrosBusca).subscribe((dados) => {
      console.log(dados);

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


      const dadosPorEspecialidade = this.contarConsultasPorEspecialidade();
      const labels = dadosPorEspecialidade.map((dados) => dados.especialidade);
      const quantidadeConsultas = dadosPorEspecialidade.map((dados) => dados.quantidade);

      this.chart = new Chart(this.elemento.nativeElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Consultas por Especialidade Médica',
            data: quantidadeConsultas,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
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

    return Object.keys(counts).map((especialidade) => ({ especialidade, quantidade: counts[especialidade] }));
  }




  contarConsultasPorData(): any[] {
    const counts: { [data: string]: number } = {};
    this.DatasConsultas.forEach(data => {
      counts[data] = counts[data] ? counts[data] + 1 : 1;
    });
    return Object.keys(counts).map(data => ({ data, quantidade: counts[data] }));
  }

  atualizarGrafico() {
    this.fetchConsultas(this.diaSelecionado)
    }
}
