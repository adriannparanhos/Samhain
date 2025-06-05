// export interface AdicionaisItem {
//   desenho: boolean;
//   projeto: boolean;
//   arruela: boolean;
//   tampao: boolean;
// }

// export interface ItemOrcamento {
//   produto: string;       
//   modelo: string;        
//   descricaoDetalhada?: string;
//   quantidade: number;
//   valorUnitario: number;
//   unidade?: string;        
//   desconto?: number;      
//   valorTotalItem?: number; 
//   valorTotalItemCIPI: number;
//   ncm: string,
//   aliquota: number,
//   largura?: number;
//   comprimento?: number;
// }


export interface DadosOrcamento {
  proposta: string | null; 
  idOrcamento?: string; 
  dataEmissao?: string; 
  validadeProposta?: string;
  cnpj: string;
  razaoSocial: string;
  nomeContato?: string;
  emailContato?: string;
  telefoneContato?: string;

  condicaoPagamento: string;
  prazoEntrega?: string;
  tipoFrete?: string;

  descricao?: string;
  status: string;

  itens: ItemOrcamentoPayload[]; 

  subtotalItens: number;
  descontoGlobal?: number;
  valorDoFrete?: number;
  difal?: number;
  outrasTaxas?: number; 
  grandTotal: number;

  vendedorResponsavel?: string;
  dataUltimaModificacao?: string | null; 

  cep?: string; 
  endereco?: string;
  endereco_numero?: string | number | null | undefined; 
  bairro?: string;
  estado?: string;
  cidade?: string;
}

export interface ItemOrcamentoPayload {
  id?: number; 
  produto: string;
  modelo: string;
  quantidade: number;
  ncm: string;
  valorUnitario: number;
  valorTotalItem?: number; 
  aliquota: number; 
  desconto?: number;
  valorTotalItemCIPI: number;
  descricaoDetalhada?: string; 
  unidade?: string; 

  desenho?: boolean | null; 
  projeto?: boolean | null;
  arruela?: boolean | null;
  tampao?: boolean | null;

  largura?: number;
  comprimento?: number;
}

export interface ListarOrcamentosDTOBackend {
  proposta: string;
  razaoSocial: string;
  data: string; // Backend envia como string (ex: "YYYY-MM-DD")
  status: string;
  grandTotal: number;
}

export interface BudgetParaTabela { 
  proposta: string;
  razaoSocial: string;
  date: Date | null; 
  status: string;
  totalValue: number;
}