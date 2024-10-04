app.directive('filtroPrevisaoPendenciaRecebimento', function () {
    return {
        templateUrl: 'view/relatorios/previsaoPendenciaRecebimento/filtroPrevisaoPendenciaRecebimento.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('listaPrevisaoPendenciaRecebimento', function () {
    return {
        templateUrl: 'view/relatorios/previsaoPendenciaRecebimento/listaPrevisaoPendenciaRecebimento.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});