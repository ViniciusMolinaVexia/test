/**
 * Configuração dos métodos que serão requisitados pela View, onde serão responsáveis
 * por controlar iteração entre a View e os Serviços (Persistência, Consultas, Exclusões, etc)
 *
 * @author Yuri Mello da Costa
 *
 * @param $scope Escopo de váriaveis do Controller / View
 * @param {type} loading
 * @param {type} ResourceBundle
 * @param {type} rmRelatorioEstoqueInconsistenciaService
 * @param {type} AutoComplete
 * @param {type} Combo
 * @returns {mmoServ}
 */
function relatorioEstoqueInconsistenciaServ($scope, loading, rmRelatorioEstoqueInconsistenciaService, ResourceBundle, Combo, AutoComplete, $http) {

    $scope.ResourceBundle = CarregaResourceBundle($scope, ResourceBundle);

    $scope.state = STATE_LISTA;

    $scope.listaDepositosNaoSelecionados = [];
    $scope.listaDepositos = CarregaComboDepositos(Combo);

    $scope.SISTEMA_RMA_WEB = SISTEMA_RMA_WEB;
    $scope.SISTEMA_CP_WEB = SISTEMA_CP_WEB;
    $scope.SISTEMA_SAP = SISTEMA_SAP;
    $scope.isPrefixoEquipamento = false;

    $scope.ENTRADA = "Entrada";
    $scope.SAIDA = "Saida";

    $scope.objAdicionarEstoque = new FiltroRelatorioEstoqueInconsistencia().getNovoFiltroRelatorioEstoqueInconsistencia();
    $scope.objAdicionarEstoque.checkCp = null;
    $scope.objAdicionarEstoque.checkRma = null;
    $scope.objAdicionarEstoque.prefixoEquipamento = null;

    $scope.ROLE_MOVIMENTACAO_ESTOQUE = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_MOVIMENTACAO_ESTOQUE);

    if (!$scope.filtro) {
        $scope.filtro = new FiltroRelatorioEstoqueInconsistencia().getNovoFiltroRelatorioEstoqueInconsistencia();
    }

    if (!$scope.listaRmMaterial) {
        $scope.listaRmMaterial = [];
    }
    /**
     * Metodo responsavel para limpar o filtro
     * @returns {undefined}
     */
    $scope.limparFiltro = function () {
        $scope.filtro = new FiltroRelatorioEstoqueInconsistencia().getNovoFiltroRelatorioEstoqueInconsistencia();

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
    	console.log($scope.listaDepositos);
        if ($scope.filtro.deposito == null) {
            $scope.alerts = Util.formataAlert(danger, $scope.ResourceBundle["msg_necessario_selecionar_deposito"], NEW_ALERT);
            Util.msgShowHide('#telaRelatorioEstoqueInconsistencia #msg');
            return;
        }
        loading.loading();

        var paginacao = new PaginacaoVo().getNovoPaginacaoVo();

        $scope.paginaAtiva = 1;
        $scope.pageSize = 15;
        $scope.listaRelatorio = [];
        $scope.numPaginas = 0;

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
        $scope.filtro.listaDeposito = listaAux;
        $scope.filtro.idsDeposito = listaAuxId;
        var filtro = new FiltroRelatorioEstoqueInconsistencia().getFiltroRelatorioEstoqueInconsistencia($scope.filtro);
        rmRelatorioEstoqueInconsistenciaService.listar(filtro, retornoListar, trataErroServidor);
    };

    /**
     * Metodo responsavel para o retorno do metodo de listar
     *
     * @param {type} data
     * @returns {undefined}
     */
    function retornoListar(data) {
        if (data) {
            $scope.lista = data;
        }
        $scope.paginaAtiva = 0;
        $scope.pageSize = 15;
        $scope.irParaPaginaEspecifica(1);
        $scope.numPaginas = Math.ceil($scope.lista.length / $scope.pageSize);
        loading.ready();
    }

    $scope.irParaPaginaEspecifica = function (pagina) {
        Paginacao.montaPaginacao($scope, 'listaRelatorioEstoqueInconsistencia', $scope.lista, pagina, 'id', loading);
    };


    /**
     * Metodos responsáveis por adicionar itens no depósito
     *
     */

    $scope.abrirModalNovoItemDeposito = function () {
        $scope.objAdicionarEstoque = new FiltroRelatorioEstoqueInconsistencia().getNovoFiltroRelatorioEstoqueInconsistencia();
        $("#modalAdicionarItemDeposito .modalAdicionarItemDepositoLabel").removeClass("fonte-vermelha");

        $("#telaRelatorioEstoqueInconsistencia #modalAdicionarItemDeposito").modal('show');
    };

    $scope.selecionaPatrimoniado = function () {
        if ($scope.objAdicionarEstoque.patrimoniado) {
            $scope.objAdicionarEstoque.quantidade = 1;
            var filtroCp = {};
            filtroCp.deposito = $scope.objAdicionarEstoque.deposito;
            filtroCp.material = $scope.objAdicionarEstoque.material;
        } else {
            $scope.objAdicionarEstoque.quantidade = null;
            $scope.objAdicionarEstoque.prefixoEquipamento = null;
        }
    };



    $scope.getAutoCompletePrefixoEquipamento = function (value) {
        var prefixoEquipamentoVo = {};
        prefixoEquipamentoVo.prefixoEquipamento = value;
        prefixoEquipamentoVo.codigoEquipamento = $scope.objAdicionarEstoque.material.codigo;
        prefixoEquipamentoVo.codigoDeposito = $scope.objAdicionarEstoque.deposito.codigo;

        //Deixado o $http no metodo por causa do then.
        return $http.post(api + '/RelatorioEstoqueInconsistencia/autoCompletePrefixoEquipamento/', prefixoEquipamentoVo).then(function (res) {
            var info = res.data;
            if (info.erro != null) {

            } else {
                return info.objeto;
            }
        });
    };

    $scope.entradaSaidaMaterialEditar = function (obj) {
        loading.loading();
        var filtroEstoqueRmaCpUnique = {};
        $scope.filtroEstoqueRmaCpUnique = {};
        $scope.filtroEstoqueRmaCpUnique.deposito = {};
        $scope.filtroEstoqueRmaCpUnique.material = {};
        $scope.objAdicionarEstoque = new FiltroRelatorioEstoqueInconsistencia().getNovoFiltroRelatorioEstoqueInconsistencia();


        $scope.filtroEstoqueRmaCpUnique.deposito.codigo = obj.codDeposito;
        $scope.filtroEstoqueRmaCpUnique.material.codigo = obj.codMaterial;
        rmRelatorioEstoqueInconsistenciaService.listarCpAndRma($scope.filtroEstoqueRmaCpUnique, retornoListarCpAndRmaEditar, trataErroServidor);
    };

    function retornoListarCpAndRmaEditar(data) {
        if (data.qtdeRma != null) {
            $scope.objAdicionarEstoque.quantidadeEstoqueRmaSelecionado = data.qtdeRma;
        } else {
            $scope.objAdicionarEstoque.quantidadeEstoqueRmaSelecionado = 0;
        }
        if (data.qtdeCpNaoPatrimoniado != null) {
            $scope.objAdicionarEstoque.quantidadeEstoqueCpSelecionado = data.qtdeCpNaoPatrimoniado;
        } else {
            $scope.objAdicionarEstoque.quantidadeEstoqueCpSelecionado = 0;
        }
        if (data.qtdeCpPatrimoniado != null) {
            $scope.objAdicionarEstoque.quantidadeEstoqueCpPatrimoniadoSelecionado = data.qtdeCpPatrimoniado;
        } else {
            $scope.objAdicionarEstoque.quantidadeEstoqueCpPatrimoniadoSelecionado = 0;
        }

        rmRelatorioEstoqueInconsistenciaService.listarMatAndDep($scope.filtroEstoqueRmaCpUnique, retornoListarMatAndDep, trataErroServidor);

        loading.ready();
    }

    function retornoListarMatAndDep(data) {
        $scope.objAdicionarEstoque.deposito = data.deposito;
        $scope.objAdicionarEstoque.material = data.material;

        $("#telaRelatorioEstoqueInconsistencia #modalAdicionarItemDeposito").modal('show');
    }

    $scope.selecionaCheckCp = function () {
        if (!$scope.objAdicionarEstoque.checkCp) {
            if ($scope.objAdicionarEstoque.patrimoniado) {
                $scope.objAdicionarEstoque.quantidade = null;
                $scope.objAdicionarEstoque.patrimoniado = false;
                $scope.objAdicionarEstoque.prefixoEquipamento = null;
            }
        }
    };

    $scope.selecionaOperacao = function () {
        if ($scope.objAdicionarEstoque.operacao != 'Saida') {
            if ($scope.objAdicionarEstoque.patrimoniado) {
                $scope.objAdicionarEstoque.quantidade = null;
                $scope.objAdicionarEstoque.patrimoniado = false;
                $scope.objAdicionarEstoque.prefixoEquipamento = null;
            }
        }
    };

    $scope.changePatrimonioSelecionado = function () {
        $scope.objAdicionarEstoque.prefixoEquipamento = $scope.objAdicionarEstoque.patrimonio;
    };

    $scope.excluirPatrimonioSelecionado = function () {
        $scope.objAdicionarEstoque.prefixoEquipamento = null;
    };

    $scope.changeMaterial = function () {
        $scope.objAdicionarEstoque.quantidadeEstoqueRmaSelecionado = null;
        $scope.objAdicionarEstoque.quantidadeEstoqueCpSelecionado = null;
        if ($scope.objAdicionarEstoque.deposito != null) {
            loading.loading();
            var filtroEstoqueRmaCpUnique = {};
            filtroEstoqueRmaCpUnique.deposito = $scope.objAdicionarEstoque.deposito;
            filtroEstoqueRmaCpUnique.material = $scope.objAdicionarEstoque.material;
            rmRelatorioEstoqueInconsistenciaService.listarCpAndRma(filtroEstoqueRmaCpUnique, retornoListarCpAndRma, trataErroServidor);
        }
    };

    $scope.changeDeposito = function () {
        $scope.objAdicionarEstoque.quantidadeEstoqueRmaSelecionado = null;
        $scope.objAdicionarEstoque.quantidadeEstoqueCpSelecionado = null;
        if ($scope.objAdicionarEstoque.material != null && $scope.objAdicionarEstoque.deposito) {
            loading.loading();
            var filtroEstoqueRmaCpUnique = {};
            filtroEstoqueRmaCpUnique.deposito = $scope.objAdicionarEstoque.deposito;
            filtroEstoqueRmaCpUnique.material = $scope.objAdicionarEstoque.material;
            rmRelatorioEstoqueInconsistenciaService.listarCpAndRma(filtroEstoqueRmaCpUnique, retornoListarCpAndRma, trataErroServidor);
        }
    };

    function retornoListarCpAndRma(data) {
        if (data.qtdeRma != null) {
            $scope.objAdicionarEstoque.quantidadeEstoqueRmaSelecionado = data.qtdeRma;
        } else {
            $scope.objAdicionarEstoque.quantidadeEstoqueRmaSelecionado = 0;
        }
        if (data.qtdeCpNaoPatrimoniado != null) {
            $scope.objAdicionarEstoque.quantidadeEstoqueCpSelecionado = data.qtdeCpNaoPatrimoniado;
        } else {
            $scope.objAdicionarEstoque.quantidadeEstoqueCpSelecionado = 0;
        }
        if (data.qtdeCpPatrimoniado != null) {
            $scope.objAdicionarEstoque.quantidadeEstoqueCpPatrimoniadoSelecionado = data.qtdeCpPatrimoniado;
        } else {
            $scope.objAdicionarEstoque.quantidadeEstoqueCpPatrimoniadoSelecionado = 0;
        }
        loading.ready();
    }

    $scope.fecharModalNovoItemDeposito = function () {
        $("#telaRelatorioEstoqueInconsistencia #modalAdicionarItemDeposito").modal('hide');
    };

    $scope.salvarAdicionarItemDeposito = function () {
        if ($scope.objAdicionarEstoque.checkRma || $scope.objAdicionarEstoque.checkCp) {
            loading.loading();
            $scope.objAdicionarEstoque.quantidadeCp = $scope.objAdicionarEstoque.quantidadeEstoqueCpSelecionado;
            rmRelatorioEstoqueInconsistenciaService.salvarEntradaSaidaEstoque($scope.objAdicionarEstoque, retornoSalvarEntradaSaidaEstoque, trataErroServidor);
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaRelatorioEstoqueInconsistencia #msg');
            $("#modalAdicionarItemDeposito .modalAdicionarItemDepositoLabel").addClass("fonte-vermelha");
        }
    };

    function retornoSalvarEntradaSaidaEstoque(data) {
        if (data.erro == null) {
            $("#telaRelatorioEstoqueInconsistencia #modalAdicionarItemDeposito").modal('hide');
        }

        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaRelatorioEstoqueInconsistencia #msg');
        loading.ready();
    }

    function retornoSalvarAdicionarItemDeposito(data) {
        $("#telaRelatorioEstoqueInconsistencia #modalAdicionarItemDeposito").modal('hide');

        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaRelatorioEstoqueInconsistencia #msg');
        loading.ready();
    }

    $scope.formataTitleInconsistencia = function (obj) {
        if (obj) {
            if (obj.inconsistenteRmaCp === true && obj.inconsistenteRmaSap === true && obj.inconsistenteCpSap === true) {
                return $scope.ResourceBundle["label_inconsistencia_geral"];
            } else if (obj.inconsistenteRmaSap === true && obj.inconsistenteCpSap === true) {
                return $scope.ResourceBundle["label_inconsistencia_rma_sap_cp"];
            } else if (obj.inconsistenteCpSap === true && obj.inconsistenteRmaCp === true) {
                return $scope.ResourceBundle["label_inconsistencia_sap_cp_rma"];
            } else if (obj.inconsistenteRmaSap == true && obj.inconsistenteRmaCp === true) {
                return $scope.ResourceBundle["label_inconsistencia_sap_rma_cp"];
            } else if (obj.inconsistenteRmaCp === true) {
                return $scope.ResourceBundle["label_inconsistencia_rma_cp"];
            } else if (obj.inconsistenteRmaSap === true) {
                return $scope.ResourceBundle["label_inconsistencia_rma_sap"];
            } else if (obj.inconsistenteCpSap === true) {
                return $scope.ResourceBundle["label_inconsistencia_cp_sap"];
            }
        }
        return "";
    };

    /**
     * Metodo responsavel por listar os itens em tela
     * @returns {undefined}
     */
    $scope.gerarXls = function () {
        loading.loading();
        var filtro = new FiltroRelatorioEstoqueInconsistencia().getFiltroRelatorioEstoqueInconsistencia($scope.filtro);
        rmRelatorioEstoqueInconsistenciaService.gerarXLS(filtro, retornoGerarXls, trataErroServidor);
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
        Util.msgShowHide('#telaRelatorioEstoqueInconsistencia #msg');
        loading.ready();
    }

    $scope.affix = function () {
        Util.affix();
    };
}