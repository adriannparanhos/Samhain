import { SafeUrl } from '@angular/platform-browser'; 

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
  peso?: number;
  frete?: number;

  vendedorResponsavel?: string;
  dataUltimaModificacao?: string | null; 

  cep?: string; 
  endereco?: string;
  endereco_numero?: string | number | null | undefined; 
  bairro?: string;
  estado?: string;
  cidade?: string;

  anexos?: { nome: string; url: SafeUrl | string; }[];
  contato?: string; 
  enderecoNumero?: string | number | null | undefined; 
  inscricao_estadual?: string;
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
  quantidadeConjuntos?: number;
  pesoTotal?: number;
  pesoItem?: number;
}

export interface ListarOrcamentosDTOBackend {
  proposta: string;
  razaoSocial: string;
  data: string;
  status: string;
  grandTotal: number;
}

export interface ListarProdutosDTOBackend {
  id?: number
  modelo: string;
  produto: string;
  valorUnitario: number;
  ncm: string;
  ipi: number;
}

export interface BudgetParaTabela { 
  proposta: string;
  razaoSocial: string;
  date: Date | null; 
  status: string;
  totalValue: number;
}

export interface NewBudget {
  id: number;
  proposalNumber: string;
  enterprise: string;
  type: string;
  date: Date;
  status: string;
  totalValue: number;
  acoes: string;
}

export interface EnterpriseData {
  address?: { 
    cep: string | undefined;
    endereco: string | undefined;
    endereco_numero: number | string | undefined | null; 
    bairro: string | undefined;
    estado: string | undefined;
    cidade: string | undefined;
  };
  email?: string | undefined;
  phone?: string | undefined;
  stateRegistration?: string | undefined;
}

export interface Cliente {
  nomeContato?: string | undefined;
  emailContato?: string | undefined;
  telefoneContato?: string | undefined;
  prazoEntrega: string | undefined;
  tipoFrete: string | undefined;
}

export interface ServiceBudgetData {
  proposalNumber: string;
  cnpj: string;
  razaoSocial: string;
  equipmentDescription: string;
  coatedArea: number;
  serviceProvidedByBaron: boolean;
  removeOldCoating: boolean;
  withPlugs: boolean;
  semiFinishedPlatesCoating: boolean;
  temporaryLabor: boolean;
  baronSafetyTechnician: boolean;
  electricity: boolean;
  compressedAir: boolean;
  starGoldFornecido: boolean; 
  maintenanceShutdown: boolean;
  totalAPagar: number;
  diasPrevistoParaTermino: number;
  nomeContato: string;
  telefoneContato: string;
  email: string;
  paymentConditions: string;
  proposalValidity: string;
  endereco: string;
  enderecoNumero: string | number | null | undefined;
  bairro: string;
  estado: string;
  cep: string;
  cidade: string;
  vendedorResponsavel: string;
  resultadoRendimentoInstalacao: number;
}

export interface ServiceBudgetResponse {
  totalAPagar: number;
  diasPrevistoParaTermino: string;
  resultadoRendimentoInstalacao: number;
  vendedorResponsavel?: string; 
}
