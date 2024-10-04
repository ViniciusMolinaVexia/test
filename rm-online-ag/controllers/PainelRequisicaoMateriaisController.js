function painelRequisicaoMateriaisServ($scope, loading, rmAprovacaoService, RmaService, AutoComplete, Combo, $http, PainelRequisicaoMateriaisService) {

    $scope.filtro = new FiltroPainelRequisicaoMateriais();
    $scope.filtroUsuarioCadastrante;

    $scope.listaTipoRequisicao = CarregaComboTipoRequisicao(Combo);
    $scope.listaPrioridades = CarregaComboPrioridades(Combo);
    $scope.listaCentros = CarregaComboCentros(Combo);

    $scope.centroSelecionado;
    $scope.codigoDepositoSelecionado;
    $scope.grupoCompradorSelecionado;

    $scope.listaTipoRequisicao = CarregaComboTipoRequisicao(Combo);
    $scope.listaPrioridades = CarregaComboPrioridades(Combo);

    $scope.listaDepositos = [];
    $scope.listaCompradores = [];


    $scope.enviarReqMaterialSapRequest = {
        item: '',
        codigoRma: '',
        codigoMaterialSap: '',
        codigoSolicitante: '',
        nomeSolicitante: '',
        centroSap: '',
        quantidade: '',
        unidadeMedida: '',
        elementoEp: '',
        depositoSap: '',
        dataRemessa: '',
        usuarioCadastro: '',
        grupoCompradores: '',
        dataSolicitacao: '',
        grupoMercadoria: '',
        valorOrcado: '',
        codigoContratoSap: '',
        areaSap: '',
        textoItem: '',
        codigoPrioridadeSap: '',
        coletorCustos: '',
        rmId: ''
    };

    $scope.enviarSap = {
        id: '',
        centro: '',
        codCentro: '',
        numero: '',
        numeroSap: '',
        material: '',
        codMaterial: '',
        codigo: '',
        quantidade: '',
        dataEmissao: '',
        dataAplicacao: '',
        requisitante: '',
        requisitante_id: 0,
        cadastrante: '',
        fluxoMaterial: '',
        coletorCustos: '',
        dataAvaliacao: '',
        status: '',
        statusItem: '',
        tipoRequisicao: '',
        observacao: '',
        rmMaterialId: '',
        rmId: '',
        unidadeMedida: '',
        areaCodigo: '',
        depositoCodigo: '',
        textoItem: '',
        grupoMercadoria: '',
        grupoComprador:'',
        solicitante: ''
    };



    $scope.reprovar = function() {
        loading.loading();

        if (!$scope.rmMaterial.justificativaReprovacao) {
            $scope.alerts = Util.formataAlert("warning", "Informe uma justificativa para reprovar.", NEW_ALERT);
            Util.msgShowHide('#telaPainelRequisicaoMateriais #msg');
            loading.ready();
        } else {

            const request = {
                idRm: $scope.rmMaterial.rmId,
                idRmMaterial: $scope.rmMaterial.rmMaterialId,
                justificativaReprovacao: $scope.rmMaterial.justificativaReprovacao
            }

            PainelRequisicaoMateriaisService.reprovar(request, $scope.retornoReprovar, $scope.retornoErro);
        }
    };

    $scope.retornoErro = function(data) {
        $scope.alerts = Util.formataAlert("error", data.mensagem, NEW_ALERT);
        Util.msgShowHide('#telaPainelRequisicaoMateriais #msg');
        loading.ready();
    }

    $scope.retornoErro = function() {
        $scope.alerts = Util.formataAlert("error", $scope.ResourceBundle, ALERT_ERRO_COMUNICACAO_SERVIDOR);
        Util.msgShowHide('#telaPainelRequisicaoMateriais #msg');
        loading.ready();
    }

    $scope.retornoReprovar = function() {
        $("#telaPainelRequisicaoMateriais #modalEditRequisicao").modal('hide');

        $scope.listar();
        loading.ready();
        $scope.alerts = Util.formataAlert("info", "Requição de material reprovada com sucesso.", NEW_ALERT);
        Util.msgShowHide('#telaPainelRequisicaoMateriais #msg');
    }


    $scope.abrirFiltro = function() {
        $('#telaPainelRequisicaoMateriais .popup-filtro').show("fade");
        $scope.state = STATE_FILTRO;
    };

    $scope.lista = [];

    function retornoListar(data) {
        console.log(data);
        $scope.filtro.paginacaoVo = data;
        $scope.lista = data.itensConsulta;
        $scope.paginaAtiva = data.pagina;
        $scope.numPaginas = Math.ceil($scope.filtro.paginacaoVo.qtdeRegistros / $scope.filtro.paginacaoVo.limiteConsulta);
        loading.ready();

    }


    $scope.listar = function() {
        $('#telaCadastroRma .popup-filtro').hide("hide");
        if ($scope.verificaNovo === true) {
            $scope.state = STATE_MANUT;
        } else {
            $scope.state = STATE_LISTA;
        }
        loading.loading();
        $scope.filtro.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();
        $scope.filtro.paginacaoVo.limiteConsulta = 15;
        $scope.filtro.paginacaoVo.qtdeRegPagina = 15;

        if ($scope.filtro.centroSelecionado) {
            $scope.filtro.centro = $scope.filtro.centroSelecionado.codigo;
        }else{
            $scope.filtro.centro = null; 
        }


        PainelRequisicaoMateriaisService.listar($scope.filtro, retornoListar, $scope.retornoErro);
    }

    $scope.irParaPaginaEspecifica = function(pagina) {
        var paginaAtual = $scope.filtro.paginacaoVo.pagina;
        // somente irá fazer a pesquisa se clicar em uma página diferente da atual
        if (pagina !== paginaAtual) {
            loading.loading();
            $scope.filtro.paginacaoVo.pagina = pagina;
            PainelRequisicaoMateriaisService.listar($scope.filtro, $scope.retornoListar, $scope.retornoErro);
        }
    };

    $scope.verificarTipo = function(item) {
        var tipo = '';
        for (var i = 0; i < $scope.lista.length; i++) {
            if ($scope.lista[i].id != item.id) {
                if ($scope.lista[i].selected) {
                    tipo = $scope.lista[i].tipoRequisicao;
                }
            }
        }
        if (tipo != '' && tipo != item.tipoRequisicao) {
            item.selected = false;
            exibeDanger('label_apenas_requisicao_mesmo_tipo');
        }
        $scope.verificarPrioridade(item);
    }

    /**
     * Seleciona todos os resultados na tela.
     */
    $scope.selecionarTodos = function() {

        var selectedAll = document.getElementById('listaRequisicaoMateriaisSelectAll').checked;

        for (var i = 0; i < $scope.lista.length; i++) {
            $scope.lista[i].selected = selectedAll;
        }
    }

    $scope.marcarDesmarcarTodos = function() {

        if (document.getElementById('listaRequisicaoMateriaisSelectAll')) {

            var todosSelecionados = true;
            $scope.lista.forEach(item => {
                if (!item.selected) {
                    todosSelecionados = false;
                    return;
                }
            });
            document.getElementById('listaRequisicaoMateriaisSelectAll').checked = todosSelecionados;
        }
    }

    $scope.permitirSelecionarTodos = function() {
        var prioridades = [];

        for (var i = 0; i < $scope.lista.length; i++) {
            if (!prioridades.includes($scope.lista[i].prioridadeDesc) && prioridades.length > 0) {
                return false;
            }
            prioridades.push($scope.lista[i].prioridadeDesc);
        }

        if ($scope.lista.length == 0) {
            return false;
        }

        return true;
    }

    $scope.verificarPrioridade = function(item) {
        var prioridade = '';
        for (var i = 0; i < $scope.lista.length; i++) {
            if ($scope.lista[i].id != item.id) {
                if ($scope.lista[i].selected) {
                    prioridade = $scope.lista[i].prioridadeDesc;
                }
            }
        }
        if (prioridade != '' && prioridade != item.prioridadeDesc) {
            item.selected = false;
            exibeDanger('label_apenas_requisicao_mesma_prioridade');
        }
    }

    $scope.enviarParaSAP = function() {
        $scope.enviarSap = [];
        for (var i = 0; i < $scope.lista.length; i++) {
            if ($scope.lista[i].selected) {
                $scope.enviarSap.push($scope.lista[i]);
            }
        }

        console.log($scope.enviarSap);

        if ($scope.enviarSap.length > 0) {
            $("#telaPainelRequisicaoMateriais #modalConfirmarEnvioSap").modal('show');
        } else {
            $scope.alerts = Util.formataAlert("warning", "Selecione ao menos uma requisição para enviar ao SAP", NEW_ALERT);
            Util.msgShowHide('#telaPainelRequisicaoMateriais #msg');
        }
    }

    $scope.enviarParaSAPConfirmado = function() {
        loading.loading();

        /**
         * Verificar qual tipo de requisição para chamar o endpoint responsábel.
         * COMPRA / RESERVA
         */
        const reserva = $scope.enviarSap.find(requisicao => requisicao.tipoRequisicaoCodigo === 'RESERVA');

        if (typeof reserva !== 'undefined') {
            processarRequisicaoReserva();
        } else {
            processarRequisicaoCompra();
        }

    }

    function processarRequisicaoReserva() {
        var requisicoes = [];
        var request = {};

        angular.forEach($scope.enviarSap, function(req) {
            $scope.enviarReqMaterialSapRequest = {};
            request = $scope.enviarReqMaterialSapRequest;

            request.codigoRma = req.rmMaterialId;
            request.item = req.id;
            request.dataReserva = req.dataEmissao;
            request.centroSap = req.codCentro;
            request.nomeSolicitante = req.requisitante;
            request.codigoMaterialSap = req.codMaterial;
            request.quantidade = req.quantidade;
            request.unidadeMedida = req.unidadeMedida;
            request.depositoSap = req.depositoCodigo;
            request.dataNecessidade = req.dataAplicacao;
            request.usuarioCadastro = req.cadastrante;
            request.coletorCustos = req.coletorCustos;
            request.diagramaRede = req.diagramaRede;
            request.textoItem = req.nota;

            requisicoes.push(request);
        });

        PainelRequisicaoMateriaisService.enviarReservaSAP(requisicoes, $scope.enviadoSAP, $scope.enviadoSAPErro);
    }

    function processarRequisicaoCompra() {
        var requisicoes = [];
        var request = {};

        angular.forEach($scope.enviarSap, function(req) {
            $scope.enviarReqMaterialSapRequest = {};
            request = $scope.enviarReqMaterialSapRequest;
            request.item = req.id;
            request.codigoRma = req.rmMaterialId;
            request.codigoMaterialSap = req.codMaterial;
            request.codigoSolicitante = req.requisitanteId;
            request.nomeSolicitante = req.requisitante;
            request.centroSap = req.codCentro;
            request.quantidade = req.quantidade;
            request.unidadeMedida = req.unidadeMedida;
            request.elementoEp = req.elementoEp;
            request.depositoSap = req.depositoCodigo;
            request.dataRemessa = req.dataAplicacao;
            request.usuarioCadastro = req.cadastrante;
            request.grupoCompradores = req.grupoComprador;
            request.dataSolicitacao = req.dataEmissao;
            request.grupoMercadoria = req.grupoMercadoria;
            request.valorOrcado = req.valorOrcado;
            request.areaSap = req.areaCodigo;
            request.grupoMercadoria = req.grupoMercadoria;
            request.codigoPrioridadeSap = req.codigoPrioridadeSap;
            request.observacaoRm = req.observacao;
            request.coletorCustos = req.coletorCustos;
            request.diagramaRede = req.diagramaRede;
            request.textoItem = req.nota;
            request.rmId = req.rmId;
            console.log(req.rmId);
            request.codigoContratoSap = req.areaCodigo + " - " + req.numero;
            console.log(request);

            requisicoes.push(request);
            //requisicoes.push(rmMaterial.numero);
        });

        console.log(requisicoes);

        PainelRequisicaoMateriaisService.enviarSAP(requisicoes, $scope.enviadoSAP, $scope.enviadoSAPErro);
    }

    $scope.enviadoSAP = function(res) {
        loading.ready();

        console.log(res);
        var quantidadeApontamentos = res.quantidadeApontamentos;
        var message = '';

        if (quantidadeApontamentos > 0) {
            message = "Requisição enviada com (" + quantidadeApontamentos + ") apontamento(s), veja os detalhes no Log de Interface!";
        } else {
            message = "Requisição enviada com sucesso!";
        }

        console.log(message);

        $("#telaPainelRequisicaoMateriais #modalConfirmarEnvioSap").modal('hide');
        $scope.alerts = Util.formataAlert("info", message, NEW_ALERT);
        Util.msgShowHide('#telaPainelRequisicaoMateriais #msg');
        // TODO - ADRIANO, verificar se realmente precisa listar novamente;		
        $scope.listar();
    }

    $scope.enviadoSAPErro = function(res) {
        loading.ready();
        $("#telaPainelRequisicaoMateriais #modalConfirmarEnvioSap").modal('hide');
        $scope.alerts = Util.formataAlert("danger", res.data.message, NEW_ALERT);
        Util.msgShowHide('#telaPainelRequisicaoMateriais #msg');
        console.log(JSON.stringify(res.data));
    }

    function exibeDanger(msg) {
        var mensagem = { mensagem: msg, tipo: "danger" };
        $scope.alerts = Util.formataAlert(mensagem, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaPainelRequisicaoMateriais #msg');
    }

    $scope.edit = function(item) {
        $scope.rmMaterial = item;
        $scope.carregarComboDepositos();

        $("#telaPainelRequisicaoMateriais #modalEditRequisicao").modal('show');
    }

    $scope.salvarAlteracao = function() {
        console.log($scope.rmMaterial);

        if (!$scope.rmMaterial.quantidade || $scope.rmMaterial.quantidade === '' || $scope.rmMaterial.quantidade === 0) {
            $("#telaPainelRequisicaoMateriais #modalConfirmarEnvioSap").modal('hide');
            $scope.alerts = Util.formataAlert("info", "Por favor informe a quantidade!", NEW_ALERT);
            Util.msgShowHide('#telaPainelRequisicaoMateriais #msg');
        } else if (!$scope.codigoDepositoSelecionado || $scope.codigoDepositoSelecionado === '') {
            $("#telaPainelRequisicaoMateriais #modalConfirmarEnvioSap").modal('hide');
            $scope.alerts = Util.formataAlert("info", "Por favor selecione um depósito para continuar!", NEW_ALERT);
            Util.msgShowHide('#telaPainelRequisicaoMateriais #msg');
        } else {
            $scope.rmMaterial.depositoCodigo = $scope.codigoDepositoSelecionado;
            $scope.rmMaterial.grupoComprador = this.grupoCompradorSelecionado;
            PainelRequisicaoMateriaisService.salvarRequisicao($scope.rmMaterial, $scope.rmAlterada, $scope.rmAlteracaoErro);
        }

    }

    $scope.rmAlteracaoErro = function() {
        loading.ready();
        $("#telaPainelRequisicaoMateriais #modalEditRequisicao").modal('hide');
        $scope.alerts = Util.formataAlert("danger", 'Erro ao editar', NEW_ALERT);
        Util.msgShowHide('#telaPainelRequisicaoMateriais #msg');
        $scope.listar();
    }

    $scope.rmAlterada = function() {
        $("#telaPainelRequisicaoMateriais #modalEditRequisicao").modal('hide');
        $scope.listar();
    }

    //#region .:Inicio Fluxo Dar Baixa:.
    $scope.salvarBaixa = function() {
        console.log($scope.rmMaterial);

        if (!$scope.rmMaterial.numeroBaixa || $scope.rmMaterial.numeroBaixa === '' || $scope.rmMaterial.numeroBaixa === null) {
            $("#telaPainelRequisicaoMateriais #modalConfirmarEnvioSap").modal('hide');
            $scope.alerts = Util.formataAlert("info", "Por favor informe o número da baixa!", NEW_ALERT);
            Util.msgShowHide('#telaPainelRequisicaoMateriais #msg');
        } else {
            $scope.rmMaterial.depositoCodigo = $scope.codigoDepositoSelecionado;
            $scope.rmMaterial.isBaixa = true;
            PainelRequisicaoMateriaisService.salvarBaixa($scope.rmMaterial, $scope.rmBaixaSucesso, $scope.rmBaixaErro);
        }
    }

    $scope.rmBaixaErro = function() {
        loading.ready();
        $("#telaPainelRequisicaoMateriais #modalEditRequisicao").modal('hide');
        $scope.alerts = Util.formataAlert("danger", 'Erro ao editar', NEW_ALERT);
        Util.msgShowHide('#telaPainelRequisicaoMateriais #msg');
        $scope.listar();
    }

    $scope.rmBaixaSucesso = function() {
        $("#telaPainelRequisicaoMateriais #modalEditRequisicao").modal('hide');
        loading.ready();
        $scope.alerts = Util.formataAlert("info", "Requição de material baixada com sucesso.", NEW_ALERT);
        Util.msgShowHide('#telaPainelRequisicaoMateriais #msg');
        $scope.listar();
    }
    //#endregion
    
    $scope.abrirFiltro = function() {
        $('#telaPainelRequisicaoMateriais .popup-filtro').show("fade");
        $scope.state = STATE_FILTRO;
    };

    $scope.getAutoCompletePessoa = function(value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;

        return AutoComplete.CarregaAutoCompletePessoas(filtroAutoComplete);
    };

    $scope.getAutoCompleteMateriaisExistentes = function(value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;
        filtroAutoComplete.limite = 20;
        return AutoComplete.CarregaAutoCompleteMateriaisExistentes(filtroAutoComplete);
    };

    /* o autocompleto só funciona se existir esse function. (OBRIGATORIO) */
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



    $scope.carregarComboDepositos = function() {
        loading.loading();
        //Verifica se foi escolhido um deposito para o material
        if ($scope.rmMaterial) {
            // var vo = {material: $scope.rmMaterial.material, deposito: $scope.rmMaterial.deposito};
            $scope.consultaInformacoesMaterialSapRequest = {};
            $scope.consultaInformacoesMaterialSapRequest.materiais = [];
            $scope.consultaInformacoesMaterialSapRequest.centro = $scope.rmMaterial.codCentro;
            $scope.consultaInformacoesMaterialSapRequest.origem = 'PAINEL';

            if ($scope.rmMaterial.depositoCodigo) {
                $scope.consultaInformacoesMaterialSapRequest.deposito = $scope.rmMaterial.depositoCodigo;
            }

            $scope.consultaInformacoesMaterialSapRequest.materiais.push($scope.rmMaterial.codMaterial);
            // console.log(vo);
            RmaService.consultaInformacoesMaterialSap($scope.consultaInformacoesMaterialSapRequest, retornoDetalharMaterial, trataErroServidor);
        } else {
            loading.ready();
        }
    };

    //Alterado Renato
    function retornoDetalharMaterial(data) {
        // atualizar combo
        if (data && data.material && data.material.depositos) {
            $scope.listaDepositos = data.material.depositos;
        }
        if (data && data.grupoCompradores) {
            $scope.listaCompradores = data.grupoCompradores;
            $scope.listaCompradores.push({code: undefined, nome: "Selecionar"});
        }

        $scope.codigoDepositoSelecionado = $scope.rmMaterial.depositoCodigo;
        $scope.grupoCompradorSelecionado = $scope.rmMaterial.codigoGrupoComprador;
        loading.ready();
    }

    $scope.changeDeposito = function() {
        $scope.codigoDepositoSelecionado = document.getElementById('depositoCadastroRma').value;
        console.log('depositoSelecionado: ' + $scope.codigoDepositoSelecionado);
    }
    $scope.changeGrupoComprador = function() {
        $scope.grupoCompradorSelecionado = document.getElementById('grupoCompradorMaterial').value;
        console.log('grupoCompradorSelecionado: ' + $scope.grupoCompradorSelecionado);
    }

    function trataErroServidor(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_ERRO_COMUNICACAO_SERVIDOR);
        // Util.msgShowHide('#telaCadastroRma #msg');
        loading.ready();
    }

}