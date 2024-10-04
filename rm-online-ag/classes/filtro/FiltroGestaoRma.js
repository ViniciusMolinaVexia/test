function FiltroGestaoRma() {
    this.material = null;
    this.materialChave = null;
    this.prioridade = null;
    this.stDataEmissaoDe = null;
    this.stDataEmissaoAte = null;
    this.stDataNecessidadeDe = null;
    this.stDataNecessidadeAte = null;
    this.tipoRequisicao = null;
    this.prioridade = null;
    this.subArea = null;
    this.requisitante = null;
    this.aprovador = null;
    this.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();

    return this;
}

