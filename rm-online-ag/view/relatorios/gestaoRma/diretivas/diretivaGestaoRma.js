app.directive('filtroGestaoRma', function () {
    return {
        templateUrl: 'view/relatorios/gestaoRma/filtroGestaoRma.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('listaGestaoRma', function () {
    return {
        templateUrl: 'view/relatorios/gestaoRma/listaGestaoRma.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});