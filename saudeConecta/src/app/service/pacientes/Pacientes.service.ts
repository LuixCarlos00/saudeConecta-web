import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { tokenService } from "src/app/util/Token/Token.service";
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';

@Injectable({
  providedIn: 'root',
})
export class PacientesService {
  private apiUrl = '';
  private Token = this.tokenService.retornaToken();

  public UsuarioEstaLogado: boolean = false;

  public TodosPacientes: Paciente[] = [];
  public MostraCamposDePEsquisa: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService,
    private apiUrl_Global : ApiUrlService
  ) {
   this.apiUrl = this.apiUrl_Global.getUrl()
  }

  cadastrarPaciente(Paciente: Paciente): Observable<Paciente> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http.post<Paciente>(
      `${this.apiUrl}/paciente/post`,
      Paciente,
      options
    );
  }

  buscarListaPacientesPorCPF(pesquisa: string): Observable<Paciente[]> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http
      .get<Paciente[]>(
        `${this.apiUrl}/paciente/buscarPorCPF/${pesquisa}`,
        options
      )
      .pipe(
        tap((Pacientes: Paciente[]) => {
          this.TodosPacientes = Pacientes;
        })
      );
  }

  buscarListaPacientesPorTelefone(pesquisa: string): Observable<Paciente[]> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http
      .get<Paciente[]>(
        `${this.apiUrl}/paciente/buscarPorTelefone/${pesquisa}`,
        options
      )
      .pipe(
        tap((Pacientes: Paciente[]) => {
          this.TodosPacientes = Pacientes;
        })
      );
  }

  buscarListaPacientesPor_RG(pesquisa: string): Observable<Paciente[]> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http
      .get<Paciente[]>(
        `${this.apiUrl}/paciente/buscarPorRG/${pesquisa}`,
        options
      )
      .pipe(
        tap((Pacientes: Paciente[]) => {
          this.TodosPacientes = Pacientes;
        })
      );
  }

  buscarListaPacientesPorNome(pesquisa: string): Observable<Paciente[]> {

    const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`, };
    const options = { headers, withCredentials: true };

    return this.http.get<Paciente[]>(`${this.apiUrl}/paciente/buscarPorNome/${pesquisa}`,options)
      .pipe(
        tap((Pacientes: Paciente[]) => {
          this.TodosPacientes = Pacientes;
        })
      );
  }

  buscarTodosPacientes(): Observable<Paciente[]> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http
      .get<Paciente[]>(`${this.apiUrl}/paciente/listatodospaciente`, options)
      .pipe(
        tap((Pacientes: Paciente[]) => {
          this.TodosPacientes = Pacientes;
        })
      );
  }


  buscarPacientePorId(id: number): Observable<Paciente> {
    const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`, };
    const options = { headers, withCredentials: true };
    return this.http.get<Paciente>(`${this.apiUrl}/paciente/buscarId/${id}`, options);
  }


}
