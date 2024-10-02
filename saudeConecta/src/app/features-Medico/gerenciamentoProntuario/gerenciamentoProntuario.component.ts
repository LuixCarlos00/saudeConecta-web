import { ProntuarioService } from 'src/app/service/MEDICO-prontuario/prontuario.service';
import { Prontuario } from './../../util/variados/interfaces/Prontuario/Prontuario';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { ConsultaStatus } from 'src/app/util/variados/interfaces/consultaStatus/consultaStatus';
import { ConsultaService } from 'src/app/service/consulta/consulta.service';
import { ConsultaStatusService } from 'src/app/service/service-consulta-status/consulta-status.service';
import { el } from 'date-fns/locale';

@Component({
  selector: 'app-gerenciamentoProntuario',
  templateUrl: './gerenciamentoProntuario.component.html',
  styleUrls: ['./gerenciamentoProntuario.component.css'],
})
export class GerenciamentoProntuarioComponent implements OnInit, OnDestroy {


  selectedTabIndex = 0;
  timer: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  interval: any;
  Consulta: any;
  Prontuario!: Prontuario;
  FinalizarConsulta: boolean = false;


  constructor(
    private ProntuarioService: ProntuarioService,
    private ConsultaService: ConsultaService,
    private ConsultaStatusService: ConsultaStatusService
  ) {}

  ngOnInit() {
    this.startTimer();
    this.resetTimer();
    this.ProntuarioService.Consulta$.subscribe((consulta) => {
      this.Consulta = consulta;
    });
   }

  finalizar() {
    this.FinalizarConsulta = true;
    Swal.fire({
      icon: 'warning',
      title: 'Atenção',
      text: 'Deseja finalizar a consulta?',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
    }).then((result) => {
      if (result.isConfirmed) {
        this.concluido();
      }else{
        this.FinalizarConsulta = false;
        Swal.fire({
          icon: 'success',
          title: 'Retomando consulta',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }

  concluido() {


    this.Prontuario = {} as any;

    const pediatriaPromise = firstValueFrom(
      this.ProntuarioService.PediatriaExamesFisicos$
    );
    const diagnosticoPromise = firstValueFrom(
      this.ProntuarioService.Diagnostico$
    );
    const prescricaoPromise = firstValueFrom(
      this.ProntuarioService.Prescricao$
    );

    Promise.all([pediatriaPromise, diagnosticoPromise, prescricaoPromise])
      .then(([pediatriaRes, diagnosticoRes, prescricaoRes]) => {
        if (pediatriaRes) {
          this.Prontuario.prontAltura = pediatriaRes.prontAltura;
          this.Prontuario.prontPeso = pediatriaRes.prontPeso;
          this.Prontuario.prontTemperatura = pediatriaRes.prontTemperatura;
          this.Prontuario.prontDataNacimento = pediatriaRes.prontDataNacimento;
          this.Prontuario.prontSexo = pediatriaRes.prontSexo;
          this.Prontuario.prontSaturacao = pediatriaRes.prontSaturacao;
          this.Prontuario.prontHemoglobina = pediatriaRes.prontHemoglobina;
          this.Prontuario.prontFrequenciaRespiratoria =
            pediatriaRes.prontFrequenciaRespiratoria;
          this.Prontuario.prontPressao = pediatriaRes.prontPressao;
          this.Prontuario.prontFrequenciaArterialSistolica =
            pediatriaRes.prontFrequenciaArterialSistolica;
          this.Prontuario.prontFrequenciaArterialDiastolica =
            pediatriaRes.prontFrequenciaArterialDiastolica;
          this.Prontuario.prontObservacao = pediatriaRes.prontObservacao;
          this.Prontuario.prontCondulta = pediatriaRes.prontCondulta;
          this.Prontuario.prontAnamnese = pediatriaRes.prontAnamnese;
          this.Prontuario.prontQueixaPricipal =
            pediatriaRes.prontQueixaPricipal;
        }

        if (diagnosticoRes) {
          this.Prontuario.prontDiagnostico = diagnosticoRes.prontDiagnostico;
        }

        if (prescricaoRes) {
          this.Prontuario.prontPrescricao = prescricaoRes.prontPrescricao;
          this.Prontuario.prontDataPrescricao =
            prescricaoRes.prontDataPrescricao;
          this.Prontuario.prontModeloPrescricao =
            prescricaoRes.prontModeloPrescricao;
          this.Prontuario.prontTituloPrescricao =
            prescricaoRes.prontTituloPrescricao;

          this.Prontuario.prontExame = prescricaoRes.prontExame;
          this.Prontuario.prontDataExame = prescricaoRes.prontDataExame;
          this.Prontuario.prontModeloExame = prescricaoRes.prontModeloExame;
          this.Prontuario.prontTituloExame = prescricaoRes.prontTituloExame;
        }

        this.Prontuario.prontCodigoMedico = this.Consulta.ConMedico.medCodigo;
        this.Prontuario.prontCodigoConsulta = this.Consulta.ConCodigoConsulta;
        const data = new Date();
        const dataAtual = data.toISOString().split('T')[0];
        this.Prontuario.prontDataFinalizado = dataAtual.toString();
        this.Prontuario.prontTempoDuracao = 10+this.minutes + ':' + this.seconds;


      this.salvar();
      })
      .catch((error) => {
        console.error('Erro ao finalizar:', error);
      });
  }

  salvar() {
    this.ConsultaService.ConcluirDadosDaTabela(
      this.Consulta.ConCodigoConsulta
    ).subscribe(
      (dados) => {
        this.ConsultaStatusService.BuscarRegistrosDeConsultaStatusPesquisandoPorTodosOsCampos(
          this.Consulta
        ).subscribe((dados) => {
          this.cadastraProntuario(dados);
        });
      },
      (error) => {
        console.error('Erro ao concluir dados:', error);
      }
    );
  }

  cadastraProntuario(ConsultaStatus: ConsultaStatus) {
    this.Prontuario.prontCodigoConsulta = ConsultaStatus.ConSttCodigoConsulata;
    this.ProntuarioService.cadastraProntuario(this.Prontuario).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Prontuário finalizado com sucesso',
          showConfirmButton: false,
          timer: 1500,
        });
        this.DeletarConsulas();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  DeletarConsulas() {
    this.ConsultaService.DeletarConsulas(
      this.Consulta.ConCodigoConsulta
    ).subscribe((dados) => {
       setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  //
  //
  //
  //
  //
  //
  //
  //
  //
  ngOnDestroy() {
    this.stopTimer();
    this.clearTimer();
  }

  resetTimer() {
    this.timer = 0;
    this.minutes = 0;
    this.seconds = 0;
  }

  stopTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.timer++;
      this.minutes = Math.floor(this.timer / 60);
      this.seconds = this.timer % 60;
    }, 1000);
  }

  clearTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  onMudarAba(index: number) {
    if (index === 6) {
      // Aba de finalização
      this.pausarTempo();
    }
    this.selectedTabIndex = index;
  }

  pausarTempo() {
    // Método para pausar o tempo
    this.stopTimer();
  }
}
