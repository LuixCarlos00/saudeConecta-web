import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import Swal from 'sweetalert2';
import { DialogService } from './../../../util/variados/dialogo-confirmação/dialog.service';
import { Prontuario } from 'src/app/util/variados/interfaces/Prontuario/Prontuario';
import { ProntuarioService } from 'src/app/service/MEDICO-prontuario/prontuario.service';

@Component({
  selector: 'app-finalizar',
  templateUrl: './finalizar.component.html',
  styleUrls: ['./finalizar.component.css'],
})
export class FinalizarComponent implements OnInit, OnChanges {
  @Input() selectedTabIndex: number = 0;
  @Input() tempo: number = 0;
  @Output() mudarTempo = new EventEmitter<number>();
  @Output() mudarAba = new EventEmitter<number>();
  @Output() pausarTempo = new EventEmitter<void>(); // Novo Output para pausar o tempo

  AparecerHtml = false;

  Prontuario: Prontuario = {
    prontCodigoProntuario: 0,
    prontAltura: '',
    prontPeso: '',
    prontTemperatura: '',
    prontDataNacimento: '',
    prontSexo: '',
    prontSaturacao: '',
    prontHemoglobina: '',
    prontPressao: '',
    prontFrequenciaRespiratoria: '',
    prontFrequenciaArterialSistolica: '',
    prontFrequenciaArterialDiastolica: '',
    prontObservacao: '',
    prontCondulta: '',
    prontAnamnese: '',
    prontQueixaPricipal: '',
    prontDiagnostico: '',
    prontModeloPrescricao: '',
    prontTituloPrescricao: '',
    prontDataPrescricao: '',
    prontPrescricao: '',
    prontDataFinalizado: '',
    prontCodigoMedico: 0,
    prontCodigoConsulta: 0,
  };

  constructor(
    private ProntuarioService: ProntuarioService,
    private DialogService: DialogService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedTabIndex'] && changes['selectedTabIndex'].currentValue === 6) {
      this.showFinalizarAlert();
      this.pausarTempo.emit(); // Emitir evento para pausar o tempo
    }
  }

  showFinalizarAlert() {
    Swal.fire({
      icon: 'info',
      title: 'Aguarde',
      text: 'Carregando dados',
      showConfirmButton: false,
      allowOutsideClick: false,
    });
    setTimeout(() => {
      Swal.fire({
        icon: 'warning',
        title: 'Finalizar',
        text: 'Tem certeza que deseja finalizar o prontuário?',
        showConfirmButton: true,
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.AparecerHtml = true;
          this.DialogService.CliqueEmSalvarParaFinalizar();
          this.PegarDados();
        }
      });
    }, 1500);
  }

  PegarDados() {
    this.ProntuarioService.AnamneseCondutas$.subscribe((Prontuario) => {
      this.Prontuario.prontCondulta = Prontuario.prontCondulta;
      this.Prontuario.prontAnamnese = Prontuario.prontAnamnese;
    });

    this.ProntuarioService.QueixaPrincipal$.subscribe((Prontuario) => {
      this.Prontuario.prontQueixaPricipal = Prontuario.prontQueixaPricipal;
    });

    this.ProntuarioService.Diagnostico$.subscribe((Prontuario) => {
      this.Prontuario.prontDiagnostico = Prontuario.prontDiagnostico;
    });

    this.ProntuarioService.PediatriaExamesFisicos$.subscribe((Prontuario) => {
      this.Prontuario.prontAltura = Prontuario.prontAltura;
      this.Prontuario.prontPeso = Prontuario.prontPeso;
      this.Prontuario.prontTemperatura = Prontuario.prontTemperatura;
      this.Prontuario.prontDataNacimento = Prontuario.prontDataNacimento;
      this.Prontuario.prontSexo = Prontuario.prontSexo;
      this.Prontuario.prontSaturacao = Prontuario.prontSaturacao;
      this.Prontuario.prontHemoglobina = Prontuario.prontHemoglobina;
      this.Prontuario.prontPressao = Prontuario.prontPressao;
      this.Prontuario.prontFrequenciaRespiratoria = Prontuario.prontFrequenciaRespiratoria;
      this.Prontuario.prontFrequenciaArterialSistolica = Prontuario.prontFrequenciaArterialSistolica;
      this.Prontuario.prontFrequenciaArterialDiastolica = Prontuario.prontFrequenciaArterialDiastolica;
      this.Prontuario.prontObservacao = Prontuario.prontObservacao;
    });

    this.ProntuarioService.SolicitacaoExame$.subscribe((Prontuario) => {
      this.Prontuario.prontModeloPrescricao = Prontuario.prontModeloPrescricao;
      this.Prontuario.prontTituloPrescricao = Prontuario.prontTituloPrescricao;
      this.Prontuario.prontDataPrescricao = Prontuario.prontDataPrescricao;
      this.Prontuario.prontPrescricao = Prontuario.prontPrescricao;
    });

    console.log(this.Prontuario, 'prontuario finalizar');
    console.log(this.tempo+5, 'tempo',this.tempo,this.tempo-1 );
  }
}
