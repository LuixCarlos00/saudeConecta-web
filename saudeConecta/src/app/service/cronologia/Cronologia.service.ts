import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tokenService } from 'src/app/util/Token/Token.service';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';
import { HttpClient } from '@angular/common/http';
import { ConsultaService } from '../consulta/consulta.service';
import { ConsultaStatus } from 'src/app/util/variados/interfaces/consultaStatus/consultaStatus';

@Injectable({
  providedIn: 'root'
})
export class CronologiaService {



  private apiUrl = '';


  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService,
    private apiUrl_Global: ApiUrlService
  ) {
    this.apiUrl = this.apiUrl_Global.getUrl()

  }

  BuscandoTodasConsultasEmIntervaloDeDatas(DataInicio: string, DataFim: string) {
    return this.http.get<Consulta[]>(`${this.apiUrl}/consulta/BuscandoTodasConsultasEmIntervaloDeDatas/dataInicial=${DataInicio}&dataFinal=${DataFim}`);
  }
  BuscandoTodasConsultasEmIntervaloDeDatasComEspecialidade(DataInicioFormatada: string, DataFimFormatada: string, especialidades: any) {
    return this.http.get<Consulta[]>(`${this.apiUrl}/consulta/BuscandoTodasConsultasEmIntervaloDeDatasComEspecialidade/dataInicial=${DataInicioFormatada}&dataFinal=${DataFimFormatada}&especialidades=${especialidades}`);
  }
  BuscandoTodasConsultasPorMedico(medico: any) {
    return this.http.get<Consulta[]>(`${this.apiUrl}/consulta/BuscandoTodasConsultasPorMedico/${medico}`);
  }
  BuscandoTodasConsultasPorMedicoEmIntervaloDeDatas(medCodigo: any, DataInicioFormatada: string, DataFimFormatada: string) {
    return this.http.get<Consulta[]>(`${this.apiUrl}/consulta/BuscandoTodasConsultasPorMedicoEmIntervaloDeDatas/medico=${medCodigo}&dataInicial=${DataInicioFormatada}&dataFinal=${DataFimFormatada}`);
  }
  BuscandoTodasConsultasPorEspecialidade(especialidades: any) {
    return this.http.get<Consulta[]>(`${this.apiUrl}/consulta/BuscandoTodasConsultasPorEspecialidade/especialidades=${especialidades}`);
  }



  BuscandoTodasConsultas_CONCLUIDADAS_EmIntervaloDeDatas(DataInicio: string, DataFim: string) {
    return this.http.get<ConsultaStatus[]>(`${this.apiUrl}/consultaStatus/BuscandoTodasConsultas_CONCLUIDADAS_EmIntervaloDeDatas/dataInicial=${DataInicio}&dataFinal=${DataFim}`);
  }
  BuscandoTodasConsultas_Concluidas_EmIntervaloDeDatasComEspecialidade(DataInicioFormatada: string, DataFimFormatada: string, especialidades: any) {
    return this.http.get<Consulta[]>(`${this.apiUrl}/consultaStatus/BuscandoTodasConsultas_Concluidas_EmIntervaloDeDatasComEspecialidade/dataInicial=${DataInicioFormatada}&dataFinal=${DataFimFormatada}&especialidades=${especialidades}`);
  }



}
