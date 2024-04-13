import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tokenService } from 'src/app/util/Token/token.service';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';

@Injectable({
  providedIn: 'root'
})
export class RecuperaCadastroService {



  private apiUrl = 'http://localhost:8080';


  constructor(private http: HttpClient, private TOkenService: tokenService) {

  }



  recuperaCadastroMedico(Email: string): Observable<Medico> {

    return this.http.get<Medico>(`${this.apiUrl}/medico/buscarPorEmail/${Email}`   );
  }


  recuperaCadastroPaciente(Email: string): Observable<Paciente> {

    return this.http.get<Paciente>(`${this.apiUrl}/paciente/buscarPorEmail/${Email}`   );
  }


}
