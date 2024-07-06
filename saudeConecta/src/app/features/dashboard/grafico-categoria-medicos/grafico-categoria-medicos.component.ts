import { GraficoCategoriaMedicoService } from './../../../service/grafico-categoria-medicos/grafico-categoria-medico.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';

@Component({
  selector: 'app-grafico-categoria-medicos',
  templateUrl: './grafico-categoria-medicos.component.html',
  styleUrls: ['./grafico-categoria-medicos.component.css']
})
export class GraficoCategoriaMedicosComponent implements OnInit {

  QuantidadeDeCategorias: number = 0;
  CategoriasMedicos: string[] = [];
  TodosMedicos: any[] = [];
  totalMedicos: number = 0;
  chart: any | undefined;

  @ViewChild("menuCanvas", { static: true }) elemento: ElementRef | undefined;

  constructor(private GraficoCategoriaMedicoService: GraficoCategoriaMedicoService) { }

  ngOnInit() {
    this.GraficoCategoriaMedicoService.BuscatodososMedicos().subscribe((dados) => {
      this.TodosMedicos = dados;
      this.totalMedicos = this.TodosMedicos.length;
      this.apurandoDados();
      this.criarGrafico();
    });
  }

  apurandoDados() {
    this.TodosMedicos.forEach((medico) => {
      if (!this.CategoriasMedicos.includes(medico.medEspecialidade.toString())) {
        this.CategoriasMedicos.push(medico.medEspecialidade.toString());
      }
    });
  }

  criarGrafico() {
    if (this.elemento) {
      const labels = this.CategoriasMedicos.map(categoria => {
        const quantidade = this.TodosMedicos.filter(medico => medico.medEspecialidade.toString() === categoria).length;
        return `${categoria} (${quantidade})`;
      });

      const data = this.CategoriasMedicos.map(categoria => {
        return this.TodosMedicos.filter(medico => medico.medEspecialidade.toString() === categoria).length;
      });

      this.chart = new Chart(this.elemento.nativeElement, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            label: 'Médicos por Categoria',
            data: data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem: any) {
                  return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(0);
                }
              }
            }
          }
        }
      });
    }
  }
}
