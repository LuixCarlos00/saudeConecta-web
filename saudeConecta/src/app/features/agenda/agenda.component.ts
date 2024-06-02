import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultaService } from 'src/app/service/service-consulta/consulta.service';
import { TabelaAgendaComponent } from './tabela-agenda/tabela-agenda.component';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
})
export class AgendaComponent implements OnInit {

  //
  //
  //

  FormularioAgenda!: FormGroup;

  constructor(
    private router: Router,
    private form: FormBuilder,
    private consultaService: ConsultaService
  ) {}

  ngOnInit() {

    this.FormularioAgenda = this.form.group({
      busca: [''],
    });
  }

  Pesquisar() {
    const busca = this.FormularioAgenda.get('busca')?.value;


    this.consultaService.FiltraDadosSubject(busca);
  }

  Recarregar() {
    this.FormularioAgenda.reset();
    this.consultaService.RecarregarDadosTabelaSubject(true);
  }

  Concluido() {
    throw new Error('Method not implemented.');
  }

  Editar() {
    this.consultaService.EditarDadosDaTabelaSubject(true);
  }


  Deletar() {
    //observa se ha algo para ser excluido e pergunta se dejesa deletar
    this.consultaService.ExcluirDadosDaTabelaSubject(true);
  }

  GerarPDF() {
    throw new Error('Method not implemented.');
    }
  voltarParaHome() {
    this.router.navigate(['home']);
  }
}
