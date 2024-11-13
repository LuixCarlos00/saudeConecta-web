import { Paciente } from '../../../util/variados/interfaces/paciente/paciente';
import { Medico } from '../../../util/variados/interfaces/medico/medico';
import { ConsultaService } from 'src/app/service/consulta/consulta.service';
import {
  Component,
  EventEmitter,
  Inject,
  input,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MedicosService } from 'src/app/service/medicos/medicos.service';
import { PacientesService } from 'src/app/service/pacientes/Pacientes.service';
import { DialogService } from 'src/app/util/variados/dialogo-confirmação/dialog.service';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { HoradaConsulta } from 'src/app/util/variados/options/options';
import Swal from 'sweetalert2';

import { Adiministrador } from 'src/app/util/variados/interfaces/administrado/adiministrador';
import { tokenService } from 'src/app/util/Token/Token.service';
import { Tabela } from 'src/app/util/variados/interfaces/tabela/Tabela';
import { el, th, id } from 'date-fns/locale';

@Component({
  selector: 'app-Editar-Consultas',
  templateUrl: './Editar-Consultas.component.html',
  styleUrls: ['./Editar-Consultas.component.css'],
})
export class EditarConsultasComponent implements OnInit {


  DiaDaSemana: string = '';
  Hora = [] as any[];
  dadosPacientePassandoTabela: any[] = [];
  dadosMedicoPassandoTabela: any[] = [];
  showResultadoPaciente: boolean = false;
  showResultadoMedico: boolean = false;
  horariosDisponiveis: string[] = [];
  FormGroupConsulta!: FormGroup;
  DadosPaciente!: any;
  DadosMedico!: any;


  DadosAntigosDeConsulta: Tabela = {
    consulta: 0,
    diaSemana: '',
    data: '',
    horario: '',
    observacao: '',
    medico: {} as Medico,
    paciente: {} as Paciente,
    status: 0,
    adm: {} as Adiministrador,
    formaPagamento: 0,
    dadaCriacao: '',
  };


  constructor(
    public dialogRef: MatDialogRef<EditarConsultasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { DadoSelecionadoParaEdicao: Tabela },
    private PacientesService: PacientesService,
    private form: FormBuilder,
    private ConsultaService: ConsultaService,
    private medicosService: MedicosService
  ) {

  }

  async ngOnInit() {
    this.FormGroupConsulta = this.form.group({
      date: [''],
      time: ['', Validators.required],
      observacao: ['', Validators.required],
      Pagamento: ['', Validators.required],
      PesquisaPaciente: ['', Validators.required],
      FiltroPesquisaPaciente: ['', Validators.required],
      FiltroPesquisaMedico: ['', Validators.required],
      PesquisaMedico: ['', Validators.required],
    });

    this.DadosAntigosDeConsulta = await this.data.DadoSelecionadoParaEdicao;

    this.FormGroupConsulta.patchValue({
      date: this.DadosAntigosDeConsulta.data,
      time: this.DadosAntigosDeConsulta.horario.slice(0, 5),
      observacao: this.DadosAntigosDeConsulta.observacao,
      Pagamento: this.DadosAntigosDeConsulta.formaPagamento,
      FiltroPesquisaPaciente: this.DadosAntigosDeConsulta.paciente,
      FiltroPesquisaMedico: this.DadosAntigosDeConsulta.medico,
    });

    this.Hora.push(await this.atualizarHorarios());


  }

  Salvar() {
    let Pagamento = '';
    if (this.FormGroupConsulta.value.Pagamento === 1) {
      Pagamento = 'Dinheiro';
    } else if (this.FormGroupConsulta.value.Pagamento === 2) {
      Pagamento = 'Cartão';
    } else if (this.FormGroupConsulta.value.Pagamento === 3) {
      Pagamento = 'Pix';
    }
    Swal.fire({
      html: `
            <div style="text-align: left;">
                <p>Tem certeza que deseja editar esse registro?</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 5px; font-weight: bold;">Médico:</td>
                        <td style="padding: 5px;">${this.DadosAntigosDeConsulta.medico.medNome}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px; font-weight: bold;">Paciente:</td>
                        <td style="padding: 5px;">${this.DadosAntigosDeConsulta.paciente.paciNome}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px; font-weight: bold;">Horário:</td>
                        <td style="padding: 5px;">${this.DadosAntigosDeConsulta.horario}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px; font-weight: bold;">Data:</td>
                        <td style="padding: 5px;">${this.DadosAntigosDeConsulta.data}</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px; font-weight: bold;">Pagamento:</td>
                        <td style="padding: 5px;">${Pagamento}</td>
                    </tr>
                </table>
                <div style="margin-top: 10px;">
                    <p><strong>Observação:</strong></p>
                    <textarea style="width: 100%; height: 60px;" readonly>${this.DadosAntigosDeConsulta.observacao || ''}</textarea>
                </div>
            </div>
        `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5ccf6c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Editar!'
    }).then((result) => {
      if (result.isConfirmed) {

        let novaConsulta: any = {
          conCodigoConsulta: this.DadosAntigosDeConsulta.consulta,
          conMedico: this.DadosAntigosDeConsulta.medico.medCodigo,
          conPaciente: this.DadosAntigosDeConsulta.paciente.paciCodigo,
          conDia_semana: this.DadosAntigosDeConsulta.diaSemana,
          conHorario: this.DadosAntigosDeConsulta.horario,
          conData: this.DadosAntigosDeConsulta.data,
          conObservacoes: this.DadosAntigosDeConsulta.observacao || '',
          conDadaCriacao: this.DadosAntigosDeConsulta.dadaCriacao,
          conFormaPagamento: this.DadosAntigosDeConsulta.formaPagamento,
          conStatus: this.DadosAntigosDeConsulta.status || 0,
          conAdm: this.DadosAntigosDeConsulta.adm?.admUsuario?.id
        };


        this.ConsultaService.EditarConsultas(this.DadosAntigosDeConsulta.consulta, novaConsulta).subscribe(
          (dados) => {
            Swal.fire({
              icon: 'success',
              title: 'OK',
              text: 'Consulta editada com sucesso .',
            }).then((result) => {
              if (result.isConfirmed) {
                this.dialogRef.close('salvo');
              }
            });
          },
          (erros) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Algo deu errado !',
            });
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.onNoClick();
      }
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

      this.showResultadoPaciente = true;
      this.dadosPacientePassandoTabela = dados;

    } catch (error) {
      this.PacientesService.exibirMensagemErro();
    }
  }
  fecharTabelaPacinte() {
    this.showResultadoPaciente = false;
  }
  PacienteSelecionado(elemento: any) {
    const PacienteEscolhido: any = elemento;
    this.FormGroupConsulta.patchValue({
      FiltroPesquisaPaciente: elemento,
    });
    this.DadosAntigosDeConsulta.paciente = PacienteEscolhido as Paciente;
  }


  async PesquisarMedicosFiltro() {
    const pesquisa: string =
      this.FormGroupConsulta.get('PesquisaMedico')?.value;
    const FiltroPesquisa: number = this.FormGroupConsulta.get(
      'FiltroPesquisaMedico'
    )?.value;
    try {
      const dados = await this.medicosService.PesquisaMedicoFiltro(
        FiltroPesquisa,
        pesquisa
      );
      this.showResultadoMedico = true;
      this.dadosMedicoPassandoTabela = dados;
    } catch (error) {
      this.medicosService.exibirMensagemErro();
    }
  }
  fecharTabelaMedicos() {
    this.showResultadoMedico = false;
  }
  MedicoSelecionado(elemento: Event) {
    const MedicoEscolhido: any = elemento;
    this.FormGroupConsulta.patchValue({
      FiltroPesquisaMedico: elemento,
    });
    this.DadosAntigosDeConsulta.medico = MedicoEscolhido as Medico;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  onDateChange(event: Event) {
    const selectedDate: string = (event.target as HTMLInputElement).value;
    this.verificarCondicoesParaConsulta(selectedDate); // Chama a função ao mudar a data
  }

  verificarCondicoesParaConsulta(DataSelecionada: any) {
    this.horariosDisponiveis = []; // Limpa os horários disponíveis ao iniciar a consulta
    if (DataSelecionada) {
      this.ConsultaService.VerificarHorariosDisponiveisReferentesAoMedicoEData(this.DadosAntigosDeConsulta.medico.medCodigo, DataSelecionada).subscribe(
        (data) => {
          const horarioDidisponivelFormatado = data.map((horario) => horario.substring(0, 5));
          this.Hora = this.Hora.filter((horario) => {
            const horarioFormatado = horario.value.substring(0, 5);
            return !horarioDidisponivelFormatado.includes(horarioFormatado);
          })
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Falha ao buscar horários disponíveis!',
          })
          console.log(error);
        }
      );
    }
  }



  async atualizarHorarios() {
    const medico = this.DadosAntigosDeConsulta.medico;
    if (medico.medTempoDeConsulta) {
      const horarioDinamico = this.gerarHorariosDinamicos(medico.medTempoDeConsulta);
      this.Hora = horarioDinamico
    } else {
      this.Hora = HoradaConsulta;
    }
  }

  gerarHorariosDinamicos(MedTempoDeConsulta: number): any {
    if (!MedTempoDeConsulta || MedTempoDeConsulta <= 0) {
      return HoradaConsulta;
    }
    const horarios: { value: string; label: string; }[] = [];
    const tempoConsultaMinutos = Number(MedTempoDeConsulta);
    let horaAtual = 8 * 60; // 8:00 em minutos
    const fimDoDia = 18 * 60; // 18:00 em minutos
    while (horaAtual < fimDoDia) {
      const horas = Math.floor(horaAtual / 60);
      const minutos = horaAtual % 60;
      const horarioFormatado = `${this.formatarNumero(horas)}:${this.formatarNumero(minutos)}`;
      horarios.push({ value: horarioFormatado, label: horarioFormatado });

      horaAtual += tempoConsultaMinutos;
    }
    return horarios;
  }

  formatarNumero(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }



} //fim da classe
