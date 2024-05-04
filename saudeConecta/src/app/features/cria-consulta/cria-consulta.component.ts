import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cria-consulta',
  templateUrl: './cria-consulta.component.html',
  styleUrls: ['./cria-consulta.component.css']
})
export class CriaConsultaComponent implements OnInit {
  horario:string="Horario de Atendimento: 08:00 a 16:30";
  DiasDeFunionamento = ['Segundas ', 'Terças ', 'Quartas ', 'Quintas e  Sextas'  ];
  constructor() { }

  ngOnInit() {
  }
  validateTime(event: any) {
    const allowedTimes = ['08:00', '08:30', '09:00','09:30',
                          '10:00', '10:30','11:00', '11:30',
                          '13:00','13:30', '14:00', '14:30',
                          '15:00', '15:30', '16:00', '16:30', ]; // Horários permitidos
    const inputTime = event.target.value;

    // Verifica se o horário inserido está na lista de horários permitidos
    if (!allowedTimes.includes(inputTime)) {
      // Se não estiver na lista, define o valor do input para o primeiro horário permitido
      event.target.value = allowedTimes[0];
      // Ou você pode limpar o valor do input
      // event.target.value = '';
      // E exibir uma mensagem de erro ou alerta ao usuário
      alert('Horário não permitido!');
    }
  }

  generateTimeRange(startTime: string, endTime: string, intervalMinutes: number): string[] {
    const startTimeParts = startTime.split(':').map(part => parseInt(part, 10));
    const endTimeParts = endTime.split(':').map(part => parseInt(part, 10));

    const startHour = startTimeParts[0];
    const startMinute = startTimeParts[1];
    const endHour = endTimeParts[0];
    const endMinute = endTimeParts[1];

    const times: string[] = [];

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
      times.push(`${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`);

      currentMinute += intervalMinutes;
      if (currentMinute >= 60) {
        currentHour++;
        currentMinute -= 60;
      }
    }

    return times;
  }


}
