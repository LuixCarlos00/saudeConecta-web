import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { Prontuario } from 'src/app/util/variados/interfaces/Prontuario/Prontuario';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-ImprimirPrescricao',
  templateUrl: './ImprimirPrescricao.component.html',
  styleUrls: ['./ImprimirPrescricao.component.css']
})
export class ImprimirPrescricaoComponent implements OnInit {
  //
  //
  //

 NomeMedico: string = '';
  Crm: string = '';
  Especialidade: string = '';
  Data: string = '';
  Prescricao: string = '';
tituloPrescricao: string = '';

  Prontuario!: Prontuario;
  Consulta!: any;
  dataAtual = new Date().toISOString().split('T')[0];
  constructor(
    public dialogRef: MatDialogRef<ImprimirPrescricaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { prontuario: any, Consulta: any }
  ) { }

  ngOnInit() {
    this.Prontuario = this.data.prontuario;
    this.Consulta = this.data.Consulta;

    this.NomeMedico = this.Prontuario.prontCodigoMedico.medNome?.trim() ||this.Consulta.conSttMedico.medNome?.trim();
    this.Crm = this.Prontuario.prontCodigoMedico.medCrm?.trim() || this.Consulta.conSttMedico.medCrm?.trim();
    this.Especialidade = this.Prontuario.prontCodigoMedico.medEspecialidade?.trim() || this.Consulta.conSttMedico.medEspecialidade?.trim();

    this.tituloPrescricao = this.Prontuario.prontTituloPrescricao?.trim() || 'SEM INFORMACÃO';
    this.Data = this.Prontuario.prontDataPrescricao || this.dataAtual
    this.Prescricao = this.Prontuario.prontPrescricao?.trim() || 'SEM INFORMACÃO';


  }

  GerarPDF() {
    const data = new Date();
    const dataAtual = data.toISOString().split('T')[0];
    const element = document.getElementById('pdfContent');
    if (element) {
      const opt = {
        margin: 0,
        filename: `Relatório_${this.data.prontuario.prontCodigoConsulta}_${dataAtual}.pdf`,
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
