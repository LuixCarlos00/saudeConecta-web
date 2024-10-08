import { Paciente } from '../../util/variados/interfaces/paciente/paciente';
import { Usuario } from '../../util/variados/interfaces/usuario/usuario';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tokenService } from "src/app/util/Token/Token.service";
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';
import { ApiUrlService } from '../_Url-Global/Api-Url.service';

@Injectable({
  providedIn: 'root'
})
export class RecuperaCadastroService {



  private Medico!: Medico;
  private Paciente!:Paciente;

  private apiUrl = '';


  constructor(
    private http: HttpClient,
    private TOkenService: tokenService,
    private apiUrl_Global : ApiUrlService
  ) {
   this.apiUrl = this.apiUrl_Global.getUrl()
  }



  recuperaCadastroMedico(Email: string): Observable<Medico> {
    return this.http.get<Medico>(`${this.apiUrl}/medico/buscarPorEmail/${Email}`   );
  }

  recuperaCadastroPaciente(Email: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/paciente/buscarPorEmail/${Email}`   );
  }

  codigoVerificacao(codigo: string):Observable<any> {
    return this.http.get<number>(`${this.apiUrl}/paciente/InserirCodigo/${codigo}`   );
  }

  trocaSenhaUsuario(id:number, user :any ): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/Home/trocaDeSenha/${id}`,user   );
  }


  recuperaLogin(id:number, tipoUsusario :string ): Observable<any> {

    return this.http.get<Usuario>(`${this.apiUrl}/Home/recuperaLogin=${id}&dados=${tipoUsusario}`   );
  }




  dadosIstanciaPaciente(InstanciaPaciente: Paciente) {
   this.Paciente=InstanciaPaciente;
  }
  dadosIstanciaMedico(InstanciaMedico: Medico) {
     this.Medico = InstanciaMedico;
  }


  GetdadosIstanciaPaciente():Paciente {
    return this.Paciente
   }
   GEtdadosIstanciaMedico():Medico {
    return  this.Medico ;
   }



}
