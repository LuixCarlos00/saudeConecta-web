import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HomeComponent } from '../features/home/home.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';




import { CadastroPacienteComponent } from '../features/cadastro/cadastro-paciente/cadastro-paciente.component';
import { CadastroComponent } from '../features/cadastro/cadastro/cadastro.component';
import { CadastroMedicoComponent } from '../features/cadastro/cadastro-medico/cadastro-medico.component';
import { CadastroUsuarioComponent } from '../features/cadastro/cadastro-usuario/cadastro-usuario.component';
import { RecuperaCadastroComponent } from '../features/recupera-Cadastro/recupera-cadastro/recupera-cadastro.component';
import { PesquisaMedicosComponent } from '../features/pesquisaMedicos/pesquisaMedicos.component';
import { TabelasPesquisasMedicosComponent } from '../features/pesquisaMedicos/tabelas-Pesquisas-Medicos/tabelas-Pesquisas-Medicos.component';
import { CriaConsultaComponent } from '../features/cria-consulta/cria-consulta.component';
import { TabelaDePacientesComponent } from '../features/cria-consulta/tabela-de-pacientes/tabela-de-pacientes.component';
import { TrocaSenhaComponent } from '../features/troca-senha/troca-senha.component';






@NgModule({
  declarations: [
    CadastroPacienteComponent,
    CadastroMedicoComponent,
    CadastroComponent,
    CadastroUsuarioComponent,
    PesquisaMedicosComponent,
    RecuperaCadastroComponent,
    HomeComponent,
    TabelasPesquisasMedicosComponent,
    CriaConsultaComponent,
    TabelaDePacientesComponent,
    TrocaSenhaComponent

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
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    FlexLayoutModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule


  ],
})
export class PacienteModule {}
