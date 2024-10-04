app.directive('filtroRelatorioDesempenhoFornecedor', function () {
    return {
        templateUrl: 'view/relatorios/relatorioDesempenhoFornecedor/filtroRelatorioDesempenhoFornecedor.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('listaRelatorioDesempenhoFornecedor', function () {
    return {
        templateUrl: 'view/relatorios/relatorioDesempenhoFornecedor/listaRelatorioDesempenhoFornecedor.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});