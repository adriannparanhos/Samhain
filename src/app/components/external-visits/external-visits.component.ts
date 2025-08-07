import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import ptBrLocale from '@fullcalendar/core/locales/pt-br'; 
import { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';

@Component({
  selector: 'app-external-visits',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    DatePipe
  ],
  templateUrl: './external-visits.component.html',
  styleUrls: ['./external-visits.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class ExternalVisitsComponent {

  isModalVisible = false;
  modalTitle = '';
  modalEvents: EventApi[] = []; 

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    locale: ptBrLocale, 
    
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana'
    },
    
    dayMaxEvents: 3, 
    contentHeight: 'auto', 

    eventContent: (arg) => {
      const vendedor = arg.event.extendedProps['vendedor'];
      const fotoHtml = vendedor 
        ? `<div class="vendor-avatar"><img src="${vendedor.fotoUrl}" alt="${vendedor.nome}" /></div>`
        : '';
      
      return {
        html: `
          <div class="visit-event">
            ${fotoHtml}
            <span class="event-title">${arg.event.title}</span>
          </div>
        `
      };
    },
    eventClassNames: (arg) => {
      const status = arg.event.extendedProps['status'];
      return status ? [`status-${status}`] : [];
    },
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this),

    events: this.getExampleEvents()
  };

  handleEventClick(info: EventClickArg){
    alert('Visita clicada: ' + info.event.title);
  }

  handleDateClick(info: DateClickArg){
    alert('Dia clicado: ' + info.dateStr);
  }

  getExampleEvents() {
    const todayStr = new Date().toISOString().replace(/T.*$/, ''); 
    return [
      { title: '10:00 - Empresa A', date: todayStr, extendedProps: { status: 'agendada', vendedor: { nome: 'Adriann', fotoUrl: '../../../assets/images/profiles/adriann.jpeg' } } },
      { title: '11:30 - Empresa B', date: todayStr, extendedProps: { status: 'completa', vendedor: { nome: 'Carlos', fotoUrl: 'https://placehold.co/40x40/EFEFEF/333?text=C' } } },
      { title: '14:00 - Empresa C', date: todayStr, extendedProps: { status: 'em_andamento', vendedor: { nome: 'Ana', fotoUrl: 'https://placehold.co/40x40/EFEFEF/333?text=A' } } },
      { title: '16:00 - Empresa D', date: todayStr, extendedProps: { status: 'cancelada', vendedor: { nome: 'Adriann', fotoUrl: '../../../assets/images/profiles/adriann.jpeg' } } },
      { title: '17:00 - Empresa E', date: todayStr, extendedProps: { status: 'agendada', vendedor: { nome: 'Carlos', fotoUrl: 'https://placehold.co/40x40/EFEFEF/333?text=C' } } },
    ];
  }
}
