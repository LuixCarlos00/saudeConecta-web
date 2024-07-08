import { Adiministrador } from './../../../util/variados/interfaces/administrado/adiministrador';
import { Secretaria } from './../../../util/variados/interfaces/secretaria/secretaria';
import { Medico } from './../../../util/variados/interfaces/medico/medico';
import { Paciente } from './../../../util/variados/interfaces/paciente/paciente';
import { UsuariosService } from './../../../service/usuario/usuarios.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';

@Component({
  selector: 'app-tabela-todos-usuarios',
  templateUrl: './tabela-todos-usuarios.component.html',
  styleUrls: ['./tabela-todos-usuarios.component.css']
})
export class TabelaTodosUsuariosComponent implements OnInit {

  dataSource: Usuario[] = [];

  Paciente: any[] = [];
  Medico: any[] = [];
  Secretaria: any[] = [];
  Administrador: any[] = [];

  constructor(private UsuariosService: UsuariosService) { }

  ngOnInit() {
    this.UsuariosService.BuscarTodosUsuarios().subscribe((data: { paciente: Paciente[], medico: Medico[], secretaria: Secretaria[], administrador: Adiministrador[] }) => {
      this.Paciente = data.paciente;
      this.Medico = data.medico;
      this.Secretaria = data.secretaria;
      this.Administrador = data.administrador;

      console.log(data, 'data');
      console.log(this. Paciente, 'Pacientes');
      console.log(this.Medico , 'Medicos');
      console.log(this.Secretaria , 'Secretarias');
      console.log(this.Administrador , 'Administradores');

      this.dataSource = [...this.Paciente, ...this.Medico, ...this.Secretaria, ...this.Administrador];

      console.log(this.dataSource, 'dataSource');

    });
  }

  displayedColumns = [
    'Codigo',
    'Login',
    'Categoria',
    'Email',
    'Status',
    'Autorização',
    'Deletar',
      'Seleciona',
  ];


}
