import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone',
  standalone: true
})
export class TelefonePipe implements PipeTransform {

  transform(value: string | number | null | undefined): string {
    if (!value) {
      return '';
    }

    const cleaned = String(value).replace(/\D/g, '');
    const length = cleaned.length;

    if (length === 11) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 3)} ${cleaned.substring(3, 7)}-${cleaned.substring(7, 11)}`;

    } else if (length === 10) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6, 10)}`;

    } else if (length === 9) {
      // Formato: X XXXX-XXXX (celular com nono dígito, sem DDD)
      // Ex: 9 8765-4321
      return `${cleaned.substring(0, 1)} ${cleaned.substring(1, 5)}-${cleaned.substring(5, 9)}`;

    } else if (length === 8) {
      // Formato: XXXX-XXXX (fixo, sem DDD)
      // Ex: 4321-8765
      return `${cleaned.substring(0, 4)}-${cleaned.substring(4, 8)}`;

    } else {
      // Se não corresponder a nenhum formato esperado, retorna o número limpo ou o valor original
      // Você pode ajustar este comportamento conforme necessário (ex: retornar string vazia, mensagem de erro)
      return String(value); // Ou `cleaned` se preferir apenas os dígitos
    }
  }

}
