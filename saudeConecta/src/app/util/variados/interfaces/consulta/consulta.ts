import { Time } from '@angular/common';

export interface Consulta {
  ConCodigoConsulta: number;
  ConMedico: number;
  ConPaciente: number;
  ConDia_semana: string;
  ConHorario: string;
  ConData: string;
  ConObservacoes: string;
  ConDadaCriacao: string;
  ConFormaPagamento: number;
  ConStatus: number;
  ConAdm: number;
}
