import { Injectable } from '@angular/core';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';
import { HttpClient } from '@angular/common/http';
import { tokenService } from 'src/app/util/Token/Token.service';
import { Router } from '@angular/router';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';

@Injectable({
  providedIn: 'root'
})
export class DadosPessoaisService {



private apiUrl = '';


constructor(
  private router: Router,
  private http: HttpClient,
  private tokenService: tokenService,
  private apiUrl_Global : ApiUrlService
) {
 this.apiUrl = this.apiUrl_Global.getUrl()

}



BuscarDadosPessoais(Id:number) {
  const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
  const options = { headers, withCredentials: true };
  return this.http.get<any>(`${this.apiUrl}/medico/buscarId/${Id}`, options);
}



AtualizarEnderecoMedico(form: any) {

  const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
  const options = { headers, withCredentials: true };
  return this.http.put<any>(`${this.apiUrl}/medico/AtualizarEnderecoMedico/${form.endCodigo}`, form ,options);
}


AtualizarDadosPessoais( form: any) {

  const headers = {'Content-Type': 'application/json',Authorization: `Bearer ${this.tokenService.retornaToken()}`,};
  const options = { headers, withCredentials: true };
  return this.http.put<any>(`${this.apiUrl}/medico/AlterarDadosMedico/${form.MedCodigo}`, form, options);
}



}
