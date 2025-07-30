import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { LucideAngularModule } from 'lucide-angular'; 
import { Router } from '@angular/router';
import { DadosNovoServicoService } from '../../services/datas/dados-novo-servico.service';
import { Subscription } from 'rxjs';
import { ServiceBudgetData } from '../../models/interfaces/dados-orcamento';


@Component({
  selector: 'app-service-budget',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, LucideAngularModule, CurrencyPipe, DatePipe, DecimalPipe, PercentPipe],
  templateUrl: './service-budget-data.component.html',
  styleUrls: ['./service-budget-data.component.css']
})
export class ServiceBudgetComponent implements OnInit {
  CONDICAO_UM: string = `Nossos produtos são fornecidos de acordo com a ABNT NBR 14.922, para peças semiacabadas. Para peças
    usinadas, devido ao UHMW ser um material flexível, a classe de tolerância dimensional utilizada, será de
    acordo com a DIN 2768. Para que a ordem de compra seja aceita, é obrigatório a indicação e conferência da
    transportadora, ou outro meio de envio registrado, para que a coleta dos produtos fornecidos, seja feita no ato
    do faturamento. A Baron reserva o direito de faturar os produtos adquiridos antes da data prevista para a
    entrega. Após o recebimento da ordem de compra, o pedido estará sujeito à análise de crédito pelo
    Departamento Financeiro. Forma de pagamento, prazo, e informações do responsável pelo financeiro da
    empresa contratante, são imprescindíveis para a validação da ordem de compra. As condições de prazo de
    entrega serão verificadas de acordo com a posição atual de estoque de materiais, podendo ser reposicionado
    pela fábrica, o qual será imediatamente informado ao cliente. O prazo de entrega somente começara a ser
    contabilizado a partir do aceite pela fábrica da respectiva ordem de compra, via e-mail de confirmação enviado
    ao cliente. Caso haja algum imprevisto quanto a atrasos em pagamentos, favor informar a Baron o quanto
    antes, para que providências sejam tomadas previamente. Caso o pagamento não seja efetuado nas datas
    constantes da ordem de compra, será acrescido aos valores, 2% referente a multa por atraso, de 5% ao mês,
    referentes a juros de mora, contados a partir da data de vencimento
  `;

  CONDICAO_DOIS: string = `Procedimento de Devolução: Após detectado uma anomalia, o cliente deverá entrar em contato
    imediatamente com a Baron, pelo telefone: +55 16 3378-0335; ou pelo e-mail, sac@baron.com.br e informar o
    ocorrido. Posteriormente, deverá fazer uma nota fiscal de devolução e reenviar o pedido integral ou parcial à
    Baron. As despesas referentes ao frete de devolução serão custeadas pelo cliente e poderão ser reembolsadas
    pela Baron, somente após constatada a não conformidade ocasionada pela Baron, através do Relatório de Não
    Conformidade (RNC). Todas as trocas deverão estar na mesma embalagem a qual foi enviada ao cliente, e
    embaladas da mesma forma, sob o risco da não conformidade ser constatada pela má qualidade da
    embalagem de devolução. Após recebido a mercadoria integral e/ou parcial, pelo Departamento de Qualidade
    da Baron, serão realizadas as inspeções de embalagem e da não conformidade relatada pelo cliente. Após a
    abertura da RNC pela Baron, o Departamento de Qualidade tem o prazo de 5 dias úteis para emitir o RNC
    correspondente. Após o recebimento da RNC, o Departamento Comercial será responsável pela divulgação e
    ações corretivas e todas as informações de procedimentos adotados para a garantia de satisfação do cliente e
    ainda, se for o caso, a reparação do pedido, incluindo eventuais reembolsos financeiros, cancelamentos de
    cobranças, trocas e/ou reparos
  `;

  OBSERVACOES_COMPLEMENTARES_UM: string = `1- Impostos incluídos: Informações de estado não disponíveis.`;
  OBSERVACOES_COMPLEMENTARES_DOIS: string = `2- Informar a transportadora no ato do fechamento do pedido.`;
  OBSERVACOES_COMPLEMENTARES_TRES: string = `3- Para pedidos de peças específicas conforme projetos do cliente, não aceitamos o cancelamento do pedido após o envio da ordem de compra ou na sua confirmação.`;

  public formData: ServiceBudgetData | null = null;
  private servicoSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private dadosNovoServicoService: DadosNovoServicoService
  ) {}

  ngOnInit(): void {
    this.servicoSubscription = this.dadosNovoServicoService.servicoAtual$.subscribe(
      (servico) => {
        if (servico) {
          this.formData = servico;
          console.log('Dados do orçamento recebidos do serviço:', this.formData);
        } else {
          console.warn('Nenhum dado de orçamento no serviço. Redirecionando para o formulário.');
          alert('Não há dados de orçamento para exibir. Por favor, gere um novo orçamento.');
          this.router.navigate(['/services-form']); 
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.servicoSubscription?.unsubscribe();
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('pt-BR');
  }

  generatePDF(): void {
    console.log('Gerando PDF para o Orçamento de Serviço...');
    window.print();
  }
}