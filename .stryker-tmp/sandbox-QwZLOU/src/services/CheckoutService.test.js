// @ts-nocheck
const { CheckoutService } = require('./CheckoutService');

const PedidoMother = {
  criarValido: () => ({
    clienteEmail: 'cliente@entregasja.com',
    valor: 150.00,
    cartao: { numero: '123456789', cvv: '123', validade: '12/2030' },
    status: 'PENDENTE'
  }),
  // Variações cirúrgicas para matar os mutantes lógicos e de Regex
  criarSemEmail: () => ({ valor: 150.00, cartao: { numero: '123' } }),
  criarEmailInvalido: () => ({ clienteEmail: 'emailinvalido.com', valor: 150.00, cartao: { numero: '123' } }),
  criarValorZero: () => ({ clienteEmail: 'cliente@entregasja.com', valor: 0, cartao: { numero: '123' } }),
  criarSemCartao: () => ({ clienteEmail: 'cliente@entregasja.com', valor: 150.00 })
};

describe('CheckoutService - Suite de Testes Unitários', () => {
  let gatewayMock, repositoryMock, emailMock, service;

  beforeEach(() => {
    gatewayMock = { cobrar: jest.fn() };
    repositoryMock = { salvar: jest.fn(pedido => Promise.resolve(pedido)) };
    emailMock = { enviarConfirmacao: jest.fn(() => Promise.resolve()) };
    service = new CheckoutService(gatewayMock, repositoryMock, emailMock);
    
    // Espião para matar os mutantes que tentam apagar as mensagens de erro
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // NOVO: Testa cada regra individualmente para o Stryker não ter para onde fugir
  test.each([
    [PedidoMother.criarSemEmail()],
    [PedidoMother.criarEmailInvalido()],
    [PedidoMother.criarValorZero()],
    [PedidoMother.criarSemCartao()],
    [null]
  ])('Deve abortar com erro 400 se o payload falhar em regras específicas', async (payloadInvalido) => {
    await expect(service.processar(payloadInvalido)).rejects.toThrow("Bad Request");
    expect(repositoryMock.salvar).not.toHaveBeenCalled();
  });

  test('Deve processar com sucesso, salvar e disparar e-mail assíncrono se aprovado', async () => {
    const pedido = PedidoMother.criarValido();
    gatewayMock.cobrar.mockResolvedValue({ status: 'APROVADO' });
    const resultado = await service.processar(pedido);
    expect(resultado.status).toBe('PROCESSADO');
    expect(repositoryMock.salvar).toHaveBeenCalledWith(pedido);
    expect(emailMock.enviarConfirmacao).toHaveBeenCalledWith(pedido.clienteEmail, "Pagamento Aprovado");
  });

  // NOVO: Mata o mutante que altera a função catch() silenciosa do e-mail
  test('Deve registrar log de erro se o e-mail falhar assincronamente', async () => {
    const pedido = PedidoMother.criarValido();
    gatewayMock.cobrar.mockResolvedValue({ status: 'APROVADO' });
    emailMock.enviarConfirmacao.mockRejectedValue(new Error("SMTP Offline"));
    
    await service.processar(pedido);
    await new Promise(process.nextTick); // Aguarda a Promise solta resolver
    
    expect(console.error).toHaveBeenCalledWith("Falha em segundo plano ao enviar e-mail:", "SMTP Offline");
  });

  test('Deve marcar como FALHOU e bloquear e-mail se o cartão for recusado', async () => {
    const pedido = PedidoMother.criarValido();
    gatewayMock.cobrar.mockResolvedValue({ status: 'RECUSADO' });
    const resultado = await service.processar(pedido);
    expect(resultado).toBeNull();
    expect(pedido.status).toBe('FALHOU');
    expect(emailMock.enviarConfirmacao).not.toHaveBeenCalled();
  });

  test('Deve se recuperar e processar com sucesso se falhar na primeira mas passar no Retry', async () => {
    const pedido = PedidoMother.criarValido();
    gatewayMock.cobrar
      .mockRejectedValueOnce(new Error("Erro de Conexão Temporário"))
      .mockResolvedValueOnce({ status: 'APROVADO' });
    const resultado = await service.processar(pedido);
    expect(resultado.status).toBe('PROCESSADO');
    expect(gatewayMock.cobrar).toHaveBeenCalledTimes(2);
  });

  test('Deve falhar de forma limpa com erro 500 e salvar ERRO_GATEWAY se estourar os retries', async () => {
    const pedido = PedidoMother.criarValido();
    gatewayMock.cobrar.mockRejectedValue(new Error("Gateway offline (500)"));
    
    await expect(service.processar(pedido)).rejects.toThrow("Erro interno de processamento");
    
    expect(pedido.status).toBe('ERRO_GATEWAY');
    expect(gatewayMock.cobrar).toHaveBeenCalledTimes(4); 
    expect(console.error).toHaveBeenCalled(); // Mata mutante de log do fallback
  });
});