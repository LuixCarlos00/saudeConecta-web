import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastroPacienteComponent } from '../cadastro/cadastro-paciente/cadastro-paciente.component';
import { CadastroMedicoComponent } from '../cadastro/cadastro-medico/cadastro-medico/cadastro-medico.component';
import { CadastroComponent } from '../cadastro/cadastro/cadastro.component';
import {MatExpansionModule} from '@angular/material/expansion';
 import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
 import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CadastroUsuarioComponent } from '../cadastro/cadastro-usuario/cadastro-usuario.component';
import {MatSelectModule} from '@angular/material/select';
import { TelaInicialComponent } from '../../tela-inicial/tela-inicial.component';

@NgModule({
  declarations: [
    CadastroPacienteComponent,
    CadastroMedicoComponent,
    CadastroComponent,
    CadastroUsuarioComponent,
    TelaInicialComponent


  ],
  exports:[],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    MatExpansionModule,
    BrowserModule,
     HttpClientModule,
     MatSelectModule
  ]
})
export class PacienteModule { }
