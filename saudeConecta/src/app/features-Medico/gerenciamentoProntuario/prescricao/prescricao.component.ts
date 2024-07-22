import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prescricao',
  templateUrl: './prescricao.component.html',
  styleUrls: ['./prescricao.component.css']
})
export class PrescricaoComponent implements OnInit {
Prescricao: string='';
DataPrescricao: string='';
ModeloPrescricao: string='';
TituloPrescricao: string='';


  constructor() { }

  ngOnInit() {
  }


  Proximo() {
    throw new Error('Method not implemented.');
    }
}
