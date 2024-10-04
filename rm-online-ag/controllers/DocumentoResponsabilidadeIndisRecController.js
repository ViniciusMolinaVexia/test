function documentoResponsabilidadeIndisRecServ($scope, loading, AutoComplete, DocumentoResponsabilidadeIndisRecService, Combo, $timeout) {
    $scope.state = STATE_LISTA;
    $scope.listaMaterialIndisRec = [];
    $scope.listaRmMaterialSelecionado = [];
    $scope.filtroIndisRec = {};
    $scope.filtroIndisRec.tipoMaterial = 'T';
    $scope.listaDepositos = CarregaComboDepositos(Combo);
    $scope.listaTodasEapMultiEmpresa = CarregaComboTodasEapMultiEmpresa(Combo);

    $scope.configuracao = UtilConfiguracao.getConfiguracaoSessao(SIGLA_MODULO);

    $scope.listar = function () {
        loading.loading();

        $scope.listaRmMaterialSelecionado = [];

        $scope.filtroIndisRec.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();
        $scope.filtroIndisRec.paginacaoVo.limiteConsulta = 15;
        $scope.filtroIndisRec.paginacaoVo.qtdeRegPagina = 15;

        $scope.filtroIndisRec.usuario = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);
        DocumentoResponsabilidadeIndisRecService.listarRmMaterialCampo($scope.filtroIndisRec, retornoListar, trataErroServidor);
    };

    $scope.getAutoCompleteMateriaisExistentes = function (value) {
        var filtroIndisRecAutoComplete = {};
        filtroIndisRecAutoComplete.strFiltro = value;
        filtroIndisRecAutoComplete.limite = 20;

        return AutoComplete.CarregaAutoCompleteMateriaisExistentes(filtroIndisRecAutoComplete);
    };

    $scope.getAutoCompletePessoa = function (value) {
        var filtroIndisRecAutoComplete = {};
        filtroIndisRecAutoComplete.strFiltro = value;

        return AutoComplete.CarregaAutoCompletePessoas(filtroIndisRecAutoComplete);
    };

    function retornoListar(data) {
        if (data) {
            $scope.filtroIndisRec.paginacaoVo = data;
            $scope.listaMaterialIndisRec = data.itensConsulta;
            $scope.paginaAtivaIndisRec = data.pagina;
            $scope.numPaginasIndisRec = Math.ceil($scope.filtroIndisRec.paginacaoVo.qtdeRegistros / $scope.filtroIndisRec.paginacaoVo.limiteConsulta);

            //Seleciono os itens que foram marcados anteriormente
            if ($scope.listaRmMaterialSelecionado.length > 0) {
                for (var i = 0; i < $scope.listaMaterialIndisRec.length; i++) {
                    for (var j = 0; j < $scope.listaRmMaterialSelecionado.length; j++) {
                        if ($scope.listaMaterialIndisRec[i].rmMaterialId === $scope.listaRmMaterialSelecionado[j].rmMaterialId) {
                            $scope.listaMaterialIndisRec[i].selecionado = true;
                            break;
                        }
                    }
                }
            }
        }
        loading.ready();
    }

    $scope.chkMaterial = function (obj) {
        var index;
        for (var k = 0; k < $scope.listaRmMaterialSelecionado.length; k++) {
            if ($scope.listaRmMaterialSelecionado[k].rmMaterialId === obj.rmMaterialId) {
                index = k;
                break;
            }
        }

        if (obj.selecionado) {
            obj.selecionado = false;
            $scope.listaRmMaterialSelecionado.splice(index, 1);
        } else {
            obj.selecionado = true;
            $scope.listaRmMaterialSelecionado.push(obj);
        }
    };

    $scope.selecionaMaterial = function (obj, $event) {
        $event.stopPropagation();

        var index;
        for (var k = 0; k < $scope.listaRmMaterialSelecionado.length; k++) {
            if ($scope.listaRmMaterialSelecionado[k].rmMaterialId === obj.rmMaterialId) {
                index = k;
                break;
            }
        }

        if (obj.selecionado) {
            obj.selecionado = false;
            $scope.listaRmMaterialSelecionado.splice(index, 1);
        } else {
            obj.selecionado = true;
            $scope.listaRmMaterialSelecionado.push(obj);
        }
    };

    $scope.gerarDocumento = function () {
        if ($scope.listaRmMaterialSelecionado.length === 0) {
            $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['label_selecione_um_material'], NEW_ALERT);
            Util.msgShowHide('#telaDocumentoResponsabilidade #msg');
            return;
        }
        var selecionados = $scope.listaRmMaterialSelecionado.filter(function (el) {
            delete el.selecionado;
            return true;
        });

        loading.loading();
        DocumentoResponsabilidadeIndisRecService.gerarDocumento(selecionados, retornoGerarDocumento, trataErroServidor);
    };

    function retornoGerarDocumento(info) {
        loading.ready();
        if (info && !info.erro) {
            var obj = info.objeto;
            Util.download(obj.arquivo, obj.nmAnexo, "pdf");
            $scope.listar();
        } else {
            $scope.alerts = Util.formataAlert(info, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaDocumentoResponsabilidade #msg');
        }
    }

    $scope.irParaPaginaEspecificaIndisRec = function (pagina) {
        var paginaAtual = $scope.filtroIndisRec.paginacaoVo.pagina;
        // somente irá fazer a pesquisa se clicar em uma página diferente da atual
        if (pagina !== paginaAtual) {
            loading.loading();
            $scope.filtroIndisRec.paginacaoVo.pagina = pagina;
            DocumentoResponsabilidadeIndisRecService.listarRmMaterialCampo($scope.filtroIndisRec, retornoListar, trataErroServidor);
        }
    };

    $scope.limparFiltro = function () {
        $scope.filtroIndisRec = {};
        $scope.filtroIndisRec.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();
        $scope.filtroIndisRec.paginacaoVo.limiteConsulta = 15;
        $scope.filtroIndisRec.paginacaoVo.qtdeRegPagina = 15;

        $scope.filtroIndisRec.usuario = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);
        $scope.filtroIndisRec.exibirImpresso = "N";
        $scope.filtroIndisRec.tipoMaterial = 'T';
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

    function trataErroServidor(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_ERRO_COMUNICACAO_SERVIDOR);
        Util.msgShowHide('#telaDocumentoResponsabilidade #msg');
        loading.ready();
    }

    $scope.affix = function () {
        Util.affix();
    };


    //Controle de abas para a aba de PENDENTES e a aba de INDISPONIVEL/RECUSADO
    $scope.abas = function (e, aba) {
        e.preventDefault();
        $('#telaDocumentoResponsabilidade #tabTelaDocumentoResponsabilidade a[href="#' + aba + '"]').tab('hide');
    };
}