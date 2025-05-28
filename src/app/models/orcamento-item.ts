export interface OrcamentoItem {
  produto: string;
  modelo: string;
  quantidade: number;
  valorUnitario: number;
  desconto: number;
  ncm: string;
  peso: number;
  categoria: string;
  espessura: number;
  clienteForneceuDesenho: boolean;
  adicionarProjeto: boolean;
  adicionarArruela: boolean;
  adicionarTampao: boolean;
  isPanelVisible: boolean;
  total?: number; // Total retornado pelo backend
  totalCIPI?: number; // Total com IPI retornado pelo backend
  pesoTotal?: number; // Peso total retornado pelo backend
  largura?: number; // Para Peça Usinada
  comprimento?: number; // Para Peça Usinada
  ipi?: number; // IPI do produto
}