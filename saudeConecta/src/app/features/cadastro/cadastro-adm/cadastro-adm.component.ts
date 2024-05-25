import { Component, OnInit } from '@angular/core';
import   { FormBuilder, FormGroup, Validators } from '@angular/forms';
import   { UsuariosService } from 'src/app/service/usuario/usuarios.service';
import   { Adiministrador } from 'src/app/util/variados/interfaces/administrado/adiministrador';

@Component({
  selector: 'app-cadastro-adm',
  templateUrl: './cadastro-adm.component.html',
  styleUrls: ['./cadastro-adm.component.css']
})
export class CadastroAdmComponent implements OnInit {

  FormularioADM!: FormGroup;
  Administracao: Adiministrador = {
    AdmCodigo: 0,
    AdmNome: '',
    AdmUsuario: 0,
    AdmStatus: 0,
    AdmDataCriacao: '',
    AdmEmail: '',
    AdmCodigoAtorizacao: ''
  }


  constructor(private form :FormBuilder,
      private usuariosService : UsuariosService
  ) { }

  ngOnInit() {

    this.FormularioADM = this.form.group({
      nome: ['',Validators.required],
      codAutorizacao: ['',Validators.required],
      Email: ['',Validators.required],
    })
  }


  cadastra() {
     const codigoAutorizacao = this.FormularioADM.get('codAutorizacao')?.value;
    this.usuariosService.cadastrarUsuarioADM(codigoAutorizacao).subscribe(
      (dados) => {console.log(dados,'dados');
      },
      (error) => {console.log(error)}
    )
      

    }

}
