import { Directive, HostListener, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Big } from 'big.js'; // Usaremos uma biblioteca de alta precisão

@Directive({
  selector: '[appIpiMultiplier]', // Este é o nome que usaremos no HTML
  standalone: true,
})
export class IpiMultiplierDirective {

  // Injetamos o NgControl para ter acesso ao FormControl ao qual a diretiva está atrelada.
  constructor(@Self() private ngControl: NgControl) { }

  // @HostListener escuta por eventos no elemento hospedeiro (o <input>).
  // Usamos o evento 'blur' para que a conversão aconteça quando o usuário sai do campo.
  @HostListener('blur')
  onBlur(): void {
    let value = this.ngControl.value;

    // Se o valor for nulo, vazio ou não for um número, não fazemos nada.
    if (value === null || value === '' || isNaN(value)) {
      return;
    }

    // Se o valor já for um multiplicador (ex: 1.065), não fazemos a conversão de novo.
    if (Number(value) >= 1 && Number(value) < 2) {
        return;
    }

    try {
        // Usamos uma biblioteca de alta precisão (big.js) para evitar erros de ponto flutuante.
        // Garanta que você instalou: npm install big.js @types/big.js
        const percentage = new Big(value);
        const hundred = new Big(100);
        const one = new Big(1);

        // A conversão: (porcentagem / 100) + 1
        const multiplier = percentage.div(hundred).plus(one);

        // Atualiza o valor no FormControl com o multiplicador calculado.
        // toFixed(5) garante um número consistente de casas decimais.
        this.ngControl.control?.setValue(multiplier.toFixed(5));

    } catch (error) {
        console.error("Erro ao converter IPI para multiplicador:", error);
        // Em caso de erro, podemos limpar o campo ou manter o valor inválido para o usuário corrigir
        this.ngControl.control?.setValue(null);
    }
  }
}