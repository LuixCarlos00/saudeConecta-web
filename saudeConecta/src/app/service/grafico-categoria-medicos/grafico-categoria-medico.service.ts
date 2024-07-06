import {   Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tokenService } from 'src/app/util/Token/Token.service';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';

@Injectable({
  providedIn: 'root'
})
export class GraficoCategoriaMedicoService {

  private apiUrl = 'http://localhost:8080';


  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService
  ) {}


  BuscatodososMedicos(): Observable<Medico[]> {
    const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
    const options = { headers, withCredentials: true };
    return this.http.get<Medico[]>(`${this.apiUrl}/medico/listatodosmedicos`, options);
  }


}
