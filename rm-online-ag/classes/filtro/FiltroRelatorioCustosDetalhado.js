function FiltroRelatorioCustosDetalhado() {
    this.getNovoFiltroRelatorioCustosDetalhado = function () {
        var filtro = {
            paginacaoVo: new PaginacaoVo().getNovoPaginacaoVo()
        };
        return filtro;
    };
}