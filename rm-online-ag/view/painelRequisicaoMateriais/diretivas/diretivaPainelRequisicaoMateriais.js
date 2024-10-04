app.directive('filtroRequisicaoMateriais', function () {
    return {
        templateUrl: 'view/painelRequisicaoMateriais/filtroRequisicaoMateriais.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('listaRequisicaoMateriais', function () {
    return {
        templateUrl: 'view/painelRequisicaoMateriais/listaRequisicaoMateriais.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});