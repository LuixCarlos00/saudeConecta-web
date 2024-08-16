import { InputModalityDetector } from '@angular/cdk/a11y';
import { ProntuarioService } from '../../../service/MEDICO-prontuario/prontuario.service';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Prontuario } from 'src/app/util/variados/interfaces/Prontuario/Prontuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pediatria-exames-fisicos',
  templateUrl: './pediatria-exames-fisicos.component.html',
  styleUrls: ['./pediatria-exames-fisicos.component.css'],
})
export class PediatriaExamesFisicosComponent implements OnInit {

  QueixaPrincipal: string = '';
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
  Conduta: any;
  Anamnese: any;

  @Input() Finalizar: boolean = false;



  constructor(private ProntuarioService: ProntuarioService) {}

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['Finalizar'] && this.Finalizar) {
      this.enviandoAquivos();
    }
  }


  enviandoAquivos() {


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
        prontCondulta: this.Conduta,
        prontAnamnese: this.Anamnese,
        prontQueixaPricipal: this.QueixaPrincipal,


      };

      this.ProntuarioService.chagePediatriaExamesFisicos(prontuario);
  }




}
