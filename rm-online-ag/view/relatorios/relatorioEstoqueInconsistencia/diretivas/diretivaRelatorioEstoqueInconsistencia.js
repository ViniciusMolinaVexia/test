app.directive('filtroRelatorioEstoqueInconsistencia', function () {
    return {
        templateUrl: 'view/relatorios/relatorioEstoqueInconsistencia/filtroRelatorioEstoqueInconsistencia.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('listaRelatorioEstoqueInconsistencia', function () {
    return {
        templateUrl: 'view/relatorios/relatorioEstoqueInconsistencia/listaRelatorioEstoqueInconsistencia.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});