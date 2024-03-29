import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { CadastroPacienteComponent } from './features/paciente/cadastro/cadastro-paciente/cadastro-paciente.component';
import { CadastroComponent } from './features/paciente/cadastro/cadastro/cadastro.component';
import { CadastroMedicoComponent } from './features/paciente/cadastro/cadastro-medico/cadastro-medico/cadastro-medico.component';
import { CadastroUsuarioComponent } from './features/paciente/cadastro/cadastro-usuario/cadastro-usuario.component';

const routes: Routes = [



  {path:'',component:LoginComponent},
  {path:'cadastro',component:CadastroComponent},
  {path:'cadastroPaciente',component:CadastroPacienteComponent},
  {path:'cadastroMedico',component:CadastroMedicoComponent},
  {path:'cadastroUsuario',component:CadastroUsuarioComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
