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
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b border-gray-200">
              <th *ngFor="let col of columns" [style.width]="col.width" class="p-3 text-left font-medium text-gray-700">
                {{ col.header }}
              </th>
              <th class="p-3 text-left font-medium text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of data; let i = index" class="border-b border-gray-100 hover:bg-gray-50">
              <td *ngFor="let col of columns" class="p-3">
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
                          class="text-primary hover:text-primary-light"
                          title="Editar">✏️</button>
                  <button (click)="delete.emit(row)"
                          class="text-error hover:text-error/80"
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