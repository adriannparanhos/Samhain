import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[cpfCnpjMask]'
})
export class CpfCnpjMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); 

    if (value.length <= 11) {
      input.value = this.formatCpf(value);
    } else {
      input.value = this.formatCnpj(value);
    }
  }

  private formatCpf(value: string): string {
    return value
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2')
      .slice(0, 14); 
  }

  private formatCnpj(value: string): string {
    return value
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18); 
  }
}