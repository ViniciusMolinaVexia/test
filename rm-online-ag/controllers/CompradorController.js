function compradorServ($scope, loading, CompradorService, AutoComplete, $timeout, Combo, AnexoService) {
    $scope.state = STATE_LISTA;

    $scope.filtro = new FiltroComprador();

    $scope.lista = [];
    $scope.listaGerarDoc = [];

    $scope.objAux = {};
    $scope.objAux.listaCheck = [];

    $scope.coletorCustos = {};

    $scope.listaRmMaterialSelecionado = [];
    $scope.listaRmMaterialDataPrevista = [];

    $scope.OPERACAO_PEP = OPERACAO_PEP;
    $scope.DIAGRAMA_DE_REDE = DIAGRAMA_DE_REDE;
    $scope.ORDEM = ORDEM;
    $scope.TIPO_REQUISICAO_MANUTENCAO = TIPO_REQUISICAO_MANUTENCAO;
    $scope.TIPO_REQUISICAO_RESP_ESTOQ = TIPO_REQUISICAO_RESP_ESTOQ;

    $scope.listaTipoRequisicao = CarregaComboTipoRequisicao(Combo);
    $scope.listaPrioridades = CarregaComboPrioridades(Combo);
    $scope.listaTodasEapMultiEmpresa = CarregaComboTodasEapMultiEmpresa(Combo);

    $scope.configuracao = UtilConfiguracao.getConfiguracaoSessao(SIGLA_MODULO);

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

    $scope.getAutoCompleteUsuario = function (value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;
        return AutoComplete.CarregaAutoCompleteUsuario(filtroAutoComplete);
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

    $scope.listar = function () {
        loading.loading();
        $scope.listaRmMaterialSelecionado = [];
        $scope.filtro.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();
        $scope.filtro.paginacaoVo.limiteConsulta = 15;
        $scope.filtro.paginacaoVo.qtdeRegPagina = 15;

        CompradorService.listar($scope.filtro, retornoListar, trataErroServidor);

        $scope.listaGerarDoc = [];
    };

    $scope.salvarConcluirComprador = function (obj) {
        if(obj.concluidaComprador != null && obj.concluidaComprador == true){
            obj.concluidaComprador = false;
        }else if (obj.concluidaComprador != null && obj.concluidaComprador == false){
            obj.concluidaComprador = true;
        }else{
            obj.concluidaComprador = true;
        }

        CompradorService.concluirComprador(obj, retornoConcluirComprador, trataErroServidor);
    };

    function retornoConcluirComprador(data) {
        if (data) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaComprador #msg');
        }
    }

    function retornoListar(data) {
    	console.log(data);
        if (data) {
        	console.log(data.itensConsulta);
            $scope.filtro.paginacaoVo = data;
            $scope.lista = data.itensConsulta;
            $scope.paginaAtiva = data.pagina;
            $scope.numPaginas = Math.ceil($scope.filtro.paginacaoVo.qtdeRegistros / $scope.filtro.paginacaoVo.limiteConsulta);
            $scope.listaRmMaterialDataPrevista = [];
            $scope.objAux.listaCheck = [];

            console.log($scope.lista);
            if (!$scope.lista) {
                loading.ready();
                return;
            }

            for (var i = 0; i < $scope.lista.length; i++) {
                $scope.objAux.listaCheck[i] = false;
            }

            //Seleciono os itens que foram marcados anteriormente
            if ($scope.listaRmMaterialSelecionado.length > 0) {
                for (var i = 0; i < $scope.lista.length; i++) {
                    for (var j = 0; j < $scope.listaRmMaterialSelecionado.length; j++) {
                        if ($scope.lista[i].rmMaterialId === $scope.listaRmMaterialSelecionado[j].rmMaterialId) {
                            $scope.objAux.listaCheck[i] = true;
                            break;
                        }
                    }
                }
            }

            //Seleciono os itens que foram marcados anteriormente
            if ($scope.listaGerarDoc && $scope.listaGerarDoc.length > 0 && $scope.lista && $scope.lista.length > 0) {
                for (var i = 0; i < $scope.lista.length; i++) {
                    for (var j = 0; j < $scope.listaGerarDoc.length; j++) {
                        if ($scope.lista[i].rmMaterialId === $scope.listaGerarDoc[j]) {
                            $scope.lista[i].gerarDoc = true;
                            break;
                        }
                    }
                }
            }
        }
        loading.ready();
    }

    $scope.abrirModalAnexoRm = function (escopo, escopoId) {
        $scope.filtroAnexo = {};
        $scope.filtroAnexo.escopo = escopo;
        $scope.filtroAnexo.escopoId = escopoId;
        AnexoService.listar($scope.filtroAnexo, retornoListarAnexoRm, trataErroServidor);
    };

    function retornoListarAnexoRm(data) {
        if (data.length === 0) {
            $scope.listaAnexo = [];
        } else {
            $scope.listaAnexo = data;
        }
        $("#telaComprador #modalAnexoCompradorRm").modal('show');
    }

    $scope.abrirModalAnexoRmMaterial = function (escopo, escopoId, numeroRequisicaoSap) {
        $scope.numeroRequisicaoSap = numeroRequisicaoSap;
        $scope.filtroAnexo = {};
        $scope.filtroAnexo.escopo = escopo;
        $scope.filtroAnexo.escopoId = escopoId;
        AnexoService.listar($scope.filtroAnexo, retornoListarAnexoRmMaterial, trataErroServidor);
    };

    function retornoListarAnexoRmMaterial(data) {
        if (data.length === 0) {
            $scope.listaAnexo = [];
        } else {
            $scope.listaAnexo = data;
            $scope.listaAnexo.numeroRequisicaoSap = $scope.numeroRequisicaoSap;
        }
        $("#telaComprador #modalAnexoCompradorRmMaterial").modal('show');
    }

    $scope.irParaPaginaEspecifica = function (pagina) {
        var paginaAtual = $scope.filtro.paginacaoVo.pagina;
        // somente irá fazer a pesquisa se clicar em uma página diferente da atual
        if (pagina !== paginaAtual) {
            loading.loading();
            $scope.filtro.paginacaoVo.pagina = pagina;
            CompradorService.listar($scope.filtro, retornoListar, trataErroServidor);
        }
    };

    $scope.limparFiltro = function () {
        $scope.filtro = new FiltroComprador();
    };

    $scope.selecionarRmMaterial = function (i, rmMaterial) {
        if (!rmMaterial.numeroRequisicaoSap && !rmMaterial.agrupadorErro) {
            var index;

            //eh preciso procurar o item na mao ao invez de utilizar o metodo
            //indexOf pois quando a lista eh recarregada, as referencias dos
            //objetos da lista antiga eh perdida
            for (var k = 0; k < $scope.listaRmMaterialSelecionado.length; k++) {
                if ($scope.listaRmMaterialSelecionado[k].rmMaterialId === rmMaterial.rmMaterialId) {
                    index = k;
                    break;
                }
            }

            if (!$scope.objAux.listaCheck[i]) {
                $scope.listaRmMaterialSelecionado.push(rmMaterial);
                $scope.objAux.listaCheck[i] = true;
            } else {
                $scope.listaRmMaterialSelecionado.splice(index, 1);
                $scope.objAux.listaCheck[i] = false;
            }
        }
    };

    $scope.selecionarGerarDoc = function (index,rmMaterial) {
        var checked = $('#checkBoxGerarDoc'+index)[0].checked;
        if(checked) {
            $scope.listaGerarDoc.push(rmMaterial.rmMaterialId);
        }else{
            for(var i = 0; i < $scope.listaGerarDoc.length;i++){
                if(rmMaterial.rmMaterialId === $scope.listaGerarDoc[i]) {
                    $scope.listaGerarDoc.splice(i,1);
                }
            }
        }
    };


    $scope.enviarParaSapConfirma = function () {
        for (var i = 0; i < $scope.listaRmMaterialSelecionado.length; i++) {
            if (!$scope.listaRmMaterialSelecionado[i].material.codigo && !$scope.listaRmMaterialSelecionado[i].isServico) {

                $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_material_sem_codigo_envio_sap'], NEW_ALERT);
                Util.msgShowHide('#telaComprador #msg');

                return;
            }
        }

        $("#telaComprador #modalConfirmarMateriais").modal('show');
    };

    $scope.enviarParaSap = function () {
        loading.loading();
        CompradorService.enviarParaSap($scope.listaRmMaterialSelecionado, retornoEnviarParaSap, trataErroServidor);
    };

    function retornoEnviarParaSap(data) {
        if (data) {
            var msg = data.mensagem ? data.mensagem : "";
            if (msg.indexOf("label_") >= 0 || msg.indexOf("msg_") >= 0) {
                $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            } else {
                $scope.alerts = Util.formataAlert(data.tipo, msg, NEW_ALERT);
            }
            Util.msgShowHide('#telaComprador #msg');
            $("#telaComprador #modalConfirmarMateriais").modal('hide');
        }

        $scope.listaRmMaterialSelecionado = [];

        CompradorService.listar($scope.filtro, retornoListar, trataErroServidor);
    }

    $scope.replicarDataPrevistaEntrega = function () {
        for (var i = 0; i < $scope.lista.length; i++) {
            $scope.lista[i].stDataPrevistaEntrega = $scope.objAux.dataPrevistaEntrega;
        }

        $scope.listaRmMaterialDataPrevista = $scope.lista;
    };

    $scope.salvarDataPrevistaEntrega = function () {
        loading.loading();
        CompradorService.salvarDataPrevisaoEntrega($scope.listaRmMaterialDataPrevista, retornoSalvarDataPrevistaEntrega, trataErroServidor);
    };

    function retornoSalvarDataPrevistaEntrega(data) {
        $scope.listaRmMaterialDataPrevista = [];
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaComprador #msg');
        loading.ready();
    }

    $scope.gerarXls = function () {
        loading.loading();
        CompradorService.geraExcel($scope.filtro, retornoGeraExcel, trataErroServidor);
    };

    function retornoGeraExcel(data) {
        Util.download(data.arquivo, data.nmAnexo, "xls");
        loading.ready();
    }

    /*
     Funções para gerar PDF conforme o resultado em tela
     */
    $scope.gerarDocumento = function() {
        loading.loading();
        CompradorService.gerarDocumento($scope.filtro, retornoGerarDocumento, trataErroServidor);
    };

    $scope.gerarDocumentoSelecionados = function() {
        loading.loading();
        $scope.filtro.idsSelecionados = $scope.listaGerarDoc;
        CompradorService.gerarDocumento($scope.filtro, retornoGerarDocumento, trataErroServidor);
    };

    function retornoGerarDocumento(info) {
        $scope.filtro.idsSelecionados = [];
        loading.ready();
        if (info && !info.erro) {
            var obj = info.objeto;
            Util.download(obj.arquivo, obj.nmAnexo, "pdf");
            $scope.listaRmMaterialSelecionado = [];
        } else {
            $scope.alerts = Util.formataAlert(info, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaComprador #msg');
        }
    }

    $scope.adicionarItemDataPrevista = function (obj) {
        if ($scope.listaRmMaterialDataPrevista.indexOf(obj) === -1) {
            $scope.listaRmMaterialDataPrevista.push(obj);
        }
    };

    //=========================================================
    //Alterar Código Material
    $scope.adicionarMaterialCodigo = function (rmMaterial) {
        $scope.objRmMaterialCodigo = new RmMaterial(rmMaterial);

        $("#telaComprador #modalAdicionarMaterialCodigo").modal('show');
    };

    $scope.salvarAdicionarMaterialCodigo = function () {
        loading.loading();
        var salvar = true;
        if($scope.objRmMaterialCodigo.justificativaAlteracaoMaterial == null || $scope.objRmMaterialCodigo.justificativaAlteracaoMaterial == ""  ) {
            salvar = false;
            $('#telaComprador #txtCodigoMat').addClass('campo-obrigatorio');
        }
        if($scope.objRmMaterialCodigo.material == null || $scope.objRmMaterialCodigo.material.codigo == null || $scope.objRmMaterialCodigo.material.codigo == ""  ) {
            salvar = false;
            $('#telaComprador #txJustificativaAddCodigo').addClass('campo-obrigatorio');
        }
        if(salvar){
            CompradorService.adicionarMaterialCodigo($scope.objRmMaterialCodigo, retornoAdicionarMaterialCodigo, trataErroServidor);
        }else{
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaComprador #msg');
        }
    };

    function retornoAdicionarMaterialCodigo(data) {
        if (data.tipo == 'success') {

            Arrays.add($scope.lista, new RmMaterial(data.objeto));

            $("#telaComprador #modalAdicionarMaterialCodigo").modal('hide');
        }
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaComprador #msg');
        loading.ready();
    }
    //=========================================================

    $scope.alterarMaterial = function (rmMaterial) {
        $scope.objAlterarMaterial = new RmMaterial(rmMaterial);
        $scope.objAlterarMaterialAux = new RmMaterial(rmMaterial);
        $scope.objAlterarMaterial.material = null;

        $("#telaComprador #modalAlterarMaterial").modal('show');
    };

    $scope.salvarAlterarMaterial = function () {
        loading.loading();
        CompradorService.alterarMaterial($scope.objAlterarMaterial, retornoSalvarAlterarMaterial, trataErroServidor);
    };

    function retornoSalvarAlterarMaterial(data) {
        Arrays.add($scope.lista, new RmMaterial(data.objeto));

        $("#telaComprador #modalAlterarMaterial").modal('hide');

        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaComprador #msg');

        loading.ready();
    }

    $scope.carregarAnexo = function (anexo) {
        loading.loading();
        AnexoService.carregarAnexo(anexo, retornoCarregarAnexo, trataErroServidor);
    };

    function retornoCarregarAnexo(data) {
        Util.download(data.anexo, data.nome);
        loading.ready();
    }

    $scope.abrirModalAtribuirComprado = function (rmMaterial) {
        $scope.materialAtribuirComprado = new RmMaterial(rmMaterial);
        $("#telaComprador #modalAtribuirComprado").modal('show');
    };

    $scope.salvarAtribuirComprado = function () {
        if (Util.validaCamposDoFormulario('frmAtribuirComprado') === 0) {
            loading.loading();
            CompradorService.salvarAtribuirComprado($scope.materialAtribuirComprado, retornoSalvarAtribuirComprado, trataErroServidor);
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaComprador #msg');
        }
    };

    function retornoSalvarAtribuirComprado(data) {
        if (data) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaComprador #msg');
            if (!data.erro) {
                $scope.listar();
            }
            $("#telaComprador #modalAtribuirComprado").modal('hide');
        }
        loading.ready();
    }

    $scope.alterarColetor = function (rmMaterial) {
        $scope.objAlterarColetor = new RmMaterial(rmMaterial);
        $scope.objAlterarColetorAux = new RmMaterial(rmMaterial);

        $("#telaComprador #modalAlterarColetor").modal('show');

        $timeout(function () {
            if ($scope.objAlterarColetor.coletorCustos) {
                $scope.coletorCustos.aux = OPERACAO_PEP;
                $scope.changeColetorCusto(OPERACAO_PEP);
            } else if ($scope.objAlterarColetor.operacao || $scope.objAlterarColetor.diagramaRede) {
                $scope.coletorCustos.aux = DIAGRAMA_DE_REDE;
                $scope.changeColetorCusto(DIAGRAMA_DE_REDE);
            } else if ($scope.objAlterarColetor.coletorOrdem) {
                $scope.coletorCustos.aux = ORDEM;
                $scope.changeColetorCusto(ORDEM);
            } else {
                $scope.changeColetorCusto(OPERACAO_PEP);
            }
        });
    };

    $scope.finalizarServico = function (obj) {
        $('#telaComprador #modalConfirmaFinalizarServico').modal('show');
        $scope.materialFinalizarIsServico = {};
        $scope.materialFinalizarIsServico = obj;
    };

    $scope.confirmaFinalizarServico = function () {
        loading.loading();

        CompradorService.finalizarIsServico($scope.materialFinalizarIsServico, retornoFinalizarIsServico, trataErroServidor);
    };

    function retornoFinalizarIsServico(data) {
        $("#telaComprador #modalConfirmaFinalizarServico").modal('hide');

        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaComprador #msg');

        $scope.materialFinalizarIsServico = {};

        $scope.listar();

        loading.ready();
    }

    $scope.changeColetorCusto = function (valor) {
        if (valor === $scope.OPERACAO_PEP) {
            exibeSeletor(true, "#compDivColetorCusto");
            exibeSeletor(false, "#compDivDiagrama");
            exibeSeletor(false, "#compDivOrdem");

            $scope.objAlterarColetor.coletorOrdem = null;
            $scope.objAlterarColetor.operacao = null;
            $scope.objAlterarColetor.diagramaRede = null;
        } else if (valor === $scope.DIAGRAMA_DE_REDE) {
            exibeSeletor(false, "#compDivColetorCusto");
            exibeSeletor(true, "#compDivDiagrama");
            exibeSeletor(false, "#compDivOrdem");

            $scope.objAlterarColetor.coletorOrdem = null;
            $scope.objAlterarColetor.coletorCustos = null;
        } else if (valor === $scope.ORDEM) {
            exibeSeletor(false, "#compDivColetorCusto");
            exibeSeletor(false, "#compDivDiagrama");
            exibeSeletor(true, "#compDivOrdem");

            $scope.objAlterarColetor.coletorCustos = null;
            $scope.objAlterarColetor.operacao = null;
            $scope.objAlterarColetor.diagramaRede = null;
        }
    };

    function exibeSeletor(op, seletor) {
        if (op) {
            $(seletor).show();
        } else {
            $(seletor).hide();
        }
    }

    $scope.salvarAlterarColetor = function () {
        //valido se o coletor possui letras e numeros
        var re = new RegExp(".*([A-Za-z][0-9]|[0-9][A-Za-z]).*");
        if ($scope.coletorCustos.aux === OPERACAO_PEP) {
            if (!re.test($scope.objAlterarColetor.coletorCustos)) {
                $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_coletor_custos_incorreto'], NEW_ALERT);
                Util.msgShowHide('#telaComprador #msg');

                $("#telaComprador #coletorCusto").addClass('campo-obrigatorio');
                return;
            } else {
                $("#telaComprador #coletorCusto").removeClass('campo-obrigatorio');
            }
        } else if ($scope.coletorCustos.aux === DIAGRAMA_DE_REDE) {
            if (!re.test($scope.objAlterarColetor.diagramaRede)) {
                $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_diagrama_rede_incorreto'], NEW_ALERT);
                Util.msgShowHide('#telaComprador #msg');

                $("#telaComprador #diagramaRede").addClass('campo-obrigatorio');
                return;
            } else {
                $("#telaComprador #diagramaRede").removeClass('campo-obrigatorio');
            }
        }

        loading.loading();
        CompradorService.alterarColetor($scope.objAlterarColetor, retornoSalvarAlterarColetor, trataErroServidor);
    };

    function retornoSalvarAlterarColetor(data) {
        Arrays.add($scope.lista, new RmMaterial(data.objeto));

        $("#telaComprador #modalAlterarColetor").modal('hide');

        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaComprador #msg');

        loading.ready();
    }

    $scope.detalharRm = function (obj) {
        loading.loading();
        CompradorService.detalharRm(obj, retornoDetalharRm, trataErroServidor);
    };

    function retornoDetalharRm(data) {
        $scope.objSelecionado = data;

        $("#telaComprador #modalDetalheRm").modal('show');

        loading.ready();
    }

    function trataErroServidor(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_ERRO_COMUNICACAO_SERVIDOR);
        Util.msgShowHide('#telaComprador #msg');
        loading.ready();
    }

    $scope.affix = function () {
        Util.affix();
    };
}