import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatKey', 
  standalone: true,
})
export class FormatKeyPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }
    return value.replace(/_/g, ' ');
  }

}