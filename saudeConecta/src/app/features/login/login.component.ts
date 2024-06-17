import { UsuariosService } from 'src/app/service/usuario/usuarios.service';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ModelService } from 'src/app/service/Model_service/Model.service';
import { tokenService } from 'src/app/util/Token/token.service';
import Swal from 'sweetalert2';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  //
  //
  //
  Usuario: Usuario = {
    roles: '',
    id: 0,
    login: '',
    senha: '',
  };

  FormularioUsuario!: FormGroup;

  constructor(
    private router: Router,
    private form: FormBuilder,
    private modelService: ModelService,
    private tokenService: tokenService
  ) {}

  ngOnInit(): void {
    this.FormularioUsuario = this.form.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  cadastraNovoUsuario() {
    this.router.navigate(['cadastroUsuario']);
  }

  recuperaSenha_Usuario() {
    this.router.navigate(['recuperaCadastro']);
  }

  Login() {
    const password = this.FormularioUsuario.get('password')?.value;
    const username = this.FormularioUsuario.get('username')?.value;

    this.Usuario.login = username;
    this.Usuario.senha = password;

    this.ExisteUsuario(username).subscribe((existe) => {

      if (existe) {
        this.modelService.fazerLogin(this.Usuario).subscribe(
          (response) => {
            if (response.body && response.body.token) {
              const token = response.body.token;

              this.tokenService.salvarToken(token);
              this.tokenService.token();
              this.router.navigate(['/home']);
            }
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Email ou senha inválidos',
            });
          }
        );
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Seu cadastro nao foi finalizado com sucesso.',
        });
      }
    });


  }
  ExisteUsuario(username: any): Observable<boolean> {
    return this.modelService.buscarUsuarioExistente(username).pipe(
      map((dados) => !!dados) // Converts the result to a boolean
    );
  }
}
