export interface AdicionaisItem {
  desenho: boolean;
  projeto: boolean;
  arruela: boolean;
  tampao: boolean;
}

export interface ItemOrcamento {
  produto: string;       
  modelo: string;        
  descricaoDetalhada?: string;
  quantidade: number;
  valorUnitario: number;
  unidade?: string;        
  desconto?: number;      
  valorTotalItem?: number; 
  valorTotalItemCIPI: number;
  ncm: string,
  aliquota: number,
  adicionais: AdicionaisItem; 
}

interface Enterprise {
  email: string,
  phone: string,
  stateRegistration: string,
  address: {
    cep: string,
    endereco: string,
    endereco_numero: number,
    bairro: string,
    estado: string,
    cidade: string
  } 
}

export interface DadosOrcamento {
    proposta: string;
    idOrcamento?: string;      
    numeroProposta?: string;  
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

    itens: ItemOrcamento[];    

    subtotalItens: number;    
    descontoGlobal?: number;    
    valorDoFrete?: number;
    difal?: number;           
    outrasTaxas?: number;      
    grandTotal: number;     

    vendedorResponsavel?: string;
    dataUltimaModificacao?: string;

    cep: string | undefined,
    endereco: string | undefined,
    endereco_numero: string | number | undefined,
    bairro: string | undefined,
    estado: string | undefined,
    cidade: string | undefined
}