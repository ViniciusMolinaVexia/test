app.directive('manutPainelEstoquista', function () {
    return {
        templateUrl: 'view/painelEstoquista/manutPainelEstoquista.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('transferenciaPainelEstoquista', function () {
    return {
        templateUrl: 'view/painelEstoquista/transferenciaPainelEstoquista.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('filtroPainelEstoquista', function () {
    return {
        templateUrl: 'view/painelEstoquista/filtroPainelEstoquista.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('listaPainelEstoquista', function () {
    return {
        templateUrl: 'view/painelEstoquista/listaPainelEstoquista.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('modalReceberMaterialPainelEstoquista', function () {
    return {
        templateUrl: 'view/painelEstoquista/modal/receberMaterialPainelEstoquista.modal.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('modalRetirarMaterialPainelEstoquista', function () {
    return {
        templateUrl: 'view/painelEstoquista/modal/retirarMaterialPainelEstoquista.modal.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});