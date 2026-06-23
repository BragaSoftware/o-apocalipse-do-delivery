class CheckoutService {
  constructor(gatewayPagamento, pedidoRepository, emailService) {
    this.gatewayPagamento = gatewayPagamento;
    this.pedidoRepository = pedidoRepository;
    this.emailService = emailService;
    this.TIMEOUT_MS = 2000; 
    this.MAX_RETRIES = 3;  
    this.BACKOFF_MS = 500;  
  }

  async processar(pedido) {
    this._validarPayload(pedido);

    try {
      const resposta = await this._executarCobrancaComRetry(pedido);

      if (resposta.status === 'APROVADO') {
        return await this._tratarSucesso(pedido);
      } else {
        return await this._tratarRecusa(pedido);
      }
    } catch (error) {
      return await this._tratarFallbackErro(pedido, error);
    }
  }

  _validarPayload(pedido) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pedido || !pedido.clienteEmail || !emailRegex.test(pedido.clienteEmail) || 
        !pedido.valor || pedido.valor <= 0 || !pedido.cartao) {
      const error = new Error("Bad Request: Payload incompleto ou inválido.");
      error.status = 400;
      throw error;
    }
  }

  async _executarCobrancaComRetry(pedido) {
    let tentativas = 0;

    while (tentativas <= this.MAX_RETRIES) {
      try {
        return await Promise.race([
          this.gatewayPagamento.cobrar(pedido.valor, pedido.cartao),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Timeout Operacional")), this.TIMEOUT_MS)
          )
        ]);
      } catch (error) {
        tentativas++;
        if (tentativas > this.MAX_RETRIES) throw error;
        await new Promise(resolve => setTimeout(resolve, this.BACKOFF_MS));
      }
    }
  }

  async _tratarSucesso(pedido) {
    pedido.status = 'PROCESSADO';
    const pedidoSalvo = await this.pedidoRepository.salvar(pedido);

    // E-mail Assíncrono (Non-blocking)
    this.emailService.enviarConfirmacao(pedido.clienteEmail, "Pagamento Aprovado")
      .catch(err => console.error("Falha em segundo plano ao enviar e-mail:", err.message));

    return pedidoSalvo;
  }

  async _tratarRecusa(pedido) {
    pedido.status = 'FALHOU'; 
    await this.pedidoRepository.salvar(pedido);
    return null; 
  }

  async _tratarFallbackErro(pedido, error) {
    // LINHA CORRIGIDA AQUI PARA PASSAR NO TESTE E MATAR O MUTANTE
    console.error("Acionando Fallback. Erro:", error.message);
    
    pedido.status = 'ERRO_GATEWAY'; 
    await this.pedidoRepository.salvar(pedido);
    
    const erroAmigavel = new Error("Erro interno de processamento. Tente mais tarde.");
    erroAmigavel.status = 500;
    throw erroAmigavel;
  }
}

module.exports = { CheckoutService };