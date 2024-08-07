import { ProntuarioService } from '../../../service/MEDICO-prontuario/prontuario.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Prontuario } from 'src/app/util/variados/interfaces/Prontuario/Prontuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pediatria-exames-fisicos',
  templateUrl: './pediatria-exames-fisicos.component.html',
  styleUrls: ['./pediatria-exames-fisicos.component.css'],
})
export class PediatriaExamesFisicosComponent implements OnInit {
  @Output() onMudarAba = new EventEmitter<number>();
  peso: string = '';
  altura: string = '';
  Temperatura: string = '';
  DataNacimento: string = '';
  Sexo: string = '';
  Saturacao: string = '';
  Hemoglobinacao: string = '';
  FreqRespiratoria: string = '';
  PressArterial: string = '';
  FreqArterialSistolica: string = '';
  observacao: string = '';
  FreqArterialDiastolica: string = '';

  constructor(private ProntuarioService: ProntuarioService) {}

  ngOnInit() {}

  Proximo() {

    if (
      this.DataNacimento === null ||
      this.DataNacimento === undefined ||
      this.DataNacimento === ''
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Para prosseguir, preencha o campo Data de Nascimento',
        showConfirmButton: true,
        showCancelButton: true,
      });
    } else {
      const prontuario: Prontuario = {
        prontAltura: this.altura,
        prontPeso: this.peso,
        prontTemperatura: this.Temperatura,
        prontDataNacimento: this.DataNacimento,
        prontSexo: this.Sexo,
        prontSaturacao: this.Saturacao,
        prontHemoglobina: this.Hemoglobinacao,
        prontFrequenciaRespiratoria: this.FreqRespiratoria,
        prontPressao: this.PressArterial,
        prontFrequenciaArterialSistolica: this.FreqArterialSistolica,
        prontFrequenciaArterialDiastolica: this.FreqArterialDiastolica,
        prontObservacao: this.observacao,
      };
      console.log('os dados chegara aqui   ', prontuario);


      this.ProntuarioService.chagePediatriaExamesFisicos(prontuario);
      this.onMudarAba.emit(1);
    }
  }
}
