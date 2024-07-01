import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoudComponent } from '../Erros/Erro404/not-foud.component';
import { CalendarDialogComponent } from '../variados/calendarDialog/calendarDialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';


@NgModule({
  declarations: [
    NotFoudComponent,
    CalendarDialogComponent

  ],
  imports: [
    CommonModule,
    MatDatepickerModule
  ]
})
export class UtilModule { }
