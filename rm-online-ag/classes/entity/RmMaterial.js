function RmMaterial(obj) {
    this.rmMaterialId = null;
    this.material = null;
    this.quantidade = null;
    this.observacao = null;
    this.ordem = null;
    this.comprador = null;
    this.rm = null;
    this.numeroPedidoCompra = null;
    this.numeroRequisicaoSap = null;
    this.itemRequisicaoSap = null;
    this.numeroReserva = null;
    this.dataCompra = null;
    this.dataPrevisaoChegada = null;
    this.fornecedor = null;
    this.coletorCustos = null;
    this.operacao = null;
    this.diagramaRede = null;
    this.estaNoOrcamento = null;
    this.valorOrcado = null;
    this.observacaoCusto = null;
    this.fluxoMaterial = null;
    this.deposito = null;
    this.observacaoEstoquista = null;
    this.quantidadeOriginal = null;
    this.itemDoPedido = null;
    this.centro = null;
    this.status = null;
    this.valorPedido = null;
    this.dataRecebimentoTotal = null;
    this.localEntrega = null;
    this.coletorOrdem = null;
    this.agrupadorErro = null;
    this.dataPrevistaEntrega = null;
    this.dataUltimaNotaFiscal = null;
    this.dataCancelamento = null;
    this.coletorEstoque = null;
    this.codMaterialAnterior= null;
    this.nota = null;

    if (obj) {
        this.rmMaterialId = obj.rmMaterialId;
        this.material = obj.material;
        this.quantidade = obj.quantidade;
        this.observacao = obj.observacao;
        this.nota = obj.nota;
        this.ordem = obj.ordem;
        this.comprador = obj.comprador;
        this.rm = obj.rm;
        this.numeroPedidoCompra = obj.numeroPedidoCompra;
        this.numeroRequisicaoSap = obj.numeroRequisicaoSap;
        this.itemRequisicaoSap = obj.itemRequisicaoSap;
        this.numeroReserva = obj.numeroReserva;
        this.dataCompra = obj.dataCompra;
        this.dataPrevisaoChegada = obj.dataPrevisaoChegada;
        this.fornecedor = obj.fornecedor;
        this.coletorCustos = obj.coletorCustos;
        this.operacao = obj.operacao;
        this.diagramaRede = obj.diagramaRede;
        this.estaNoOrcamento = obj.estaNoOrcamento;
        this.valorOrcado = obj.valorOrcado;
        this.observacaoCusto = obj.observacaoCusto;
        this.fluxoMaterial = obj.fluxoMaterial;
        this.deposito = obj.deposito;
        this.observacaoEstoquista = obj.observacaoEstoquista;
        this.quantidadeOriginal = obj.quantidadeOriginal;
        this.itemDoPedido = obj.itemDoPedido;
        this.centro = obj.centro;
        this.status = obj.status;
        this.valorPedido = obj.valorPedido;
        this.dataRecebimentoTotal = obj.dataRecebimentoTotal;
        this.localEntrega = obj.localEntrega;
        this.coletorOrdem = obj.coletorOrdem;
        this.agrupadorErro = obj.agrupadorErro;
        this.dataPrevistaEntrega = obj.dataPrevistaEntrega;
        this.dataUltimaNotaFiscal = obj.dataUltimaNotaFiscal;
        this.dataCancelamento = obj.dataCancelamento;
        this.coletorEstoque = obj.coletorEstoque;
        this.codMaterialAnterior = obj.codMaterialAnterior;
    }

    this.equals = function (obj) {
        if (!this.rmMaterialId || !obj.rmMaterialId) {
            return false;
        } else {
            return this.rmMaterialId === obj.rmMaterialId;
        }
    };

    return this;
}

