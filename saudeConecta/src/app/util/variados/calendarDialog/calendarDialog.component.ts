import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../dialogo-confirmação/dialog.service';

@Component({
  selector: 'app-calendarDialog',
  template: `
  <mat-calendar
    (selectedChange)="selectDate($event)"
    [startAt]="today"
    [selected]="selectedDate"
  ></mat-calendar>
  <button mat-button (click)="confirmSelection()">Confirmar</button>
`,

  styleUrls: ['./calendarDialog.component.css'],
})
export class CalendarDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CalendarDialogComponent>,
    private dialogService :DialogService
  ) {}
  ngOnInit() {}

today = new Date();
  selectedDate: Date | undefined;


  selectDate(date: Date): void {
    this.selectedDate = date;
  }

  confirmSelection(): void {
    if (this.selectedDate) {

      const utcDate = new Date(
        Date.UTC(
          this.selectedDate.getUTCFullYear(),
          this.selectedDate.getUTCMonth(),
          this.selectedDate.getUTCDate()
        )
      );
      const formattedDate = utcDate.toISOString().split('T')[0]; // Formata para 'YYYY-MM-DD'
      this.dialogRef.close(formattedDate);
    } else {
      this.dialogService.NaoHaRegistroParaAsDatasSelecionada();
      this.dialogRef.close();
    }
  }
}
