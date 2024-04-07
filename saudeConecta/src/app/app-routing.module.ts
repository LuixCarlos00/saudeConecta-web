import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
 import { NotFoudComponent } from './util/Erros/Erro404/not-foud.component';
import { GuardaRotasLogin } from './features/login/guards/GuardaRotasLogin';
import { CadastroUsuarioComponent } from './features/cadastro/cadastro-usuario/cadastro-usuario.component';
import { GuardaRotasCadastraUsuario } from './features/cadastro/cadastro-usuario/guard/GuardaRotasCadastraUsuario';
import { CadastroComponent } from './features/cadastro/cadastro/cadastro.component';
import { GuardaRotasCadastra } from './features/cadastro/cadastro/guards/GuardaRotasCadastro';
import { GuardaRotasCadastroPaciente } from './features/cadastro/cadastro-paciente/guard/GuardaRotasCadastroPaciente';
import { CadastroPacienteComponent } from './features/cadastro/cadastro-paciente/cadastro-paciente.component';
import { CadastroMedicoComponent } from './features/cadastro/cadastro-medico/cadastro-medico.component';
import { RecuperaCadastroComponent } from './features/recupera-Cadastro/recupera-cadastro/recupera-cadastro.component';
import { RecuperaLoginComponent } from './features/recupera-Cadastro/recupera-login/recupera-login.component';
import { RecuperaSenhaComponent } from './features/recupera-Cadastro/recupera-senha/recupera-senha.component';

const routes: Routes = [



  {path:'',component:LoginComponent, canActivate: [GuardaRotasLogin]},//1

  {path:'cadastroUsuario',component:CadastroUsuarioComponent, canActivate:[GuardaRotasCadastraUsuario]},//2

  {path:'cadastro',component:CadastroComponent,canActivate:[GuardaRotasCadastra]},//3

  {path:'cadastroPaciente',component:CadastroPacienteComponent, canActivate:[GuardaRotasCadastroPaciente]},//4

  {path:'cadastroMedico',component:CadastroMedicoComponent, canActivate:[GuardaRotasCadastroPaciente]},//4


  {path:'recuperaCadastro',component:RecuperaCadastroComponent,  },//4

  {path:'recuperaLogin',component:RecuperaLoginComponent,  },//4

  {path:'recuperaSenha',component:RecuperaSenhaComponent,  },//4






  { path: '**', pathMatch: 'full', component: NotFoudComponent },

];

@NgModule({
   imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
