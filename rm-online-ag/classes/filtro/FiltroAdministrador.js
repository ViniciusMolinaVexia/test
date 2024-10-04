function FiltroAdministrador() {
    this.numeroRm = null;
    this.requisitante = null;
    this.status = "T";
    this.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();

    return this;
}

