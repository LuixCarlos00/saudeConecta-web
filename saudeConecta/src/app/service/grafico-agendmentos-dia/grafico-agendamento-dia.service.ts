import { parentescoOptions } from './../../util/variados/options/options';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tokenService } from 'src/app/util/Token/Token.service';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';

@Injectable({
  providedIn: 'root'
})
export class GraficoAgendamentoDiaService {

  private apiUrl = 'http://localhost:8080';


  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService
  ) {}


  BuscatodasAsConsultas(): Observable<Consulta[]> {
    const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
    const options = { headers, withCredentials: true };
    return this.http.get<Consulta[]>(`${this.apiUrl}/consulta/listatodasConsulta`, options);
  }

  BuscatodasAsConsultasPorDataSelecionada(paramentrosBusca : string): Observable<Consulta[]> {
    const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
    const options = { headers, withCredentials: true };
    return this.http.get<Consulta[]>(`${this.apiUrl}/consulta/listatodasConsultaPorDataSelecionada/data=${paramentrosBusca}`, options);
  }


}
