import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { tokenService } from 'src/app/util/Token/token.service';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';
@Injectable({
  providedIn: 'root',
})
export class MedicosService {
  private apiUrl = 'http://localhost:8080';
  private Token = this.tokenService.retornaToken();

  public MedicoCidade: Medico[] | undefined;
  public MedicoCRM: Medico[] | undefined;
  public MedicoNome: Medico[] | undefined;
  public MedicoEspecialidade: Medico[] | undefined;
  public TodosMedicos: Medico[] = [];

  private medicoData = new BehaviorSubject<Medico | null>(null);
  MedicoValue$ = this.medicoData.asObservable();

  public MostraCamposDePEsquisa: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService
  ) {}

  LimparDadosPesquisa(): void {

    this.MedicoCidade= [];
    this.MedicoCRM= [];
    this.MedicoNome= [];
    this.MedicoEspecialidade= [];
    this.TodosMedicos= [];

  }

  changeMedicoData(medico: Medico): void {
    this.medicoData.next(medico);
  }

  cadastrarMedico(Paciente: Medico): Observable<Medico> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http.post<Medico>(
      `${this.apiUrl}/medico/post`,
      Paciente,
      options
    );
  }

  buscarListaMedicosPorEspecialidade(pesquisa: string): Observable<Medico[]> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http
      .get<Medico[]>(
        `${this.apiUrl}/medico/buscarPorMedEspecialidade/${pesquisa}`,
        options
      )
      .pipe(
        tap((medicos: Medico[]) => {
          this.MedicoEspecialidade = medicos;
        })
      );
  }

  buscarListaMedicosPorCidade(pesquisa: string): Observable<Medico[]> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http
      .get<Medico[]>(
        `${this.apiUrl}/medico/buscarPorCidade/${pesquisa}`,
        options
      )
      .pipe(
        tap((medicos: Medico[]) => {
          this.MedicoCidade = medicos;
        })
      );
  }

  buscarListaMedicosPorCRM(pesquisa: string): Observable<Medico[]> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http
      .get<Medico[]>(`${this.apiUrl}/medico/buscarPorCRM/${pesquisa}`, options)
      .pipe(
        tap((medicos: Medico[]) => {
          this.MedicoCRM = medicos;
        })
      );
  }

  buscarListaMedicosPorNome(pesquisa: string): Observable<Medico[]> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http
      .get<Medico[]>(`${this.apiUrl}/medico/buscarPorNome/${pesquisa}`, options)
      .pipe(
        tap((medicos: Medico[]) => {
          this.MedicoNome = medicos;
        })
      );
  }

  // BuscarTodosRegistrosDeConsulta(): Observable<{content: Consulta[]}> {
  //   const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${this.Token}` };
  //   const options = { headers, withCredentials: true };
  //   return this.http.get<{content: Consulta[]}>(`${this.apiUrl}/consulta/Consultapagina`, options);
  // }

  buscarPorTodosOsMedicos(): Observable<  Medico[]  > {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http
      .get<  Medico[]  >(`${this.apiUrl}/medico/listatodosmedicos`, options)
      .pipe(
        tap((medicos: Medico[]) => {
          this.TodosMedicos= medicos;
        })
      );
  }
}
