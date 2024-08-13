import { Injectable } from '@angular/core';
import { tokenService } from 'src/app/util/Token/Token.service';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabelaAgendaMedicoService {



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


  BuscarTodaAgendaDeMedicoDoDia(IdUsuarioMedico: number ): Observable<any[]> {
    const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.Token}`, };
    const options = { headers, withCredentials: true };
    return this.http.get<any[]>( `${this.apiUrl}/consulta/BuscarTodaAgendaDeMedico/${IdUsuarioMedico}`, options);
  }




}
