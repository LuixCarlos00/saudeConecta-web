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
      console.log(Usuario, 'paciente');
    });

    this.DadosDeEdicaoConsulta = this.data.DadoSelecionadoParaEdicao[0];
    this.DadosPaciente = this.data.DadoSelecionadoParaEdicao[0].ConPaciente;
    this.DadosMedico = this.data.DadoSelecionadoParaEdicao[0].ConMedico;

    console.log(this.DadosDeEdicaoConsulta, 'dados');

    this.PacienteEscolhido = this.DadosPaciente;
    this.MedicoEscolhido = this.DadosMedico;
  }

  onNoClick(): void {

    this.dialogRef.close();
  }

  ngOnInit() {
    this.DadosDeEdicaoConsulta.ConHorario = this.DadosDeEdicaoConsulta.ConHorario.slice(0, 5);
    this.FormGroupConsulta = this.form.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      observacao: ['', Validators.required],
      Pagamento: ['', Validators.required],
      PesquisaPaciente: ['', Validators.required],
      FiltroPesquisaPaciente: ['', Validators.required],
      FiltroPesquisaMedico: ['', Validators.required],
      Pesquisa: ['', Validators.required],
    });
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
    console.log(elemento, 'paciente selecionado');
    this.MedicoEscolhido = elemento;
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
    this.DadosDeEdicaoConsulta.ConPaciente = this.PacienteEscolhido.paciCodigo;
    this.DadosDeEdicaoConsulta.ConMedico = this.MedicoEscolhido.medCodigo;
    this.DadosDeEdicaoConsulta.ConAdm = this.Usuario.AdmCodigo;

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

            this.ConsultaService.EditarConsulas(
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