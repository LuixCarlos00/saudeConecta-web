import { Time } from '@angular/common';

export interface Consulta {
  ConCodigoConsulta: number;
  ConMedico: number;
  ConPaciente: number;
  ConDia_semana: string;
  ConHorario: string;
  ConData: Time;
  ConObservacoes: string;
  ConDadaCriacao: string;
  ConFormaPagamento: number;
}
