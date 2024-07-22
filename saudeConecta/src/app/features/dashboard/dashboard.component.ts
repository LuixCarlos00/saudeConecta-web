import { ControleAcessoService } from './../../service/_controleAcesso/controle-acesso.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public ControleAcessoService: ControleAcessoService) { }

  ngOnInit() {
  }

}
