import { log } from 'node:console';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tokenService } from "src/app/util/Token/Token.service";
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { ConsultaStatus } from 'src/app/util/variados/interfaces/consultaStatus/consultaStatus';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ConsultaStatusService {





  private apiUrl = '';
  private Token = this.tokenService.retornaToken();

  private dadosStatusFiltradosSubject = new BehaviorSubject<string | undefined>('');
  dadosStatusFiltrados$ = this.dadosStatusFiltradosSubject.asObservable();

  private RecarregarStatusTabelaSubject = new BehaviorSubject<Boolean>(false);
  RecarregarStatusTabela$ = this.RecarregarStatusTabelaSubject.asObservable();


  private GeraPdfStatusSubject = new BehaviorSubject<Boolean>(false);
  GeraPDFRegistroTabela$ = this.GeraPdfStatusSubject.asObservable();


  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService,
    private apiUrl_Global: ApiUrlService
  ) {
    this.apiUrl = this.apiUrl_Global.getUrl()
  }




  FiltraDadosTabelaStatusSubject(dados: string) {
    this.dadosStatusFiltradosSubject.next(dados);
  }

  RecarregarDadosTabelaStatusSubject(dados: boolean) {
    this.RecarregarStatusTabelaSubject.next(dados);
  }

  Gera_PDF_DeRegistroDaTabelaSubject(dados: boolean) {
    this.GeraPdfStatusSubject.next(dados);
  }



  BuscarTodosRegistrosDeConsultaStatus(): Observable<ConsultaStatus[]> {
    return this.http.get<ConsultaStatus[]>(`${this.apiUrl}/consultaStatus/Consultapagina`);
  }

  BuscarRegistrosDeConsultaStatusPesquisandoPorTodosOsCampos(Consulta: any) {
    return this.http.get<ConsultaStatus>(`${this.apiUrl}/consultaStatus/Allcampos/medico=${Consulta.ConMedico.medCodigo}&data=${Consulta.ConData}&horario=${Consulta.ConHorario}&paciente=${Consulta.ConPaciente.paciCodigo}&Administrador=${Consulta.ConAdm.admCodigo}&DataCriacao=${Consulta.ConDadaCriacao}`);
  }

  BuscarHistoricoDeAgendaDoMedico(IdUsuarioMedico: number) {
    return this.http.get<any[]>(`${this.apiUrl}/consultaStatus/BuscarHistoricoDeAgendaDoMedico/${IdUsuarioMedico}`);
  }

  BuscarDadosDeAgendaDeTodosOsMedicos() {
    return this.http.get<any[]>(`${this.apiUrl}/consultaStatus/BuscarDadosDeAgendaDeTodosOsMedicos`);
  }




  BuscarDadosDeComoAdmin(dataSource: any, filteredDataSource: any): Promise<any> {
    return new Promise((resolve, reject) => {

      this.BuscarDadosDeAgendaDeTodosOsMedicos().subscribe((dados) => {
        let Consulta: ConsultaStatus[] = [];
        console.log('dados', dados)
        for (let i = 0; i < dados.length; i++) {
          Consulta[i] = {
            conSttCodigoConsulata: dados[i].conSttCodigoConsulata,
            conSttMedico: dados[i].conSttMedico,
            conSttPaciente: dados[i].conSttPaciente,
            conSttDia_semana: dados[i].conSttDia_semana,
            conSttHorario: dados[i].conSttHorario,
            conSttData: dados[i].conSttData,
            conSttObservacao: dados[i].conSttObservacao,
            conSttDataCriacao: dados[i].conSttDataCriacao,
            conSttFormaPagamento: dados[i].conSttFormaPagamento,
            conSttAdm: dados[i].conSttStatus,
            conSttStatus: dados[i].conAdm,
          };
        }

        Consulta.sort((a, b) => {
          const horaA = a.conSttData ? a.conSttData.split('-').map(Number) : [0, 0];
          const horaB = b.conSttData ? b.conSttData.split('-').map(Number) : [0, 0];

          if (horaA[0] !== horaB[0]) {
            return horaA[0] - horaB[0];
          }
          return horaA[1] - horaB[1];
        });


        if (Consulta.length > 0) {
          resolve(Consulta);
        } else {
          Swal.fire(
            'Nenhuma consulta encontrada',
            'Tente novamente',
            'warning'
          );
          Consulta[0] = {
            conSttCodigoConsulata: 0,
            conSttMedico: 0,
            conSttPaciente: 0,
            conSttDia_semana: 'Sem Dados',
            conSttHorario: 'Sem Dados',
            conSttData: 'Sem Dados',
            conSttObservacao: 'Sem Dados',
            conSttDataCriacao: 'Sem Dados',
            conSttFormaPagamento: 0,
            conSttStatus: 0,
            conSttAdm: 0,
          };
          dataSource = [];
          filteredDataSource = [];
          dataSource = Consulta;
          filteredDataSource = Consulta;
          resolve(Consulta);
        }
      },
        (error) => {
          reject(error);
          console.warn('error:', error);
        }
      );
    })
  }









  BuscarDadosDoMedico(id: number, dataSource: ConsultaStatus[], filteredDataSource: any[]): Promise<any[]> {

    return new Promise((resolve, reject) => {

      this.BuscarHistoricoDeAgendaDoMedico(id).subscribe((dados) => {
        let Consulta: ConsultaStatus[] = [];
        for (let i = 0; i < dados.length; i++) {
          Consulta[i] = {
            conSttCodigoConsulata: dados[i].conSttCodigoConsulata,
            conSttMedico: dados[i].conSttMedico,
            conSttPaciente: dados[i].conSttPaciente,
            conSttDia_semana: dados[i].conSttDia_semana,
            conSttHorario: dados[i].conSttHorario,
            conSttData: dados[i].conSttData,
            conSttObservacao: dados[i].conSttObservacao,
            conSttDataCriacao: dados[i].conSttDataCriacao,
            conSttFormaPagamento: dados[i].conSttFormaPagamento,
            conSttAdm: dados[i].conSttStatus,
            conSttStatus: dados[i].conAdm,
          };
        }

        Consulta.sort((a, b) => {
          const horaA = a.conSttData ? a.conSttData.split('-').map(Number) : [0, 0];
          const horaB = b.conSttData ? b.conSttData.split('-').map(Number) : [0, 0];

          if (horaA[0] !== horaB[0]) {
            return horaA[0] - horaB[0];
          }
          return horaA[1] - horaB[1];
        });


        if (Consulta.length > 0) {
          resolve(Consulta);
        } else {
          Swal.fire('Nenhuma consulta encontrada', 'Tente novamente', 'warning');
          Consulta[0] = {
            conSttCodigoConsulata: 0,
            conSttMedico: 0,
            conSttPaciente: 0,
            conSttDia_semana: 'Sem Dados',
            conSttHorario: 'Sem Dados',
            conSttData: 'Sem Dados',
            conSttObservacao: 'Sem Dados',
            conSttDataCriacao: 'Sem Dados',
            conSttFormaPagamento: 0,
            conSttStatus: 0,
            conSttAdm: 0,
          };
          resolve(Consulta);
        }
      },
        (error) => {
          reject(error);
          console.warn('error:', error);
        });

    })
  }

}
