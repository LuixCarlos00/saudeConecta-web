import { Usuario } from "../usuario/usuario";

export interface Adiministrador {
  AdmCodigo: number;
  AdmNome: string;
  AdmUsuario: number;
  AdmStatus: number;
  AdmEmail: string;
  AdmCodigoAtorizacao: string;
  AdmDataCriacao: string;
  admUsuario?: Usuario

  admCodigo?: number;
}
