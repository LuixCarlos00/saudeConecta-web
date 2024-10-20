import { Medico } from './../../../../util/variados/interfaces/medico/medico';
import { ConsultaService } from 'src/app/service/consulta/consulta.service';
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
import { MedicosService } from 'src/app/service/medicos/medicos.service';
import { PacientesService } from 'src/app/service/pacientes/Pacientes.service';
import { DialogService } from 'src/app/util/variados/dialogo-confirmação/dialog.service';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';
import { Usuario } from 'src/app/util/variados/interfaces/usuario/usuario';
import { HoradaConsulta } from 'src/app/util/variados/options/options';
import Swal from 'sweetalert2';

import { Adiministrador } from 'src/app/util/variados/interfaces/administrado/adiministrador';
import { tokenService } from 'src/app/util/Token/Token.service';
import { Tabela } from 'src/app/util/variados/interfaces/tabela/tabela';
import { th } from 'date-fns/locale';

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
  horariosDisponiveis: string[] = [];
  FormGroupConsulta!: FormGroup;
  DataSelecionada: any;
  DadosPaciente!: any;
  DadosMedico!: any;

  UsuarioLogado: Usuario = {
    id: 0,
    aud: '',
    exp: '',
    iss: '',
    sub: '',
  };
  DadosAntigosDeConsulta: Tabela = {
    consulta: '',
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
  DadosDeEdicaoConsulta: Tabela = {
    consulta: '',
    diaSemana: '',
    data: '',
    horario: '',
    observacao: '',
    medico: {} as Medico,
    paciente: {} as Paciente,
    dadaCriacao: '',
    status: 0,
    adm: {} as Adiministrador,
    formaPagamento: 0,
  };

  constructor(
    public dialogRef: MatDialogRef<EditarConsultasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { DadoSelecionadoParaEdicao: Tabela },
    private DialogService: DialogService,
    private PacientesService: PacientesService,
    private form: FormBuilder,
    private ConsultaService: ConsultaService,
    private tokenService: tokenService,
    private medicosService: MedicosService
  ) {
    this.tokenService.decodificaToken();
    this.tokenService.UsuarioLogadoValue$.subscribe((Usuario) => {
      if (Usuario) this.UsuarioLogado = Usuario;
    });

    this.PacienteEscolhido = this.data.DadoSelecionadoParaEdicao.paciente;
    this.MedicoEscolhido = this.data.DadoSelecionadoParaEdicao.medico;
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
    console.log('DadosAntigosDeConsulta', this.DadosAntigosDeConsulta);

    this.FormGroupConsulta.patchValue({
      date: this.DadosAntigosDeConsulta.data,
      time: this.DadosAntigosDeConsulta.horario,
      observacao: this.DadosAntigosDeConsulta.observacao,
      Pagamento: this.DadosAntigosDeConsulta.formaPagamento,
      FiltroPesquisaPaciente: this.DadosAntigosDeConsulta.paciente,
      FiltroPesquisaMedico: this.DadosAntigosDeConsulta.medico,
    });
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
        console.log('Editando consulta...', this.FormGroupConsulta.value);

        // this.DadosDeEdicaoConsulta.ConPaciente = this.PacienteEscolhido.paciCodigo;
        // this.DadosDeEdicaoConsulta.ConMedico = this.MedicoEscolhido.medCodigo;
        // this.DadosDeEdicaoConsulta.ConAdm = this.UsuarioLogado.id;
        // this.DadosDeEdicaoConsulta.ConDia_semana = this.DiaDaSemana;

        // if (this.DadosDeEdicaoConsulta.ConHorario ===  this.DadosAntigosDeConsulta.ConHorario &&
        //   this.DadosDeEdicaoConsulta.ConData === this.DadosAntigosDeConsulta.ConData &&
        //   this.DadosDeEdicaoConsulta.ConMedico === this.DadosAntigosDeConsulta.ConMedico.medCodigo ) {

        //   this.ConsultaService.EditarConsultas(
        //     this.DadosDeEdicaoConsulta.ConCodigoConsulta,
        //     this.DadosDeEdicaoConsulta
        //   ).subscribe(
        //     (dados) => {
        //       Swal.fire({
        //         icon: 'success',
        //         title: 'OK',
        //         text: 'Consulta editada com sucesso .',
        //       }).then((result) => {
        //         if (result.isConfirmed) {
        //          //window.location.reload();
        //         }
        //       });
        //     },
        //     (erros) => {
        //       Swal.fire({
        //         icon: 'error',
        //         title: 'Oops...',
        //         text: 'Algo deu errado !',
        //       });
        //     }
        //   );
        // }

        // else if (this.DadosDeEdicaoConsulta.ConHorario != this.DadosAntigosDeConsulta.ConHorario ||
        //   this.DadosDeEdicaoConsulta.ConData != this.DadosAntigosDeConsulta.ConData ||
        //   this.DadosDeEdicaoConsulta.ConMedico != this.DadosAntigosDeConsulta.ConMedico.medCodigo
        // ) {
        //   console.log('Dados diferentes ');
        //   if (this.DadosDeEdicaoConsulta) {
        //     this.ConsultaService.VericarSeExetemConsultasMarcadas(
        //       this.DadosDeEdicaoConsulta
        //     ).subscribe(
        //       (dados) => {
        //         if (dados) {
        //           Swal.fire({
        //             icon: 'error',
        //             title: 'Oops...',
        //             text: 'Ja existe uma consulta marcada para este horário. Tente outro horário. Ou altere o dia.',
        //           });
        //         } else if (!dados) {
        //           console.log(dados, 'dados');

        //           this.ConsultaService.EditarConsultas(
        //             this.DadosDeEdicaoConsulta.ConCodigoConsulta,
        //             this.DadosDeEdicaoConsulta
        //           ).subscribe(
        //             (dados) => {
        //               Swal.fire({
        //                 icon: 'success',
        //                 title: 'OK',
        //                 text: 'Consulta editada com sucesso .',
        //               }).then((result) => {
        //                 if (result.isConfirmed) {
        //                   window.location.reload();
        //                 }
        //               });
        //             },
        //             (erros) => {
        //               Swal.fire({
        //                 icon: 'error',
        //                 title: 'Oops...',
        //                 text: 'Algo deu errado !',
        //               });
        //             }
        //           );
        //         }
        //       },
        //       (erros) => {
        //         Swal.fire({
        //           icon: 'error',
        //           title: 'Oops...',
        //           text: 'Algo deu errado !',
        //         });
        //       }
        //     );
        //   }
        // }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.onNoClick();
      }
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
    const pesquisa: string =
      this.FormGroupConsulta.get('PesquisaMedico')?.value;
    const FiltroPesquisa: number = this.FormGroupConsulta.get(
      'FiltroPesquisaMedico'
    )?.value;

    if (FiltroPesquisa === 1) {
      console.log('nome', pesquisa);

      this.medicosService.buscarListaMedicosPorNome(pesquisa).subscribe(
        (dados) => {
          if (dados && dados.length > 0) {
            console.log('dados', dados);

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

  fecharTabela() {
    this.showResultadoPaciente = false;
  }

  fecharTabelaMedicos() {
    this.showResultadoMedico = false;
  }

  PacienteSelecionado(elemento: any) {
    this.FormGroupConsulta.patchValue({
      FiltroPesquisaPaciente: elemento,
    })
   //this.PacienteEscolhido = elemento;
  }

  MedicoSelecionado(elemento: Event) {
     this.FormGroupConsulta.patchValue({
      FiltroPesquisaMedico: elemento,
    });
    console.log('FormGroupConsulta', this.FormGroupConsulta.value);

   // this.MedicoEscolhido = elemento;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  exibirMensagemErro() {
    this.DialogService.exibirMensagemErro();
  }

  FormataçãoDeDatasParaDiasDaSemanas(selectedDate: string): void {
    if (!selectedDate) return; // Adiciona verificação para lidar com valores vazios
    const date = new Date(selectedDate + 'T00:00:00'); // Adiciona a hora para evitar problemas com fuso horário
    const utcDate = new Date(date.toUTCString()); // Normaliza a data para UTC
    const options = { weekday: 'long' as const };
    const dayOfWeek = new Intl.DateTimeFormat('pt-BR', options).format(utcDate);
    this.DiaDaSemana = dayOfWeek;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
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
    if (this.MedicoEscolhido && this.DataSelecionada) {
      this.ConsultaService.VerificarHorariosDisponiveisReferentesAoMedicoEData(
        this.MedicoEscolhido.medCodigo,
        this.DataSelecionada
      ).subscribe(
        (data) => {
          this.horariosDisponiveis = data;
          this.atualizarHorarios(); // Atualiza os horários disponíveis ao receber os dados
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  atualizarHorarios() {
    if (this.horariosDisponiveis) {
      const horariosDisponiveisFormatados = this.horariosDisponiveis.map(
        (horario) => horario.substring(0, 5)
      );
      this.Hora = HoradaConsulta.filter((horario) => {
        const horarioFormatado = horario.value.substring(0, 5);
        return !horariosDisponiveisFormatados.includes(horarioFormatado);
      });
    } else {
      this.Hora = HoradaConsulta;
    }
  }
} //fim da classe
