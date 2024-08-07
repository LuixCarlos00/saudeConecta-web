import { ImprimirPrescricaoComponent } from './../../impressoes-PDF/ImprimirPrescricao/ImprimirPrescricao.component';
import { ConsultaStatus } from 'src/app/util/variados/interfaces/consultaStatus/consultaStatus';
import { ConsultaStatusService } from 'src/app/service/service-consulta-status/consulta-status.service';
import { da } from 'date-fns/locale';
import { elements, TimeScale } from 'chart.js';
import { tokenService } from 'src/app/util/Token/Token.service';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import Swal from 'sweetalert2';
import { DialogService } from './../../../util/variados/dialogo-confirmação/dialog.service';
import { Prontuario } from 'src/app/util/variados/interfaces/Prontuario/Prontuario';
import { ProntuarioService } from 'src/app/service/MEDICO-prontuario/prontuario.service';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { TabelaAgendaMedicoService } from 'src/app/service/MEDICO-tabela-agenda-medico/tabelaAgendaMedico.service';
import { ConsultaService } from 'src/app/service/consulta/consulta.service';
import { take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ImprimirSoliciatacaoDeExamesComponent } from '../../impressoes-PDF/ImprimirSoliciatacaoDeExames/ImprimirSoliciatacaoDeExames.component';

@Component({
  selector: 'app-finalizar',
  templateUrl: './finalizar.component.html',
  styleUrls: ['./finalizar.component.css'],
})
export class FinalizarComponent implements OnInit, OnChanges {
  //
  //
  //

  @Input() selectedTabIndex: number = 0;
  @Input() tempo: number = 0;
  @Output() mudarTempo = new EventEmitter<number>();
  @Output() mudarAba = new EventEmitter<number>();
  @Output() pausarTempo = new EventEmitter<void>(); // Novo Output para pausar o tempo
  @Input() Consultas: any;

  minutos = 0;
  segundos = 0;
  AparecerHtml = false;

  UsuarioLogado: Usuario = {
    id: 0,
    aud: '',
    exp: '',
    iss: '',
    sub: '',
  };

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

    prontModeloExame: '',
    prontTituloExame: '',
    prontDataExame: '',
    prontExame: '',
  };

  constructor(
    private tokenService: tokenService,
    private ProntuarioService: ProntuarioService,
    private DialogService: DialogService,
    private TabelaAgendaMedicoService: TabelaAgendaMedicoService,
    private ConsultaStatusService: ConsultaStatusService,
    private ConsultaService: ConsultaService,
    public dialog: MatDialog
  ) {
    this.tokenService.decodificaToken();
    this.tokenService.UsuarioLogadoValue$.subscribe((Usuario) => {
      if (Usuario) {
        this.UsuarioLogado = Usuario;
      }
    });

    console.log(this.Consultas, 'consulta');
  }

  ngOnInit() {}

  converteTempoParaSegundos() {
    this.minutos = Math.floor(this.tempo / 60);
    this.segundos = this.tempo % 60;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['selectedTabIndex'] &&
      changes['selectedTabIndex'].currentValue === 6
    ) {
      this.showFinalizarAlert();
      this.converteTempoParaSegundos();
      this.pausarTempo.emit(); // Emitir evento para pausar o tempo
    }
    console.log('tempo ', this.minutos, this.segundos);
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
      this.Prontuario.prontFrequenciaRespiratoria =
        Prontuario.prontFrequenciaRespiratoria;
      this.Prontuario.prontFrequenciaArterialSistolica =
        Prontuario.prontFrequenciaArterialSistolica;
      this.Prontuario.prontFrequenciaArterialDiastolica =
        Prontuario.prontFrequenciaArterialDiastolica;
      this.Prontuario.prontObservacao = Prontuario.prontObservacao;
    });

    this.ProntuarioService.SolicitacaoExame$.subscribe((Prontuario) => {
      this.Prontuario.prontModeloPrescricao = Prontuario.prontModeloPrescricao;
      this.Prontuario.prontTituloPrescricao = Prontuario.prontTituloPrescricao;
      this.Prontuario.prontDataPrescricao = Prontuario.prontDataPrescricao;
      this.Prontuario.prontPrescricao = Prontuario.prontPrescricao;

      this.Prontuario.prontExame = Prontuario.prontExame;
      this.Prontuario.prontDataExame = Prontuario.prontDataExame;
      this.Prontuario.prontModeloExame = Prontuario.prontModeloExame;
      this.Prontuario.prontTituloExame = Prontuario.prontTituloExame;
    });

    this.Prontuario.prontCodigoMedico = this.Consultas.ConMedico.medCodigo;
    this.Prontuario.prontCodigoConsulta = this.Consultas.ConCodigoConsulta;
    const data = new Date();
    const dataAtual = data.toISOString().split('T')[0];
    this.Prontuario.prontDataFinalizado = dataAtual.toString();

    console.log(this.Prontuario, 'prontuario finalizar');
    console.log(this.Consultas, 'prontuario Consulta');
  }

  salvar() {
    this.ConsultaService.ConcluirDadosDaTabela(
      this.Consultas.ConCodigoConsulta
    ).subscribe(
      (dados) => {
        this.ConsultaStatusService.BuscarRegistrosDeConsultaStatusPesquisandoPorTodosOsCampos(
          this.Consultas
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
      this.Consultas.ConCodigoConsulta
    ).subscribe((dados) => {
      console.log(dados);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });
  }

  ImprimirPrescricao() {
    this.dialog.open(ImprimirPrescricaoComponent, {
      width: '60%',
      height: '90%',
      data: { prontuario: this.Prontuario, Consulta: this.Consultas },
    });
  }

  ImprimirSOlicitacaoDeExames() {
    this.dialog.open(ImprimirSoliciatacaoDeExamesComponent, {
      width: '60%',
      height: '90%',
      data: { prontuario: this.Prontuario },
    });
  }
}
