app.directive('manutCadastroRmaServico', function() {
    return {
        templateUrl: 'view/cadastroRmaServico/manutCadastroRmaServico.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('filtroCadastroRmaServico', function() {
    return {
        templateUrl: 'view/cadastroRmaServico/filtroCadastroRmaServico.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('listaCadastroRmaServico', function() {
    return {
        templateUrl: 'view/cadastroRmaServico/listaCadastroRmaServico.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});