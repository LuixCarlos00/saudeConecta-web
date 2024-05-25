import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { tokenService } from 'src/app/util/Token/token.service';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';


@Injectable({
  providedIn: 'root'
})
export class PacientesService {

  private apiUrl = 'http://localhost:8080';
  private Token = this.tokenService.retornaToken();

  public UsuarioEstaLogado : boolean = false;
  public PacienteCPF:  Paciente[] | undefined;
  public PacienteRG : Paciente[]|undefined;
  public PacienteNome: Paciente[]|undefined;
  public PacienteTelefone:  Paciente[]|undefined;
  public MostraCamposDePEsquisa: boolean = false;


  constructor(
    private router : Router ,
    private http: HttpClient,
    private tokenService: tokenService) {}



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



    buscarListaPacientesPorCPF(pesquisa: string): Observable< Paciente[]> {
  const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
  const options = { headers, withCredentials: true };
  return this.http.get< Paciente[]>(`${this.apiUrl}/paciente/buscarPorCPF/${pesquisa}` ,options ) .pipe(
    tap(( Pacientes:  Paciente[]) => {
      this. PacienteTelefone=  Pacientes;
    })
  );
}


buscarListaPacientesPorTelefone(pesquisa: string) : Observable< Paciente[]>{
  const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
  const options = { headers, withCredentials: true };
  return this.http.get< Paciente[]>(`${this.apiUrl}/paciente/buscarPorTelefone/${pesquisa}`, options ) .pipe(
    tap(( Pacientes:  Paciente[]) => {
      this. PacienteCPF =  Pacientes;
    })
  );
}

buscarListaPacientesPor_RG(pesquisa: string) : Observable< Paciente[]>{
  const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
  const options = { headers, withCredentials: true };
  return this.http.get< Paciente[]>(`${this.apiUrl}/paciente/buscarPorRG/${pesquisa}`, options ) .pipe(
    tap(( Pacientes:  Paciente[]) => {
      this. PacienteRG =  Pacientes;
    })
  );
}

buscarListaPacientesPorNome(pesquisa: string): Observable< Paciente[]> {
  console.log(pesquisa, ' aciente');

  const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
  const options = { headers, withCredentials: true };
  return this.http.get< Paciente[]>(`${this.apiUrl}/paciente/buscarPorNome/${pesquisa}`, options ) .pipe(
    tap(( Pacientes:  Paciente[]) => {
      this. PacienteNome =  Pacientes;
    })
  );
}




}
