import { ConsultaService } from 'src/app/service/consulta/consulta.service';
import { Paciente } from 'src/app/util/variados/interfaces/paciente/paciente';
import { Medico } from './../../../../util/variados/interfaces/medico/medico';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Consulta } from 'src/app/util/variados/interfaces/consulta/consulta';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Tabela } from 'src/app/util/variados/interfaces/tabela/Tabela';

@Component({
  selector: 'app-Avisos-Lembretes',
  templateUrl: './Avisos-Lembretes.component.html',
  styleUrls: ['./Avisos-Lembretes.component.css'],
})
export class AvisosLembretesComponent implements OnInit {
  AvisoLembreteForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AvisosLembretesComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { Consulta: Tabela; Medico: Medico; Paciente: Paciente },
    private form: FormBuilder,
    private consultaService: ConsultaService
  ) {
    console.log('avisos', this.data.Consulta);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.AvisoLembreteForm = this.form.group({
      destinatario: [''],
      mensagem: [''],
    });
  }

  EnviarMensagem() {
    const mensagem = this.AvisoLembreteForm.value.mensagem;
    const destinatario = this.BuscarDestinatario();
    const EnviarMensagem = {
      medEmail: destinatario,
      medTelefone: destinatario,
      paciEmail: destinatario,
      paciTelefone: destinatario,
      mensagem: mensagem,
    };

    if (destinatario && mensagem) {
      Swal.fire({
        title: 'Revisando Lembrete',
        text: 'Deseja enviar este lembrete?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5ccf6c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, enviar!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.consultaService.EnviarMensagem(EnviarMensagem).subscribe(() => {
            Swal.fire(
              'Enviado!',
              'O lembrete foi enviado com sucesso.',
              'success'
            );
            this.dialogRef.close();
          });

        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Preencha todos os campos',
      });
    }
  }

  BuscarDestinatario(): any {
    if (this.AvisoLembreteForm.value.destinatario == 1) {
      return this.data.Medico.medEmail;
    } else if (this.AvisoLembreteForm.value.destinatario == 2) {
      return this.data.Medico.medTelefone;
    } else if (this.AvisoLembreteForm.value.destinatario == 3) {
      return this.data.Paciente.paciEmail;
    } else if (this.AvisoLembreteForm.value.destinatario == 4) {
      return this.data.Paciente.paciTelefone;
    }
  }
}
