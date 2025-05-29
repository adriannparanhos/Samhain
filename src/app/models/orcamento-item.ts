export interface OrcamentoItem {
  produto: string;
  modelo: string;
  quantidade: number;
  valorUnitario: number;
  valorUnitarioCIPI: number;
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
  total?: number;
  totalCIPI?: number; 
  pesoTotal?: number; 
  largura?: number; 
  comprimento?: number; 
  ipi?: number; 
}