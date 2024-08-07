import { GerenciamentoProntuarioComponent } from '../features-Medico/gerenciamentoProntuario/gerenciamentoProntuario.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {MatAutocompleteModule} from '@angular/material/autocomplete';



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
import { GerenciamentoUsuarioComponent } from '../features/gerenciamento-usuario/gerenciamento-usuario.component';
import { TabelaTodosUsuariosComponent } from '../features/gerenciamento-usuario/tabela-todos-usuarios/tabela-todos-usuarios.component';
import { TabelaAgendaMedicoComponent } from '../features-Medico/tabela-agenda-medico/tabela-agenda-medico.component';
import { ProntuarioComponent } from '../features-Medico/prontuario/prontuario.component';
import { FinalizarComponent } from '../features-Medico/gerenciamentoProntuario/finalizar/finalizar.component';
import { QueixaPrincipalComponent } from '../features-Medico/gerenciamentoProntuario/C_queixa-principal/queixa-principal.component';
import { AtestadoComponent } from '../features-Medico/gerenciamentoProntuario/F_atestado/atestado.component';
import { DiagnosticoComponent } from '../features-Medico/gerenciamentoProntuario/D_diagnostico/diagnostico.component';
import { PediatriaExamesFisicosComponent } from '../features-Medico/gerenciamentoProntuario/A_pediatria-exames-fisicos/pediatria-exames-fisicos.component';
import { PrescricaoComponent } from '../features-Medico/gerenciamentoProntuario/E_prescricao/prescricao.component';
 import { AnamneseCondutaComponent } from '../features-Medico/gerenciamentoProntuario/B_anamnese-conduta/anamnese-conduta.component';
import { ImprimirPrescricaoComponent } from '../features-Medico/impressoes-PDF/ImprimirPrescricao/ImprimirPrescricao.component';
import { ImprimirSoliciatacaoDeExamesComponent } from '../features-Medico/impressoes-PDF/ImprimirSoliciatacaoDeExames/ImprimirSoliciatacaoDeExames.component';
import { HistoricosComponent } from '../features-Medico/historicos/historicos.component';

@NgModule({
  declarations: [
    CadastroPacienteComponent,
    CadastroMedicoComponent,
    CadastroComponent,
    CadastroUsuarioComponent,
    CadastroSecretariaComponent,
    PesquisaMedicosComponent,
    RecuperaCadastroComponent,

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
    GraficoCategoriaMedicosComponent,
    GerenciamentoUsuarioComponent,
    TabelaTodosUsuariosComponent,
    TabelaAgendaMedicoComponent,
    ProntuarioComponent,
    GerenciamentoProntuarioComponent,
    FinalizarComponent,
    QueixaPrincipalComponent,
    AtestadoComponent,
    AnamneseCondutaComponent,
    DiagnosticoComponent,
    PediatriaExamesFisicosComponent,
    PrescricaoComponent,
    ImprimirPrescricaoComponent,
    ImprimirSoliciatacaoDeExamesComponent,
    HistoricosComponent

  ],
  exports: [],

  imports: [
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
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatRadioModule,

  ],
})
export class PacienteModule {}
