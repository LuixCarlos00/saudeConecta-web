import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GerenciamentoService {

  private medicoEscolhidoSource = new BehaviorSubject<any>(null);
  medicoEscolhido$ = this.medicoEscolhidoSource.asObservable();


  private pacienteEscolhidoSource = new BehaviorSubject<any>(null);
  pacienteEscolhido$ = this.pacienteEscolhidoSource.asObservable();




  constructor() {}

  setMedicoEscolhido(medico: any) {
    this.medicoEscolhidoSource.next(medico);
  }

  setPacienteEscolhido(paciente: any) {
    this.pacienteEscolhidoSource.next(paciente);
  }
}
