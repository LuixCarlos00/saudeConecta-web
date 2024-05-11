import { Usuario } from './../variados/interfaces/usuario/usuario';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';


import { jwtDecode } from "jwt-decode";
import { HttpClient } from '@angular/common/http';
import { Paciente } from '../variados/interfaces/paciente/paciente';

const KEY: string = 'authToken';
const authTwof: string = 'authTwof';

@Injectable({ providedIn: 'root' })
export class tokenService {
  //
  //
  //


  constructor( private http: HttpClient,) {
   this.token();
  }


  private apiUrl = 'http://localhost:8080';

  private SubjectPaciente = new BehaviorSubject<Paciente | null>(null);
  PacienteValue$ = this.SubjectPaciente.asObservable();

  private Usuario = {
    id: 0,
    login: '',
    senha: '',
    roles: '',
  };


  salvarToken(token: string) {
    window.localStorage.setItem(KEY, token);
  }


  excluirToken() {
    localStorage.removeItem(KEY);
  }


  retornaToken() {
    return localStorage.getItem(KEY) ?? '';
  }

  possuiToken(): boolean {
    const token = localStorage.getItem(KEY);
    if (token) {
      return true;
    } else {
      return false;
    }
  }




  removeToken() {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(authTwof);
  }



  setAuthTwof(authTwof: boolean): void {
    window.localStorage.setItem('authTwof', authTwof.toString());
  }



  getAuthTwof(): boolean {
    if (!localStorage.getItem(authTwof)) {
      return false;
    } else return true;
  }



  oTokenEstavalido(token: any): boolean {
    if (!token) {
      // Tratar o caso em que token é null
      return false;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const TempoDoToken = decodedToken.exp;

      if (typeof TempoDoToken !== 'undefined') {
        return Math.floor(new Date().getTime() / 1000) < TempoDoToken; ///retorna true se valido
      } else {
        return false; /// retorna false se invalido
      }
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return false;
    }
  }

token (){
  const token = this.retornaToken();
  this.Usuario = jwtDecode(token);
  this.Usuario.id
  this.buscarPorUsuario(this.Usuario.id)
//caso venha dar errado tente comentar a linha e descomentar , tbm tente fexha o VS e abrir novamente
}




buscarPorUsuario(id: number) {
  const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.retornaToken()}` };
  const options = { headers, withCredentials: true };

  this.http.get<Paciente>(`${this.apiUrl}/paciente/buscarIdDeUsusario/${id}`, options)
    .subscribe(
      (Paciente: Paciente) => {
        this.SubjectPaciente.next(Paciente);
      },
      (error) => {
        console.error('Erro ao buscar usuário:', error);
      }
    );
}



  }
