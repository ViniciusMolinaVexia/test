function administradorServ($scope, loading, AdministradorService, $timeout, AutoComplete) {
    $scope.state = STATE_LISTA;

    $scope.OPERACAO_PEP = OPERACAO_PEP;
    $scope.DIAGRAMA_DE_REDE = DIAGRAMA_DE_REDE;
    $scope.ORDEM = ORDEM;

    $scope.compra_mat = INTEGRACAO_COMPRA_MATERIAL;
    $scope.retirada_mat = INTEGRACAO_RETIRADA_MATERIAL;
    $scope.sinc_equipamento = SINC_EQUIPAMENTO;
    $scope.sinc_transf_equipamento = SINC_TRANF_EQUIPAMENTO;
    $scope.sinc_gera_cautela = SINC_GERA_CAUTELA;
    $scope.sinc_reserva = SINC_RESERVA;
    $scope.todos = TODOS;
    var SIGLA_MODULO = SIGLA_RMA;
    $scope.usuario = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);

    $scope.objColetorCusto = [];

    if (!$scope.filtro) {
        $scope.filtro = new FiltroAdministrador();
        $scope.filtro.status = $scope.todos;
        $scope.filtro.sistema = $scope.todos;
    }

    if (!$scope.lista) {
        $scope.lista = [];
    }

    $scope.getAutoCompletePessoa = function (value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;

        return AutoComplete.CarregaAutoCompletePessoas(filtroAutoComplete);
    };

    $scope.formataLabel = function (data) {
        if (data) {
            if (data.nome) {
                return data.nome;
            }
        }
        return "";
    };

    $scope.editar = function (obj) {
        loading.loading();
        AdministradorService.selectById(obj, retornoEditar, trataErroServidor);
    };

    function retornoEditar(data) {
        $scope.objSelecionado = data;
        $scope.frenteDeServico = false;

        $scope.state = STATE_MANUT;
        $("#manutAdministrador .popup-manutencao").show("fade");

        $timeout(function () {
            if ($scope.objSelecionado && $scope.objSelecionado.rmMateriais) {
                for (var i = 0; i < $scope.objSelecionado.rmMateriais.length; i++) {
                    var obj = $scope.objSelecionado.rmMateriais[i];

                    // Caso for frente de serviço exibir botões:
                    // Salvar
                    // Encaminhar estoquista
                    // Atribuir para ...
                    if (obj.rm.tipoRequisicao &&
                        obj.rm.tipoRequisicao.codigo &&
                        obj.rm.tipoRequisicao.codigo === TIPO_REQUISICAO_FRENTE_SERVICO) {
                        $scope.frenteDeServico = true;
                    }

                    if (obj.coletorCustos) {
                        $scope.objColetorCusto[i] = OPERACAO_PEP;
                        $scope.changeColetorCusto(OPERACAO_PEP, i);
                    } else if (obj.operacao || obj.diagramaRede) {
                        $scope.objColetorCusto[i] = DIAGRAMA_DE_REDE;
                        $scope.changeColetorCusto(DIAGRAMA_DE_REDE, i);
                    } else if (obj.coletorOrdem) {
                        $scope.objColetorCusto[i] = ORDEM;
                        $scope.changeColetorCusto(ORDEM, i);
                    } else {
                        $scope.changeColetorCusto(OPERACAO_PEP, i);
                    }
                }
            }
        });

        loading.ready();
    }

    $scope.listar = function () {
        loading.loading();
        var obj = $scope.filtro;
        if (obj.status === $scope.todos) {
            obj.status = "";
        }

        obj.paginacaoVo.pagina = 1;
        AdministradorService.listar(obj, retornoListar, trataErroServidor);
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
            AdministradorService.listar($scope.filtro, retornoListar, trataErroServidor);
        }
    };

    $scope.limparFiltro = function () {
        $scope.filtro = new FiltroAdministrador();
        $scope.filtro.status = $scope.todos;
        $scope.filtro.sistema = $scope.todos;
    };

    $scope.habilitarManutSap = function () {
        if ($scope.objSelecionado) {
            var func = $scope.objSelecionado.sincRegistro.funcionalidade;
            if (func == $scope.sinc_equipamento || func == $scope.sinc_transf_equipamento || func == $scope.sinc_gera_cautela || func == $scope.sinc_reserva) {
                return false;
            }
        }
        return true;
    };

    $scope.changeColetorCusto = function (valor, index) {
        if (valor === $scope.OPERACAO_PEP) {
            exibeSeletor(true, "#admDivColetorCusto" + index);
            exibeSeletor(false, "#admDivDiagrama" + index);
            exibeSeletor(false, "#admDivOrdem" + index);

            $scope.objSelecionado.rmMateriais[index].coletorOrdem = null;
            $scope.objSelecionado.rmMateriais[index].operacao = null;
            $scope.objSelecionado.rmMateriais[index].diagramaRede = null;
        } else if (valor === $scope.DIAGRAMA_DE_REDE) {
            exibeSeletor(false, "#admDivColetorCusto" + index);
            exibeSeletor(true, "#admDivDiagrama" + index);
            exibeSeletor(false, "#admDivOrdem" + index);

            $scope.objSelecionado.rmMateriais[index].coletorOrdem = null;
            $scope.objSelecionado.rmMateriais[index].coletorCustos = null;
        } else if (valor === $scope.ORDEM) {
            exibeSeletor(false, "#admDivColetorCusto" + index);
            exibeSeletor(false, "#admDivDiagrama" + index);
            exibeSeletor(true, "#admDivOrdem" + index);

            $scope.objSelecionado.rmMateriais[index].coletorCustos = null;
            $scope.objSelecionado.rmMateriais[index].operacao = null;
            $scope.objSelecionado.rmMateriais[index].diagramaRede = null;
        }
    };

    function exibeSeletor(op, seletor) {
        if (op) {
            $(seletor).show();
        } else {
            $(seletor).hide();
        }
    }

    $scope.salvar = function () {
        loading.loading();

        //valido se o coletor possui letras e numeros
        var re = new RegExp(".*([A-Za-z][0-9]|[0-9][A-Za-z]).*");
        for (var i = 0; i < $scope.objSelecionado.rmMateriais.length; i++) {
            if ($scope.objColetorCusto[i] === OPERACAO_PEP) {
                if (!re.test($scope.objSelecionado.rmMateriais[i].coletorCustos)) {
                    $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_coletor_custos_incorreto'], NEW_ALERT);
                    Util.msgShowHide('#telaAdministrador #msg');

                    $("#telaAdministrador #coletorCusto" + i).addClass('campo-obrigatorio');
                    return;
                } else {
                    $("#telaAdministrador #coletorCusto" + i).removeClass('campo-obrigatorio');
                }
            } else if ($scope.objColetorCusto[i] === DIAGRAMA_DE_REDE) {
                if (!re.test($scope.objSelecionado.rmMateriais[i].diagramaRede) || $scope.objSelecionado.rmMateriais[i].diagramaRede === null) {
                    $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_diagrama_rede_incorreto'], NEW_ALERT);
                    Util.msgShowHide('#telaAdministrador #msg');

                    $("#telaAdministrador #diagramaRede" + i).addClass('campo-obrigatorio');
                    $("#telaAdministrador #operacao" + i).addClass('campo-obrigatorio');
                    loading.ready();
                    return;
                }
                if ($scope.objSelecionado.rmMateriais[i].operacao === null) {
                    $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_operacao_incorreta'], NEW_ALERT);
                    Util.msgShowHide('#telaAdministrador #msg');

                    $("#telaAdministrador #operacao" + i).addClass('campo-obrigatorio');
                    $("#telaAdministrador #diagramaRede" + i).removeClass('campo-obrigatorio');
                    loading.ready();
                    return;
                } else {
                    $("#telaAdministrador #diagramaRede" + i).removeClass('campo-obrigatorio');
                    $("#telaAdministrador #operacao" + i).removeClass('campo-obrigatorio');
                }
            }
        }

        AdministradorService.salvar($scope.objSelecionado, retornoSalvar, trataErroServidor);
    };

    function retornoSalvar(data) {
        if (data) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaAdministrador #msg');
        }
        loading.ready();
    }

    $scope.reenviarParaSap = function () {
        loading.loading();
        AdministradorService.salvar($scope.objSelecionado, retornoSalvarReenviar, trataErroServidor);
    };

    function retornoSalvarReenviar(data) {
        if (!data.erro) {
            AdministradorService.reenviarParaSap($scope.objSelecionado.sincRegistro, retornoReenviarParaSap, trataErroServidor);
        } else {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaAdministrador #msg');

            loading.ready();
        }
    }

    $scope.desativarRegistroRetirada = function () {
        loading.loading();
        AdministradorService.desativarRegistro($scope.objSelecionado.sincRegistro, retornoDesativarRegistroRetirada, trataErroServidor);
    };

    function retornoDesativarRegistroRetirada(data) {
        4;
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaAdministrador #msg');

        $scope.listar();

        loading.ready();
        $scope.state = STATE_LISTA;
    }

    function retornoReenviarParaSap(data) {
        if (data) {
            var msg = data.mensagem;
            if (msg.indexOf("label_") >= 0 || msg.indexOf("msg_") >= 0) {
                $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            } else {
                $scope.alerts = Util.formataAlert(data.tipo, msg, NEW_ALERT);
            }
            Util.msgShowHide('#telaAdministrador #msg');

            $scope.state = STATE_LISTA;

            $scope.listar();
        }
        loading.ready();
    }

    function trataErroServidor(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_ERRO_COMUNICACAO_SERVIDOR);
        Util.msgShowHide('#telaAdministrador #msg');
        loading.ready();
    }

    $scope.affix = function () {
        Util.affix();
    };
}