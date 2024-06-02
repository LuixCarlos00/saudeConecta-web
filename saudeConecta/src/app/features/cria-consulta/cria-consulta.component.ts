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
import { style } from '@angular/animations';

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
    private PacientesService: PacientesService
  ) {
    this.medicosService.MedicoValue$.subscribe((medico) => {
      if (medico) this.Medico = medico;
    });

    this.tokenService.UsuarioLogadoValue$.subscribe((paciente) => {
      if (paciente) {
        this.Adiministrador = paciente;
        console.log(this.Adiministrador);
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
        (erros) => {
          this.exibirMensagemErro();
        }
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
        (erros) => {
          this.exibirMensagemErro();
        }
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
        (erros) => {
          this.exibirMensagemErro();
        }
      );
    } else if (FiltroPesquisaPaciente === 4) {
      this.PacientesService.buscarListaPacientesPorTelefone(pesquisa).subscribe(
        (dados) => {
          console.log(dados);

          if (dados && dados.length > 0) {
            this.dadosPaciente = dados;
            this.showResultadoPaciente = true;
          } else {
            this.exibirMensagemErro();
          }
        },
        (erros) => {
          this.exibirMensagemErro();
        }
      );
    }else if (FiltroPesquisaPaciente === 5) {
      this.PacientesService.buscarTodosPacientes().subscribe(
        (dados) => {
          console.log(dados);

          if (dados && dados.length > 0) {
            this.dadosPaciente = dados;
            this.showResultadoPaciente = true;
          } else {
            this.exibirMensagemErro();
          }
        },
        (erros) => {
          this.exibirMensagemErro();
        }
      );
    }


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
      const paciente = this.PacienteEscolhido.paciCodigo;

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
        ConAdm: this.Adiministrador.AdmCodigo,
        ConStatus: 0
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
            this.ServiceConsultaMedicosService.CriarConsulata(
              consult
            ).subscribe(
              (response) => {
                console.log(response);
                const texto :string =`O cadastro da consulta foi realizado com sucesso.\n   `+`Codigo de consulta: ${response.ConCodigoConsulta} `

                Swal.fire({
                  icon: 'success',
                  title: 'OK',
                  text: texto,

                }).then((result) => {
                  if (result.isConfirmed) {
                    this.router.navigate(['home']);
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
    console.log(elemento, 'paciente selecionado');

    this.PacienteEscolhido = elemento;
  }

  exibirMensagemErro() {
    this.DialogService.exibirMensagemErro();
  }
}
