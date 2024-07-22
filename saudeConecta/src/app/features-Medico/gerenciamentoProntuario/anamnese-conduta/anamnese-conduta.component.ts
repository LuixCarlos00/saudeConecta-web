import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-anamnese-conduta',
  templateUrl: './anamnese-conduta.component.html',
  styleUrls: ['./anamnese-conduta.component.css'],
})
export class AnamneseCondutaComponent implements OnInit {
  Conduta: string = '';
  Anamnese: string = '';



  constructor() {}

  ngOnInit() {}

  Proximo() {
    console.log(this.Conduta,'Conduta', this.Anamnese,'Anamnese');


  }
}
