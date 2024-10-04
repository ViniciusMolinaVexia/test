app.directive('filtroRequisicaoServicos', function() {
    return {
        templateUrl: 'view/painelRequisicaoServicos/filtroRequisicaoServicos.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('listaRequisicaoServicos', function() {
    return {
        templateUrl: 'view/painelRequisicaoServicos/listaRequisicaoServicos.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});