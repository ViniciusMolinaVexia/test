app.directive('manutRmAprovacao', function () {
    return {
        templateUrl: 'view/rmAprovacao/manutRmAprovacao.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('filtroRmAprovacao', function () {
    return {
        templateUrl: 'view/rmAprovacao/filtroRmAprovacao.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('listaRmAprovacao', function () {
    return {
        templateUrl: 'view/rmAprovacao/listaRmAprovacao.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('camposManutRmAprovacao', function () {
    return {
        templateUrl: 'view/rmAprovacao/camposManutRmAprovacao.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});