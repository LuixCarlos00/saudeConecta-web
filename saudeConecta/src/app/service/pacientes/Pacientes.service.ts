import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { tokenService } from 'src/app/util/Token/Token.service';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';
import { tr } from 'date-fns/locale';
import { DialogService } from 'src/app/util/variados/dialogo-confirmação/dialog.service';

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
    private apiUrl_Global: ApiUrlService,
    private DialogService: DialogService,

  ) {
    this.apiUrl = this.apiUrl_Global.getUrl();
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
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };

    return this.http
      .get<Paciente[]>(
        `${this.apiUrl}/paciente/buscarPorNome/${pesquisa}`,
        options
      )
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
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.retornaToken()}`,
    };
    const options = { headers, withCredentials: true };
    return this.http.get<Paciente>(
      `${this.apiUrl}/paciente/buscarId/${id}`,
      options
    );
  }

  PesquisarPacientes(FiltroPesquisaPaciente: number, pesquisa: string): Promise<any[]> {
    const searchMethods: { [key: number]: () => Observable<any[]> } = {
      1: () => this.buscarListaPacientesPorNome(pesquisa),
      2: () => this.buscarListaPacientesPorCPF(pesquisa),
      3: () => this.buscarListaPacientesPor_RG(pesquisa),
      4: () => this.buscarListaPacientesPorTelefone(pesquisa),
      5: () => this.buscarTodosPacientes(),
    };

    return new Promise((resolve, reject) => {
      try {
        const searchMethod = searchMethods[FiltroPesquisaPaciente];
        if (searchMethod) {
          searchMethod().subscribe(
            (dados) => {
              if (dados && dados.length > 0) {
                resolve(dados);
              } else {
                reject(new Error('Nenhum paciente encontrado.'));
              }
            },
            (error) => {
              reject(error);
            }
          );
        } else {
          reject(new Error('Filtro de pesquisa inválido.'));
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  exibirMensagemErro() {
    this.DialogService.exibirMensagemErro();
  }

}
