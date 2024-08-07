import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-atestado',
  templateUrl: './atestado.component.html',
  styleUrls: ['./atestado.component.css']
})
export class AtestadoComponent implements OnInit {
  @Output() onMudarAba = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
  }

}
