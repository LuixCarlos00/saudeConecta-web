import { UsuariosService } from 'src/app/service/usuario/usuarios.service';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { tokenService } from 'src/app/util/Token/Token.service';
import Swal from 'sweetalert2';
import { Observable, map } from 'rxjs';
import { el } from 'date-fns/locale';
import { LoginService } from 'src/app/service/service-login/login.service';

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
    id: 0,
    aud: '',
    exp: '',
    iss: '',
    sub: ''
  };

  FormularioUsuario!: FormGroup;

  constructor(
    private router: Router,
    private form: FormBuilder,
    private LoginService: LoginService,
    private tokenService: tokenService
  ) { }

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

    const Usuario = {
      login: username,
      senha: password,
    };




    this.LoginService.fazerLogin(Usuario).subscribe(
      (response) => {

        if (response.body && response.body.token) {
          const token = response.body.token;
          this.tokenService.salvarToken(token);
          this.tokenService.decodificaToken();

          this.tokenService.UsuarioLogadoValue$.subscribe(
            (UsuarioLogado) => {
              this.Usuario = UsuarioLogado;

            }
          );

          if (
            this.Usuario.aud === '[ROLE_ADMIN]' ||
            this.Usuario.aud === '[ROLE_Secretaria]' ||
            this.Usuario.aud === '[ROLE_Medico]'
          ) {


            this.tokenService.setAuthTwof(true);
            this.router.navigate(['/Dashboard']);
          }

          else {

            this.tokenService.removeToken();
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Parece que você não tem permissão para acessar esta página',
            });
          }
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


  }
  ExisteUsuario(username: any): Observable<boolean> {
    return this.LoginService.buscarUsuarioExistente(username).pipe(
      map((dados) => !!dados) // Converts the result to a boolean
    );
  }
}
