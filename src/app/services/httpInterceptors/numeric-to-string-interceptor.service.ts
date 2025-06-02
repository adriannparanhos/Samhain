import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class NumericToStringInterceptor implements HttpInterceptor {

  constructor() {}

  private readonly BIG_DECIMAL_FIELDS = [
    'subtotalItens',
    'valorDoFrete',
    'difal',
    'grandTotal',
    'valorUnitario',
    'desconto',
    'valorTotalItem',
    'valorTotalItemCIPI',
    'aliquota'
  ];

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.method === 'POST' && request.url.includes('/api/orcamentos/salvar')) {
      const clonedBody = this.convertNumbersToStrings(request.body);

      const clonedRequest = request.clone({
        body: clonedBody
      });

      return next.handle(clonedRequest);
    }

    return next.handle(request);
  }

  private convertNumbersToStrings(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj; 
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.convertNumbersToStrings(item));
    }

    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        if (this.BIG_DECIMAL_FIELDS.includes(key) && typeof value === 'number') {
          newObj[key] = String(value);
        } else if (typeof value === 'object') {
          newObj[key] = this.convertNumbersToStrings(value);
        } else {
          newObj[key] = value;
        }
      }
    }
    return newObj;
  }
}