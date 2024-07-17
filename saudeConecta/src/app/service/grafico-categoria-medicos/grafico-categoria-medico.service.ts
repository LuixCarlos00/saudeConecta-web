import {   Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tokenService } from 'src/app/util/Token/Token.service';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';

@Injectable({
  providedIn: 'root'
})
export class GraficoCategoriaMedicoService {

  private apiUrl = '';


  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService,
    private apiUrl_Global : ApiUrlService
  ) {
   this.apiUrl = this.apiUrl_Global.getUrl()}


  BuscatodososMedicos(): Observable<Medico[]> {
    const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
    const options = { headers, withCredentials: true };
    return this.http.get<Medico[]>(`${this.apiUrl}/medico/listatodosmedicos`, options);
  }


}
