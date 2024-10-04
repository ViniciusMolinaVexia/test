app.directive('manutComprador', function () {
    return {
        templateUrl: 'view/comprador/manutComprador.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('filtroComprador', function () {
    return {
        templateUrl: 'view/comprador/filtroComprador.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('listaComprador', function () {
    return {
        templateUrl: 'view/comprador/listaComprador.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});