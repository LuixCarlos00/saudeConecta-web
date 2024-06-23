import { Adiministrador } from 'src/app/util/variados/interfaces/administrado/adiministrador';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';
import { DialogService } from './../../util/variados/dialogo-confirmação/dialog.service';
import { ConsultaService } from '../../service/service-consulta/consulta.service';
import { HoradaConsulta } from './../../util/variados/options/options';
import { tokenService } from 'src/app/util/Token/token.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import Swal from 'sweetalert2';
import { PacientesService } from 'src/app/service/pacientes/Pacientes.service';
import { MedicosService } from 'src/app/service/medicos/medicos.service';
import { GerenciamentoService } from 'src/app/service/gerenciamento/gerenciamento.service';

@Component({
  selector: 'app-pesquias-Paciente',
  templateUrl: './pesquiasPaciente.component.html',
  styleUrls: ['./pesquiasPaciente.component.css'],
})
export class PesquiasPacienteComponent implements OnInit {
  DiaDaSemana: string = '';
  Medico!: any;
  private Adiministrador!: Adiministrador;
  PacienteEscolhido!: any;
  Consulta!: Consulta;
  FormGroupConsulta!: FormGroup;
  observacao: string = 'Tem alguma observação? Quais:';
  Hora = HoradaConsulta;
  pagamento: Boolean = false;
  dadosPaciente: any;
  showResultadoPaciente: boolean = false;

  constructor(
    private form: FormBuilder,
    private router: Router,
    private medicosService: MedicosService,
    private tokenService: tokenService,
    private ServiceConsultaMedicosService: ConsultaService,
    private DialogService: DialogService,
    private PacientesService: PacientesService,
    private gerenciamentoService: GerenciamentoService
  ) {
    this.tokenService.token();
    this.tokenService.UsuarioLogadoValue$.subscribe((paciente) => {
      if (paciente) {
        this.Adiministrador = paciente;
        console.log(this.Adiministrador, 'adm');
      }
    });

    this.gerenciamentoService.medicoEscolhido$.subscribe((medico) => {
      if (medico) {
        this.Medico = medico;
        console.log('Médico selecionado:', this.Medico);
      }
    });

    this.gerenciamentoService.pacienteEscolhido$.subscribe((paciente) => {
      if (paciente) {
        this.PacienteEscolhido = paciente;
        console.log('Paciente selecionado:', this.PacienteEscolhido);
      }
    });
  }

  ngOnInit() {
    this.FormGroupConsulta = this.form.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      observacao: ['', Validators.required],
      Pagamento: ['', Validators.required],
      PesquisaPaciente: ['', Validators.required],
      FiltroPesquisaPaciente: ['', Validators.required],
    });
  }

  PesquisarPacientes() {
    const pesquisa: string =
      this.FormGroupConsulta.get('PesquisaPaciente')?.value;
    const FiltroPesquisaPaciente: number = this.FormGroupConsulta.get(
      'FiltroPesquisaPaciente'
    )?.value;

    if (FiltroPesquisaPaciente === 1) {
      this.PacientesService.buscarListaPacientesPorNome(pesquisa).subscribe(
        (dados) => {
          if (dados && dados.length > 0) {
            this.dadosPaciente = dados;
            this.showResultadoPaciente = true;
          } else {
            this.exibirMensagemErro();
          }
        },
        () => this.exibirMensagemErro()
      );
    } else if (FiltroPesquisaPaciente === 2) {
      this.PacientesService.buscarListaPacientesPorCPF(pesquisa).subscribe(
        (dados) => {
          if (dados && dados.length > 0) {
            this.dadosPaciente = dados;
            this.showResultadoPaciente = true;
          } else {
            this.exibirMensagemErro();
          }
        },
        () => this.exibirMensagemErro()
      );
    } else if (FiltroPesquisaPaciente === 3) {
      this.PacientesService.buscarListaPacientesPor_RG(pesquisa).subscribe(
        (dados) => {
          if (dados && dados.length > 0) {
            this.dadosPaciente = dados;
            this.showResultadoPaciente = true;
          } else {
            this.exibirMensagemErro();
          }
        },
        () => this.exibirMensagemErro()
      );
    } else if (FiltroPesquisaPaciente === 4) {
      this.PacientesService.buscarListaPacientesPorTelefone(pesquisa).subscribe(
        (dados) => {
          if (dados && dados.length > 0) {
            this.dadosPaciente = dados;
            this.showResultadoPaciente = true;
          } else {
            this.exibirMensagemErro();
          }
        },
        () => this.exibirMensagemErro()
      );
    } else if (FiltroPesquisaPaciente === 5) {
      this.PacientesService.buscarTodosPacientes().subscribe(
        (dados) => {
          if (dados && dados.length > 0) {
            this.dadosPaciente = dados;
            this.showResultadoPaciente = true;
          } else {
            this.exibirMensagemErro();
          }
        },
        () => this.exibirMensagemErro()
      );
    }
  }

  marcarConsulta() {
    this.gerenciamentoService.medicoEscolhido$.subscribe((medico) => {
      if (medico) {
        this.Medico = medico;
      }
    });

    this.gerenciamentoService.pacienteEscolhido$.subscribe((paciente) => {
      if (paciente) {
        this.PacienteEscolhido = paciente;
      }
    });

    let time = this.FormGroupConsulta.get('time')?.value;
    const data = this.FormGroupConsulta.get('date')?.value;
    const observacao = this.FormGroupConsulta.get('observacao')?.value;
    const FornaPAgamento = this.transformaFormaPagamento();

    if (
      data &&
      time &&
      FornaPAgamento &&
      this.Medico &&
      this.PacienteEscolhido
    ) {
      const date = new Date();
      const dataAtual = date.toISOString().split('T')[0];
      const diaDaSemana = this.DiaDaSemana;
      const medico = this.Medico.medCodigo;
      const paciente = this.PacienteEscolhido.paciCodigo;

      const consult: any = {
        ConData: data,
        ConHorario: time,
        ConMedico: medico,
        ConPaciente: paciente,
        ConCodigoConsulta: 0,
        ConDia_semana: diaDaSemana,
        ConObservacoes: observacao,
        ConDadaCriacao: dataAtual,
        ConFormaPagamento: FornaPAgamento,
        ConAdm: this.Adiministrador.AdmCodigo,
        ConStatus: 0,
      };

      this.ServiceConsultaMedicosService.VericarSeExetemConsultasMarcadas(
        consult
      ).subscribe(
        (data) => {
          if (data) {
            this.DialogService.JaexisteDadosCAdastradosComEssesParamentros();
            this.FormGroupConsulta.reset();
          } else if (!data) {
            this.ServiceConsultaMedicosService.CriarConsulata(
              consult
            ).subscribe(
              (response) => {
                console.log(response);
                const texto: string = `O cadastro da consulta foi realizado com sucesso.\nCodigo de consulta: ${response.ConCodigoConsulta} `;

                Swal.fire({
                  icon: 'success',
                  title: 'OK',
                  text: texto,
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.DialogService.exibirMensagemDeRetornoAposCriaConsultaDeMedico();
                  }
                });
              },
              (error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Algo deu errado. Tente novamente mais tarde.',
                });
                console.log(error);
              }
            );
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.DialogService.exibirMensagemParaCamposNaoInformadosDeConsulta();
    }
  }

  onDateChange(event: Event) {
    const selectedDate: string = (event.target as HTMLInputElement).value;
    const date = new Date(selectedDate + 'T00:00:00'); // Adiciona a hora para evitar problemas com fuso horário
    const utcDate = new Date(date.toUTCString()); // Normaliza a data para UTC
    const options = { weekday: 'long' as const };
    const dayOfWeek = new Intl.DateTimeFormat('pt-BR', options).format(utcDate);
    this.DiaDaSemana = dayOfWeek;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(this.DiaDaSemana);
  }

  voltarParaPesquisaMedicos() {
    this.router.navigate(['pesquisar']);
  }

  fecharTabela() {
    this.showResultadoPaciente = false;
  }

  PacienteSelecionado(elemento: any) {
    this.PacienteEscolhido = elemento;
    this.gerenciamentoService.setPacienteEscolhido(elemento);
  }

  exibirMensagemErro() {
    this.DialogService.exibirMensagemErro();
  }

  transformaFormaPagamento() {
    const pagamentoValue = this.FormGroupConsulta.get('Pagamento')?.value;
    let FornaPAgamento: number;

    switch (pagamentoValue) {
      case 'Cartao':
        return (FornaPAgamento = 1);
        break;
      case 'Dinheiro':
        return (FornaPAgamento = 2);
        break;
      case 'Pix':
        return (FornaPAgamento = 3);
        break;
      default:
        return (FornaPAgamento = 0); // Valor padrão, caso nenhuma das opções seja selecionada
    }
  }
}