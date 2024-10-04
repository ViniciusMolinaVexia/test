function FiltroCadastroRma() {
    this.numero = null;
    this.material = null;
    this.materialChave = null;
    this.stDataEmissaoDe = null;
    this.stDataEmissaoAte = null;
    this.stDataRecebimentoDe = null;
    this.stDataRecebimentoAte = null;
    this.stDataNecessidadeDe = null;
    this.stDataNecessidadeAte = null;
    this.fluxoMaterial = null;
    this.status = null;
    this.rmMaterial = null;
    this.naoExibirComComprador = false;
    this.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();
    this.comprador = null;
    this.prioridade = null;
    this.eapMultiEmpresa = null;
    this.area = null;
    return this;
}

