import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProntuarioService } from 'src/app/service/MEDICO-prontuario/prontuario.service';
import { Prontuario } from 'src/app/util/variados/interfaces/Prontuario/Prontuario';

@Component({
  selector: 'app-queixa-principal',
  templateUrl: './queixa-principal.component.html',
  styleUrls: ['./queixa-principal.component.css'],
})
export class QueixaPrincipalComponent implements OnInit {
  @Output() mudarAba = new EventEmitter<number>();

  QueixaPrincipal: string = '';
  constructor(private ProntuarioService: ProntuarioService) {}

  ngOnInit() {}

  Proximo() {
    const prontuario: Prontuario = {
         prontQueixaPricipal: this.QueixaPrincipal,
    };
    this.ProntuarioService.chageQueixaPrincipal(prontuario);

    this.mudarAba.emit(3);
  }
}
