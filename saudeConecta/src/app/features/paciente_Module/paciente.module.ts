import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { TelaInicialComponent } from '../tela-inicial/tela-inicial.component';
import { CadastroPacienteComponent } from '../cadastro/cadastro-paciente/cadastro-paciente.component';
import { CadastroComponent } from '../cadastro/cadastro/cadastro.component';
import { CadastroMedicoComponent } from '../cadastro/cadastro-medico/cadastro-medico.component';
import { CadastroUsuarioComponent } from '../cadastro/cadastro-usuario/cadastro-usuario.component';
import { RecuperaCadastroComponent } from '../recupera-Cadastro/recupera-cadastro/recupera-cadastro.component';
import { RecuperaLoginComponent } from '../recupera-Cadastro/recupera-login/recupera-login.component';
import { RecuperaSenhaComponent } from '../recupera-Cadastro/recupera-senha/recupera-senha.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    CadastroPacienteComponent,
    CadastroMedicoComponent,
    CadastroComponent,
    CadastroUsuarioComponent,
    TelaInicialComponent,
    RecuperaCadastroComponent,
    RecuperaLoginComponent,
    RecuperaSenhaComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    MatExpansionModule,
    BrowserModule,
    HttpClientModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
})
export class PacienteModule {}
