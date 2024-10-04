function Servico(obj) {
    this.rmId = null;
    this.numeroRm = null;
    this.dataEmissao = null;
    this.dataAplicacao = null;
    this.dataAprovacaoCompra = null;
    this.dataRecebimento = null;
    this.dataCancelamento = null;
    this.dataEnvioComprador = null;
    this.dataAceiteComprador = null;
    this.dataReprovacaoCompra = null;
    this.observacao = null;
    this.teste = null;
    this.tipoRequisicao = null;
    this.comprador = null;
    this.requisitante = null;
    this.deposito = null;
    this.prioridade = null;
    this.justificativaCancelamento = null;
    this.justificativaEnvioAprovacao = null;
    this.justificativaGerenteObra = null;
    this.usuario = null;
    this.gerenteCustos = null;
    this.dataEnvioAprovacao = null;
    this.dataReprovacao = null;
    this.reprovadoPor = null;
    this.localEntrega = null;
    this.gerenteObra = null;
    this.justRetornoEquipeCustos = null;
    this.atribuidoPara = null;
    this.numeroRmMobile = null;
    this.periodo = null;
    this.gerenteArea = null;
    this.justMateriaisCautelados = null;
    this.eapMultiEmpresa = null;

    if (obj) {
        this.rmId = obj.rmId;
        this.numeroRm = obj.numeroRm;
        this.dataEmissao = obj.dataEmissao;
        this.dataAplicacao = obj.dataAplicacao;
        this.dataAprovacaoCompra = obj.dataAprovacaoCompra;
        this.dataRecebimento = obj.dataRecebimento;
        this.dataCancelamento = obj.dataCancelamento;
        this.dataEnvioComprador = obj.dataEnvioComprador;
        this.dataReprovacaoCompra = obj.dataReprovacaoCompra;
        this.dataAceiteComprador = obj.dataAceiteComprador;
        this.observacao = obj.observacao;
        this.tipoRequisicao = obj.tipoRequisicao;
        this.comprador = obj.comprador;
        this.requisitante = obj.requisitante;
        this.deposito = obj.deposito;
        this.prioridade = obj.prioridade;
        this.justificativaCancelamento = obj.justificativaCancelamento;
        this.justificativaEnvioAprovacao = obj.justificativaEnvioAprovacao;
        this.justificativaGerenteObra = obj.justificativaGerenteObra;
        this.usuario = obj.usuario;
        this.gerenteCustos = obj.gerenteCustos;
        this.dataEnvioAprovacao = obj.dataEnvioAprovacao;
        this.dataReprovacao = obj.dataReprovacao;
        this.reprovadoPor = obj.reprovadoPor;
        this.localEntrega = obj.localEntrega;
        this.gerenteObra = obj.gerenteObra;
        this.justRetornoEquipeCustos = obj.justRetornoEquipeCustos;
        this.atribuidoPara = obj.atribuidoPara;
        this.numeroRmMobile = obj.numeroRmMobile;
        this.periodo = obj.periodo;
        this.gerenteArea = obj.gerenteArea;
        this.justMateriaisCautelados = obj.justMateriaisCautelados;
        this.eapMultiEmpresa = obj.eapMultiEmpresa;
    }

    this.equals = function(obj) {
        if (!this.rmId || !obj.rmId) {
            return false;
        } else {
            return this.rmId === obj.rmId;
        }
    };

    return this;
}