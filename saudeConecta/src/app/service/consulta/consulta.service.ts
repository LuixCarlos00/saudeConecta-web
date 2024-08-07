import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { tokenService } from 'src/app/util/Token/Token.service';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';
import { CronologiaService } from '../cronologia/Cronologia.service';

@Injectable({
  providedIn: 'root',
})
export class ConsultaService {
  //
  //
  //

  private apiUrl = '';
  private Token = this.tokenService.retornaToken();

  private dadosFiltradosSubject = new BehaviorSubject<Consulta[]>([]);
  dadosFiltrados$ = this.dadosFiltradosSubject.asObservable();

  private RecarregarTabelaSubject = new BehaviorSubject<Boolean>(false);
  RecarregarTabela$ = this.RecarregarTabelaSubject.asObservable();

  private DeletarDadosDaTabelaSubject = new BehaviorSubject<Boolean>(false);
  DeletarDadosDaTabela$ = this.DeletarDadosDaTabelaSubject.asObservable();

  private EditarTabelaSubject = new BehaviorSubject<Boolean>(false);
  EditarDadosDaTabela$ = this.EditarTabelaSubject.asObservable();

  private ConcluidoRegistroTabelaSubject = new BehaviorSubject<Boolean>(false);
  ConcluidoRegistroTabela$ = this.ConcluidoRegistroTabelaSubject.asObservable();

  private GeraPDFRegistroTabelaSubject = new BehaviorSubject<Boolean>(false);
  GeraPDFRegistroTabela$ = this.GeraPDFRegistroTabelaSubject.asObservable();

  private CadastroRealizadoComSucessoSubject = new BehaviorSubject<Consulta>({} as Consulta);
  CadastroRealizadoComSucesso$ = this.CadastroRealizadoComSucessoSubject.asObservable();

  private DadosParaCronologiaDoDiaSubject = new BehaviorSubject<any>(null);
  BuscarDadoParaCronologia$ =  this.DadosParaCronologiaDoDiaSubject.asObservable();


  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService,
    private apiUrl_Global : ApiUrlService
  ) {
   this.apiUrl = this.apiUrl_Global.getUrl()
  }

  FiltraDadosSubject(dados: Consulta[]) {
    this.dadosFiltradosSubject.next(dados);
  }

  RecarregarDadosTabelaSubject(dados: boolean) {
    this.RecarregarTabelaSubject.next(dados);
  }

  ExcluirDadosDaTabelaSubject(dados: boolean) {
    this.DeletarDadosDaTabelaSubject.next(dados);
  }

  EditarDadosDaTabelaSubject(dados: boolean) {
    this.EditarTabelaSubject.next(dados);
  }

  ConcluidoTabelaSubject(dados: boolean) {
    this.ConcluidoRegistroTabelaSubject.next(dados);
  }

  Gera_PDF_DeRegistroDaTabelaSubject(dados: boolean) {
    this.GeraPDFRegistroTabelaSubject.next(dados);
  }


  PassarDadosParaCronologiaDoDia(dados: any) {
    this.DadosParaCronologiaDoDiaSubject.next(dados);
  }


  CriarConsulata(Consulta: Consulta): Observable<Consulta> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    };
    const options = { headers, withCredentials: true };
    return this.http.post<Consulta>(
      `${this.apiUrl}/consulta/post`,
      Consulta,
      options
    );
  }

  VericarSeExetemConsultasMarcadas(consult: Consulta) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    };
    const options = { headers, withCredentials: true };
    return this.http.get<Consulta>(
      `${this.apiUrl}/consulta/consultaData=${consult.ConData}&horario=${consult.ConHorario}&medico=${consult.ConMedico} `,
      options
    );
  }

  BuscarTodosRegistrosDeConsulta(): Observable<{ content: Consulta[] }> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    };
    const options = { headers, withCredentials: true };
    return this.http.get<{ content: Consulta[] }>(
      `${this.apiUrl}/consulta/Consultapagina`,
      options
    );
  }

  BuscarRegistrosDeConsulta(busca: any) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    };
    const options = { headers, withCredentials: true };
    return this.http.get<{ content: Consulta[] }>(
      `${this.apiUrl}/consulta/BuscarRegistrosDeConsulta/${busca}`,
      options
    );
  }

  DeletarConsulas(consultaId: any) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    };
    const options = { headers, withCredentials: true };
    return this.http.delete<{ content: Consulta[] }>(
      `${this.apiUrl}/consulta/${consultaId}`,
      options
    );
  }

  EditarConsultas(
    consultaId: any,
    novaConsulta: Consulta
  ): Observable<Consulta> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    });
    return this.http
      .put<Consulta>(
        `${this.apiUrl}/consulta/editar/${consultaId}`,
        novaConsulta,
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error('Erro ao editar consulta:', error);
          return throwError(error);
        })
      );
  }

  ConcluirDadosDaTabela(IdConclusao: number): Observable<Consulta> {
    console.log(IdConclusao, 'IdConclusao', this.Token.toString());

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    });
    return this.http.put<Consulta>(
      `${this.apiUrl}/consulta/concluido/${IdConclusao}`,
      {},
      { headers }
    );
  }

  ChangeCadastroRealizadoComSucesso(cadastro: Consulta) {
    this.CadastroRealizadoComSucessoSubject.next(cadastro);
  }

  VerificarHorariosDisponiveisReferentesAoMedicoEData(
    medCodigo: any,
    DataSelecionada: any
  ) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    });
    return this.http.get<string[]>(
      `${this.apiUrl}/consulta/VerificarHorariosDisponiveisReferentesAoMedicoEData/medico=${medCodigo}&data=${DataSelecionada}`,
      { headers }
    );
  }

  EnviarMensagem(EnviarMensagem: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    });
    return this.http.post<any>(
      `${this.apiUrl}/consulta/EnviarMensagem `,
      EnviarMensagem,
      { headers }
    );
  }
}
