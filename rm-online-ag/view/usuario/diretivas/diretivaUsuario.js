app.directive('manutUsuario', function () {
    return {
        templateUrl: 'view/usuario/manutUsuario.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('filtroUsuario', function () {
    return {
        templateUrl: 'view/usuario/filtroUsuario.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('listaUsuario', function () {
    return {
        templateUrl: 'view/usuario/listaUsuario.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('abaManutUsuario', function () {
    return {
        templateUrl: 'view/usuario/abaManutUsuario.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});


app.directive('abaPermissoes', function () {
    return {
        templateUrl: 'view/usuario/abaPermissoes.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});


app.directive('abaTipoAtuacao', function () {
    return {
        templateUrl: 'view/usuario/abaTipoAtuacao.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});