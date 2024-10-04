function FiltroPainelRequisicaoMateriais (){
	this.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();
	this.centro = null;
	this.numero = null;
	this.material = null;
	this.qtdeSolicitada = null;
	this.recebimentoSolicitacao = null;
	this.stDataEmissaoDe = null;
    this.stDataEmissaoAte = null;
    this.stDataNecessidadeDe = null;
    this.stDataNecessidadeAte = null;
	this.requisitante = {};
	this.usuarioCadastrante = null;
	this.coletorCusto = null;
	this.status = null;
	
	return this;
}