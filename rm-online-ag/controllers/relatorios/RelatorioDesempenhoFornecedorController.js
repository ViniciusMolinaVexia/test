/**
 * Configuração dos métodos que serão requisitados pela View, onde serão responsáveis
 * por controlar iteração entre a View e os Serviços (Persistência, Consultas, Exclusões, etc)
 *
 * @author Nextage
 *
 * @param $scope Escopo de váriaveis do Controller / View
 * @param {type} loading
 * @param {type} ResourceBundle
 * @param {type} rmAprovacaoService
 * @param {type} AutoComplete
 * @param {type} Combo
 * @returns {mmoServ}
 */
function relatorioDesempenhoFornecedorServ($scope, loading, rmAprovacaoService, ResourceBundle, Combo, AutoComplete) {

    $scope.ResourceBundle = CarregaResourceBundle($scope, ResourceBundle);

    $scope.state = STATE_LISTA;

    $scope.comboGerenteCusto = CarregaComboGerenteCustos(Combo);

    if (!$scope.filtro) {
        $scope.filtro = new FiltroRmAprovacao().getNovo();
    }

    if (!$scope.lista) {
        $scope.lista = [];
    }

    $scope.formataLabel = function (data) {
        if (data) {
            if (data.referencia && data.nome) {
                return data.referencia + " - " + data.nome;
            }
            if (data.nome) {
                return data.nome;
            }
        }
        return '';
    };

    $scope.getAutoCompletePessoa = function (value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;

        return AutoComplete.CarregaAutoCompletePessoas(filtroAutoComplete);
    };

    $scope.listar = function () {
        loading.loading();

        var paginacao = new PaginacaoVo();
        paginacao.pagina = 1;
        paginacao.limiteConsulta = 20;
        paginacao.qtdeRegPagina = 20;

        $scope.filtro.paginacaoVo = paginacao;
        rmAprovacaoService.listar($scope.filtro, retornoListar, trataErroServidor);
    };

    function retornoListar(data) {
        if (data) {
            $scope.filtro.paginacaoVo = data;
            $scope.lista = data.itensConsulta;
            $scope.paginaAtiva = data.pagina;
            $scope.numPaginas = Math.ceil($scope.filtro.paginacaoVo.qtdeRegistros / $scope.filtro.paginacaoVo.limiteConsulta);
        }
        loading.ready();
    }

    $scope.irParaPaginaEspecifica = function (pagina) {
        var paginaAtual = $scope.filtro.paginacaoVo.pagina;
        // somente irá fazer a pesquisa se clicar em uma página diferente da atual
        if (pagina !== paginaAtual) {
            loading.loading();
            $scope.filtro.paginacaoVo.pagina = pagina;
            rmAprovacaoService.listar($scope.filtro, retornoListar, retornoErro);
        }
    };

    $scope.limparFiltro = function () {
        $scope.filtro = new FiltroRmAprovacao().getNovo();

        $scope.lista = [];
        $scope.paginaAtiva = null;
        $scope.numPaginas = null;
    };

    function trataErroServidor(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_ERRO_COMUNICACAO_SERVIDOR);
        Util.msgShowHide('#telaMmoAprovacaoSS #msg');
        loading.ready();
    }

    $scope.affix = function () {
        Util.affix();
    };
}