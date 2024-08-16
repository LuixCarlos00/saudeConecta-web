 import { elements } from 'chart.js';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { lastDayOfDecade } from 'date-fns';
import { UsuarioAdmService } from 'src/app/service/service-usuario-adm/usuario-adm.service';

@Component({
  selector: 'app-TrocaSenhaUsuarios',
  templateUrl: './TrocaSenhaUsuarios.component.html',
  styleUrls: ['./TrocaSenhaUsuarios.component.css'],
})
export class TrocaSenhaUsuariosComponent implements OnInit {
  novaSenha: string = '';
  showPassword: boolean = false; // Variável para controlar a visibilidade da senha

  constructor(
    public dialogRef: MatDialogRef<TrocaSenhaUsuariosComponent>,
    @Inject(MAT_DIALOG_DATA) public elements: { elements: any },

    private UsuarioAdmService: UsuarioAdmService
  ) {}

  ngOnInit() {}

  TrocaSenha() {
    if(this.novaSenha == ''){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Preencha todos os campos',
        showCloseButton: true,
      })
    } else {

      console.log('troca', this.elements.elements);

      // Verifica se a propriedade secreUsuario existe e possui um ID
      const codigo = this.elements.elements.secreUsuario?.id ||
                     this.elements.elements.usuario?.id ||
                     this.elements.elements.admUsuario?.id ||
                     0;

      console.log('o codigo é', codigo);

      const SenhaNovaDTO = {
          id:0,
          senhaAntiga : 'senhaAntiga',
          senhaNova: this.novaSenha,
          email: 'email',
      }

      this.UsuarioAdmService.TrocaSenhaDoUsuario( codigo, SenhaNovaDTO).subscribe((dados)=>{
         Swal.fire({
          icon: 'success',
          title: 'Alterado com sucesso',
          text: 'Senha alterada com sucesso',
          showCloseButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        })
       });
    }



  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Alterna a visibilidade da senha
  }
}
