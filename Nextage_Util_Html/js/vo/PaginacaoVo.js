function PaginacaoVo() {

    var newPaginacaoVo;

    this.getPaginacaoVo = function (paginacao) {
        var newPaginacaoVo = {
            itensConsulta: paginacao.itensConsulta,
            itensPagina: paginacao.itensPagina,
            limiteConsulta: paginacao.limiteConsulta,
            qtdeRegistros: paginacao.qtdeRegistros,
            qtdeRegPagina: paginacao.qtdeRegPagina,
            pagina: paginacao.pagina,
            novaConsulta: paginacao.novaConsulta,
            listaNxOrder: paginacao.listaNxOrder
        };
        return newPaginacaoVo;
    };
    this.getNovoPaginacaoVo = function () {
        var newPaginacaoVo = {
            itensConsulta: null,
            itensPagina: null,
            limiteConsulta: 20,
            qtdeRegistros: 0,
            qtdeRegPagina: 20,
            pagina: 1,
            novaConsulta: true,
            filtro: null,
            listaNxOrder: []
        };
        return newPaginacaoVo;
    };
} 