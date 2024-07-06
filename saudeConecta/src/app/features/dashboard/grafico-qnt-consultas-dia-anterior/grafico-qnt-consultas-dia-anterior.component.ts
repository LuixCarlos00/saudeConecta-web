
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, CategoryScale, LinearScale } from 'chart.js';

@Component({
  selector: 'app-grafico-qnt-consultas-dia-anterior',
  templateUrl: './grafico-qnt-consultas-dia-anterior.component.html',
  styleUrls: ['./grafico-qnt-consultas-dia-anterior.component.css']
})
export class GraficoQntConsultasDiaAnteriorComponent implements OnInit {

  @ViewChild("menuCanvas", { static: true }) elemento: ElementRef | undefined;

  constructor() { }

  ngOnInit() {
    if (this.elemento) {
      new Chart(this.elemento.nativeElement, {
        type: 'line',
        data: {
          labels: ['Data Anterior'],
          datasets: [{
            label: 'Consultas Marcadas',
            data: [10], // Número de consultas marcadas no dia anterior
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
}
