import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { tokenService } from "src/app/util/Token/Token.service";
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';
@Injectable({
  providedIn: 'root',
})
export class MedicosService {
  private apiUrl = '';
  private medicoSubject = new BehaviorSubject<Medico[]>([]);
  MedicoValue$ = this.medicoSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService,
    private apiUrl_Global : ApiUrlService
  ) {
   this.apiUrl = this.apiUrl_Global.getUrl()
  }

  private emitMedicosChange(medicos: Medico[]): void {
    this.medicoSubject.next(medicos);
  }

  LimparDadosPesquisa(): void {
    this.emitMedicosChange([]);
  }

  changeMedicoData(medicos: Medico[]): void {
    this.emitMedicosChange(medicos);
  }






  cadastrarMedico(medico: Medico): Observable<Medico> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http.post<Medico>(`${this.apiUrl}/medico/post`, medico, options);
  }

  buscarListaMedicosPorEspecialidade(pesquisa: string): Observable<Medico[]> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http
      .get<Medico[]>(`${this.apiUrl}/medico/buscarPorMedEspecialidade/${pesquisa}`, options)
      .pipe(tap((medicos: Medico[]) => this.emitMedicosChange(medicos)));
  }

  buscarListaMedicosPorCidade(pesquisa: string): Observable<Medico[]> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http
      .get<Medico[]>(`${this.apiUrl}/medico/buscarPorCidade/${pesquisa}`, options)
      .pipe(tap((medicos: Medico[]) => this.emitMedicosChange(medicos)));
  }

  buscarListaMedicosPorCRM(pesquisa: string): Observable<Medico[]> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http
      .get<Medico[]>(`${this.apiUrl}/medico/buscarPorCRM/${pesquisa}`, options)
      .pipe(tap((medicos: Medico[]) => this.emitMedicosChange(medicos)));
  }

  buscarListaMedicosPorNome(pesquisa: string): Observable<Medico[]> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http
      .get<Medico[]>(`${this.apiUrl}/medico/buscarPorNome/${pesquisa}`, options)
      .pipe(tap((medicos: Medico[]) => this.emitMedicosChange(medicos)));
  }

  buscarPorTodosOsMedicos(): Observable<Medico[]> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http
      .get<Medico[]>(`${this.apiUrl}/medico/listatodosmedicos`, options)
      .pipe(tap((medicos: Medico[]) => this.emitMedicosChange(medicos)));
  }
}

