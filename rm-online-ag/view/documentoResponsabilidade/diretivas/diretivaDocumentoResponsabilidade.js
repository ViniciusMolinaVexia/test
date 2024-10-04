app.directive('filtroPendentes', function () {
    return {
        templateUrl: 'view/documentoResponsabilidade/filtroPendentes.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('listaPendentes', function () {
    return {
        templateUrl: 'view/documentoResponsabilidade/listaPendentes.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('filtroIndisponiveisRecusados', function () {
    return {
        templateUrl: 'view/documentoResponsabilidade/filtroIndisponiveisRecusados.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('listaIndisponiveisRecusados', function () {
    return {
        templateUrl: 'view/documentoResponsabilidade/listaIndisponiveisRecusados.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});
