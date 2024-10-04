function FiltroPainelEstoquista() {
    this.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();
    this.numeroRma = null;
    this.material = null;
    this.materialChave = null;
    this.deposito = null;
    this.solicitante = null;
    this.stDataInicio = null;
    this.stDataFim = null;
    this.stDataInicioAplicacao = null;
    this.stDataFimAplicacao = null;
    this.stDataInicioRecebSolic = null;
    this.stDataFimRecebSolic = null;
    this.status = "P";
    this.statusItem = null;
    this.cadastrante = null;

    return this;
}

