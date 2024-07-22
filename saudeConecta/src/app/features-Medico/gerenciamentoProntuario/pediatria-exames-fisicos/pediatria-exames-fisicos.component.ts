import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pediatria-exames-fisicos',
  templateUrl: './pediatria-exames-fisicos.component.html',
  styleUrls: ['./pediatria-exames-fisicos.component.css'],
})
export class PediatriaExamesFisicosComponent implements OnInit {
  peso: string = '';
  altura: string = '';
  Temperatura: string = '';
  DataNacimento: string = '';
  Sexo: string = '';
  Saturacao: string = '';
  Hemoglobinacao: string = '';
  FreqRespiratoria: string = '';
  FreqCardiaca: string = '';
  PressArterial: string = '';
  FreqArterialSistolica: string = '';
  observacao: string = '';
  FreqArterialDiastolica: string = '';

  constructor() {}

  ngOnInit() {}

  Proximo() {
    console.log(this.observacao, 'Observacao');
    console.log(this.Saturacao, 'saturacao');
    console.log(this.Hemoglobinacao, 'hemoglobina');
    console.log(this.FreqRespiratoria, 'FreqRespiratoria');
    console.log(this.FreqCardiaca, 'FreqCardiaca');
    console.log(this.PressArterial, 'PressArterial');
    console.log(this.FreqArterialSistolica, 'FreqArterialSistolica');
    console.log(this.FreqArterialDiastolica, 'FreqArterialDiastolica');
    console.log(this.peso, 'peso');
    console.log(this.altura, 'altura');
    console.log(this.Temperatura, 'temperatura');
    console.log(this.DataNacimento, 'DataNacimento');
    console.log(this.Sexo, 'Sexo');



  }
}
