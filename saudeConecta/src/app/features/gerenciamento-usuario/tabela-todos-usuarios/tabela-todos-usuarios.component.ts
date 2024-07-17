import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsuariosService } from './../../../service/usuario/usuarios.service';
import { GerenciamentoUsuariosService } from './../../../service/gerenciamento-usuarios/GerenciamentoUsuarios.service';
import { Adiministrador } from './../../../util/variados/interfaces/administrado/adiministrador';
import { Secretaria } from './../../../util/variados/interfaces/secretaria/secretaria';
import { Medico } from './../../../util/variados/interfaces/medico/medico';
import { Paciente } from './../../../util/variados/interfaces/paciente/paciente';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { el } from 'date-fns/locale';
import { DialogService } from 'src/app/util/variados/dialogo-confirmação/dialog.service';
import Swal from 'sweetalert2';
import { OutletContext } from '@angular/router';

@Component({
  selector: 'app-tabela-todos-usuarios',
  templateUrl: './tabela-todos-usuarios.component.html',
  styleUrls: ['./tabela-todos-usuarios.component.css'],
})
export class TabelaTodosUsuariosComponent implements OnInit {
  dataSource: Usuario[] = [];

  radioValue: number = 0;
  searchText: string = '';

  Paciente: any[] = [];
  Medico: any[] = [];
  Secretaria: any[] = [];
  Administrador: any[] = [];

  TodosUsuarios: any[] = [];

  constructor(
    private UsuariosService: UsuariosService,
    private GerenciamentoUsuariosService: GerenciamentoUsuariosService,
    private DialogService: DialogService
  ) {}

  ngOnInit() {
    this.GerenciamentoUsuariosService.RadioValue$.subscribe((radioValue) => {
      this.radioValue = radioValue;
      this.filterCategoriras();
    });

    this.GerenciamentoUsuariosService.searchText$.subscribe((searchText) => {
      this.searchText = searchText;
      this.dataSource = [];
      this.PesquisaDados();
    });

    this.UsuariosService.BuscarTodosUsuarios().subscribe(
      (data: {
        paciente: Paciente[];
        medico: Medico[];
        secretaria: Secretaria[];
        administrador: Adiministrador[];
      }) => {
        this.Paciente = data.paciente;
        this.Medico = data.medico;
        this.Secretaria = data.secretaria;
        this.Administrador = data.administrador;
        this.dataSource = [
          ...this.Paciente,
          ...this.Medico,
          ...this.Secretaria,
          ...this.Administrador,
        ];
        console.log(this.dataSource);

        this.TodosUsuarios = this.dataSource;
      }
    );
  }

  PesquisaDados() {
    let filteredData: Usuario[] = [];
    if (this.searchText) {
      const normalizeString = (str: string) => {
        return str
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase();
      };

      // Filtrando por texto de pesquisa
      if (this.searchText) {
        const dadosUpper = normalizeString(this.searchText.toString());

        filteredData = this.TodosUsuarios.filter((usuario) => {
          const nome =
            usuario.paciNome ||
            usuario.medNome ||
            usuario.secreNome ||
            usuario.admNome ||
            '';
          const email =
            usuario.paciEmail ||
            usuario.medEmail ||
            usuario.secreEmail ||
            usuario.admEmail ||
            '';
          return (
            normalizeString(nome).includes(dadosUpper) ||
            normalizeString(email).includes(dadosUpper)
          );
        });

        if (filteredData.length === 0) {
          this.DialogService.NaoFoiEncontradoConsultasComEssesParametros();
        }
      }
    }
    this.dataSource = [];
    this.dataSource = filteredData;
  }

  filterCategoriras() {
    let filteredData: Usuario[] = [];

    if (this.radioValue) {
      if (this.radioValue == 1) {
        for (let i = 0; i < this.Paciente.length; i++) {
          filteredData.push(this.Paciente[i]);
          this.dataSource = [];
        }
      } else if (this.radioValue == 2) {
        for (let i = 0; i < this.Medico.length; i++) {
          filteredData.push(this.Medico[i]);
          this.dataSource = [];
        }
      } else if (this.radioValue == 3) {
        for (let i = 0; i < this.Secretaria.length; i++) {
          filteredData.push(this.Secretaria[i]);
          this.dataSource = [];
        }
      } else if (this.radioValue == 4) {
        for (let i = 0; i < this.Administrador.length; i++) {
          filteredData.push(this.Administrador[i]);
          this.dataSource = [];
        }
      } else if (this.radioValue == 5) {
        for (let i = 0; i < this.dataSource.length; i++) {
          filteredData = this.TodosUsuarios;
          this.dataSource = [];
        }
      }
    }

    this.dataSource = filteredData;
  }

  deletar(element: any) {
    let codigo: any;

    if (element.medCodigo && element.usuario && element.usuario.id) {
      codigo = element.usuario.id;
    } else if (
      element.secreCodigo &&
      element.secreUsuario &&
      element.secreUsuario.id
    ) {
      codigo = element.secreUsuario.id;
    } else if (
      element.admCodigo &&
      element.admUsuario &&
      element.admUsuario.id
    ) {
      codigo = element.admUsuario.id;
    } else if (element.paciCodigo) {
      codigo = element.paciCodigo;
    }

    if (codigo) {
      this.UsuariosService.deletarUsuario(codigo).subscribe(
        (dados) => {
          Swal.fire({
            icon: 'success',
            title: 'Deletado com sucesso',
            showCloseButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
              this.DialogService.DeletadoComSucesso();
            }
          });
        },
        (error) => {
          this.handleHttpError(error);
        }
      );
    }
  }

  private handleHttpError(error: any) {
    console.log(error); // Exibir o erro completo no console para depuração

    let errorMessage = 'Erro desconhecido ao deletar.';

    if (error.error) {
      if (
        error.error.includes('Cannot delete') &&
        error.error.includes('consulta_ibfk_1') &&
        error.error.includes('ConMedico') &&
        error.error.includes('-TratadorDeErros - T03#')
      ) {
        errorMessage =
          'Não é possivel deletar esse usuario, pois, existem registros relacionados a ele!';
      } else {
        errorMessage = error.error; // Usar a mensagem de erro específica retornada pelo servidor
      }
    }

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });

    console.error('Erro ao cadastrar:', error);
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
