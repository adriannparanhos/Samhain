export interface Item {
  id?: number;
  produto: string;
  modelo?: string;
  quantidade: number;
  largura: number;
  comprimento: number;
  valorUnitario: number;
  desconto: number;
}

export const PRODUTOS = [
  'Chapa', 'Peça usinada', 'Revestimento',
  'Tarugo', 'Extrator', 'Patolão', 'Personalizado'
] as const;

export const MODELOS_POR_PRODUTO: Record<string, string[]> = {
    Chapa:    ['Chapa 10', 'Chapa 20', 'Chapa 30', 'Chapa 40', 'Chapa 50'],
    'Peça usinada': ['Usinada A', 'Usinada B'],
    Revestimento: ['Revestimento A', 'Revestimento B'],
    Tarugo: ['Tarugo A', 'Tarugo B'],
    Extrator: ['Extrator A', 'Extrator B'],
    Patolão: ['Patolão A', 'Patolão B'],
    Personalizado: ['Personalizado A', 'Personalizado B']
};
