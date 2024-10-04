/**
 * Configuração dos métodos que serão requisitados pela View, onde serão responsáveis
 * por controlar iteração entre a View e os Serviços (Persistência, Consultas, Exclusões, etc)
 *
 * @author Nextage
 *
 * @param $scope Escopo de váriaveis do Controller / View
 * @param {type} loading
 * @param {type} ResourceBundle
 * @param {type} gestaoRmaService
 * @param {type} AutoComplete
 * @param {type} Combo
 * @returns {mmoServ}
 */
function gestaoRmaServ($scope, loading, gestaoRmaService, ResourceBundle, Combo, AutoComplete) {

    $scope.ResourceBundle = CarregaResourceBundle($scope, ResourceBundle);

    $scope.state = STATE_LISTA;

    $scope.listaDepositosNaoSelecionados = [];
    $scope.listaDepositos = CarregaComboDepositos(Combo);
    $scope.listaPrioridades = CarregaComboPrioridades(Combo);
    //$scope.listaTipoRequisicaoComFrenteServico = CarregaComboTipoRequisicaoComFrenteServico(Combo);
    $scope.listaTipoRequisicao = CarregaComboTipoRequisicao(Combo);
    $scope.listaTodasEapMultiEmpresa = CarregaComboTodasEapMultiEmpresa(Combo);

    $scope.configuracao = UtilConfiguracao.getConfiguracaoSessao(SIGLA_MODULO);

    if (!$scope.filtro) {
        $scope.filtro = new FiltroGestaoRma();
    }

    if (!$scope.listaRmMaterial) {
        $scope.listaRmMaterial = [];
    }
    /**
     * Metodo responsavel para limpar o filtro
     * @returns {undefined}
     */
    $scope.limparFiltro = function () {
        $scope.filtro = new FiltroGestaoRma();
    };

    $scope.formataLabel = function (data) {
        if (data) {
            //Pessoa
            if (data.referencia && data.nome) {
                return data.referencia + " - " + data.nome;
            }
            if (data.nome) {
                return data.nome;
            }
            //Setor e subarea
            if (data.descricao) {
                return data.descricao;
            }
        }
        return '';
    };


    $scope.getAutoCompleteSetor = function (value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;

        return AutoComplete.CarregaAutoCompleteSetor(filtroAutoComplete);
    };

    $scope.getAutoCompleteSubarea = function (value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;

        return AutoComplete.CarregaAutoCompleteSubarea(filtroAutoComplete);
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

    $scope.getAutoCompleteMateriaisExistentes = function (value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;
        filtroAutoComplete.limite = 20;

        return AutoComplete.CarregaAutoCompleteMateriaisExistentes(filtroAutoComplete);
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

        gestaoRmaService.listar($scope.filtro, retornoListar, trataErroServidor);
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
            gestaoRmaService.listar($scope.filtro, retornoListar, trataErroServidor);
        }
    };

    /**
     * Metodo responsavel por listar os itens em tela
     * @returns {undefined}
     */
    $scope.gerarXls = function () {
        loading.loading();

        gestaoRmaService.geraExcel($scope.filtro, retornoGerarXls, trataErroServidor);
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