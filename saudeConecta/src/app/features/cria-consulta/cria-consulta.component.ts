import { DialogService } from './../../util/variados/dialogo-confirmação/dialog.service';
import { ServiceConsultaMedicosService } from './../../service/service-consultaMedico/service-consultaMedicos.service';
import { HoradaConsulta } from './../../util/variados/options/options';
import { tokenService } from 'src/app/util/Token/token.service';
import { LoginService } from 'src/app/service/service-login/login.service';
import { Paciente } from './../../util/variados/interfaces/paciente/paciente';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from './../../service/paciente_service/paciente.service';
import { Component, OnInit } from '@angular/core';
import { Medico } from 'src/app/util/variados/interfaces/medico/medico';

import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import Swal from 'sweetalert2';
import { el } from 'date-fns/locale';

@Component({
  selector: 'app-cria-consulta',
  templateUrl: './cria-consulta.component.html',
  styleUrls: ['./cria-consulta.component.css'],
})
export class CriaConsultaComponent implements OnInit {
  //
  //
  //
  DiaDaSemana: string = '';
  horario: string = 'Horario de Atendimento: 08:00 a 16:30';
  DiasDeFunionamento = [
    'Segundas ',
    'Terças ',
    'Quartas ',
    'Quintas e  Sextas',
  ];

  Medico!: any;
  private Paciente!: Paciente;
  Consulta!: Consulta;
  FormGroupConsulta!: FormGroup;
  observacao: string = 'Tem alguma observação? Quais:';
  Hora = HoradaConsulta;
  pagamento: Boolean = false;

  constructor(
    private form: FormBuilder,
    private router: Router,
    private PacienteService: PacienteService,
    private tokenService: tokenService,
    private ServiceConsultaMedicosService: ServiceConsultaMedicosService,
    private DialogService: DialogService
  ) {
    this.PacienteService.MedicoValue$.subscribe((medico) => {
      if (medico) this.Medico = medico;
    });

    this.tokenService.PacienteValue$.subscribe((paciente) => {
      if (paciente) {
        this.Paciente = paciente;
        console.log(this.Paciente);
      }
    });
  }

  ngOnInit() {
    this.FormGroupConsulta = this.form.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      observacao: ['', Validators.required],
      Pagamento: ['', Validators.required],
    });
  }

  marcarConsulta() {
    let time = this.FormGroupConsulta.get('time')?.value;
      const data = this.FormGroupConsulta.get('date')?.value;
      const observacao = this.FormGroupConsulta.get('observacao')?.value;
      const FornaPAgamento = this.FormGroupConsulta.get('Pagamento')?.value;

    if (data && time && FornaPAgamento) {
      const date = new Date();
      const dataAtual = date.toISOString().split('T')[0];

      const diaDaSemana = this.DiaDaSemana;


      const medico = this.Medico.medCodigo;
      const paciente = this.Paciente.PaciCodigo;

      const consult: Consulta = {
        ConData: data,
        ConHorario: time,
        ConMedico: medico,
        ConPaciente: paciente,
        ConCodigoConsulta: 0,
        ConDia_semana: diaDaSemana,
        ConObservacoes: observacao,
        ConDadaCriacao: dataAtual, // Corrige o nome do campo para ConDataCriacao
        ConFormaPagamento: FornaPAgamento,
      };
      console.log(consult);

      this.ServiceConsultaMedicosService.VericarSeExetemConsultasMarcadas(
        consult
      ).subscribe(
        (data) => {
          if (data) {
            this.DialogService.JaexisteDadosCAdastradosComEssesParamentros();
            this.FormGroupConsulta.reset();
          } else if (!data) {
            this.ServiceConsultaMedicosService.CriarConsulata(consult).subscribe(
              () => {
                Swal.fire({
                  icon: 'success',
                  title: 'OK',
                  text: 'Consulta  realizado com sucesso.',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.router.navigate(['home']);
                    this.DialogService.exibirMensagemDeRetornoAposCriaConsultaDeMedico();
                  }
                });
              },
              (error) => {
                console.log(error);
              }
            );
          }
        },
        (error) => {
          console.log(error);
          console.log(data, 'error');
        }
      );
    }else{
      this.DialogService.exibirMensagemParaCamposNaoInformadosDeConsulta ();
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
}
