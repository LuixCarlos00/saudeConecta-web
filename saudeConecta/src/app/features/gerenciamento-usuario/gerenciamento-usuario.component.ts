import { GerenciamentoService } from 'src/app/service/gerenciamento/gerenciamento.service';
import { Component, OnInit } from '@angular/core';
import { GerenciamentoUsuariosService } from 'src/app/service/gerenciamento-usuarios/GerenciamentoUsuarios.service';
import { DialogService } from 'src/app/util/variados/dialogo-confirmação/dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { CadastroMedicoComponent } from '../cadastro/cadastro-medico/cadastro-medico.component';
import { CadastroPacienteComponent } from '../cadastro/cadastro-paciente/cadastro-paciente.component';
import { CadastroSecretariaComponent } from '../cadastro/cadastro-secretaria/cadastro-secretaria.component';

@Component({
  selector: 'app-gerenciamento-usuario',
  templateUrl: './gerenciamento-usuario.component.html',
  styleUrls: ['./gerenciamento-usuario.component.css'],
})
export class GerenciamentoUsuarioComponent implements OnInit {

  radioValue: number = 0;
  searchText: string = '';

  constructor(
    private gerenciamentoUsuariosService: GerenciamentoUsuariosService,
    private dialog : MatDialog
  ) {}

  ngOnInit() {}

  PesquisaDados() {
    this.radioValue = 0;
    this.gerenciamentoUsuariosService.changeSearchTextSubject(this.searchText);
  }



  PesquisaCategoria() {
    this.searchText = '';
    this.gerenciamentoUsuariosService.changeRadioValueSubject(this.radioValue);
  }


  AdicionarMedico() {
    this.dialog.open(CadastroMedicoComponent, {
      width: '800px',
      height: '700px',

    });
    }


    AdicionarPaciente() {
    this.dialog.open(CadastroPacienteComponent, {
      width: '800px',
      height: '700px',

    });
    }

    AdicionarSecretaria() {
      this.dialog.open(CadastroSecretariaComponent, {
      width: '800px',
      height: '600px',

    });
      }

}
