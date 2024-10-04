/**
 * Configuração dos métodos que serão requisitados pela View, onde serão responsáveis
 * por controlar iteração entre a View e os Serviços (Persistência, Consultas, Exclusões, etc)
 *
 * @author Nextage
 *
 * @param $scope Escopo de váriaveis do Controller / View
 * @param {type} loading
 * @param {type} ResourceBundle
 * @param {type} rmPrevisaoPendenciaRecebimentoService
 * @param {type} AutoComplete
 * @param {type} Combo
 * @returns {mmoServ}
 */
function previsaoPendenciaRecebimentoServ($scope, loading, rmPrevisaoPendenciaRecebimentoService, ResourceBundle, Combo, AutoComplete) {

    $scope.ResourceBundle = CarregaResourceBundle($scope, ResourceBundle);

    $scope.state = STATE_LISTA;

    $scope.listaDepositosNaoSelecionados = [];
    $scope.listaDepositos = CarregaComboDepositos(Combo);

    $scope.TIPO_PENDENCIA_TODAS = "";
    $scope.TIPO_PENDENCIA_ATRASADAS = TIPO_PENDENCIA_ATRASADAS;
    $scope.TIPO_PENDENCIA_DENTRO_PRAZO = TIPO_PENDENCIA_DENTRO_PRAZO;

    if (!$scope.filtro) {
        $scope.filtro = new FiltroPrevisaoPendenciaRecebimento().getNovoFiltroPrevisaoPendenciaRecebimento();
    }

    if (!$scope.listaRmMaterial) {
        $scope.listaRmMaterial = [];
    }

    $scope.listaTodasEapMultiEmpresa = CarregaComboTodasEapMultiEmpresa(Combo);

    $scope.configuracao = UtilConfiguracao.getConfiguracaoSessao(SIGLA_MODULO);

    /**
     * Metodo responsavel para limpar o filtro
     * @returns {undefined}
     */
    $scope.limparFiltro = function () {
        $scope.filtro = new FiltroPrevisaoPendenciaRecebimento().getNovoFiltroPrevisaoPendenciaRecebimento();

        $scope.listaRmMaterial = [];
        $scope.paginaAtiva = null;
        $scope.numPaginas = null;
        for (var i = 0; i < $scope.listaDepositos.length; i++) {
            $scope.listaDepositos[i].selected = undefined;
        }
    };

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

    $scope.getAutoCompleteMateriais = function (value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;

        return AutoComplete.CarregaAutoCompleteMateriais(filtroAutoComplete);
    };

    /**
     * Metodo responsavel por listar os itens em tela
     * @returns {undefined}
     */
    $scope.listar = function () {
        loading.loading();

        var paginacao = new PaginacaoVo();
        paginacao.pagina = 1;
        paginacao.limiteConsulta = 15;
        paginacao.qtdeRegPagina = 15;

        $scope.filtro.paginacaoVo = paginacao;

        var listaAux = [];
        var listaAuxId = [];
        for (var i = 0; i < $scope.listaDepositos.length; i++) {
            if ($scope.listaDepositos[i].selected) {
                var deposito = new Deposito($scope.listaDepositos[i]);
                listaAux.push(deposito);
                listaAuxId.push(deposito.depositoId);
            }
        }
        $scope.filtro.deposito = listaAux;
        $scope.filtro.idsDeposito = listaAuxId;
        var filtro = new FiltroPrevisaoPendenciaRecebimento().getFiltroPrevisaoPendenciaRecebimento($scope.filtro);
        rmPrevisaoPendenciaRecebimentoService.listar(filtro, retornoListar, trataErroServidor);
    };

    /**
     * Metodo responsavel para o retorno do metodo de listar
     *
     * @param {type} data
     * @returns {undefined}
     */
    function retornoListar(data) {
        if (data) {
            $scope.filtro.paginacaoVo = data;
            $scope.listaRmMaterial = data.itensConsulta;
            $scope.paginaAtiva = data.pagina;
            $scope.numPaginas = Math.ceil($scope.filtro.paginacaoVo.qtdeRegistros / $scope.filtro.paginacaoVo.limiteConsulta);
        }
        loading.ready();
    }

    /**
     * Metodo responsavel por listar os itens em tela da pagina selecionada
     *
     * @param {type} pagina
     * @returns {undefined}
     */
    $scope.irParaPaginaEspecifica = function (pagina) {
        var paginaAtual = $scope.filtro.paginacaoVo.pagina;
        // somente irá fazer a pesquisa se clicar em uma página diferente da atual
        if (pagina !== paginaAtual) {
            loading.loading();
            $scope.filtro.paginacaoVo.pagina = pagina;
            rmPrevisaoPendenciaRecebimentoService.listar($scope.filtro, retornoListar, retornoErro);
        }
    };

    /**
     * Metodo responsavel por listar os itens em tela
     * @returns {undefined}
     */
    $scope.gerarXls = function () {
        loading.loading();
        var listaAux = [];
        var listaAuxId = [];
        for (var i = 0; i < $scope.listaDepositos.length; i++) {
            if ($scope.listaDepositos[i].selected) {
                var deposito = new Deposito($scope.listaDepositos[i]);
                listaAux.push(deposito);
                listaAuxId.push(deposito.depositoId);
            }
        }
        $scope.filtro.deposito = listaAux;
        $scope.filtro.idsDeposito = listaAuxId;
        var filtro = new FiltroPrevisaoPendenciaRecebimento().getFiltroPrevisaoPendenciaRecebimento($scope.filtro);
        rmPrevisaoPendenciaRecebimentoService.gerarXLS(filtro, retornoGerarXls, trataErroServidor);
    };

    /**
     * Metodo responsavel para o retorno do metodo de gerarExcel
     *
     * @param {type} data
     * @returns {undefined}
     */
    function retornoGerarXls(data) {
        if (data && data.nmAnexo && data.arquivo) {
            Util.download(data.arquivo, data.nmAnexo, "xls");
        }
        loading.ready();
    }

    /**
     * Trata os erros do sistema
     * @param {type} data
     * @returns {undefined}
     */
    function trataErroServidor(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_ERRO_COMUNICACAO_SERVIDOR);
        Util.msgShowHide('#telaPrevisaoPendenciaRecebimento #msg');
        loading.ready();
    }

    $scope.affix = function () {
        Util.affix();
    };
}