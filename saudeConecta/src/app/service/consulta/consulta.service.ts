import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { tokenService } from 'src/app/util/Token/Token.service';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';
import { CronologiaService } from '../cronologia/Cronologia.service';
import { tr } from 'date-fns/locale';
import { Tabela } from 'src/app/util/variados/interfaces/tabela/Tabela';



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

  private CadastroRealizadoComSucessoSubject = new BehaviorSubject<Consulta>(
    {} as Consulta
  );
  CadastroRealizadoComSucesso$ =
    this.CadastroRealizadoComSucessoSubject.asObservable();

  private DadosParaCronologiaDoDiaSubject = new BehaviorSubject<any>(null);
  BuscarDadoParaCronologia$ =
    this.DadosParaCronologiaDoDiaSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService,
    private apiUrl_Global: ApiUrlService
  ) {
    this.apiUrl = this.apiUrl_Global.getUrl();
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

  BuscarTodosRegistrosDeConsulta(): Observable<Consulta[]> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.Token}`,
    };
    const options = { headers, withCredentials: true };
    return this.http.get<Consulta[]>(
      `${this.apiUrl}/consulta/Consultapagina`,
      options
    );
  }

  // BuscarRegistrosDeConsulta(busca: any) {
  //   const headers = {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${this.Token}`,
  //   };
  //   const options = { headers, withCredentials: true };
  //   return this.http.get<{ content: Consulta[] }>(
  //     `${this.apiUrl}/consulta/BuscarRegistrosDeConsulta/${busca}`,
  //     options
  //   );
  // }

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
    console.log('Editando consulta:', novaConsulta, 'Id:', consultaId);

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
    console.log('VerificarHorariosDisponiveisReferentesAoMedicoEData', medCodigo, DataSelecionada);

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




  filtrandoDadosDoBancoPassadoParametros_Pesquisa(dados: any, dataSource: Tabela[]): Promise<Tabela[]> {
    return new Promise((resolve, reject) => {
      try {
        // Função para normalizar e remover acentos e caracteres especiais
        const normalizeString = (str: string) => {
          return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
            .toUpperCase(); // Converte para maiúsculas
        };

        const safeNormalize = (value: any) => {
          return value ? normalizeString(value.toString()) : ''; // Verifica se o valor não é nulo ou undefined
        };

        const isDateMatch = (date1: string, date2: string) => {
          const parseDate = (dateStr: string) => {
            const date = new Date(dateStr);
            return isNaN(date.getTime()) ? null : date;
          };

          const parsedDate1 = parseDate(date1);
          const parsedDate2 = parseDate(date2);

          if (!parsedDate1 || !parsedDate2) {
            return false; // Se qualquer data for inválida, retorne false
          }

          return (
            parsedDate1.toISOString().split('T')[0] ===
            parsedDate2.toISOString().split('T')[0]
          );
        };

        const isTimeMatch = (time1: string, time2: string) => {
          const formatTime = (time: string) => {
            let [hour, minute] = time.split(':');
            if (!hour || !minute) {
              return null; // Se não for possível dividir corretamente, retorne null
            }
            hour = hour.padStart(2, '0'); // Garante que a hora tenha 2 dígitos
            minute = minute.padStart(2, '0'); // Garante que os minutos tenham 2 dígitos
            return `${hour}:${minute}`;
          };

          const formattedTime1 = formatTime(time1.trim());
          const formattedTime2 = formatTime(time2.trim());

          if (!formattedTime1 || !formattedTime2) {
            return false; // Se qualquer hora for inválida, retorne false
          }

          return formattedTime1 === formattedTime2;
        };

        const dadosUpper = safeNormalize(dados.trim());

        // Filtrar os dados da consulta, comparando as strings normalizadas e tratando a data e o horário de forma específica
        let resultadoFiltrado = dataSource.filter(
          (item) =>
            safeNormalize(item.consulta).includes(dadosUpper) ||
            safeNormalize(item.medico.medNome).includes(dadosUpper) || // Verifica se ConMedico existe antes de acessar medNome
            safeNormalize(item.paciente.PaciNome).includes(dadosUpper) || // Verifica se ConPaciente existe antes de acessar paciNome
            safeNormalize(item.diaSemana).includes(dadosUpper) ||
            isDateMatch(item.data, dados.trim()) || // Compara as datas sem normalizar
            isTimeMatch(item.horario, dados.trim()) || // Compara os horários diretamente
            safeNormalize(item.observacao).includes(dadosUpper)
        );

        console.log('resultadoFiltrado', resultadoFiltrado);

        if (resultadoFiltrado.length > 0) {
          resolve(resultadoFiltrado);
          //this.LimparTabela();
          //this.dataSource = resultadoFiltrado;
        } else {
          // this.DialogService.NaoFoiEncontradoConsultasComEssesParametros();
          // this.LimparTabela();
        }
      } catch (error) {
        console.error('Erro ao filtrar dados:', error);
        reject(error);
      }
    });
  }
}
