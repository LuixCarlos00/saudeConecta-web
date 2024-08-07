import { GerenciamentoUsuarioComponent } from './features/gerenciamento-usuario/gerenciamento-usuario.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { NotFoudComponent } from './util/Erros/Erro404/not-foud.component';
import { GuardaRotasLogin } from './features/login/guards/GuardaRotasLogin';
import { CadastroUsuarioComponent } from './features/cadastro/cadastro-usuario/cadastro-usuario.component';
import { GuardaRotasCadastraUsuario } from './features/cadastro/cadastro-usuario/guard/GuardaRotasCadastraUsuario';
import { CadastroComponent } from './features/cadastro/cadastro/cadastro.component';
import { GuardaRotasCadastra } from './features/cadastro/cadastro/guards/GuardaRotasCadastro';
import { GuardaRotasCadastroPaciente } from './features/cadastro/cadastro-paciente/guard/GuardaRotasCadastroPaciente';
import { CadastroPacienteComponent } from './features/cadastro/cadastro-paciente/cadastro-paciente.component';
import { CadastroMedicoComponent } from './features/cadastro/cadastro-medico/cadastro-medico.component';
import { RecuperaCadastroComponent } from './features/recupera-Cadastro/recupera-cadastro/recupera-cadastro.component';

import { PesquisaMedicosComponent } from './features/pesquisaMedicos/pesquisaMedicos.component';

import { AgendaComponent } from './features/agenda/agenda.component';
 import { TrocaSenhaComponent } from './features/troca-senha/troca-senha.component';
import { CadastroAdmComponent } from './features/cadastro/cadastro-adm/cadastro-adm.component';
import { GuardaRotasHome } from './features/dashboard/guards/GuardaRotasHome';
import { CadastroSecretariaComponent } from './features/cadastro/cadastro-secretaria/cadastro-secretaria.component';
import { GerenciamentoComponent } from './features/gerenciamento/gerenciamento.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProntuarioComponent } from './features-Medico/prontuario/prontuario.component';
import { TabelaAgendaMedicoComponent } from './features-Medico/tabela-agenda-medico/tabela-agenda-medico.component';
import { HistoricosComponent } from './features-Medico/historicos/historicos.component';


const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [GuardaRotasLogin] },

  {
    path: 'cadastroUsuario',
    component: CadastroUsuarioComponent,
    canActivate: [GuardaRotasCadastraUsuario],
  },

  {
    path: 'cadastroadmin',
    component: CadastroAdmComponent,
    canActivate: [GuardaRotasHome],
  },

  {
    path: 'cadastro',
    component: CadastroComponent,
    canActivate: [GuardaRotasCadastra],
  },

  {
    path: 'cadastroPaciente',
    component: CadastroPacienteComponent,
    canActivate: [GuardaRotasCadastroPaciente],
  },

  {
    path: 'cadastroMedico',
    component: CadastroMedicoComponent,
    canActivate: [GuardaRotasCadastroPaciente],
  },

  {
    path: 'cadastroSecretaria',
    component: CadastroSecretariaComponent,
    canActivate: [GuardaRotasCadastroPaciente],
  },

  {
    path: 'recuperaCadastro',
    component: RecuperaCadastroComponent,
    canActivate: [GuardaRotasHome],
  },

  {
    path: 'gerenciamento',
    component: GerenciamentoComponent,
    canActivate: [GuardaRotasHome],
  },

  {
    path: 'Dashboard',
    component: DashboardComponent,
    canActivate: [GuardaRotasHome],
  },

  {
    path: 'agenda',
    component: PesquisaMedicosComponent,
    canActivate: [GuardaRotasHome],
  },

  {
    path: 'Gerenciamento-Usuarios',
    component: GerenciamentoUsuarioComponent,
    canActivate: [GuardaRotasHome],
  },

  {
    path: 'Historico',
    component: HistoricosComponent,
    canActivate: [GuardaRotasHome],
  },

  {
    path: 'trocaSenha',
    component: TrocaSenhaComponent,
    canActivate: [GuardaRotasHome],
  },

  {
    path: 'Agenda-Medico',
    component: TabelaAgendaMedicoComponent,
    canActivate: [GuardaRotasHome],
  },

  {
    path: 'Prontuario',
    component: ProntuarioComponent,
    canActivate: [GuardaRotasHome],
  },

  {
    path: '**',
    pathMatch: 'full',
    component: NotFoudComponent,
    canActivate: [GuardaRotasHome],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
