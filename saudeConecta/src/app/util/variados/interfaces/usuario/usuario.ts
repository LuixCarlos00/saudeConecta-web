export interface Usuario {


  id:number ,
  login:string,
  senha:string,
  tipoUsuario: string;
  status : string,

  aud?:string

}


