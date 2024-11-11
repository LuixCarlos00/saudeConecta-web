import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agenda-dados',
  templateUrl: './agenda-dados.component.html',
  styleUrls: ['./agenda-dados.component.css']
})
export class AgendaDadosComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }





















































  voltarParaHome() {
    this.router.navigate(['/Dashboard']);
  }
}
