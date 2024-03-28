import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastroPacienteComponent } from '../cadastro-paciente/cadastro-paciente.component';



@NgModule({
  declarations: [CadastroPacienteComponent],
  exports:[],
  imports: [
    CommonModule
  ]
})
export class PacienteModule { }
