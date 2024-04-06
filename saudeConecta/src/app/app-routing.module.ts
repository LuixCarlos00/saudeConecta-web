import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { CadastroPacienteComponent } from './features/paciente/cadastro/cadastro-paciente/cadastro-paciente.component';
import { CadastroComponent } from './features/paciente/cadastro/cadastro/cadastro.component';
import { CadastroMedicoComponent } from './features/paciente/cadastro/cadastro-medico/cadastro-medico/cadastro-medico.component';
import { CadastroUsuarioComponent } from './features/paciente/cadastro/cadastro-usuario/cadastro-usuario.component';
import { NotFoudComponent } from './util/Erros/Erro404/not-foud.component';
import { GuardaRotasLogin } from './features/login/guards/GuardaRotasLogin';
import { GuardaRotasCadastra } from './features/paciente/cadastro/cadastro/guards/GuardaRotasCadastro';

const routes: Routes = [



  {path:'',component:LoginComponent,
  //canActivate: [GuardaRotasLogin]
},
  {path:'cadastro',component:CadastroComponent
 // ,canActivate:[GuardaRotasCadastra]
},
  {path:'cadastroPaciente',component:CadastroPacienteComponent},
  {path:'cadastroMedico',component:CadastroMedicoComponent},
  {path:'cadastroUsuario',component:CadastroUsuarioComponent},


  { path: '**', pathMatch: 'full', component: NotFoudComponent },

];

@NgModule({
   imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
