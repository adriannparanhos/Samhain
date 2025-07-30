import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CpfCnpjMaskDirective } from '../../directive/cpf-cnpj-mask.directive';
import { IpiMultiplierDirective } from '../../directive/ipi-multiplier.directive';

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea' | 'date' | 'email' | 'number' | 'currency' | 'password';
  options?: { label: string; value: string }[];
  validators?: ValidatorFn[];
  placeholder?: string;
  customEvents?: { [key: string]: (event: any) => void }; 
  disabled?: boolean;
  useMask?: 'cpfCnpjMask' | string;
  useIpiMask?: boolean
}

@Component({
  selector: 'app-add-new-form',
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule, 
    LucideAngularModule,
    CpfCnpjMaskDirective,
    IpiMultiplierDirective],
  templateUrl: './add-new-form.component.html',
  styleUrl: './add-new-form.component.css'
})
export class AddNewFormComponent implements OnInit {
  @Input() fields: FieldConfig[] = [];
  @Input() initialData: any = null;
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
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
    this.formReady.emit(this.form);
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  public getFormValue(): any {
    if (this.form.valid) {
      return this.form.getRawValue(); 
    }
    return null; 
  }

}
