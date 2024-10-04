function materiaisSemCodigoSapServ($scope, loading, MateriaisSemCodigoSapService, AutoComplete, Combo) {
    $scope.state = STATE_LISTA;

    if (!$scope.filtro) {
        $scope.filtro = new FiltroMateriaisSemCodigoSap();
    }

    if (!$scope.lista) {
        $scope.lista = [];
    }

    $scope.deParaVo = {};
    $scope.botaoDePara;

    $scope.listaDepositos = CarregaComboDepositos(Combo);

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

    $scope.formataLabel = function (data) {
        if (data) {
            if (data.nome) {
                return data.nome;
            }
        }
        return "";
    };

    $scope.editar = function (obj, operacao) {
        loading.loading();

        $scope.operacao = operacao;

        MateriaisSemCodigoSapService.selectById(obj, retornoEditar, trataErroServidor);
    };

    function retornoEditar(data) {
        $scope.objSelecionado = data;

        $scope.deParaVo = {};

        $scope.state = STATE_MANUT;
        $("#manutMateriaisSemCodigoSap .popup-manutencao").show("fade");
        loading.ready();
    }

    $scope.salvarConfirma = function () {
        $scope.mensagem = Util.setParamsLabel($scope.ResourceBundle["label_deseja_alterar_codigo_material"], $scope.objSelecionado.nome);

        $("#telaMateriaisSemCodigoSap #modalConfirmaSalvar").modal('show');
    };

    $scope.salvar = function () {
        loading.loading();
        $scope.bloquear = true;

        MateriaisSemCodigoSapService.alterarCodigoSap($scope.objSelecionado, retornoSalvar, trataErroServidor);
    };

    function retornoSalvar(data) {
        if (data) {
            if (data.mensagem.indexOf("msg") > -1) {
                $scope.objSelecionado = data.objeto;
                $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
                MateriaisSemCodigoSapService.listar($scope.filtro, retornoListar, trataErroServidor);
            } else {
                $scope.alerts = Util.formataAlert("danger", data.mensagem, NEW_ALERT);
                loading.ready();
            }
            Util.msgShowHide('#telaMateriaisSemCodigoSap #msg');
        }
    }

    $scope.realizarDeParaConfirma = function () {
        $scope.mensagem = Util.setParamsLabel($scope.ResourceBundle["label_deseja_realizar_de_para"], $scope.deParaVo.materialPara.nome);

        $("#telaMateriaisSemCodigoSap #modalConfirmaRealizarDePara").modal('show');
    };

    $scope.realizarDePara = function () {
        loading.loading();
        $scope.deParaVo.materialDe = $scope.objSelecionado;

        MateriaisSemCodigoSapService.realizarDePara($scope.deParaVo, retornoRealizarDePara, trataErroServidor);
    };

    function retornoRealizarDePara(data) {
        if (data) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaMateriaisSemCodigoSap #msg');
        }

        MateriaisSemCodigoSapService.listar($scope.filtro, retornoListar, trataErroServidor);
    }

    $scope.listar = function () {
        loading.loading();
        MateriaisSemCodigoSapService.listar($scope.filtro, retornoListar, trataErroServidor);
    };

    function retornoListar(data) {
        if (data) {
            $scope.filtro.paginacaoVo = data;
            $scope.lista = data.itensConsulta;
            $scope.paginaAtiva = data.pagina;
            $scope.numPaginas = Math.ceil($scope.filtro.paginacaoVo.qtdeRegistros / $scope.filtro.paginacaoVo.limiteConsulta);

            if ($scope.filtro.status === 'S') {
                $scope.botaoDePara = true;
            } else {
                $scope.botaoDePara = false;
            }
        }
        loading.ready();
    }

    $scope.irParaPaginaEspecifica = function (pagina) {
        var paginaAtual = $scope.filtro.paginacaoVo.pagina;
        // somente irá fazer a pesquisa se clicar em uma página diferente da atual
        if (pagina !== paginaAtual) {
            loading.loading();
            $scope.filtro.paginacaoVo.pagina = pagina;
            MateriaisSemCodigoSapService.listar($scope.filtro, retornoListar, trataErroServidor);
        }
    };

    $scope.limparFiltro = function () {
        $scope.filtro = new FiltroMateriaisSemCodigoSap();
    };

    $scope.novo = function () {
        $scope.objSelecionado = {};
    };

    function trataErroServidor(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_ERRO_COMUNICACAO_SERVIDOR);
        Util.msgShowHide('#telaMateriaisSemCodigoSap #msg');
        loading.ready();
    }

    $scope.affix = function () {
        Util.affix();
    };
}