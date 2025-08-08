import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import ptBrLocale from '@fullcalendar/core/locales/pt-br'; 
import { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-external-visits',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    DatePipe,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './external-visits.component.html',
  styleUrls: ['./external-visits.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class ExternalVisitsComponent implements OnInit {
  isModalOpen = false;
  visitForm!: FormGroup;
  isModalVisible = false;
  modalTitle = '';
  modalEvents: EventApi[] = []; 

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.visitForm = this.fb.group({
      cnpj: ['', [Validators.required]],
      razaoSocial: [{ value: '', disabled: false }, [Validators.required]],
      data: ['', [Validators.required]],
      horario: ['', [Validators.required]],
      motivo: ['', [Validators.required]]
    });
  }

  openModal(): void {
    this.visitForm.reset(); 
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onFormSubmit(): void {
    if (this.visitForm.invalid) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const formValues = this.visitForm.getRawValue();

    // 1. Crie o novo evento a partir dos dados do formulário
    const newEvent = {
      title: `${formValues.horario} - ${formValues.razaoSocial}`,
      date: formValues.data, // O FullCalendar aceita 'YYYY-MM-DD'
      extendedProps: {
        status: 'agendada', // Status padrão para novas visitas
        vendedor: { 
          nome: 'Adriann', // No futuro, pegue do usuário logado
          fotoUrl: '../../../assets/images/profiles/adriann.jpeg' 
        }
      }
    };

    // 2. Atualize a lista de eventos
    // Criamos um novo array com os eventos existentes (...) mais o novo.
    this.calendarOptions = {
      ...this.calendarOptions, // Mantém todas as outras opções
      events: [
        ...this.calendarOptions.events as any[], // Pega todos os eventos antigos
        newEvent // Adiciona o novo no final
      ]
    };

    this.closeModal();
  }

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
