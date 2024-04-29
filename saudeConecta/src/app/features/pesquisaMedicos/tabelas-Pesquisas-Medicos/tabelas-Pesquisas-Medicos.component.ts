import { Component, OnInit } from '@angular/core';
import { PacienteService } from 'src/app/service/paciente_service/paciente.service';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';

@Component({
  selector: 'app-tabelas-Pesquisas-Medicos',
  templateUrl: './tabelas-Pesquisas-Medicos.component.html',
  styleUrls: ['./tabelas-Pesquisas-Medicos.component.css']
})
export class TabelasPesquisasMedicosComponent implements OnInit {

  private MedicoCidade: Medico[] | undefined;
  private MedicoCRM :Medico[]|undefined;
  private MedicoNome:Medico[]|undefined;
  private MedicoEspecialidade : Medico[]|undefined;

  dataSource: Medico[] = [];

  constructor(private pacienteService: PacienteService) {
    this.MedicoCidade = pacienteService.MedicoCidade;
    this.MedicoCRM = pacienteService.MedicoCRM;
    this.MedicoNome = pacienteService.MedicoNome;
    this.MedicoEspecialidade = pacienteService.MedicoEspecialidade;

    // Concatenando os arrays e atribuindo ao dataSource
    this.dataSource = [
      ...(this.MedicoCidade ?? []),
      ...(this.MedicoCRM ?? []),
      ...(this.MedicoNome ?? []),
      ...(this.MedicoEspecialidade ?? [])
    ];
  }

  ngOnInit() {
  }



  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

}
