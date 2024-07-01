import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tokenService } from './../../util/Token/Token.service';
import { Secretaria } from 'src/app/util/variados/interfaces/secretaria/secretaria';

@Injectable({
  providedIn: 'root'
})
export class SecretariaService {





  private apiUrl = 'http://localhost:8080';
  private Token = this.tokenService.retornaToken();


  constructor(
    private router: Router,
    private http: HttpClient,
    private tokenService: tokenService
  ) {}




VerificarCodicodeAutorizacaoParaCadastraSecretaria(codigoAutorizacao: any): Observable<Secretaria> {
  return this.http.get<Secretaria>( `${this.apiUrl}/administrador/buscarPorCoigoAutorizacao/${codigoAutorizacao}` );
}
cadastrarSecretaria(Secretaria: Secretaria) {
  const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${this.tokenService.retornaToken()}`, };
  const options = { headers, withCredentials: true };
  return this.http.post<Secretaria>( `${this.apiUrl}/secretaria/post`, Secretaria, options);

}


}
