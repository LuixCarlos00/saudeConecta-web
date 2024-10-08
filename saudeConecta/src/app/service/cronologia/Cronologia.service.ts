import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tokenService } from 'src/app/util/Token/Token.service';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CronologiaService {



  private apiUrl = '';


  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService,
    private apiUrl_Global : ApiUrlService
  ) {
   this.apiUrl = this.apiUrl_Global.getUrl()

  }

BuscandoTodasConsultasEmIntervaloDeDatas(DataInicio: string, DataFim: string) {
  const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
  const options = { headers, withCredentials: true };
  return this.http.get<Consulta[]>(`${this.apiUrl}/consulta/BuscandoTodasConsultasEmIntervaloDeDatas/dataInicial=${DataInicio}&dataFinal=${DataFim}`, options);
}


BuscandoTodasConsultasEmIntervaloDeDatasComEspecialidade(DataInicioFormatada: string, DataFimFormatada: string, especialidades: any) {
  const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
  const options = { headers, withCredentials: true };
  return this.http.get<Consulta[]>(`${this.apiUrl}/consulta/BuscandoTodasConsultasEmIntervaloDeDatasComEspecialidade/dataInicial=${DataInicioFormatada}&dataFinal=${DataFimFormatada}&especialidades=${especialidades}`, options);
}


BuscandoTodasConsultasPorMedico(medico: any) {
  const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
  const options = { headers, withCredentials: true };
  return this.http.get<Consulta[]>(`${this.apiUrl}/consulta/BuscandoTodasConsultasPorMedico/${medico}`, options);
}


BuscandoTodasConsultasPorMedicoEmIntervaloDeDatas(medCodigo: any, DataInicioFormatada: string, DataFimFormatada: string) {
  const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
  const options = { headers, withCredentials: true };
  return this.http.get<Consulta[]>(`${this.apiUrl}/consulta/BuscandoTodasConsultasPorMedicoEmIntervaloDeDatas/medico=${medCodigo}&dataInicial=${DataInicioFormatada}&dataFinal=${DataFimFormatada}`, options);
}

BuscandoTodasConsultasPorEspecialidade(especialidades: any) {
  const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
  const options = { headers, withCredentials: true };
  return this.http.get<Consulta[]>(`${this.apiUrl}/consulta/BuscandoTodasConsultasPorEspecialidade/especialidades=${especialidades}`, options);
}

}
