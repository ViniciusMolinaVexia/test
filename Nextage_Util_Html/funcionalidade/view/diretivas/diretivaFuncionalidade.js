// Essa diretiva será chamada no módulo que precisa do geral
// Ex: Módulo Refeitório necessita do Relatório de Requisições
// Então no index.html do Refeitório será referenciado a este arquivo js
// Isso pra não colocar as dependências das diretivas direto no Home do "refeitório"

app.directive('pageFuncionalidade', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/funcionalidade/view/funcionalidade/Funcionalidade.html',
        restrict: 'E',
        transclude: true,
        scope: false,
        link: function (scope, elem, attrs) {
            //Inicializa a tela a partir do codigo passado no atributo "tipo" da tag
            if (!scope.CODIGO_FUNCIONALIDADE && attrs.codigo) {
                scope.CODIGO_FUNCIONALIDADE = attrs.codigo;
            }
            if (!scope.CAMINHO_CLASSE_COMPLETO && attrs.caminho) {
                scope.CAMINHO_CLASSE_COMPLETO = attrs.caminho;
            }
            if (attrs.nomePropId) {
                scope.nomePropId = attrs.nomePropId;
            }
            if (attrs.idTela) {
                scope.idTela = attrs.idTela;
            }
            if (attrs.modulo) {
                scope.modulo = attrs.modulo;
                if (attrs.propriedadeModulo) {
                    scope.propriedadeModulo = attrs.propriedadeModulo;
                }
            }
        }
    };
});


