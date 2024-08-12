import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tokenService } from 'src/app/util/Token/Token.service';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { Prontuario } from 'src/app/util/variados/interfaces/Prontuario/Prontuario';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';

@Injectable({
  providedIn: 'root'
})
export class ProntuarioService {





  private apiUrl = '';
  private Token = this.tokenService.retornaToken();


  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService,
    private apiUrl_Global : ApiUrlService
  ) {
   this.apiUrl = this.apiUrl_Global.getUrl()
  }

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

private ObjetoConsultaSubjet = new BehaviorSubject<Consulta>({} as Consulta);
ObjetoConsulta$ = this.ObjetoConsultaSubjet.asObservable();





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

changeObjetoConsulta(element: any) {
this.ObjetoConsultaSubjet.next(element);
}



cadastraProntuario(Prontuario: Prontuario) {
  const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.Token}`, };
  const options = { headers, withCredentials: true };
  return this.http.post<Prontuario>( `${this.apiUrl}/prontuario/Post`, Prontuario, options);
}

BuscarPorProntuarioPassadoIdDeConsultaStatus(value: any) {
  const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.Token}`, };
  const options = { headers, withCredentials: true };
  return this.http.get<Prontuario>( `${this.apiUrl}/prontuario/BuscarPorProntuarioPassadoIdDeConsultaStatus/${value}`, options);
}



}
