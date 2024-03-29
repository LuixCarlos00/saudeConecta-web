import { TokenService } from './../../../../util/Token/Token.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { PacienteService } from '../../../paciente/paciente_service/paciente.service';

@Component({
  selector: 'app-cadastro-usuario',

  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.css'
})
export class CadastroUsuarioComponent {


  FormularioUsuario!: FormGroup ;

  Usuario: Usuario = {
    id: 0,
    login:'',
    senha:'',
  };



  constructor(
    private form: FormBuilder,
    private router : Router ,
    private CadastroPaciete_Medico :PacienteService,
    private TokenService :TokenService) {}

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
          // Armazenar dados do usuário e token JWT
          this.CadastroPaciete_Medico.dadosUsuario(dados.body);

        },
        (error) => {
          // Tratar erros
          console.error('Erro ao cadastrar usuário:', error);
          // Exibir mensagem de erro para o usuário
          console.log('Não foi possível realizar o cadastro');
        }
      );
    } else {
      // Exibir mensagem ao usuário para preencher corretamente o formulário
      console.log('Formulário inválido. Verifique os campos obrigatórios.');
    }
    // Redirecionar sempre, mesmo se o formulário for inválido
    this.router.navigate(['cadastro']);
  }

}
