import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tokenService } from 'src/app/util/Token/token.service';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';

@Injectable({
  providedIn: 'root'
})
export class ServiceConsultaMedicosService {
  //
  //
  //



  private apiUrl = 'http://localhost:8080';
  private Token = this.tokenService.retornaToken();



  constructor(
    private router : Router ,
    private http: HttpClient,
    private tokenService: tokenService) {}



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



}
