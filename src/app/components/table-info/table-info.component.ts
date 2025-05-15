import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
  template: `
    <div class="card">
      <div *ngIf="isLoading" class="p-4 text-center">Carregando…</div>
      <div *ngIf="!isLoading" class="overflow-x-auto">
        <table class="w-full border-collapse border border-gray-200 rounded-md">
          <thead class="bg-gray-300">
            <tr>
              <th *ngFor="let col of columns" [style.width]="col.width" 
                  class="p-3 text-left font-medium text-gray-700 border-b border-r border-gray-300">
                {{ col.header }}
              </th>
              <th class="p-3 text-left font-medium text-gray-700 border-b border-gray-300">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of data; let i = index; let last = last" 
                [class.border-b]="!last"
                class="border-gray-200 hover:bg-gray-50">
              <td *ngFor="let col of columns; let lastCol = last" 
                  class="p-3 border-r border-gray-200" 
                  [class.border-r-0]="lastCol">
                <ng-container [ngSwitch]="col.type">
                  <span *ngSwitchCase="'currency'" class="block">
                    {{ getNumberValue(row, col.field) | currency:'BRL':'symbol':'1.2-2' }}
                  </span>
                  <span *ngSwitchDefault class="block">
                    {{ getValue(row, col.field) }}
                  </span>
                </ng-container>
              </td>
              <td class="p-3">
                <div class="flex space-x-2">
                  <button (click)="edit.emit(row)"
                          class="text-primary hover:text-primary-light p-1 rounded hover:bg-gray-100"
                          title="Editar">✏️</button>
                  <button (click)="delete.emit(row)"
                          class="text-error hover:text-error/80 p-1 rounded hover:bg-gray-100"
                          title="Excluir">🗑️</button>
                </div>
              </td>
            </tr>
            <tr *ngIf="data.length === 0">
              <td [attr.colspan]="columns.length + 1"
                  class="text-center py-8 text-gray-500">
                Sem registros.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrl: './table-info.component.css'
})
export class TableInfoComponent<T> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() title: string = '';
  @Input() isLoading: boolean = false;

  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  
  getValue(item: T, field: keyof T): any {
    return item[field];
  }
  
  getNumberValue(item: T, field: keyof T): number {
    const value = item[field];
    return typeof value === 'number' ? value : 0;
  }
}