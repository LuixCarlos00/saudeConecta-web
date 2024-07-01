import { ConsultaService } from 'src/app/service/service-consulta/consulta.service';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';

import { UsuariosService } from 'src/app/service/usuario/usuarios.service';
import { tokenService } from 'src/app/util/Token/Token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro-usuario',

  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.css',
})
export class CadastroUsuarioComponent {
  FormularioUsuario!: FormGroup;

  @Input() RolesUsuario!: any;

  Usuario: Usuario = {
    id: 0,
    login: '',
    senha: '',
    tipoUsuario: '',
  };

  constructor(
    private form: FormBuilder,
    private usuariosService: UsuariosService,

  ) {


  }

  ngOnInit(): void {
    console.log(this.RolesUsuario,"roles");
    this.FormularioUsuario = this.form.group({
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });


  }

  cadatraUsuario() {
    if (this.FormularioUsuario.valid) {
      this.Usuario.login = this.FormularioUsuario.get('login')?.value;
      this.Usuario.senha = this.FormularioUsuario.get('password')?.value;
      this.Usuario.tipoUsuario = this.RolesUsuario;

      this.usuariosService.cadastrarUsuario(this.Usuario).subscribe(
        (dados) => {

          console.log(dados.body.usuarioView, 'o token');
          //this.router.navigate(['cadastro']);
        },
        (error) => {
          if (error.status === 400) {
            alert('Erro ao cadastrar usuário: \n[Login Ja Existente]');
          } else {
            alert('Erro durante a requisição: ' + error);
          }
        }
      );
    } else {
      alert('Formulário inválido. Verifique os campos obrigatórios.');
    }
  }


}
