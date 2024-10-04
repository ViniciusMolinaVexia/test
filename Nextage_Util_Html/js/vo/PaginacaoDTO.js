function PaginacaoDTO() {

    var newPaginacaoDTO;

    this.getPaginacaoDTO = function (paginacao) {
        var newPaginacaoDTO = {
            ItensConsulta: paginacao.ItensConsulta,
            ItensPagina: paginacao.ItensPagina,
            LimiteConsulta: paginacao.LimiteConsulta,
            QtdeRegistros: paginacao.QtdeRegistros,
            QtdeRegPagina: paginacao.QtdeRegPagina,
            Pagina: paginacao.Pagina,
            NovaConsulta: paginacao.NovaConsulta
        };
        return newPaginacaoDTO;
    };
    this.getNovoPaginacaoDTO = function () {
        var newPaginacaoDTO = {
            ItensConsulta: null,
            ItensPagina: null,
            LimiteConsulta: 20,
            QtdeRegistros: 0,
            QtdeRegPagina: 20,
            Pagina: 1,
            NovaConsulta: true,
            Filtro: null
        };
        return newPaginacaoDTO;
    };
} 