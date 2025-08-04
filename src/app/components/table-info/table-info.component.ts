import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { SimpleChanges } from '@angular/core';

export interface TableColumn<T> {
  header: string;
  field: keyof T;
  type?: 'text' | 'currency' | 'date' | 'number';
  width?: string;
  currencyCode?: string;        
  currencyDisplay?: 'symbol' | 'code' | 'symbol-narrow' | string | boolean; 
  currencyDigitsInfo?: string;  
  currencyLocale?: string;      
}

@Component({
  selector: 'app-table-info',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="card bg-white rounded-lg shadow-sm p-4">
      <div *ngIf="isLoading" class="p-4 text-center text-gray-500">Carregando…</div>
      <div *ngIf="!isLoading" class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead class="bg-gray-100">
            <tr>
              <th *ngFor="let col of columns"
                  [style.width]="col.width"
                  class="p-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                {{ col.header }}
              </th>
              <th class="p-3 text-left font-semibold text-gray-700 border-b border-gray-200">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of data; let last = last"
                [class.border-b]="!last"
                class="border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out">
              <td *ngFor="let col of columns; let lastCol = last"
                  class="p-3 border-r border-gray-100"
                  [class.border-r-0]="lastCol">
                <ng-container [ngSwitch]="col.type">
                  <span *ngSwitchCase="'currency'" class="block">
                    {{ getNumberValue(row, col.field) | currency:col.currencyCode:col.currencyDisplay:col.currencyDigitsInfo:col.currencyLocale }}
                  </span>
                  <span *ngSwitchCase="'date'" class="block">
                    {{ getValue(row, col.field) | date:'dd/MM/yyyy' }}
                  </span>
                  <span *ngSwitchDefault class="block">
                    <ng-container *ngIf="col.field === 'status'; else defaultText">
                      <span class="inline-block px-2 py-1 rounded-md text-white transition duration-150 ease-in-out"
                            [ngClass]="getStatusClasses(getValue(row, col.field))">
                        {{ getValue(row, col.field) }}
                      </span>
                    </ng-container>
                    <ng-template #defaultText>
                      {{ getValue(row, col.field) }}
                    </ng-template>
                  </span>
                </ng-container>
              </td>
              <td *ngIf="displayActionsColumn" class="p-3">
                <div class="flex space-x-2">
                    <button *ngIf="showViewAction" (click)="view.emit(row)" title="Visualizar" class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-gray-100 transition">
                        <lucide-icon [name]="'eye'" class="w-5 h-5"></lucide-icon>
                    </button>
                    <button *ngIf="showEditAction" (click)="edit.emit(row)" title="Editar" class="text-yellow-600 hover:text-yellow-800 p-1 rounded hover:bg-gray-100 transition">
                        <lucide-icon [name]="'pencil'" class="w-5 h-5"></lucide-icon>
                    </button>
                    <button *ngIf="showDeleteAction" (click)="delete.emit(row)" title="Excluir" class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-gray-100 transition">
                        <lucide-icon [name]="'trash-2'" class="w-5 h-5"></lucide-icon>
                    </button>
                    <button *ngIf="showCheckListAction" (click)="checkList.emit(row)" title="Check-list" class="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-gray-100 transition">
                        <lucide-icon [name]="'list-check'" class="w-5 h-5"></lucide-icon>
                    </button>
                    <button *ngIf="showProcessAction" (click)="process.emit(row)" title="Ficha-processo" class="text-green-600 hover:text-green-800 p-1 rounded hover:bg-gray-100 transition">
                        <lucide-icon [name]="'file-spreadsheet'" class="w-5 h-5"></lucide-icon>
                    </button>
                    <button *ngIf="showApprovedAction" (click)="approved.emit(row)" title="Aprovar" class="text-green-600 hover:text-green-800 p-1 rounded hover:bg-gray-100 transition">
                        <lucide-icon [name]="'check'" class="w-5 h-5"></lucide-icon>
                    </button>
                    <button *ngIf="showRepprovedAction" (click)="repproved.emit(row)" title="Reprovar" class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-gray-100 transition">
                        <lucide-icon [name]="'x'" class="w-5 h-5"></lucide-icon>
                    </button>
                </div>
            </td>
            </tr>
            <tr *ngIf="data.length === 0">
              <td [attr.colspan]="columns.length + 1"
                  class="text-center py-8 text-gray-500">Sem registros.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrls: ['./table-info.component.css']
})
export class TableInfoComponent<T> {
  @Input() columns: TableColumn<T>[] = [];
  @Input() data:     T[]             = [];
  @Input() isLoading: boolean        = false;

  @Output() view = new EventEmitter<T>();
  @Output() edit   = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() checkList = new EventEmitter<T>();
  @Output() process = new EventEmitter<T>();
  @Output() approved = new EventEmitter<T>();
  @Output() repproved = new EventEmitter<T>();

  @Input() showViewAction: boolean = true;   
  @Input() showEditAction: boolean = true;   
  @Input() showDeleteAction: boolean = true; 
  @Input() showCheckListAction: boolean = false;
  @Input() showProcessAction: boolean = false;
  @Input() showApprovedAction: boolean = false;
  @Input() showRepprovedAction: boolean = false;

  get displayActionsColumn(): boolean {
    return this.showViewAction || this.showEditAction || this.showDeleteAction;
  }

  getValue(item: T, field: keyof T): any {
    return item[field];
  }

  getNumberValue(item: T, field: keyof T): number {
    const value = item[field];
    return typeof value === 'number' ? value : 0;
  }

  getStatusClasses(status: string): string {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-400 text-green-600 hover:bg-green-300 rounded-full px-3 py-0.5 font-medium';
      case 'Pendente':
        return 'bg-yellow-400 text-yellow-600 hover:bg-yellow-300 rounded-full px-3 py-0.5 font-medium';
      case 'Reprovado':
        return 'bg-red-400 text-red-600 hover:bg-red-300 rounded-full px-3 py-0.5 font-medium';
      default:
        return 'bg-gray-400 text-gray-600 hover:bg-gray-300 rounded-full px-3 py-0.5 font-medium';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showViewAction']) {
      console.log('TableInfo: showViewAction mudou para', this.showViewAction);
    }
    if (changes['showEditAction']) {
      console.log('TableInfo: showEditAction mudou para', this.showEditAction);
    }
    if (changes['showDeleteAction']) {
      console.log('TableInfo: showDeleteAction mudou para', this.showDeleteAction);
    }
    if (changes['showCheckListAction']) {
      console.log('TableInfo: showCheckListAction mudou para', this.showCheckListAction);
    }
    if (changes['showProcessAction']) {
      console.log('TableInfo: showProcessAction mudou para', this.showProcessAction);
    }
    if (changes['showApprovedAction']) {
      console.log('TableInfo: showApprovedAction mudou para', this.showApprovedAction);
    }
    if (changes['showRepprovedAction']) {
      console.log('TableInfo: showRepprovedAction mudou para', this.showRepprovedAction);
    }
    console.log('TableInfo: displayActionsColumn é', this.displayActionsColumn);
  }
}