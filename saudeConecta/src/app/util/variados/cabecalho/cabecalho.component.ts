import { Component, OnInit } from '@angular/core';
import { PacienteService } from 'src/app/service/paciente_service/paciente.service';

@Component({
  selector: 'app-cabecalho',
  templateUrl: './cabecalho.component.html',
  styleUrls: ['./cabecalho.component.css']
})
export class CabecalhoComponent implements OnInit {

  constructor(public pacienteService: PacienteService) { }

  ngOnInit() {
  }

}
