function FiltroComprador() {
    this.numeroRm = null;
    this.material = null;
    this.materialChave = null;
    this.requisitante = null;
    this.tipoRequisicao = null;
    this.status = "SNP";
    this.prioridade = null;
    this.itensConcluidos = "N";
    this.exibirCanceladas = "N";
    this.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();

    return this;
}

