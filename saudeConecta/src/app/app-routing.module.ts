import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { CadastroPacienteComponent } from './features/paciente/cadastro-paciente/cadastro-paciente.component';

const routes: Routes = [

  {path:'',component:LoginComponent},
  {path:'cadastroPaciente',component:CadastroPacienteComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
