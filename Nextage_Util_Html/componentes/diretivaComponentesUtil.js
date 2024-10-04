//============================== MENU ===============================
/*
 * Diretivas definidas para componentes Globais - Util
 * [Marlos M. Novo]
 * [23/05/2014]
 */
app.directive('inputText', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            name: '@',
            form: '@',
            model: '='
        },
        templateUrl: 'Nextage_Util_Html5/componentes/inputText.html'
    };
});