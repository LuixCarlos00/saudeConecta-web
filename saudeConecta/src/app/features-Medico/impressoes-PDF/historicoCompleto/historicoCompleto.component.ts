import { tokenService } from 'src/app/util/Token/Token.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as html2pdf from 'html2pdf.js';
import { HistoricoService } from 'src/app/service/historioService/historico.service';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';

@Component({
  selector: 'app-historicoCompleto',
  templateUrl: './historicoCompleto.component.html',
  styleUrls: ['./historicoCompleto.component.css'],
})
export class HistoricoCompletoComponent implements OnInit {
  prontuarios: any[] = [];
  consulta: any[] = [];
  UsuarioLogado: Usuario = {
    id: 0,
    aud: '',
    exp: '',
    iss: '',
    sub: '',
  };

  constructor(
    public dialogRef: MatDialogRef<HistoricoCompletoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { Consulta: any },
    private HistoricoCompletoService: HistoricoService,
    private tokenService: tokenService
  ) {}

  ngOnInit() {
    const CodigoPaciente = this.data.Consulta.conSttPaciente.paciCodigo;
    this.tokenService.decodificaToken();
    this.tokenService.UsuarioLogadoValue$.subscribe((dados) => {
      if (dados) {
        this.UsuarioLogado = dados;
      }
    });

    this.HistoricoCompletoService.BuscandoHistoricoDoPaciente(
      CodigoPaciente
    ).subscribe((data: any) => {
      this.prontuarios = data.prontuarios;
      this.consulta = data.consultaStatus;

      if (this.UsuarioLogado.aud == '[ROLE_Medico]') {
        this.prontuarios = this.prontuarios.filter((item) => {
          return item.prontCodigoMedico.usuario.id === this.UsuarioLogado.id;
        });
        this.consulta = this.consulta.filter((item) => {
          return item.conSttMedico.usuario.id === this.UsuarioLogado.id;
        });
      }
      if (this.UsuarioLogado.aud == '[ROLE_ADMIN]') {
        this.prontuarios = data.prontuarios;
        this.consulta = data.consultaStatus;
      }
    });
  }

  GerarPDF() {
    const data = new Date();

    const element = document.getElementById('pdfContent');
    if (element) {
      const opt = {
        margin: 0,
        filename: `Relatório_${this.data.Consulta.conSttPaciente.paciNome}.pdf`,
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
