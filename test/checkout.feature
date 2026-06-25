# language: pt
Funcionalidade: Processamento de Checkout de Pedidos
  Como o microsserviço de Checkout da EntregasJá 
  Quero processar os pedidos dos clientes e realizar a cobrança no gateway externo [cite: 2]
  Para garantir que as compras da Black Friday sejam finalizadas com resiliência [cite: 3, 4]

  Contexto:
    Dado que o sistema possui um pedido gerado pelo Data Builder 

  Cenário: Checkout realizado com sucesso (Caminho Feliz)
    Quando o cliente finaliza a compra com dados válidos
    E o gateway de pagamento aprova a transação de forma imediata
    Então o status do pedido deve ser alterado para "PROCESSADO"
    E um e-mail de confirmação deve ser disparado para o cliente 

  Cenário: Gateway de Pagamento Lento ou Instável (Timeout com Resiliência)
    Quando o gateway parceiro apresenta uma latência severa de 5000ms [cite: 24]
    Então o sistema deve acionar o mecanismo de Retry por até 4 tentativas
    E caso obtenha sucesso em uma das tentativas, o pedido deve ser finalizado com sucesso
    E o cliente não deve visualizar nenhuma mensagem de erro 5xx 

  Cenário: Cartão de Crédito Recusado pelo Banco (Falha de Negócio)
    Quando o cliente tenta pagar com um cartão sem saldo ou inválido 
    E o gateway responde que a cobrança foi recusada
    Então o sistema deve retornar o status "APLICACAO_RECUSADA" ou status 400
    E o e-mail de confirmação de sucesso NÃO deve ser enviado 

  Cenário: Erro de Infraestrutura Crítico (Fallback/Degradação Graciosa)
    Quando o gateway parceiro fica completamente fora do ar após todas as tentativas de Retry [cite: 3]
    Então o sistema deve aplicar a degradação graciosa (Fallback) 
    E salvar o pedido em uma fila de contingência para reprocessamento assíncrono
    E retornar uma mensagem amigável ao usuário sem derrubar a aplicação