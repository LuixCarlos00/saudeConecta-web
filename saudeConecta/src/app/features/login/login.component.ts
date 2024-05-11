import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../service/paciente_service/paciente.service';
import { tokenService } from 'src/app/util/Token/token.service';

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
    private pacienteService: PacienteService,
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

    // No componente onde você chama fazerLogin
    this.pacienteService.fazerLogin(this.Usuario).subscribe(
      (response) => {
        console.log('Resposta recebida:', response);
        if (response.body && response.body.token) {
          const token = response.body.token;
          console.log('Token de acesso:', token);
          this.tokenService.token();
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        console.error('Erro durante o login:', error);
      }
    );
  }
}
