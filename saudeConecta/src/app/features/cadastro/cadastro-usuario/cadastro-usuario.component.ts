
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { tokenService } from 'src/app/util/Token/token.service';
import { PacienteService } from '../../paciente_service/paciente.service';

@Component({
  selector: 'app-cadastro-usuario',

  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.css'
})
export class CadastroUsuarioComponent {


  FormularioUsuario!: FormGroup ;

  Usuario: Usuario = {
    id: 0,
    login: '',
    senha: '',
    roles:  ''
  };



  constructor(
    private form: FormBuilder,
    private router : Router ,
    private CadastroPaciete_Medico :PacienteService,
    private TokenService :tokenService) {}

  ngOnInit(): void {



    this.FormularioUsuario = this.form.group({
      login:['',Validators.required],
      password:['',Validators.required]
    })

  }


  cadatraUsuario() {
    console.log(this.Usuario);
    if (this.FormularioUsuario.valid) {
      this.CadastroPaciete_Medico.cadastrarUsuario(this.Usuario).subscribe(
        (dados) => {



        },
        (error) => {

          console.error('Erro ao cadastrar usuário:', error);

          console.log('Não foi possível realizar o cadastro');
        }
      );
    } else {

      console.log('Formulário inválido. Verifique os campos obrigatórios.');
    }
    this.router.navigate(['cadastro']);
  }

}
