import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { UsuarioAdmService } from './../../service/service-usuario-adm/usuario-adm.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { el } from 'date-fns/locale';
import { tokenService } from "src/app/util/Token/Token.service";
import { Adiministrador } from 'src/app/util/variados/interfaces/administrado/adiministrador';
import Swal from 'sweetalert2';
import { map, take } from 'rxjs';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';

@Component({
  selector: 'app-troca-senha',
  templateUrl: './troca-senha.component.html',
  styleUrls: ['./troca-senha.component.css'],
})
export class TrocaSenhaComponent implements OnInit {
  trocaMinhaSenha: boolean = false;
  EsqueciMinhaSenha: boolean = false;

  UsuarioLogado!: Usuario;

  FormularioEsqueciMinhaSenha!: FormGroup;
  FormularioTrocaSenha!: FormGroup;

  emailValido: Boolean = false;
  codigoDeSegurancaValidao: Boolean = false;
  PesquisandoEmail: Boolean = false;
  constructor(
    private form: FormBuilder,
    private usuarioAdmService: UsuarioAdmService,
    private tokenService: tokenService
  ) {
    this.tokenService.decodificaToken();
    this.tokenService.UsuarioLogadoValue$.subscribe((paciente) => {
      if (paciente) {

        this.UsuarioLogado = paciente;
      }
    });
  }

  ngOnInit(): void {
    this.FormularioEsqueciMinhaSenha = this.form.group({
      email: ['', Validators.required],
      NovaSenha: ['', Validators.required],
      codigo: [''],
    });

    this.FormularioTrocaSenha = this.form.group({
      email: ['', Validators.required],
      SenhaAntiga: ['', Validators.required],
      SenhaNova: ['', Validators.required],
    });
  }

  EsqueciASenha() {
    this.EsqueciMinhaSenha = true;
    this.trocaMinhaSenha = false;
  }

  TrocarSenha() {
    this.EsqueciMinhaSenha = false;
    this.trocaMinhaSenha = true;
  }

  enviar() {
    if (this.trocaMinhaSenha) {
      const email = this.FormularioTrocaSenha.value.email;
      const SenhaAntiga = this.FormularioTrocaSenha.value.SenhaAntiga;
      const SenhaNova = this.FormularioTrocaSenha.value.SenhaNova;
      const idUsuario = this.UsuarioLogado.id;

      const administrador = {
        id: idUsuario,
        senhaAntiga: SenhaAntiga,
        senhaNova: SenhaNova,
        email: email,
      };

      if (email && SenhaAntiga && SenhaNova) {
        this.usuarioAdmService.TrocaSenha(administrador).subscribe(
          (response) => {

              this.FormularioTrocaSenha.reset();
              Swal.fire({
                icon: 'success',
                title: ' OK...',
                text: 'Senha alterada com sucesso',
              });

          },
          (error) => {
            console.log(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Senha inválida',
            });
          }
        );
      }
    } else if (this.EsqueciMinhaSenha) {

      this.PesquisandoEmail = true;
      const email = this.FormularioEsqueciMinhaSenha.value.email;

      this.usuarioAdmService
        .ObeterCodigoParaRecuperacaoDeSenhaPassandoOEmail(email)
        .subscribe((response) => {
          if (response === 'Email invalido') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Email inválido',
            });
            this.emailValido = false;
            this.PesquisandoEmail = false;
          } else {
            Swal.fire({
              icon: 'success',
              title: ' OK...',
              text: 'Foi enviado um codigo para o seu email, verifique a sua caixa de entrada',
            });
            this.emailValido = true;
            this.PesquisandoEmail = false;
          }
        });


    }
  }










  // ============================= ESQUECI A SENHA ==================================





  ConfirmaCodigoDeSeguraca() {
    const codigo = this.FormularioEsqueciMinhaSenha.value.codigo;
    if (codigo.length === 6) {
      this.usuarioAdmService.ConfirmaCodigoDeSeguraca(codigo).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: ' OK...',
            text: 'Código validado com sucesso',
          });
          this.codigoDeSegurancaValidao = true;
        },

        (error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Código inválido',
          });
          this.codigoDeSegurancaValidao = false;
        }
      );
    }
  }




  ConfirmaNovaSenha_ESQUECI_A_SENHA() {
    const NovaSenha = this.FormularioEsqueciMinhaSenha.get('NovaSenha')?.value;
    const idUsuario = this.UsuarioLogado.id;

    const administrador = {
      id: idUsuario,
      senhaAntiga: 'senhaAntiga',
      senhaNova: NovaSenha,
      email: 'email',
    };

    this.usuarioAdmService.esqueciMinhaSenha(administrador).subscribe(
      (response) => {
        this.FormularioEsqueciMinhaSenha.reset();
        Swal.fire({
          icon: 'success',
          title: ' OK...',
          text: 'Senha alterada com sucesso',
          showCloseButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });

      },
      (error) => {
        console.log(error);
        this.FormularioEsqueciMinhaSenha.reset();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Erro ao alterar senha',
        });
      }
    );
  }
} //fim do componente
