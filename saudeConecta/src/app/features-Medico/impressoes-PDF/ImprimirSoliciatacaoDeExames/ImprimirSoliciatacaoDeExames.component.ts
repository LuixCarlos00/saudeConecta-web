import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { Prontuario } from 'src/app/util/variados/interfaces/Prontuario/Prontuario';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-ImprimirSoliciatacaoDeExames',
  templateUrl: './ImprimirSoliciatacaoDeExames.component.html',
  styleUrls: ['./ImprimirSoliciatacaoDeExames.component.css'],
})
export class ImprimirSoliciatacaoDeExamesComponent implements OnInit {
  //
  //
  //
  Prontuario!: Prontuario;
  Consulta!: any;
  dataAtual = new Date().toISOString().split('T')[0];
  NomeMedico: string = '';
  Crm: string = '';
  Especialidade: string = '';
  Data: string = '';
    Prescricao: string = '';

  constructor(
    public dialogRef: MatDialogRef<ImprimirSoliciatacaoDeExamesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { prontuario: any; Consulta: any }
  ) {}

  ngOnInit() {
    this.Prontuario = this.data.prontuario;
    this.Consulta = this.data.Consulta;
    console.log('consulta', this.Consulta);

    console.log('prontuario', this.Prontuario);

    this.NomeMedico = this.Prontuario.prontCodigoMedico.medNome?.trim() ||this.Consulta.conSttMedico.medNome?.trim();
    this.Crm = this.Prontuario.prontCodigoMedico.medCrm?.trim() || this.Consulta.conSttMedico.medCrm?.trim();
    this.Especialidade = this.Prontuario.prontCodigoMedico.medEspecialidade?.trim() || this.Consulta.conSttMedico.medEspecialidade?.trim();
    this.Data = this.Prontuario.prontDataPrescricao || this.dataAtual
     this.Prescricao = this.Prontuario.prontPrescricao?.trim() || 'SEM INFORMACÃO';

  }

  GerarPDF() {
    const data = new Date();
    const element = document.getElementById('pdfContent');
    if (element) {
      const name =
        `Relatório_${  this.Prontuario.prontCodigoProntuario}_${this.Prontuario.prontDataPrescricao}.pdf`
      const opt = {
        margin: 0,
        filename: name,
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
