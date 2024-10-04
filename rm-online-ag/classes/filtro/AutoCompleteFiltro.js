function AutoCompleteFiltro() {

    this.getAutoCompleteFiltro = function (filtroAutoComplete) {
        var newAutoCompleteFiltro = {
            stFiltro: filtroAutoComplete.stFiltro,
            limite: filtroAutoComplete.limite
        };
        return newAutoCompleteFiltro;
    };

    this.getNovoAutoCompleteFiltro = function () {
        var newAutoCompleteFiltro = {
            stFiltro: "",
            limite: 50

        };
        return newAutoCompleteFiltro;
    };
}