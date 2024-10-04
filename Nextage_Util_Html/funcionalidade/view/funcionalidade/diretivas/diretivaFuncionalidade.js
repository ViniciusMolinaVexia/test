//view
app.directive('manutFuncionalidade', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/funcionalidade/view/funcionalidade/manutFuncionalidade.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});
app.directive('filtroFuncionalidade', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/funcionalidade/view/funcionalidade/filtroFuncionalidade.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});
app.directive('listaFuncionalidade', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/funcionalidade/view/funcionalidade/listaFuncionalidade.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});
//fim view
//conteudo aba caso tenha grupo
app.directive('conteudoAbaFuncionalidade', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/funcionalidade/view/funcionalidade/abas/conteudoAba.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});
app.directive('abasFilhasFuncionalidade', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/funcionalidade/view/funcionalidade/abas/abasFilhas.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});
