import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';
import { log } from 'node:console';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicosService } from 'src/app/service/medicos/medicos.service';
import { MatDialog } from '@angular/material/dialog';
import { TabelasPesquisasMedicosComponent } from './tabelas-Pesquisas-Medicos/tabelas-Pesquisas-Medicos.component';
import { PacientesService } from 'src/app/service/pacientes/Pacientes.service';
import { TabelaDePacientesComponent } from './tabela-de-pacientes/tabela-de-pacientes.component';
import Swal from 'sweetalert2';
import { HoradaConsulta } from 'src/app/util/variados/options/options';
import { ConsultaService } from 'src/app/service/consulta/consulta.service';
import { tokenService } from 'src/app/util/Token/Token.service';
import { LoginService } from 'src/app/service/service-login/login.service';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { async } from 'rxjs';
import { DialogService } from 'src/app/util/variados/dialogo-confirmação/dialog.service';

@Component({
  selector: 'app-agenda-dados',
  templateUrl: './agenda-dados.component.html',
  styleUrls: ['./agenda-dados.component.css']
})
export class AgendaDadosComponent implements OnInit {

  FormularioPaciente!: FormGroup
  FormularioMedicos!: FormGroup
  FormularioConsulta!: FormGroup

  Medico: Medico = {
    MedCodigo: 0,
    MedNome: '',
    MedSexo: 0,
    MedDataNacimento: '',
    MedCrm: '',
    MedCpf: '',
    MedRg: '',
    MedEspecialidade: '',
    MedEmail: '',
    MedTelefone: ''
  }
  Paciente: Paciente = {
    PaciCodigo: 0,
    PaciNome: '',
    PaciSexo: 0,
    PaciDataNacimento: '',
    PaciCpf: '',
    PaciRg: '',
    PaciEmail: '',
    PaciTelefone: '',
    endereco: 0,
    PaciStatus: 0
  }
  UsuarioLogado: Usuario = {
    id: 0,
    aud: '',
    exp: '',
    iss: '',
    sub: '',
  };

  DiaDaSemana: string = ''
  MostraHora: boolean = false
  Hora = HoradaConsulta;
  horariosDisponiveis: string[] = [];
  DataSelecionada: any;

  constructor(
    private router: Router,
    private FormBuilder: FormBuilder,
    private medicosService: MedicosService,
    private dialog: MatDialog,
    private pacientesService: PacientesService,
    private consultaService: ConsultaService,
    private LoginService: LoginService,
    private tokenService: tokenService,
    private DialogService: DialogService
  ) {
    this.LoginService.iniciarObservacaoDadosUsuario();
    this.tokenService.UsuarioLogadoValue$.subscribe((UsuarioLogado) => {
      if (UsuarioLogado) this.UsuarioLogado = UsuarioLogado;
    });
  }

  ngOnInit() {
    this.FormularioMedicos = this.FormBuilder.group({
      PesquisaMedicos: [''],
      OptionsFindMedicos: [''],
    });

    this.FormularioPaciente = this.FormBuilder.group({
      PesquisaPaciente: [''],
      OptionsFindPaciente: [''],
    });

    this.FormularioConsulta = this.FormBuilder.group({
      observacao: [''],
      date: [''],
      Hora: [''],
      Pagamento: [''],
    })
  }

  async Pesquisar(value: string) {
    if (value === 'paciente') {
      const FiltroPesquisa = this.FormularioPaciente.get('OptionsFindPaciente')?.value;
      const pesquisa: string = this.FormularioPaciente.get('PesquisaPaciente')?.value;
      try {
        const dados = await this.pacientesService.PesquisarPacientesFiltro(FiltroPesquisa, pesquisa);
        this.AbirTabela(dados, 'paciente');
      } catch (error) {
        this.medicosService.exibirMensagemErro();
      }
    }
    if (value === 'medico') {
      const FiltroPesquisa = this.FormularioMedicos.get('OptionsFindMedicos')?.value;
      const pesquisa: string = this.FormularioMedicos.get('PesquisaMedicos')?.value;
      this.FormularioConsulta.patchValue({
        date: '',
        Hora: ''
      });
      try {
        const dados = await this.medicosService.PesquisaMedicoFiltro(FiltroPesquisa, pesquisa);
        this.AbirTabela(dados, 'medico');
      } catch (error) {
        this.medicosService.exibirMensagemErro();
      }
    }
  }

  AbirTabela(Dados: any, value: string) {
    if (value === 'paciente') {
      const dialogRef = this.dialog.open(TabelaDePacientesComponent, {
        width: '800px',
        data: { datasource: Dados, },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.Paciente = result;
        }
      })
    }
    if (value === 'medico') {
      const dialogRef = this.dialog.open(TabelasPesquisasMedicosComponent, {
        width: '800px',
        data: { datasource: Dados, },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.MostraHora = true
          this.Medico = result;
        }
      })
    }
  }

  onDateChange(event: Event) {
    const selectedDate = this.FormularioConsulta.get('date')?.value
    const date = new Date(selectedDate + 'T00:00:00');
    const utcDate = new Date(date.toUTCString());
    const options = { weekday: 'long' as const };
    const diaDaSemana = new Intl.DateTimeFormat('pt-BR', options).format(utcDate);
    this.DiaDaSemana = diaDaSemana;
    this.DataSelecionada = selectedDate;
    if (this.MostraHora) {
      this.verificarCondicoesParaConsulta(selectedDate)
    }
  }

  verificarCondicoesParaConsulta(selectedDate: Date) {
    this.horariosDisponiveis = [];
    if (this.Medico && selectedDate) {
      if (this.Medico.medTempoDeConsulta) {
        this.generateAvailableTimes(this.Medico.medTempoDeConsulta);
      } else {
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
      this.consultaService.VerificarHorariosDisponiveisReferentesAoMedicoEData(this.Medico.medCodigo, selectedDate).subscribe(
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

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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



  //======================================================================


  async marcarConsulta() {
    const input_Forma_Pagamento = this.transformaFormaPagamento();
    const input_HORA = this.FormularioConsulta.get('Hora')?.value;
    const input_OBSERVACAO = this.FormularioConsulta.get('observacao')?.value;
    const dataAtual = new Date().toISOString().split('T')[0];

    console.log('input_OBSERVACAO', input_OBSERVACAO),
      console.log('input_HORA', input_HORA),
      console.log('input_Forma_Pagamento', input_Forma_Pagamento),
      console.log('this.Medico', this.Medico),
      console.log('this.Paciente', this.Paciente),
      console.log('this.DataSelecionada', this.DataSelecionada);

    if (this.Medico && this.Paciente && this.DataSelecionada && input_Forma_Pagamento && input_HORA) {
      const consult: any = {
        conData: this.DataSelecionada,
        conHorario: input_HORA,
        conMedico: this.Medico.medCodigo,
        conPaciente: this.Paciente.paciCodigo,
        conCodigoConsulta: 0,
        conDia_semana: this.DiaDaSemana,
        conObservacoes: input_OBSERVACAO,
        conDadaCriacao: dataAtual,
        conFormaPagamento: input_Forma_Pagamento,
        conAdm: this.UsuarioLogado.id,
        conStatus: 0,
      };
      console.log('consult', consult);
      try {
        const dados = await this.consultaService.VericarSeExetemConsultasMarcadas(consult).toPromise();
        console.log('dados', dados);
        if (dados) {
          this.DialogService.JaexisteDadosCAdastradosComEssesParamentros();
          this.FormularioConsulta.reset();
          return;
        }

        this.consultaService.CriarConsulata(consult).subscribe((response) => {

          const texto: string = `O cadastro da consulta foi realizado com sucesso.\nCodigo de consulta: ${response.conCodigoConsulta} `;
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: texto,
          }).then((result) => {
            if (result.isConfirmed) {
              this.FormularioPaciente.reset();
              this.FormularioMedicos.reset();
              this.FormularioConsulta.reset();
              this.Paciente = {} as Paciente;
              this.Medico = {} as Medico;
              this.consultaService.ChangeCadastroRealizadoComSucesso(response);
            }
          });
        },
          (error) => {
            console.error('Erro ao criar consulta:', error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Algo deu errado. Tente novamente mais tarde.',
            });
          }
        );
      } catch (error) {
        console.error('Erro ao verificar consultas:', error);
        this.DialogService.JaexisteDadosCAdastradosComEssesParamentros();
        this.FormularioConsulta.reset();
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Por favor, preencha todos os campos obrigatórios.',
      });
    }
  }







  transformaFormaPagamento() {
    const pagamentoValue = this.FormularioConsulta.get('Pagamento')?.value;
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






















  voltarParaHome() {
    this.router.navigate(['/Dashboard']);
  }
}

