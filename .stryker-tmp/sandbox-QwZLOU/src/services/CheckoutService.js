// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
class CheckoutService {
  constructor(gatewayPagamento, pedidoRepository, emailService) {
    if (stryMutAct_9fa48("0")) {
      {}
    } else {
      stryCov_9fa48("0");
      this.gatewayPagamento = gatewayPagamento;
      this.pedidoRepository = pedidoRepository;
      this.emailService = emailService;
      this.TIMEOUT_MS = 2000;
      this.MAX_RETRIES = 3;
      this.BACKOFF_MS = 500;
    }
  }
  async processar(pedido) {
    if (stryMutAct_9fa48("1")) {
      {}
    } else {
      stryCov_9fa48("1");
      this._validarPayload(pedido);
      try {
        if (stryMutAct_9fa48("2")) {
          {}
        } else {
          stryCov_9fa48("2");
          const resposta = await this._executarCobrancaComRetry(pedido);
          if (stryMutAct_9fa48("5") ? resposta.status !== 'APROVADO' : stryMutAct_9fa48("4") ? false : stryMutAct_9fa48("3") ? true : (stryCov_9fa48("3", "4", "5"), resposta.status === (stryMutAct_9fa48("6") ? "" : (stryCov_9fa48("6"), 'APROVADO')))) {
            if (stryMutAct_9fa48("7")) {
              {}
            } else {
              stryCov_9fa48("7");
              return await this._tratarSucesso(pedido);
            }
          } else {
            if (stryMutAct_9fa48("8")) {
              {}
            } else {
              stryCov_9fa48("8");
              return await this._tratarRecusa(pedido);
            }
          }
        }
      } catch (error) {
        if (stryMutAct_9fa48("9")) {
          {}
        } else {
          stryCov_9fa48("9");
          return await this._tratarFallbackErro(pedido, error);
        }
      }
    }
  }
  _validarPayload(pedido) {
    if (stryMutAct_9fa48("10")) {
      {}
    } else {
      stryCov_9fa48("10");
      const emailRegex = stryMutAct_9fa48("21") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("20") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("19") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("18") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("17") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("16") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("15") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("14") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("13") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("12") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("11") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      if (stryMutAct_9fa48("24") ? (!pedido || !pedido.clienteEmail || !emailRegex.test(pedido.clienteEmail) || !pedido.valor || pedido.valor <= 0) && !pedido.cartao : stryMutAct_9fa48("23") ? false : stryMutAct_9fa48("22") ? true : (stryCov_9fa48("22", "23", "24"), (stryMutAct_9fa48("26") ? (!pedido || !pedido.clienteEmail || !emailRegex.test(pedido.clienteEmail) || !pedido.valor) && pedido.valor <= 0 : stryMutAct_9fa48("25") ? false : (stryCov_9fa48("25", "26"), (stryMutAct_9fa48("28") ? (!pedido || !pedido.clienteEmail || !emailRegex.test(pedido.clienteEmail)) && !pedido.valor : stryMutAct_9fa48("27") ? false : (stryCov_9fa48("27", "28"), (stryMutAct_9fa48("30") ? (!pedido || !pedido.clienteEmail) && !emailRegex.test(pedido.clienteEmail) : stryMutAct_9fa48("29") ? false : (stryCov_9fa48("29", "30"), (stryMutAct_9fa48("32") ? !pedido && !pedido.clienteEmail : stryMutAct_9fa48("31") ? false : (stryCov_9fa48("31", "32"), (stryMutAct_9fa48("33") ? pedido : (stryCov_9fa48("33"), !pedido)) || (stryMutAct_9fa48("34") ? pedido.clienteEmail : (stryCov_9fa48("34"), !pedido.clienteEmail)))) || (stryMutAct_9fa48("35") ? emailRegex.test(pedido.clienteEmail) : (stryCov_9fa48("35"), !emailRegex.test(pedido.clienteEmail))))) || (stryMutAct_9fa48("36") ? pedido.valor : (stryCov_9fa48("36"), !pedido.valor)))) || (stryMutAct_9fa48("39") ? pedido.valor > 0 : stryMutAct_9fa48("38") ? pedido.valor < 0 : stryMutAct_9fa48("37") ? false : (stryCov_9fa48("37", "38", "39"), pedido.valor <= 0)))) || (stryMutAct_9fa48("40") ? pedido.cartao : (stryCov_9fa48("40"), !pedido.cartao)))) {
        if (stryMutAct_9fa48("41")) {
          {}
        } else {
          stryCov_9fa48("41");
          const error = new Error(stryMutAct_9fa48("42") ? "" : (stryCov_9fa48("42"), "Bad Request: Payload incompleto ou inválido."));
          error.status = 400;
          throw error;
        }
      }
    }
  }
  async _executarCobrancaComRetry(pedido) {
    if (stryMutAct_9fa48("43")) {
      {}
    } else {
      stryCov_9fa48("43");
      let tentativas = 0;
      while (stryMutAct_9fa48("46") ? tentativas > this.MAX_RETRIES : stryMutAct_9fa48("45") ? tentativas < this.MAX_RETRIES : stryMutAct_9fa48("44") ? false : (stryCov_9fa48("44", "45", "46"), tentativas <= this.MAX_RETRIES)) {
        if (stryMutAct_9fa48("47")) {
          {}
        } else {
          stryCov_9fa48("47");
          try {
            if (stryMutAct_9fa48("48")) {
              {}
            } else {
              stryCov_9fa48("48");
              return await Promise.race(stryMutAct_9fa48("49") ? [] : (stryCov_9fa48("49"), [this.gatewayPagamento.cobrar(pedido.valor, pedido.cartao), new Promise(stryMutAct_9fa48("50") ? () => undefined : (stryCov_9fa48("50"), (_, reject) => setTimeout(stryMutAct_9fa48("51") ? () => undefined : (stryCov_9fa48("51"), () => reject(new Error(stryMutAct_9fa48("52") ? "" : (stryCov_9fa48("52"), "Timeout Operacional")))), this.TIMEOUT_MS)))]));
            }
          } catch (error) {
            if (stryMutAct_9fa48("53")) {
              {}
            } else {
              stryCov_9fa48("53");
              stryMutAct_9fa48("54") ? tentativas-- : (stryCov_9fa48("54"), tentativas++);
              if (stryMutAct_9fa48("58") ? tentativas <= this.MAX_RETRIES : stryMutAct_9fa48("57") ? tentativas >= this.MAX_RETRIES : stryMutAct_9fa48("56") ? false : stryMutAct_9fa48("55") ? true : (stryCov_9fa48("55", "56", "57", "58"), tentativas > this.MAX_RETRIES)) throw error;
              await new Promise(stryMutAct_9fa48("59") ? () => undefined : (stryCov_9fa48("59"), resolve => setTimeout(resolve, this.BACKOFF_MS)));
            }
          }
        }
      }
    }
  }
  async _tratarSucesso(pedido) {
    if (stryMutAct_9fa48("60")) {
      {}
    } else {
      stryCov_9fa48("60");
      pedido.status = stryMutAct_9fa48("61") ? "" : (stryCov_9fa48("61"), 'PROCESSADO');
      const pedidoSalvo = await this.pedidoRepository.salvar(pedido);

      // E-mail Assíncrono (Non-blocking)
      this.emailService.enviarConfirmacao(pedido.clienteEmail, stryMutAct_9fa48("62") ? "" : (stryCov_9fa48("62"), "Pagamento Aprovado")).catch(stryMutAct_9fa48("63") ? () => undefined : (stryCov_9fa48("63"), err => console.error(stryMutAct_9fa48("64") ? "" : (stryCov_9fa48("64"), "Falha em segundo plano ao enviar e-mail:"), err.message)));
      return pedidoSalvo;
    }
  }
  async _tratarRecusa(pedido) {
    if (stryMutAct_9fa48("65")) {
      {}
    } else {
      stryCov_9fa48("65");
      pedido.status = stryMutAct_9fa48("66") ? "" : (stryCov_9fa48("66"), 'FALHOU');
      await this.pedidoRepository.salvar(pedido);
      return null;
    }
  }
  async _tratarFallbackErro(pedido, error) {
    if (stryMutAct_9fa48("67")) {
      {}
    } else {
      stryCov_9fa48("67");
      pedido.status = stryMutAct_9fa48("68") ? "" : (stryCov_9fa48("68"), 'ERRO_GATEWAY');
      await this.pedidoRepository.salvar(pedido);
      const erroAmigavel = new Error(stryMutAct_9fa48("69") ? "" : (stryCov_9fa48("69"), "Erro interno de processamento. Tente mais tarde."));
      erroAmigavel.status = 500;
      throw erroAmigavel;
    }
  }
}
module.exports = stryMutAct_9fa48("70") ? {} : (stryCov_9fa48("70"), {
  CheckoutService
});