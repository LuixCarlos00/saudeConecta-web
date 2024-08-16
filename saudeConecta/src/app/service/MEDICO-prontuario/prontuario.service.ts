import { Consulta } from './../../util/variados/interfaces/consulta/consulta';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tokenService } from 'src/app/util/Token/Token.service';
 import { Prontuario } from 'src/app/util/variados/interfaces/Prontuario/Prontuario';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';

@Injectable({
  providedIn: 'root',
})
export class ProntuarioService {

  private apiUrl = '';
  private Token = this.tokenService.retornaToken();

  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService,
    private apiUrl_Global: ApiUrlService
  ) {
    this.apiUrl = this.apiUrl_Global.getUrl();
  }




  private PediatriaExamesFisicoSubjet = new BehaviorSubject<Prontuario>( {} as Prontuario);
  PediatriaExamesFisicos$ = this.PediatriaExamesFisicoSubjet.asObservable();

  private DiagnosticoSubjet = new BehaviorSubject<Prontuario>({} as Prontuario);
  Diagnostico$ = this.DiagnosticoSubjet.asObservable();

  private PrescricaoSubjet = new BehaviorSubject<Prontuario>({} as Prontuario);
  Prescricao$ = this.PrescricaoSubjet.asObservable();




  private ConsultaSubjet = new BehaviorSubject<Prontuario>({} as Prontuario);
  Consulta$ = this.ConsultaSubjet.asObservable();


















  chagePediatriaExamesFisicos(prontuario: Prontuario) {    /// 1
    this.PediatriaExamesFisicoSubjet.next(prontuario);
  }

  chageDiagnostico(prontuario: Prontuario) {    ///4
    this.DiagnosticoSubjet.next(prontuario);
  }

  chagePrescricao(prontuario: Prontuario) {   ///4
    this.PrescricaoSubjet.next(prontuario);
  }


  changeConsulta(element: any) {
     this.ConsultaSubjet.next(element)
  }







  cadastraProntuario(Prontuario: Prontuario) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    };
    const options = { headers, withCredentials: true };
    return this.http.post<Prontuario>(
      `${this.apiUrl}/prontuario/Post`,
      Prontuario,
      options
    );
  }

  BuscarPorProntuarioPassadoIdDeConsultaStatus(value: any) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    };
    const options = { headers, withCredentials: true };
    return this.http.get<Prontuario>(
      `${this.apiUrl}/prontuario/BuscarPorProntuarioPassadoIdDeConsultaStatus/${value}`,
      options
    );
  }
}
