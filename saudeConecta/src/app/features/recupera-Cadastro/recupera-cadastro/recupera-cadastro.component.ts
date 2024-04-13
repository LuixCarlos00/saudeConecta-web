import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecuperaCadastroService } from '../service/recupera-cadastro.service';

@Component({
  selector: 'app-recupera-cadastro',
  templateUrl: './recupera-cadastro.component.html',
  styleUrls: ['./recupera-cadastro.component.css']
})
export class RecuperaCadastroComponent implements OnInit {
//
//
//

mostralogin: boolean = false;
mostraSenha: boolean = false;
FormularioAceito : boolean = false;
FormularioEmail!:FormGroup;

  constructor(private form : FormBuilder , private recuperaCadastroService : RecuperaCadastroService) { }

  ngOnInit() {
this.FormularioEmail = this.form.group({
  email:['',[Validators.required,Validators.email]]
})

  }


  mostrarRecuperarLogin() {
    this.mostralogin =true
    this.mostraSenha =false
    }


    mostrarRecuperarSenha() {
      this.mostraSenha =true
      this.mostralogin =false
    }


    enviarEmail() {
      const email:string  = this.FormularioEmail.get('email')?.value;
      this.recuperaCadastroService.recuperaCadastroMedico(email).subscribe((dadosUsuario)=>{
        console.log('dados sao de um medico', dadosUsuario);

      })

      this.recuperaCadastroService.recuperaCadastroPaciente(email).subscribe((dadosUsuario)=>{
        console.log('dados sao de um Paciente', dadosUsuario);

      })




      }

}
