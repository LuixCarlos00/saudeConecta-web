import { ConsultaService } from 'src/app/service/service-consulta/consulta.service';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModelService } from 'src/app/service/Model_service/Model.service';
import { MedicosService } from 'src/app/service/medicos/medicos.service';
import { PacientesService } from 'src/app/service/pacientes/Pacientes.service';
import { DialogService } from 'src/app/util/variados/dialogo-confirmação/dialog.service';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { HoradaConsulta } from 'src/app/util/variados/options/options';
import Swal from 'sweetalert2';
import { tokenService } from 'src/app/util/Token/token.service';
import { Adiministrador } from 'src/app/util/variados/interfaces/administrado/adiministrador';

@Component({
  selector: 'app-Editar-Consultas',
  templateUrl: './Editar-Consultas.component.html',
  styleUrls: ['./Editar-Consultas.component.css'],
})
export class EditarConsultasComponent implements OnInit {
  //
  //
  //

  DiaDaSemana: string = '';
  Hora = HoradaConsulta;

  dadosPacientePassandoTabela: any;
  dadosMedicoPassandoTabela: any;

  showResultadoPaciente: boolean = false;
  showResultadoMedico: boolean = false;

  MedicoEscolhido!: any;
  PacienteEscolhido!: any;

  FormGroupConsulta!: FormGroup;

  DadosPaciente!: any;
  DadosMedico!: any;

  Usuario: Adiministrador = {
    AdmCodigo: 0,
    AdmNome: '',
    AdmUsuario: 0,
    AdmStatus: 0,
    AdmEmail: '',
    AdmCodigoAtorizacao: '',
    AdmDataCriacao: '',
  };

  DadosAntigosDeConsulta: any = {
    ConCodigoConsulta: 0,
    ConMedico: 0,
    ConPaciente: 0,
    ConDia_semana: '',
    ConHorario: '',
    ConData: '',
    ConObservacoes: '',
    ConDadaCriacao: '',
    ConFormaPagamento: 0,
    ConStatus: 0,
    ConAdm: 0,
  };
  DadosDeEdicaoConsulta: Consulta = {
    ConCodigoConsulta: 0,
    ConMedico: 0,
    ConPaciente: 0,
    ConDia_semana: '',
    ConHorario: '',
    ConData: '',
    ConObservacoes: '',
    ConDadaCriacao: '',
    ConFormaPagamento: 0,
    ConStatus: 0,
    ConAdm: 0,
  };

  constructor(
    public dialogRef: MatDialogRef<EditarConsultasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { DadoSelecionadoParaEdicao: any },
    private DialogService: DialogService,
    private PacientesService: PacientesService,
    private form: FormBuilder,
    private ConsultaService: ConsultaService,
    private tokenService: tokenService,
    private medicosService: MedicosService
  ) {
    this.tokenService.UsuarioLogadoValue$.subscribe((Usuario) => {
      if (Usuario) this.Usuario = Usuario;
    });

    this.DadosAntigosDeConsulta = this.data.DadoSelecionadoParaEdicao[0];

    this.DadosDeEdicaoConsulta = this.data.DadoSelecionadoParaEdicao[0];
    this.DadosPaciente = this.data.DadoSelecionadoParaEdicao[0].ConPaciente;
    this.DadosMedico = this.data.DadoSelecionadoParaEdicao[0].ConMedico;

    this.PacienteEscolhido = this.DadosPaciente;
    this.MedicoEscolhido = this.DadosMedico;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.DadosDeEdicaoConsulta.ConHorario =
      this.DadosDeEdicaoConsulta.ConHorario.slice(0, 5);

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

    this.FormGroupConsulta.get('date')?.valueChanges.subscribe((value) => {
      this.onDateChange(value);
    });

    this.DadosAntigosDeConsulta = {
      ConData: this.DadosDeEdicaoConsulta.ConData,
      ConHorario: this.DadosDeEdicaoConsulta.ConHorario,
      ConObservacoes: this.DadosDeEdicaoConsulta.ConObservacoes,
      ConFormaPagamento: this.DadosDeEdicaoConsulta.ConFormaPagamento,
      ConPaciente: this.PacienteEscolhido,
      ConMedico: this.MedicoEscolhido,
      ConAdm: this.DadosDeEdicaoConsulta.ConAdm,
      ConDia_semana: this.DadosDeEdicaoConsulta.ConDia_semana,
      ConStatus: this.DadosDeEdicaoConsulta.ConStatus,
      ConCodigoConsulta: this.DadosDeEdicaoConsulta.ConCodigoConsulta,
      ConDadaCriacao: this.DadosDeEdicaoConsulta.ConDadaCriacao,
    };
  }

  fecharTabela() {
    this.showResultadoPaciente = false;
  }

  fecharTabelaMedicos() {
    this.showResultadoMedico = false;
  }

  PacienteSelecionado(elemento: any) {
    this.PacienteEscolhido = elemento;
  }

  MedicoSelecionado(elemento: Event) {
    this.MedicoEscolhido = elemento;
  }

  onDateChange(selectedDate: string) {
    if (!selectedDate) return; // Adiciona verificação para lidar com valores vazios

    const date = new Date(selectedDate + 'T00:00:00'); // Adiciona a hora para evitar problemas com fuso horário
    const utcDate = new Date(date.toUTCString()); // Normaliza a data para UTC
    const options = { weekday: 'long' as const };
    const dayOfWeek = new Intl.DateTimeFormat('pt-BR', options).format(utcDate);
    this.DiaDaSemana = dayOfWeek;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(this.DiaDaSemana, 'dia da semana');
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
            this.dadosPacientePassandoTabela = dados;
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
            this.dadosPacientePassandoTabela = dados;
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
            this.dadosPacientePassandoTabela = dados;
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
            this.dadosPacientePassandoTabela = dados;
            this.showResultadoPaciente = true;
          } else {
            this.exibirMensagemErro();
          }
        },
        (erros) => {
          this.exibirMensagemErro();
        }
      );
    } else if (FiltroPesquisaPaciente === 5) {
      this.PacientesService.buscarTodosPacientes().subscribe(
        (dados) => {
          console.log(dados);

          if (dados && dados.length > 0) {
            this.dadosPacientePassandoTabela = dados;
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

  PesquisarMedicosFiltro() {
    const pesquisa: string = this.FormGroupConsulta.get('Pesquisa')?.value;
    const FiltroPesquisa: number = this.FormGroupConsulta.get(
      'FiltroPesquisaMedico'
    )?.value;

    if (FiltroPesquisa === 1) {
      this.medicosService.buscarListaMedicosPorNome(pesquisa).subscribe(
        (dados) => {
          if (dados && dados.length > 0) {
            this.dadosMedicoPassandoTabela = dados;
            this.showResultadoMedico = true;
          } else {
            this.exibirMensagemErro();
          }
        },
        (erros) => {
          this.exibirMensagemErro();
        }
      );
    } else if (FiltroPesquisa === 2) {
      this.medicosService.buscarListaMedicosPorCRM(pesquisa).subscribe(
        (dados) => {
          if (dados && dados.length > 0) {
            this.dadosMedicoPassandoTabela = dados;
            this.showResultadoMedico = true;
          } else {
            this.exibirMensagemErro();
          }
        },
        (erros) => {
          this.exibirMensagemErro();
        }
      );
    } else if (FiltroPesquisa === 3) {
      this.medicosService.buscarListaMedicosPorCidade(pesquisa).subscribe(
        (dados) => {
          if (dados && dados.length > 0) {
            this.dadosMedicoPassandoTabela = dados;
            this.showResultadoMedico = true;
          } else {
            this.exibirMensagemErro();
          }
        },
        (erros) => {
          this.exibirMensagemErro();
        }
      );
    } else if (FiltroPesquisa === 4) {
      this.medicosService
        .buscarListaMedicosPorEspecialidade(pesquisa)
        .subscribe(
          (dados) => {
            console.log(dados);

            if (dados && dados.length > 0) {
              this.dadosMedicoPassandoTabela = dados;
              this.showResultadoMedico = true;
            } else {
              this.exibirMensagemErro();
            }
          },
          (erros) => {
            this.exibirMensagemErro();
          }
        );
    } else if (FiltroPesquisa === 5) {
      this.medicosService.buscarPorTodosOsMedicos().subscribe(
        (dados) => {
          if (dados && dados.length > 0) {
            this.dadosMedicoPassandoTabela = dados;
            console.log(this.dadosMedicoPassandoTabela, 'dados do medico');

            this.showResultadoMedico = true;
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

  exibirMensagemErro() {
    this.DialogService.exibirMensagemErro();
  }

  Salvar() {
    Swal.fire({
      title: 'Tem certeza que deseja editar esses registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#5ccf6c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Editar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.onDateChange(this.FormGroupConsulta.get('Data')?.value);

        this.DadosDeEdicaoConsulta.ConPaciente =
          this.PacienteEscolhido.paciCodigo;
        this.DadosDeEdicaoConsulta.ConMedico = this.MedicoEscolhido.medCodigo;
        this.DadosDeEdicaoConsulta.ConAdm = this.Usuario.AdmCodigo;
        this.DadosDeEdicaoConsulta.ConDia_semana = this.DiaDaSemana;

        if (
          this.DadosDeEdicaoConsulta.ConHorario ===
            this.DadosAntigosDeConsulta.ConHorario &&
          this.DadosDeEdicaoConsulta.ConData ===
            this.DadosAntigosDeConsulta.ConData &&
          this.DadosDeEdicaoConsulta.ConMedico ===
            this.DadosAntigosDeConsulta.ConMedico.medCodigo
        ) {
          console.log('Dados iguais');

          this.ConsultaService.EditarConsultas(
            this.DadosDeEdicaoConsulta.ConCodigoConsulta,
            this.DadosDeEdicaoConsulta
          ).subscribe(
            (dados) => {
              Swal.fire({
                icon: 'success',
                title: 'OK',
                text: 'Consulta editada com sucesso .',
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.reload();
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
        } else if (
          this.DadosDeEdicaoConsulta.ConHorario !=
            this.DadosAntigosDeConsulta.ConHorario ||
          this.DadosDeEdicaoConsulta.ConData !=
            this.DadosAntigosDeConsulta.ConData ||
          this.DadosDeEdicaoConsulta.ConMedico !=
            this.DadosAntigosDeConsulta.ConMedico.medCodigo
        ) {
          console.log('Dados diferentes ');
          if (this.DadosDeEdicaoConsulta) {
            this.ConsultaService.VericarSeExetemConsultasMarcadas(
              this.DadosDeEdicaoConsulta
            ).subscribe(
              (dados) => {
                if (dados) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ja existe uma consulta marcada para este horário. Tente outro horário. Ou altere o dia.',
                  });
                } else if (!dados) {
                  console.log(dados, 'dados');

                  this.ConsultaService.EditarConsultas(
                    this.DadosDeEdicaoConsulta.ConCodigoConsulta,
                    this.DadosDeEdicaoConsulta
                  ).subscribe(
                    (dados) => {
                      Swal.fire({
                        icon: 'success',
                        title: 'OK',
                        text: 'Consulta editada com sucesso .',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          window.location.reload();
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
                }
              },
              (erros) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Algo deu errado !',
                });
              }
            );
          }
        }
      }
    else  if (result.dismiss === Swal.DismissReason.cancel) {
      this.ConsultaService.EditarDadosDaTabelaSubject(false);
      window.location.reload();
      }
    });
  }



}//fim da classe
