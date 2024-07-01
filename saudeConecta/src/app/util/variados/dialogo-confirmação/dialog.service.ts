import { ConsultaService } from 'src/app/service/service-consulta/consulta.service';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalendarDialogComponent } from '../calendarDialog/calendarDialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {




constructor(
   private _snackBar: MatSnackBar,
   private dialog: MatDialog ,
    private consultaService : ConsultaService) { }

exibirMensagemErro() {
  this._snackBar.open('Não ha registros com esse parametro.', 'Fechar', {
    duration: 3000,
  });
}

exibirMensagemDeRetornoAposCriaConsultaDeMedico() {
  this._snackBar.open('Consulta Criada.', 'Fechar', {
    duration: 3000,
  });
}


JaexisteDadosCAdastradosComEssesParamentros() {
  this._snackBar.open('Ja Existe uma consulta marcadas para esse dia com esse horário.\nTente outro horário. Ou altere o dia.', 'Fechar', {
    duration: 10000,
  });
}

exibirMensagemParaCamposNaoInformadosDeConsulta() {
  this._snackBar.open('Dados não informados.Tente Novamente.', 'Fechar', {
    duration: 50000,
  });
}

NaoFoiEncontradoConsultasComEssesParametros() {
  this._snackBar.open('Não foi encontrado consultas com esses parametros .Tente Novamente.', 'Fechar', {
    duration: 50000,
  });
}


FornecaDataParaCronologia(): void {
  const dialogRef = this.dialog.open(CalendarDialogComponent, {
    width: '300px', // Largura do diálogo do calendário
  });

  dialogRef.afterClosed().subscribe((formattedDate: string | undefined) => {
    if (formattedDate) {

      this.consultaService.PassarDadosParaCronologiaDoDia(formattedDate);
    }
  });
}

NaoHaRegistroParaAsDatasSelecionada() {
  this._snackBar.open('Não ha registro para a data Selecionada', 'Fechar', {
    duration: 50000,
  });
}
}

