function documentoResponsabilidadePendServ($scope, loading, AutoComplete, DocumentoResponsabilidadePendService, Combo, $timeout) {
    $scope.state = STATE_LISTA;
    $scope.listaMaterial = [];
    $scope.filtro = {exibirImpresso: "N"};
    $scope.listaRmMaterialSelecionado = [];
    $scope.listaDepositos = CarregaComboDepositos(Combo);
    $scope.listaTodasEapMultiEmpresa = CarregaComboTodasEapMultiEmpresa(Combo);

    $scope.configuracao = UtilConfiguracao.getConfiguracaoSessao(SIGLA_MODULO);

    $scope.listar = function() {
        loading.loading();

        $scope.listaRmMaterialSelecionado = [];

        $scope.filtro.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();
        $scope.filtro.paginacaoVo.limiteConsulta = 15;
        $scope.filtro.paginacaoVo.qtdeRegPagina = 15;

        $scope.filtro.usuario = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);
        DocumentoResponsabilidadePendService.listarRmMaterialCampo($scope.filtro, retornoListar, trataErroServidor);
    };

    $scope.getAutoCompleteMateriaisExistentes = function(value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;
        filtroAutoComplete.limite = 20;

        return AutoComplete.CarregaAutoCompleteMateriaisExistentes(filtroAutoComplete);
    };

    $scope.getAutoCompletePessoa = function(value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;

        return AutoComplete.CarregaAutoCompletePessoas(filtroAutoComplete);
    };

    function retornoListar(data) {
        if (data) {
            $scope.filtro.paginacaoVo = data;
            $scope.listaMaterial = data.itensConsulta;
            $scope.paginaAtiva = data.pagina;
            $scope.numPaginas = Math.ceil($scope.filtro.paginacaoVo.qtdeRegistros / $scope.filtro.paginacaoVo.limiteConsulta);

            //Seleciono os itens que foram marcados anteriormente
            if ($scope.listaRmMaterialSelecionado.length > 0) {
                for (var i = 0; i < $scope.listaMaterial.length; i++) {
                    for (var j = 0; j < $scope.listaRmMaterialSelecionado.length; j++) {
                        if ($scope.listaMaterial[i].rmMaterialId === $scope.listaRmMaterialSelecionado[j].rmMaterialId) {
                            $scope.listaMaterial[i].selecionado = true;
                            break;
                        }
                    }
                }
            }
        }
        loading.ready();
    }

    $scope.chkMaterial = function(obj) {
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

    $scope.selecionaMaterial = function(obj, $event) {
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

    $scope.gerarDocumento = function() {
        if ($scope.listaRmMaterialSelecionado.length === 0) {
            $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['label_selecione_um_material'], NEW_ALERT);
            Util.msgShowHide('#telaDocumentoResponsabilidade #msg');
            return;
        }
        var selecionados = $scope.listaRmMaterialSelecionado.filter(function(el) {
            delete el.selecionado;
            return true;
        });

        loading.loading();
        DocumentoResponsabilidadePendService.gerarDocumento(selecionados, retornoGerarDocumento, trataErroServidor);
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

    $scope.irParaPaginaEspecifica = function(pagina) {
        var paginaAtual = $scope.filtro.paginacaoVo.pagina;
        // somente irá fazer a pesquisa se clicar em uma página diferente da atual
        if (pagina !== paginaAtual) {
            loading.loading();
            $scope.filtro.paginacaoVo.pagina = pagina;
            DocumentoResponsabilidadePendService.listarRmMaterialCampo($scope.filtro, retornoListar, trataErroServidor);
        }
    };

    $scope.limparFiltro = function() {
        $scope.filtro = {};
        $scope.filtro.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();
        $scope.filtro.paginacaoVo.limiteConsulta = 15;
        $scope.filtro.paginacaoVo.qtdeRegPagina = 15;

        $scope.filtro.usuario = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);
        $scope.filtro.exibirImpresso = "N";
    };

    $scope.formataLabel = function(data) {
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

    $scope.affix = function() {
        Util.affix();
    };


    //Controle de abas para a aba de PENDENTES e a aba de INDISPONIVEL/RECUSADO
    $scope.abas = function (e, aba) {
        e.preventDefault();
        $('#telaDocumentoResponsabilidade #tabTelaDocumentoResponsabilidade a[href="#' + aba + '"]').tab('hide');
    };
}