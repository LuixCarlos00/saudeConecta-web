import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProntuarioService } from 'src/app/service/MEDICO-prontuario/prontuario.service';
import { Prontuario } from 'src/app/util/variados/interfaces/Prontuario/Prontuario';

@Component({
  selector: 'app-anamnese-conduta',
  templateUrl: './anamnese-conduta.component.html',
  styleUrls: ['./anamnese-conduta.component.css'],
})
export class AnamneseCondutaComponent implements OnInit {
  @Output() mudarAba = new EventEmitter<number>();
  Conduta: string = '';
  Anamnese: string = '';



  constructor(private ProntuarioService: ProntuarioService) {}

  ngOnInit() {


  }

  Proximo() {
    const prontuario: Prontuario = {
      prontCondulta: this.Conduta,
      prontAnamnese: this.Anamnese,
    };
    this.ProntuarioService.chageAnamneseConduta(prontuario);

    this.mudarAba.emit(2);
  }
}
