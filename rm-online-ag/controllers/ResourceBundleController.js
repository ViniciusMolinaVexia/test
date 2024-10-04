/**
 * Inicia a Fabrica com os Servicos que serao providos para o Controlador,
 * listando seus metodos e o respectivo caminho de acesso aos mesmos.
 *
 * @author Leonardo Faix Pordeus
 *
 * @param $resource Onde serao definido o caminho para o service e seus metodos.
 * @param $http
 * @param $log
 * */
services.factory('ResourceBundle', function ($http, $resource, $log) {
    return $resource(api + '/ResourceBundleController/', {}, {
        getResourceBundle: {method: 'POST', isArray: false, url: api + '/ResourceBundleController/getResourceBundle/'}
    });
});

/**
 * Configuracao dos metodos que serao requisitados pela View, onde serao responsaveis
 * por controlar interacao entre a View e os Servicos.
 *
 * @author Leonardo Faix Pordeus
 *
 * @param $scope Escopo de variaveis do Controller / View
 * @param $http Protocolo para comunicacao entre o FrontEnd e o BackEnd
 * @param ResourceBundle
 * */
function ResourceBundleController($scope, $http, ResourceBundle) {
    $scope.ResourceBundle = CarregaResourceBundle($scope, ResourceBundle);
}

/**
 *<pre>
 *<b>author:</b> Leonardo
 *<b>date:  </b> 28/04/2014
 *</pre>
 *
 * <p>Carrega ResourceBundle de acordo com locale.
 *
 *    TODO: Carrega o aquivo de properties de acordo com o locale, caso seja a primeira
 *    consulta ao ResourceBundle, se não busca na Sessão do navegador.
 *    é necessário que a váriavel no scope que terá os labels seja declarada como "ResourceBundle".
 *
 * @param $scope
 * @param ResourceBundle
 */
function CarregaResourceBundle($scope, ResourceBundle) {
    var locale = "pt_BR";
    //Verifica se já existe na sessão do navegador
    var listaResourceLocale = Sessao.getObjDaSessao(RESOURCE_BUNDLE);
    //Caso não exista, busca no backend.
    ResourceBundle.getResourceBundle(locale, function (result) {
    //Preenche o scope, para carregar os labels na view ao brir o sistema;
    	$scope.ResourceBundle = result.mensagens;
        //Grava objeto na sessao do navegador
        Sessao.gravaObjNaSessao(result.mensagens, RESOURCE_BUNDLE);
    }, retornoErro);
    return listaResourceLocale;
}

/**
 * Funcao para tratamento caso ocorra erro na comuniÃ§Ã£o com o backend.
 * [Leonardo Faix Pordeus]
 *
 * @param data
 * */
function retornoErro(data) {
//   $scope.alerts = [
//       { type: "danger", msg: SEM_COMUNICACAO_SERVIDOR_RESOURCE_BUNDLE }
//   ];
    $scope.alerts = Util.formataAlert("danger", SEM_COMUNICACAO_SERVIDOR_RESOURCE_BUNDLE, NEW_ALERT);
}

