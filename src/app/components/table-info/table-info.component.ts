import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface TableColumn<T> {
  header: string;
  field: keyof T;
  type?: 'text' | 'currency';
  width?: string;
}

@Component({
  selector: 'app-table-info',
  standalone: true,
  imports: [],
  template: `
    
  `,
  styleUrl: './table-info.component.css'
})
export class TableInfoComponent<T> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() title: string = '';

  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
}
