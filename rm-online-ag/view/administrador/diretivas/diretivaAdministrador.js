app.directive('manutAdministrador', function () {
    return {
        templateUrl: 'view/administrador/manutAdministrador.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('filtroAdministrador', function () {
    return {
        templateUrl: 'view/administrador/filtroAdministrador.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('listaAdministrador', function () {
    return {
        templateUrl: 'view/administrador/listaAdministrador.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});



app.directive('admListaMaterialDepositoEntrada', function () {
    return {
        templateUrl: 'view/administrador/listaMaterialDepositoEntrada.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('admListaMaterialTransferenciaVo', function () {
    return {
        templateUrl: 'view/administrador/listaMaterialTransferenciaVo.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('admListaRmMaterial', function () {
    return {
        templateUrl: 'view/administrador/listaRmMaterial.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});