import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CpfCnpjMaskDirective } from '../../directive/cpf-cnpj-mask.directive';

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea' | 'date' | 'email' | 'number' | 'currency';
  options?: { label: string; value: string }[];
  validators?: ValidatorFn[];
  placeholder?: string;
  customEvents?: { [key: string]: (event: any) => void }; 
  disabled?: boolean;
  useMask?: 'cpfCnpjMask' | string;
}

@Component({
  selector: 'app-add-new-form',
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule, 
    LucideAngularModule,
    CpfCnpjMaskDirective],
  templateUrl: './add-new-form.component.html',
  styleUrl: './add-new-form.component.css'
})
export class AddNewFormComponent implements OnInit {
  @Input() fields: FieldConfig[] = [];
  @Output() submitForm = new EventEmitter<any>();
  @Output() formReady = new EventEmitter<FormGroup>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
      const group: any = {};
      for (const f of this.fields) {
        group[f.name] = ['', f.validators || []];
      }
    this.form = this.fb.group(group);
    this.formReady.emit(this.form);
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

}
