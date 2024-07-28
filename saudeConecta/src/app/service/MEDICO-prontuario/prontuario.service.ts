import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Prontuario } from 'src/app/util/variados/interfaces/Prontuario/Prontuario';

@Injectable({
  providedIn: 'root'
})
export class ProntuarioService {





private PediatriaExamesFisicoSubjet = new BehaviorSubject<Prontuario>({} as Prontuario);
PediatriaExamesFisicos$ = this.PediatriaExamesFisicoSubjet.asObservable();

private AnamneseCondutaSubjet = new BehaviorSubject<Prontuario>({} as Prontuario);
AnamneseCondutas$ = this.AnamneseCondutaSubjet.asObservable();

private QueixaPrincipalSubjet = new BehaviorSubject<Prontuario>({} as Prontuario);
QueixaPrincipal$ = this.QueixaPrincipalSubjet.asObservable();

private DiagnosticoSubjet = new BehaviorSubject<Prontuario>({} as Prontuario);
Diagnostico$ = this.DiagnosticoSubjet.asObservable();

private  SolicitacaoExameSubjet = new BehaviorSubject<Prontuario>({} as Prontuario);
SolicitacaoExame$ = this.SolicitacaoExameSubjet.asObservable();

constructor() { }




changeCriandoObjProntuario(){


}


chagePediatriaExamesFisicos(prontuario: Prontuario) {/// 1
 this.PediatriaExamesFisicoSubjet.next(prontuario);
}
chageAnamneseConduta(prontuario: Prontuario) {///2
 this.AnamneseCondutaSubjet.next(prontuario);
}
chageQueixaPrincipal(prontuario: Prontuario) {///3
 this.QueixaPrincipalSubjet.next(prontuario);
}
 chageDiagnostico(prontuario: Prontuario) { ///4
  this.DiagnosticoSubjet.next(prontuario);
}
chageSolicitacaoExame(prontuario: Prontuario) {
 this.SolicitacaoExameSubjet.next(prontuario);
}
}
