import { TrocaSenhaComponent } from './../features/troca-senha/troca-senha.component';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';



import { CadastroPacienteComponent } from '../features/cadastro/cadastro-paciente/cadastro-paciente.component';
import { CadastroComponent } from '../features/cadastro/cadastro/cadastro.component';
import { CadastroMedicoComponent } from '../features/cadastro/cadastro-medico/cadastro-medico.component';
import { CadastroUsuarioComponent } from '../features/cadastro/cadastro-usuario/cadastro-usuario.component';
import { RecuperaCadastroComponent } from '../features/recupera-Cadastro/recupera-cadastro/recupera-cadastro.component';
import { PesquisaMedicosComponent } from '../features/pesquisaMedicos/pesquisaMedicos.component';
import { TabelasPesquisasMedicosComponent } from '../features/pesquisaMedicos/tabelas-Pesquisas-Medicos/tabelas-Pesquisas-Medicos.component';

import { CadastroAdmComponent } from '../features/cadastro/cadastro-adm/cadastro-adm.component';
import { AgendaComponent } from '../features/agenda/agenda.component';
import { ObservacoesComponent } from '../features/agenda/Observacoes/Observacoes.component';
import { EditarConsultasComponent } from '../features/agenda/Editar-Consultas/Editar-Consultas.component';
import { Template_PDFComponent } from '../features/agenda/template_PDF/template_PDF.component';
import { CadastroSecretariaComponent } from '../features/cadastro/cadastro-secretaria/cadastro-secretaria.component';
import { GerenciamentoComponent } from '../features/gerenciamento/gerenciamento.component';
import { TabelaDePacientesComponent } from '../features/pesquisaPaciente/tabela-de-pacientes/tabela-de-pacientes.component';
import { PesquiasPacienteComponent } from '../features/pesquisaPaciente/pesquiasPaciente.component';
import { AvisosLembretesComponent } from '../features/agenda/Avisos-Lembretes/Avisos-Lembretes.component';
import { DashboardComponent } from '../features/dashboard/dashboard.component';
import { GraficoQntConsultasDiaAnteriorComponent } from '../features/dashboard/grafico-qnt-consultas-dia-anterior/grafico-qnt-consultas-dia-anterior.component';
import { GraficoAgendamentosDiasSemanasMesComponent } from '../features/dashboard/grafico-agendamentos-dias-semanas-mes/grafico-agendamentos-dias-semanas-mes.component';
import { GraficoSaldoComponent } from '../features/dashboard/grafico-saldo/grafico-saldo.component';
import { GraficoCategoriaMedicosComponent } from '../features/dashboard/grafico-categoria-medicos/grafico-categoria-medicos.component';
import { GerenciamentoUsuarioComponent } from '../features/gerenciamento-usuario/gerenciamento-usuario.component';
import { TabelaTodosUsuariosComponent } from '../features/gerenciamento-usuario/tabela-todos-usuarios/tabela-todos-usuarios.component';
import { TabelaAgendaMedicoComponent } from '../features-Medico/tabela-agenda-medico/tabela-agenda-medico.component';
import { ProntuarioComponent } from '../features-Medico/prontuario/prontuario.component';
import { DiagnosticoComponent } from '../features-Medico/gerenciamentoProntuario/D_diagnostico/diagnostico.component';
import { PediatriaExamesFisicosComponent } from '../features-Medico/gerenciamentoProntuario/A_pediatria-exames-fisicos/pediatria-exames-fisicos.component';
import { PrescricaoComponent } from '../features-Medico/gerenciamentoProntuario/E_prescricao/prescricao.component';
import { ImprimirPrescricaoComponent } from '../features-Medico/impressoes-PDF/ImprimirPrescricao/ImprimirPrescricao.component';
import { ImprimirSoliciatacaoDeExamesComponent } from '../features-Medico/impressoes-PDF/ImprimirSoliciatacaoDeExames/ImprimirSoliciatacaoDeExames.component';
import { HistoricosComponent } from '../features-Medico/historicos/historicos.component';
import { DadosPessoaisComponent } from '../features-Medico/DadosPessoais/DadosPessoais.component';
import { AtestadoPacienteComponent } from '../features-Medico/impressoes-PDF/AtestadoPaciente/AtestadoPaciente.component';
import { TrocaSenhaUsuariosComponent } from '../features/gerenciamento-usuario/tabela-todos-usuarios/TrocaSenhaUsuarios/TrocaSenhaUsuarios.component';
import { MatBadgeModule } from '@angular/material/badge';
import { HistoricoCompletoComponent } from '../features-Medico/impressoes-PDF/historicoCompleto/historicoCompleto.component';
import { TabelaEditarMedicosConsultasComponent } from '../features/agenda/Editar-Consultas/tabela-editar-Medicos-Consultas/tabela-editar-Medicos-Consultas.component';


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
    AgendaComponent,
    ObservacoesComponent,
    AvisosLembretesComponent,
    EditarConsultasComponent,
    TabelaEditarMedicosConsultasComponent,
    Template_PDFComponent,

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

    DiagnosticoComponent,
    PediatriaExamesFisicosComponent,
    PrescricaoComponent,
    ImprimirPrescricaoComponent,
    ImprimirSoliciatacaoDeExamesComponent,
    HistoricosComponent,
    DadosPessoaisComponent,
    AtestadoPacienteComponent,
    TrocaSenhaUsuariosComponent,
    HistoricoCompletoComponent

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
    MatBadgeModule,




  ],
})
export class PacienteModule { }
