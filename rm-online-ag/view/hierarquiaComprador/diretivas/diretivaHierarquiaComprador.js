app.directive('manutHierarquiaComprador', function () {
    return {
        templateUrl: 'view/hierarquiaComprador/manutHierarquiaComprador.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('filtroHierarquiaComprador', function () {
    return {
        templateUrl: 'view/hierarquiaComprador/filtroHierarquiaComprador.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('listaHierarquiaComprador', function () {
    return {
        templateUrl: 'view/hierarquiaComprador/listaHierarquiaComprador.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});
