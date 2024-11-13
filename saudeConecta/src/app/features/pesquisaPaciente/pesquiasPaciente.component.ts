import { Adiministrador } from 'src/app/util/variados/interfaces/administrado/adiministrador';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';
import { DialogService } from './../../util/variados/dialogo-confirmação/dialog.service';
import { ConsultaService } from '../../service/consulta/consulta.service';
import { HoradaConsulta } from './../../util/variados/options/options';
import { tokenService } from './../../util/Token/Token.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import Swal from 'sweetalert2';
import { PacientesService } from 'src/app/service/pacientes/Pacientes.service';
import { MedicosService } from 'src/app/service/medicos/medicos.service';
import { GerenciamentoService } from 'src/app/service/gerenciamento/gerenciamento.service';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { LoginService } from 'src/app/service/service-login/login.service';

@Component({
  selector: 'app-pesquias-Paciente',
  templateUrl: './pesquiasPaciente.component.html',
  styleUrls: ['./pesquiasPaciente.component.css'],
})
export class PesquiasPacienteComponent implements OnInit {
  DiaDaSemana: string = '';
  Medico!: any;

  PacienteEscolhido!: any;
  Consulta!: Consulta;
  FormGroupConsulta!: FormGroup;

  Hora = HoradaConsulta;
  pagamento: Boolean = false;
  dadosPaciente: any;
  showResultadoPaciente: boolean = false;
  DataSelecionada: any;
  horariosDisponiveis: string[] = [];

  UsuarioLogado: Usuario = {
    id: 0,
    aud: '',
    exp: '',
    iss: '',
    sub: '',
  };

  constructor(
    private form: FormBuilder,
    private router: Router,
    private MedicosService: MedicosService,

    private tokenService: tokenService,
    private consultaService: ConsultaService,
    private DialogService: DialogService,
    private PacientesService: PacientesService,
    private gerenciamentoService: GerenciamentoService,
    public LoginService: LoginService
  ) {
    this.LoginService.iniciarObservacaoDadosUsuario();
    this.tokenService.UsuarioLogadoValue$.subscribe((UsuarioLogado) => {
      if (UsuarioLogado) this.UsuarioLogado = UsuarioLogado;
    });

    this.gerenciamentoService.medicoEscolhido$.subscribe((medico) => {
      if (medico) {
        this.Medico = medico;
        this.verificarCondicoesParaConsulta();
        //  this.generateAvailableTimes(this.Medico.medTempoDeConsulta);
      }
    });

    this.gerenciamentoService.pacienteEscolhido$.subscribe((paciente) => {
      if (paciente) {
        this.PacienteEscolhido = paciente;
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

  async PesquisarPacientes() {
    const pesquisa: string =
      this.FormGroupConsulta.get('PesquisaPaciente')?.value;
    const FiltroPesquisaPaciente: number = this.FormGroupConsulta.get(
      'FiltroPesquisaPaciente'
    )?.value;
    try {
      const dados = await this.PacientesService.PesquisarPacientesFiltro(
        FiltroPesquisaPaciente,
        pesquisa
      );
      console.log(dados);
      this.showResultadoPaciente = true;
      this.dadosPaciente = dados;
    } catch (error) {
      this.PacientesService.exibirMensagemErro();
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
        ConAdm: this.UsuarioLogado.id,
        ConStatus: 0,
      };

      this.consultaService.VericarSeExetemConsultasMarcadas(consult).subscribe(
        (data) => {
          if (data) {
            this.DialogService.JaexisteDadosCAdastradosComEssesParamentros();
            this.FormGroupConsulta.reset();
          } else if (!data) {
            this.consultaService.CriarConsulata(consult).subscribe(
              (response) => {
                this.consultaService.ChangeCadastroRealizadoComSucesso(
                  response
                );
                this.PacienteEscolhido = null;
                this.FormGroupConsulta.reset();
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
                console.log(error, 'erros');

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
    const date = new Date(selectedDate + 'T00:00:00');
    const utcDate = new Date(date.toUTCString());
    const options = { weekday: 'long' as const };
    const dayOfWeek = new Intl.DateTimeFormat('pt-BR', options).format(utcDate);
    this.DataSelecionada = selectedDate;
    this.DiaDaSemana = dayOfWeek;
    this.verificarCondicoesParaConsulta(); // Chama a função ao mudar a data
  }

  verificarCondicoesParaConsulta() {
    this.horariosDisponiveis = []; // Limpa os horários disponíveis ao iniciar a consulta

    // Se o médico e a data estiverem selecionados
    if (this.Medico && this.DataSelecionada) {
      // Gera os horários disponíveis com base no tempo de consulta do médico
      if (this.Medico.medTempoDeConsulta) {
        this.generateAvailableTimes(this.Medico.medTempoDeConsulta);
      } else {
        // Se não houver tempo de consulta definido, usa os horários padrão
        Swal.fire({
          icon: 'warning',
          title: 'Atenção',
          text: 'O médico ainda não informou o tempo de consulta. Portanto, serão utilizados os horários padrão.',
          showCloseButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              text: 'É altamente recomendado que o tempo de consulta seja definido pelo médico para evitar problemas futuros.',
            });
          }
        });

        this.Hora = [...HoradaConsulta];
      }

      // Verifica os horários indisponíveis para a data e o médico selecionados
      this.consultaService
        .VerificarHorariosDisponiveisReferentesAoMedicoEData(
          this.Medico.medCodigo,
          this.DataSelecionada
        )
        .subscribe(
          (data) => {
            this.horariosDisponiveis = data;

            // Filtra os horários disponíveis com base nos horários gerados/selecionados
            this.atualizarHorarios();
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  generateAvailableTimes(medTempoDeConsulta: number) {
    const startTime = '08:00';
    const endTime = '18:00';

    let currentTime = this.convertToDateObject(startTime);
    const endDateTime = this.convertToDateObject(endTime);

    this.Hora = [];

    // Enquanto o tempo atual for menor ou igual ao tempo final
    while (currentTime <= endDateTime) {
      // Adiciona o horário formatado ao array
      this.Hora.push({
        value: this.formatTime(currentTime),
        label: this.formatTime(currentTime),
      });

      // Incrementa o tempo atual de acordo com o tempo de consulta
      currentTime = new Date(
        currentTime.getTime() + medTempoDeConsulta * 60000
      ); // 60000 ms = 1 minuto
    }
  }

  atualizarHorarios() {
    if (this.horariosDisponiveis) {
      const horariosDisponiveisFormatados = this.horariosDisponiveis.map(
        (horario) => horario.substring(0, 5)
      );

      // Filtra os horários gerados pelo método generateAvailableTimes
      this.Hora = this.Hora.filter((horario) => {
        const horarioFormatado = horario.value.substring(0, 5);
        return !horariosDisponiveisFormatados.includes(horarioFormatado);
      });
    }
  }

  convertToDateObject(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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
