import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tokenService } from 'src/app/util/Token/Token.service';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {

  private apiUrl = '';


  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService,
    private apiUrl_Global : ApiUrlService
  ) {
   this.apiUrl = this.apiUrl_Global.getUrl()
  }


  BuscandoHistoricoDoPaciente(codigoID: number) {
    const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
    const options = { headers, withCredentials: true };
    return this.http.get<any[]>(`${this.apiUrl}/prontuario/BuscandoHistoricoDoPaciente/${codigoID}`, options);
  }

}
