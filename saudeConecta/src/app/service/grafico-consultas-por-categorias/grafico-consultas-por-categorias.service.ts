import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tokenService } from 'src/app/util/Token/Token.service';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';

@Injectable({
  providedIn: 'root'
})
export class GraficoConsultasPorCategoriasService {



private apiUrl = '';


constructor(
  private router: Router,
  private http: HttpClient,
  private tokenService: tokenService,
  private apiUrl_Global : ApiUrlService
) {
 this.apiUrl = this.apiUrl_Global.getUrl()

}


BuscatodasAsConsultas(): Observable<Consulta[]> {
  const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
  const options = { headers, withCredentials: true };
  return this.http.get<Consulta[]>(`${this.apiUrl}/consulta/listatodasConsulta`, options);
}

// BuscatodasAsConsultasPorDataSelecionada(paramentrosBusca : string): Observable<Consulta[]> {
//   const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
//   const options = { headers, withCredentials: true };
//   return this.http.get<Consulta[]>(`${this.apiUrl}/consulta/listatodasConsultaPorDataSelecionada/data=${paramentrosBusca}`, options);
// }


BuscandoTodasConsultasEmIntervaloDeDatas(DataInicio: string, DataFim: string) {
  const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
  const options = { headers, withCredentials: true };
  return this.http.get<Consulta[]>(`${this.apiUrl}/consulta/BuscandoTodasConsultasEmIntervaloDeDatas/dataInicial=${DataInicio}&dataFinal=${DataFim}`, options);
}

}
