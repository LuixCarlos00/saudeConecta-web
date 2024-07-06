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
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';


import { CadastroPacienteComponent } from '../features/cadastro/cadastro-paciente/cadastro-paciente.component';
import { CadastroComponent } from '../features/cadastro/cadastro/cadastro.component';
import { CadastroMedicoComponent } from '../features/cadastro/cadastro-medico/cadastro-medico.component';
import { CadastroUsuarioComponent } from '../features/cadastro/cadastro-usuario/cadastro-usuario.component';
import { RecuperaCadastroComponent } from '../features/recupera-Cadastro/recupera-cadastro/recupera-cadastro.component';
import { PesquisaMedicosComponent } from '../features/pesquisaMedicos/pesquisaMedicos.component';
import { TabelasPesquisasMedicosComponent } from '../features/pesquisaMedicos/tabelas-Pesquisas-Medicos/tabelas-Pesquisas-Medicos.component';

import { TrocaSenhaComponent } from '../features/troca-senha/troca-senha.component';
import { CadastroAdmComponent } from '../features/cadastro/cadastro-adm/cadastro-adm.component';
import { TabelaAgendaComponent } from '../features/agenda/tabela-agenda/tabela-agenda.component';
import { AgendaComponent } from '../features/agenda/agenda.component';
import { ObservacoesComponent } from '../features/agenda/tabela-agenda/Observacoes/Observacoes.component';
import { EditarConsultasComponent } from '../features/agenda/tabela-agenda/Editar-Consultas/Editar-Consultas.component';
import { TabelaEditarMedicosConsultasComponent } from '../features/agenda/tabela-agenda/Editar-Consultas/tabela-editar-Medicos-Consultas/tabela-editar-Medicos-Consultas.component';
import { TabelaAgendaStatusComponent } from '../features/agenda/tabela-agenda-status/tabela-agenda-status.component';
import { Template_PDFComponent } from '../features/agenda/template_PDF/template_PDF.component';
import { Template_PDF_ConcluidosComponent } from '../features/agenda/template_PDF_Concluidos/template_PDF_Concluidos.component';
import { CadastroSecretariaComponent } from '../features/cadastro/cadastro-secretaria/cadastro-secretaria.component';
import { GerenciamentoComponent } from '../features/gerenciamento/gerenciamento.component';
import { TabelaDePacientesComponent } from '../features/pesquisaPaciente/tabela-de-pacientes/tabela-de-pacientes.component';
import { PesquiasPacienteComponent } from '../features/pesquisaPaciente/pesquiasPaciente.component';
import { AvisosLembretesComponent } from '../features/agenda/tabela-agenda/Avisos-Lembretes/Avisos-Lembretes.component';
import { DashboardComponent } from '../features/dashboard/dashboard.component';
import { GraficoQntConsultasDiaAnteriorComponent } from '../features/dashboard/grafico-qnt-consultas-dia-anterior/grafico-qnt-consultas-dia-anterior.component';
import { GraficoAgendamentosDiasSemanasMesComponent } from '../features/dashboard/grafico-agendamentos-dias-semanas-mes/grafico-agendamentos-dias-semanas-mes.component';
import { GraficoSaldoComponent } from '../features/dashboard/grafico-saldo/grafico-saldo.component';
import { GraficoCategoriaMedicosComponent } from '../features/dashboard/grafico-categoria-medicos/grafico-categoria-medicos.component';






@NgModule({
  declarations: [
    CadastroPacienteComponent,
    CadastroMedicoComponent,
    CadastroComponent,
    CadastroUsuarioComponent,
    CadastroSecretariaComponent,
    PesquisaMedicosComponent,
    RecuperaCadastroComponent,
    HomeComponent,
    TabelasPesquisasMedicosComponent,
    TabelaDePacientesComponent,
    PesquiasPacienteComponent,
    TrocaSenhaComponent,
    CadastroAdmComponent,
    TabelaAgendaComponent,
    AgendaComponent,
    ObservacoesComponent,
    AvisosLembretesComponent,
    EditarConsultasComponent,
    TabelaEditarMedicosConsultasComponent,
    TabelaAgendaStatusComponent,
    Template_PDFComponent,
    Template_PDF_ConcluidosComponent,
    GerenciamentoComponent,
    DashboardComponent,
    GraficoAgendamentosDiasSemanasMesComponent,
    GraficoQntConsultasDiaAnteriorComponent,
    GraficoSaldoComponent,
    GraficoCategoriaMedicosComponent

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
    MatDialogModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule


  ],
})
export class PacienteModule {}
