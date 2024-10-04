app.directive('manutCadastroRma', function() {
    return {
        templateUrl: 'view/cadastroRma/manutCadastroRma.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('filtroCadastroRma', function() {
    return {
        templateUrl: 'view/cadastroRma/filtroCadastroRma.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('listaCadastroRma', function() {
    return {
        templateUrl: 'view/cadastroRma/listaCadastroRma.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});