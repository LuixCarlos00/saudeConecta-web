import { Adiministrador } from "../administrado/adiministrador";
import { Medico } from "../medico/medico";
import { Paciente } from "../paciente/paciente";

export interface Tabela {
  consulta: string;
  medico: Medico;
  paciente: Paciente;
  diaSemana: string;
  data: string;
  horario: string;
  observacao: string;
  dadaCriacao: string;
  status: number;
  adm :Adiministrador
  formaPagamento : number
}

