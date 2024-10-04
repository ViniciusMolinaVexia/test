app.directive('manutMateriaisSemCodigoSap', function () {
    return {
        templateUrl: 'view/materiaisSemCodigoSap/manutMateriaisSemCodigoSap.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('filtroMateriaisSemCodigoSap', function () {
    return {
        templateUrl: 'view/materiaisSemCodigoSap/filtroMateriaisSemCodigoSap.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('listaMateriaisSemCodigoSap', function () {
    return {
        templateUrl: 'view/materiaisSemCodigoSap/listaMateriaisSemCodigoSap.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});