import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { tokenService } from 'src/app/util/Token/token.service';

import { UsuariosService } from 'src/app/service/usuario/usuarios.service';

@Component({
  selector: 'app-cadastro-usuario',

  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.css',
})
export class CadastroUsuarioComponent {
  FormularioUsuario!: FormGroup;

  Usuario: Usuario = {
    id: 0,
    login: '',
    senha: '',
    roles: '',
  };

  constructor(
    private form: FormBuilder,
    private router: Router,
    private usuariosService: UsuariosService,
    private TokenService: tokenService
  ) {}

  ngOnInit(): void {
    this.FormularioUsuario = this.form.group({
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  cadatraUsuario() {
    if (this.FormularioUsuario.valid) {
      this.usuariosService.cadastrarUsuario(this.Usuario).subscribe(
        (dados) => {
          this.usuariosService.changeNovoUsuariocadastrado(
            dados.body.usuarioView
          );

          this.router.navigate(['cadastro']);
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
