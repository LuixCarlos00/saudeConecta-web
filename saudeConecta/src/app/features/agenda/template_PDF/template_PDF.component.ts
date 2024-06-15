import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConsultaService } from 'src/app/service/service-consulta/consulta.service';
import { DialogService } from 'src/app/util/variados/dialogo-confirmação/dialog.service';
import * as html2pdf from 'html2pdf.js';
import { MatCalendar } from '@angular/material/datepicker';

@Component({
  selector: 'app-template_PDF',
  templateUrl: './template_PDF.component.html',
  styleUrls: ['./template_PDF.component.css'],
})
export class Template_PDFComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendar!: MatCalendar<Date>;

  dataPadraoBR: string = '';
  dataCriacaoPadraoBr: string = '';

  dataISO: Date = new Date();
  selected: Date = new Date();
  activeDate: Date = new Date();

  DadosPDFConsulta: any = {
    ConCodigoConsulta: 0,
    ConMedico: { medNome: '', medCrm: '', medEmail: '', medEspecialidade: '' },
    ConPaciente: { paciNome: '', paciCpf: '', paciRg: '', paciEmail: '' },
    ConDia_semana: '',
    ConHorario: '',
    ConData: '',
    ConObservacoes: '',
    ConDadaCriacao: '',
    ConFormaPagamento: 0,
    ConStatus: 0,
    ConAdm: 0,
  };

  IdadeMedico: any;
  IdadePaciente: any;
  SexoMedico: any;
  SexoPaciente: any;

  constructor(
    public dialogRef: MatDialogRef<Template_PDFComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { DadoSelecionadoParaGerarPDF: any },
    private DialogService: DialogService,
    private consultaService: ConsultaService,
    private cdr: ChangeDetectorRef
  ) {
    this.DadosPDFConsulta = this.data.DadoSelecionadoParaGerarPDF[0];
    console.log(this.DadosPDFConsulta);

    this.dataAtual();
    this.dataISO = this.criarDataComTimeZone(this.DadosPDFConsulta.ConData);
    this.activeDate = this.criarDataComTimeZone(this.DadosPDFConsulta.ConData); // Set the initial active date

    this.converteValorParaSexo(this.DadosPDFConsulta.ConMedico.medSexo,this.DadosPDFConsulta.ConPaciente.paciSexo);

    this.converteDatadeNacimentoParaIdade(
      this.DadosPDFConsulta.ConMedico.medDataNacimento,
      this.DadosPDFConsulta.ConPaciente.paciDataNacimento
    );
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.updateCalendar();
  }

  updateCalendar() {
    setTimeout(() => {
      this.selected = this.dataISO;
      this.calendar.activeDate = this.activeDate;
      this.calendar.updateTodaysDate();
      this.cdr.detectChanges();
    });
  }





  GerarPDF() {
    const data = new Date();
    const dataAtual = data.toISOString().split('T')[0];
    const element = document.getElementById('pdfContent');
    if (element) {
      const opt = {
        margin: 0,
        filename: `Relatório_${this.DadosPDFConsulta.ConCodigoConsulta}_${dataAtual}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      html2pdf().from(element).set(opt).save();
    } else {
      console.error('Element not found');
    }
  }








  dataAtual() {
    const data = new Date(this.DadosPDFConsulta.ConData + 'T00:00:00');
    this.dataPadraoBR = data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const dataCriacao = new Date(
      this.DadosPDFConsulta.ConDadaCriacao + 'T00:00:00'
    );
    this.dataCriacaoPadraoBr = dataCriacao.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  criarDataComTimeZone(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  converteDatadeNacimentoParaIdade(
    medDataNacimento: any,
    paciDataNacimento: any
  ) {
    const dataMedico = new Date(medDataNacimento);
    const ano = dataMedico.getFullYear();
    const mes = dataMedico.getMonth();
    const dia = dataMedico.getDate();

    const dataPaciente = new Date(paciDataNacimento);
    const anoP = dataPaciente.getFullYear();
    const mesP = dataPaciente.getMonth();
    const diaP = dataPaciente.getDate();

    const dataDeNascimento = new Date(ano, mes, dia);
    const dataDeNascimentoP = new Date(anoP, mesP, diaP);
    const hoje = new Date();

    const idade = Math.floor(
      (hoje.getTime() - dataDeNascimento.getTime()) /
        (1000 * 60 * 60 * 24 * 365.25)
    );

    const idadeP = Math.floor(
      (hoje.getTime() - dataDeNascimentoP.getTime()) /
        (1000 * 60 * 60 * 24 * 365.25)
    );

    this.IdadeMedico = idade;
    this.IdadePaciente = idadeP;
  }

  converteValorParaSexo(medSexo: any, paciSexo: any) {
    const sexoMedico = medSexo;
    const sexoPaciente = paciSexo;
    if (sexoMedico == 1) {
      this.SexoMedico = 'Masculino';
    } else {
      this.SexoMedico = 'Feminino';
    }
    if (sexoPaciente == 1) {
      this.SexoPaciente = 'Masculino';
    } else {
      this.SexoPaciente = 'Feminino';
    }
  }
}