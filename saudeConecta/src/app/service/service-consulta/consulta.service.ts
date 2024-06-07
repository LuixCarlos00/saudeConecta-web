import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tokenService } from 'src/app/util/Token/token.service';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  //
  //
  //



  private apiUrl = 'http://localhost:8080';
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

  constructor(
    private router : Router ,
    private http: HttpClient,
    private tokenService: tokenService) {}


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



    CriarConsulata(Consulta: Consulta): Observable<Consulta> {
      const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.Token}`,};
      const options = { headers, withCredentials: true };
      return this.http.post<Consulta>(`${this.apiUrl}/consulta/post`,Consulta,options );
      }




      VericarSeExetemConsultasMarcadas(consult: Consulta) {
        const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.Token}`,};
        const options = { headers, withCredentials: true };
        return this.http.get<Consulta>(`${this.apiUrl}/consulta/consultaData=${consult.ConData}&horario=${consult.ConHorario}&medico=${consult.ConMedico} `,options );
      }

      BuscarTodosRegistrosDeConsulta(): Observable<{content: Consulta[]}> {
        const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${this.Token}` };
        const options = { headers, withCredentials: true };
        return this.http.get<{content: Consulta[]}>(`${this.apiUrl}/consulta/Consultapagina`, options);
      }


      BuscarRegistrosDeConsulta(busca: any) {
        const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${this.Token}` };
        const options = { headers, withCredentials: true };
        return this.http.get<{content: Consulta[]}>(`${this.apiUrl}/consulta/BuscarRegistrosDeConsulta/${busca}`, options);
      }


      DeletarConsulas(consultaId: any) {
        const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${this.Token}` };
        const options = { headers, withCredentials: true };
        return this.http.delete<{content: Consulta[]}>(`${this.apiUrl}/consulta/${consultaId}`, options);
      }



      EditarConsulas(consultaId: any, NovaConsulta: Consulta): Observable<Consulta> {
        console.log(consultaId, NovaConsulta);

        const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${this.Token}` };
        const options = { headers, withCredentials: true };
        return this.http.put<Consulta>(`${this.apiUrl}/consulta/editar/${consultaId}`,NovaConsulta, options);
      }


      ConcluirDadosDaTabela(IdConclusao: number): Observable<Consulta> {
        console.log(IdConclusao, 'IdConclusao', this.Token.toString());

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.Token}`
        });

        return this.http.put<Consulta>(`${this.apiUrl}/consulta/concluido/${IdConclusao}`, {}, { headers });
    }

}
