import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tokenService } from "src/app/util/Token/Token.service";
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { ConsultaStatus } from 'src/app/util/variados/interfaces/consultaStatus/consultaStatus';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaStatusService {



  //
  //
  //



  private apiUrl = '';
  private Token = this.tokenService.retornaToken();

  private dadosStatusFiltradosSubject = new BehaviorSubject<string | undefined>('');
  dadosStatusFiltrados$ = this.dadosStatusFiltradosSubject.asObservable();

  private RecarregarStatusTabelaSubject = new BehaviorSubject<Boolean>(false);
  RecarregarStatusTabela$ = this.RecarregarStatusTabelaSubject.asObservable();

  // private DeletarDadosDaTabelaStatusSubject = new BehaviorSubject<Boolean>(false);
  // DeletarDadosDaTabelaStatus$ = this.DeletarDadosDaTabelaStatusSubject.asObservable();

  // private EditarTabelaStatusSubject = new BehaviorSubject<Boolean>(false);
  // EditarDadosDaTabelaStatus$ = this.EditarTabelaStatusSubject.asObservable();

  // private ConcluidoRegistroTabelaStatusSubject = new BehaviorSubject<Boolean>(false);
  // ConcluidoRegistroTabelaStatus$ = this.ConcluidoRegistroTabelaStatusSubject.asObservable();

  private GeraPdfStatusSubject = new BehaviorSubject<Boolean>(false);
  GeraPDFRegistroTabela$ = this.GeraPdfStatusSubject.asObservable();


  constructor(
    private router : Router ,
    private http: HttpClient,
    private tokenService: tokenService,
    private apiUrl_Global : ApiUrlService
  ) {
   this.apiUrl = this.apiUrl_Global.getUrl()
  }


    FiltraDadosTabelaStatusSubject(dados: string) {
      this.dadosStatusFiltradosSubject.next(dados);
    }

    RecarregarDadosTabelaStatusSubject(dados: boolean) {
      this.RecarregarStatusTabelaSubject.next(dados);
    }

    // ExcluirDadosDaTabelaStatusSubject(dados: boolean) {
    //    this.DeletarDadosDaTabelaStatusSubject.next(dados);
    // }

    // EditarDadosDaTabelaStatusSubject(dados: boolean) {
    //  this.EditarTabelaStatusSubject.next(dados);
    // }

    // ConcluidoTabelaStatusSubject(dados: boolean) {
    //    this.ConcluidoRegistroTabelaStatusSubject.next(dados);
    // }


    Gera_PDF_DeRegistroDaTabelaSubject(dados: boolean) {
     this.GeraPdfStatusSubject.next(dados);
    }




    // CriarConsulataStatus(Consulta: Consulta): Observable<Consulta> {
    //   const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.Token}`,};
    //   const options = { headers, withCredentials: true };
    //   return this.http.post<Consulta>(`${this.apiUrl}/consultaStatus/post`,Consulta,options );
    //   }




      // VericarSeExetemConsultasMarcadasNaTabelaStatus(consult: ConsultaStatus) {
      //   const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.Token}`,};
      //   const options = { headers, withCredentials: true };
      //   return this.http.get<ConsultaStatus>(`${this.apiUrl}/consultaStatus/consultaData=${consult.ConSttData}&horario=${consult.ConSttHorario}&medico=${consult.ConSttHorario} `,options );
      // }

      BuscarTodosRegistrosDeConsultaStatus(): Observable<{content: ConsultaStatus[]}> {
        const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${this.Token}` };
        const options = { headers, withCredentials: true };
        return this.http.get<{content: ConsultaStatus[]}>(`${this.apiUrl}/consultaStatus/Consultapagina`, options);
      }


      // BuscarRegistrosDeConsultaStatus(busca: any) {
      //   const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${this.Token}` };
      //   const options = { headers, withCredentials: true };
      //   return this.http.get<{content: ConsultaStatus[]}>(`${this.apiUrl}/consultaStatus/BuscarRegistrosDeConsulta/${busca}`, options);
      // }


      // DeletarConsulasStatus(consultaId: any) {
      //   const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${this.Token}` };
      //   const options = { headers, withCredentials: true };
      //   return this.http.delete<{content: Consulta[]}>(`${this.apiUrl}/consultaStatus/${consultaId}`, options);
      // }



      // EditarConsulasStatus(consultaId: any, NovaConsulta: ConsultaStatus): Observable<ConsultaStatus> {

      //   const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${this.Token}` };
      //   const options = { headers, withCredentials: true };
      //   return this.http.put<ConsultaStatus>(`${this.apiUrl}/consultaStatus/editar/${consultaId}`,NovaConsulta, options);
      // }


    //   ConcluirDadosDaTabelaStatus(IdConclusao: number): Observable<ConsultaStatus> {


    //     const headers = new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${this.Token}`
    //     });

    //     return this.http.put<ConsultaStatus>(`${this.apiUrl}/consultaStatus/concluido/${IdConclusao}`, {}, { headers });
    // }



    BuscarRegistrosDeConsultaStatusPesquisandoPorTodosOsCampos(Consulta: any) {

      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${this.Token}` };
      const options = { headers, withCredentials: true };
      return this.http.get<ConsultaStatus>(`${this.apiUrl}/consultaStatus/Allcampos/medico=${Consulta.ConMedico.medCodigo}&data=${Consulta.ConData}&horario=${Consulta.ConHorario}&paciente=${Consulta.ConPaciente.paciCodigo}&Administrador=${Consulta.ConAdm.admCodigo}&DataCriacao=${Consulta.ConDadaCriacao}`, options);
    }



    BuscarHistoricoDeAgendaDoMedico(IdUsuarioMedico: number) {
      const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.Token}`, };
      const options = { headers, withCredentials: true };
      return this.http.get<any[]>( `${this.apiUrl}/consultaStatus/BuscarHistoricoDeAgendaDoMedico/${IdUsuarioMedico}`, options);
    }

      BuscarDadosDeAgendaDeTodosOsMedicos() {
        const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.Token}`, };
        const options = { headers, withCredentials: true };
        return this.http.get<any[]>( `${this.apiUrl}/consultaStatus/BuscarDadosDeAgendaDeTodosOsMedicos`, options);
      }




}
