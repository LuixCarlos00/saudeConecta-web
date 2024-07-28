import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-gerenciamentoProntuario',
  templateUrl: './gerenciamentoProntuario.component.html',
  styleUrls: ['./gerenciamentoProntuario.component.css'],
})
export class GerenciamentoProntuarioComponent implements OnInit, OnDestroy {
  selectedTabIndex = 0;
  timer: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  interval: any;

  constructor(
    public dialogRef: MatDialogRef<GerenciamentoProntuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { element: any }
  ) {}

  ngOnInit() {
    console.log('element', this.data.element);
    this.startTimer();
    this.resetTimer();
  }

  ngOnDestroy() {
    this.stopTimer();
    this.clearTimer();
  }

  resetTimer() {
    this.timer = 0;
    this.minutes = 0;
    this.seconds = 0;
  }

  stopTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.timer++;
      this.minutes = Math.floor(this.timer / 60);
      this.seconds = this.timer % 60;
    }, 1000);
  }

  clearTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  onMudarAba(index: number) {
    this.selectedTabIndex = index;
  }

  pausarTempo() { // Método para pausar o tempo
    this.stopTimer();
  }
}
