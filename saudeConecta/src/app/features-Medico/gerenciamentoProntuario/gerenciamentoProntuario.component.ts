import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-gerenciamentoProntuario',
  templateUrl: './gerenciamentoProntuario.component.html',
  styleUrls: ['./gerenciamentoProntuario.component.css'],
})
export class GerenciamentoProntuarioComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<GerenciamentoProntuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { element: any }
  ) {}

  ngOnInit() {
    console.log('element', this.data.element);


  }
}
