// import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { ModelService } from 'src/app/service/Model_service/Model.service';
// import { tokenService } from '../../Token/token.service';

// @Component({
//   selector: 'app-cabecalho',
//   templateUrl: './cabecalho.component.html',
//   styleUrls: ['./cabecalho.component.css'],
// })
// export class CabecalhoComponent implements OnInit {
//   //
//   //
//   //
//   AcessoPermitido: string = '';

//   Usuario: any;

//   constructor(
//     public ModelService: ModelService,
//     private router: Router,
//     private tokenService: tokenService
//   ) {}

//   ngOnInit() {
//     this.tokenService.token();
//     this.tokenService.UsuarioLogadoValue$.subscribe((paciente) => {
//       if (paciente) this.Usuario = paciente;
//       console.log(paciente, 'paciente');
//     });


//     this.estaLogado();
//   }

//   estaLogado(): Boolean {
//     return this.ModelService.verificarLogin();
//   }

//   logout() {
//     console.log('Logout clicked');
//     this.ModelService.logout();
//   }

//   Menu() {
//     this.router.navigate(['home']);
//   }

//   TrocaSenha() {
//     this.router.navigate(['trocaSenha']);
//   }

//   cadastraPaciente() {
//     this.router.navigate(['cadastroPaciente']);
//   }

//   cadastraNovoUsuario() {
//     this.router.navigate(['cadastroUsuario']);
//   }

//   TipoUsuario(): any {
//     //return this.ModelService.pegarTipoUsuario();
//   }

//   /// colocar o cadastro de usuario antes de cadastra medico
// }
