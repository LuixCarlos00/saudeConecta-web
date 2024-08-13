import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as html2pdf from 'html2pdf.js';
import { Prontuario } from 'src/app/util/variados/interfaces/Prontuario/Prontuario';

@Component({
  selector: 'app-AtestadoPaciente',
  templateUrl: './AtestadoPaciente.component.html',
  styleUrls: ['./AtestadoPaciente.component.css'],
})
export class AtestadoPacienteComponent implements OnInit {
  //
  //
  //
  NomeMedico: string = '';
  Crm: string = '';
  Especialidade: string = '';

  DataConsulta: any;
  HorarioConsulta: any;
  DiaSemana: any;

  NomePaciente: any;
  DataNacimeto: any;
  CPF: any;
  Rg:any;
  telefone: any;



  Consulta!: any;


  constructor(
    public dialogRef: MatDialogRef<AtestadoPacienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { Consulta: any }
  ) {}

  ngOnInit() {
    this.Consulta = this.data.Consulta;
    console.log('Consulta', this.data.Consulta);

    this.NomeMedico =  this.Consulta.conSttMedico.medNome?.trim().toUpperCase();
    this.Crm =  this.Consulta.conSttMedico.medCrm?.trim().toUpperCase();
    this.Especialidade = this.Consulta.conSttMedico.medEspecialidade?.trim().toUpperCase();


    this.DataConsulta =  this.Consulta.conSttData?.trim().toUpperCase();
    this.HorarioConsulta =  this.Consulta.conSttHorario?.trim().toUpperCase();
    this.DiaSemana =  this.Consulta.conSttDia_semana?.trim().toUpperCase();

    this.NomePaciente =  this.Consulta.conSttPaciente.paciNome?.trim().toUpperCase()
    this.CPF =  this.Consulta.conSttPaciente.paciCpf?.trim().toUpperCase();
    this.Rg = this.Consulta.conSttPaciente.paciRg?.trim().toUpperCase();
    this.DataNacimeto =  this.Consulta.conSttPaciente.paciDataNacimento?.trim().toUpperCase();
    this.telefone =  this.Consulta.conSttPaciente.paciTelefone?.trim().toUpperCase();


  }

  GerarPDF() {
    const data = new Date();

    const element = document.getElementById('pdfContent');
    if (element) {
      const opt = {
        margin: 0,
        filename: `Relatório_${this.Consulta.conSttCodigoConsulata}_${this.Consulta.conSttData}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      html2pdf().from(element).set(opt).save();
    } else {
      console.error('Element not found');
    }
  }
}
