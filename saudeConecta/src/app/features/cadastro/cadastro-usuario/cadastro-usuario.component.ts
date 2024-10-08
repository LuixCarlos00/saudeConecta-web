import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/service/usuario/usuarios.service';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css'],
})
export class CadastroUsuarioComponent implements OnInit, OnChanges {
  FormularioUsuario!: FormGroup;

  @Input() RolesUsuario!: any;
 // @Output() usuarioCadastrado = new EventEmitter<Usuario>();

  Usuario: Usuario = {
    id: 0,
    aud: '',
    exp: '',
    iss: '',
    sub: '',
  };

  constructor(
    private form: FormBuilder,
    private usuariosService: UsuariosService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarioCadastrado']) {
      this.FormularioUsuario.reset();
    }
  }

  ngOnInit(): void {
    this.FormularioUsuario = this.form.group({
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  cadatraUsuario() {
    if (this.FormularioUsuario.valid) {
      const Usuario = {
        login: this.FormularioUsuario.get('login')?.value,
        senha: this.FormularioUsuario.get('password')?.value,
        tipoUsuario: this.RolesUsuario,
        Status: 1,
      };

      this.usuariosService.cadastrarUsuario(Usuario).subscribe(
        (dados) => {
       //   this.usuarioCadastrado.emit(dados.body.usuarioView);


          this.FormularioUsuario.disable();
          setTimeout(() => {
            this.FormularioUsuario.reset();
          }, 10000);
        },
        (error) => {
          let errorMessage = 'Erro ao cadastrar usuário';
          if (error.status === 400) {
            errorMessage = 'Erro ao cadastrar usuário: [Login já existente]';
          } else {
            errorMessage = `Erro durante a requisição: ${error.message}`;
          }
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: errorMessage,
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulário inválido',
        text: 'Verifique os campos obrigatórios.',
      });
    }
  }
}
