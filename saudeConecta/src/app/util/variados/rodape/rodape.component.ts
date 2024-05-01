import { Component, OnInit } from '@angular/core';
import { PacienteService } from 'src/app/service/paciente_service/paciente.service';


@Component({
  selector: 'app-rodape',
  templateUrl: './rodape.component.html',
  styleUrls: ['./rodape.component.css']
})
export class RodapeComponent implements OnInit {

  constructor(public pacienteService: PacienteService) { }

  ngOnInit() {
  }



  estaLogado(): Boolean {
    if (this.pacienteService.verificarLogin() ) {
      return true;
    }else{
      return false;
    }

  }
}
