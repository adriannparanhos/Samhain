import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleName',     
  standalone: true,
})
export class RoleNamePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return 'Não definida'; 
    }

    switch (value.toUpperCase()) {
      case 'ROLE_ADMIN':
        return 'ADMINISTRADOR';
      case 'ROLE_USER':
        return 'USUARIO COMUM';
      default:
        return value; 
    }
  }

}