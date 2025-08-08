import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true // Marca o pipe como standalone
})
export class TruncatePipe implements PipeTransform {

  /**
   * Trunca um número para um número específico de casas decimais sem arredondar.
   * @param value O número a ser truncado.
   * @param decimalPlaces O número de casas decimais a manter (padrão é 2).
   * @returns O número truncado.
   */
  transform(value: number, decimalPlaces: number = 2): number | undefined {
    if (isNaN(value)) {
      return value;
    }

    const multiplier = Math.pow(10, decimalPlaces);
    return Math.floor(value * multiplier) / multiplier;
  }
}
