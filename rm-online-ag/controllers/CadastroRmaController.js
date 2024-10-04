function cadastroRmaServ($scope, loading, RmaService, ObterSaldoRmMaterialService, ObterAprovadoresRmMaterialService,
    AutoComplete, rmAprovacaoService, BuscarEstoqueMaterialService, Combo, AnexoService, $timeout, $modal) {
    $scope.state = STATE_LISTA;
    $scope.OPERACAO_PEP = OPERACAO_PEP;
    $scope.DIAGRAMA_DE_REDE = DIAGRAMA_DE_REDE;
    $scope.ORDEM = ORDEM;
    $scope.ESTOQUE = ESTOQUE;
    $scope.FALSE = false;
    $scope.SAP = "SAP";
    var SIGLA_MODULO = SIGLA_RMA;
    $scope.status = "";

    $scope.depositosSelecionados = [];
    $scope.listaStatus = [];
    $scope.listaDetalheMaterial = [];
    $scope.modelEstoqueMaterial = {
        nomeDeposito: '',
        quantidade: 0
    };

    $scope.listaDepositosNaoSelecionados = [];
    $scope.materialSimilarSelecionado = null;
    $scope.filtroMateriaisSimilares = {};
    $scope.listaAtribuirCompradores = [];
    $scope.objAtribuirComprador = {};
    $scope.objColetorCusto = { valor: $scope.SAP };
    $scope.coletorCustosCadastroRma = {};

    $scope.bloquearCampos = false;
    $scope.bloqueiaBotaoCancelarRm = false;
    $scope.bloqueiaBotaoCancelarRmStatus = false;
    $scope.verificaNovo = false;


    $scope.consultaInformacoesMaterialSapRequest = {
        centro: '',
        deposito: '',
        materiais: []
    };


    //Seta o material no vo para enviar antes de cadastrar, pois o metodo foi alterado para 1 vo
    $scope.cadastraMaterial = {};

    $scope.listaPrioridades = CarregaComboPrioridades(Combo);
    $scope.listaTipoRequisicao = CarregaComboTipoRequisicao(Combo);
    $scope.listaGerentesObra = CarregaComboGerenteObra(Combo);
    $scope.listaComboStatus = CarregaComboStatus(Combo);
    $scope.listaComboComprador = CarregaComboComprador(Combo);
    $scope.comboGerenteCusto = CarregaComboGerenteCustos(Combo);
    $scope.comboCoordenador = CarregaComboEquipeCustos(Combo);
    $scope.comboUnidadeMedida = CarregaComboUnidadeMedida(Combo);
    $scope.listaEapMultiEmpresa = CarregaComboEapMultiEmpresa(Combo);
    $scope.listaTodasEapMultiEmpresa = CarregaComboTodasEapMultiEmpresa(Combo); //RETIRAR
    $scope.listaCentros = CarregaComboCentros(Combo);

    $scope.depositoSelecionado = '';
    $scope.listaDepositos = [];
    //$scope.listaAreas = CarregaComboAreas(Combo);
    $scope.painelCadastrarServico = false;
    $scope.painelCadastrarMaterial = true;

    $scope.configuracao = UtilConfiguracao.getConfiguracaoSessao(SIGLA_MODULO);

    $scope.filtro = new FiltroCadastroRma();
    $scope.filtro.usuario = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);
    $scope.lista = [];
    $scope.listaRmMateriais = [];
    $scope.rmMaterial = {};
    $scope.habilitaEnvioAprovacaoCoordenador = true;
    $scope.validacao = {};
    $scope.bloqueiaBtSalvarServico = false;
    $scope.usuario = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);
    $scope.ROLE_REQUISITANTE_CORPORATIVO = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_REQUISITANTE_CORPORATIVO);
    $scope.ROLE_REQUISITANTE = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_REQUISITANTE);
    $scope.ROLE_ADMINISTRADOR = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_ADMINISTRADOR);
    $scope.filtro.naoExibirComComprador = true;
    $scope.servico = {};
    $scope.usuariosAprovadores = [];
    $scope.aprovadorEscolhido = {};
    $scope.aprovador = {};
    $scope.objSelecionado = {};

    $scope.aprovadoresRmMaterial = {};

    $scope.rmFornecedorServico = function(index) {
        console.log(index);
        $scope.servico.fornecedores.splice(index, 1);
    }

    $scope.addFornecedorServico = function() {
        if (!$scope.servico.fornecedores) {
            $scope.servico.fornecedores = [];
        }
        var fornecedor = {};
        fornecedor.fornecedor = $scope.servico.cadFornecedor;
        fornecedor.telefone = $scope.servico.cadTelefone;
        fornecedor.email = $scope.servico.cadEmail;
        fornecedor.pessoaContato = $scope.servico.cadPessoaContato;
        $scope.servico.fornecedores.push(fornecedor);
        console.log($scope.servico.fornecedores);
        $scope.servico.cadFornecedor = '';
        $scope.servico.cadTelefone = '';
        $scope.servico.cadEmail = '';
        $scope.servico.cadPessoaContato = '';
    }

    $scope.depositoCarregado = function(data) {
        $scope.listaDepositos = data;
    }

    $scope.atualizarDepositos = function(centro) {
        if (centro) {
            CarregaComboAreas(Combo, centro.idioma).then(function(listaFiltrada) {
                $scope.listaAreas = listaFiltrada; // Atribui a lista filtrada ao escoposs
            }).catch(function(error) {
                console.error('Erro ao carregar áreas:', error);
            });
    
            RmaService.listarDepositosDoCentro(centro.centroId, $scope.depositoCarregado, trataErroServidor);
        }
    }

    function CarregaComboAreas(Combo, idioma) {
        return new Promise((resolve, reject) => {
            Combo.listarAreas(function(result) {
                // Filtra a lista com base no idioma fornecido
                const listaFiltrada = result.filter(function(area) {
                    return area.idioma === idioma; // Filtra por idioma
                });
                resolve(listaFiltrada); // Resolve a Promise com a lista filtrada
            });
        });
    }

    $scope.atualizarDepositosPorId = function(centroId) {
        if (centroId) {
            RmaService.listarDepositosDoCentro(centroId, $scope.depositoCarregado, trataErroServidor);
        }
    }

    $scope.changeArea = function() {
        if ($scope.objSelecionado && $scope.objSelecionado.rm.area) {
            $scope.changeDataAplicacao();
        }
    }

    $scope.cadastrarServico = function() {
        $scope.painelCadastrarMaterial = false;
        $scope.painelCadastrarServico = true;
    }

    $scope.cadastrarMaterial = function() {
        $scope.painelCadastrarServico = false;
        $scope.painelCadastrarMaterial = true;
    }

    $scope.getAutoCompletePessoa = function(value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;

        return AutoComplete.CarregaAutoCompletePessoas(filtroAutoComplete);
    };

    $scope.getAutoCompleteRequisitante = function(value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;

        if ($scope.configuracao.habilitaEapMultiEmpresa != null && $scope.configuracao.habilitaEapMultiEmpresa == true) {
            if ($scope.objSelecionado.rm != null && $scope.objSelecionado.rm.eapMultiEmpresa != null) {
                filtroAutoComplete.objetoFiltro = $scope.objSelecionado.rm.eapMultiEmpresa.id;
            }
        }

        return AutoComplete.CarregaAutoCompletePessoas(filtroAutoComplete);
    };

    $scope.getAutoCompleteCoordenadores = function(value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;
        if ($scope.configuracao.habilitaEapMultiEmpresa != null && $scope.configuracao.habilitaEapMultiEmpresa == true) {
            if ($scope.objSelecionado.rm != null && $scope.objSelecionado.rm.eapMultiEmpresa != null) {
                filtroAutoComplete.objetoFiltro = $scope.objSelecionado.rm.eapMultiEmpresa.id;
            }
        }
        return AutoComplete.CarregaAutoCompleteCoordenadores(filtroAutoComplete);
    };

    $scope.getAutoCompleteResponsavelRetiradaEstoque = function(value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;
        if ($scope.configuracao.habilitaEapMultiEmpresa != null && $scope.configuracao.habilitaEapMultiEmpresa == true) {

            if ($scope.objSelecionado.rm != null && $scope.objSelecionado.rm.eapMultiEmpresa != null) {
                filtroAutoComplete.objetoFiltro = $scope.objSelecionado.rm.eapMultiEmpresa.id;
            }
        }
        return AutoComplete.CarregaAutoCompleteResponsavelRetiradaEstoque(filtroAutoComplete);
    };

    $scope.getAutoCompleteGerenteAreaEncarregado = function(value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;
        if ($scope.objEnviarAprovacao && $scope.objEnviarAprovacao.rm && $scope.objEnviarAprovacao.rm.eapMultiEmpresa && $scope.objEnviarAprovacao.rm.eapMultiEmpresa.id > 0) {
            filtroAutoComplete.objetoFiltro = '{eapMultiEmpresaId:' + $scope.objEnviarAprovacao.rm.eapMultiEmpresa.id + '}';
            //filtroAutoComplete.objetoFiltro.eapMultiEmpresaId = $scope.objEnviarAprovacao.rm.eapMultiEmpresa.id;
        } else if ($scope.objLista && $scope.objLista.rmEapMultiEmpresaId) {
            filtroAutoComplete.objetoFiltro = '{eapMultiEmpresaId:' + $scope.objLista.rmEapMultiEmpresaId + '}';
        }
        return AutoComplete.CarregaAutoCompleteGerenteAreaEncarregado(filtroAutoComplete);
    };

    $scope.getAutoCompleteMateriais = function(value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;

        return AutoComplete.CarregaAutoCompleteMateriais(filtroAutoComplete);
    };

    $scope.getAutoCompleteMateriaisCadastroRma = function(value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;
        filtroAutoComplete.tipoRequisicao = $scope.objSelecionado.rm.tipoRequisicao;
        filtroAutoComplete.codigoCentro = $scope.objSelecionado.rm.centro.codigo;

        return AutoComplete.CarregaAutoCompleteMateriaisCadastroRma(filtroAutoComplete);
    };

    $scope.getAutoCompleteMateriaisExistentes = function(value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;
        filtroAutoComplete.limite = 20;
        return AutoComplete.CarregaAutoCompleteMateriaisExistentes(filtroAutoComplete);
    };

    $scope.limparCampoRequisitante = function() {
        $scope.objSelecionado.rm.requisitante = null;
    };

    $scope.editar = function(obj) {
        $scope.copiaTipoRequisicao = null;
        $scope.verificarStatus(obj);
        loading.loading();
        var objEnviar = {};
        objEnviar.rmId = obj.rmRmId;
        $scope.atualizarDepositosPorId(obj.centroId);
        RmaService.listarRm(objEnviar, retornoEditar, trataErroServidor);
    };

    function retornoEditar(data) {
        $scope.objSelecionado = data;
        $scope.rmMaterial = {};
        console.log(data);

        if (data.rmDepositos) {
            for (var i = 0; i < data.rmDepositos.length; i++) {
                for (var j = 0; j < $scope.listaDepositos.length; j++) {
                    if ($scope.listaDepositos[j].depositoId === data.rmDepositos[i].deposito.depositoId) {
                        $scope.listaDepositos[j].selected = true;
                    }
                }
            }
        }
        console.log($scope.status);
        if ($scope.status == "Env" || $scope.status == "Rep") {
            $scope.bloquearCampos = false;
        } else {
            $scope.bloquearCampos = true;
        }

        if ($scope.itemSelecionado && $scope.itemSelecionado.rmMaterialStatus &&
            $scope.itemSelecionado.rmMaterialStatus.status) {

            if ($scope.itemSelecionado.rmMaterialStatus.status.codigo && ((
                    $scope.itemSelecionado.rmMaterialStatus.status.codigo === 'Can' || $scope.itemSelecionado.rmMaterialStatus.status.codigo === 'Fim' ||
                    $scope.itemSelecionado.rmMaterialStatus.status.codigo === 'AgRet' || $scope.itemSelecionado.rmMaterialStatus.status.codigo === 'MatComAgRec' ||
                    $scope.itemSelecionado.rmMaterialStatus.status.codigo === 'RecParc' || $scope.itemSelecionado.rmMaterialStatus.status.codigo === 'Rec' ||
                    $scope.itemSelecionado.rmMaterialStatus.status.codigo === 'SolicTransf' || $scope.itemSelecionado.rmMaterialStatus.status.codigo === 'Indisp' ||
                    $scope.itemSelecionado.rmMaterialStatus.status.codigo === 'RetParc'))) {
                $scope.bloqueiaBotaoCancelarRmStatus = true;
                $scope.bloqueiaBotaoCancelarMaterialStatus = true;
            } else {
                $scope.bloqueiaBotaoCancelarRmStatus = false;
                $scope.bloqueiaBotaoCancelarMaterialStatus = false;
            }
        }

        for (var i = 0; i < $scope.objSelecionado.rmMateriais.length; i++) {
            if ($scope.objSelecionado.rmMateriais[i].numeroRequisicaoSap) {
                $scope.bloqueiaBotaoCancelarRm = true;
            } else {
                $scope.bloqueiaBotaoCancelarRm = false;
            }
        }

        $scope.validarBotoesCadastroMaterial();

        $scope.tipoRequisicaoAnterior = $scope.objSelecionado.rm.tipoRequisicao;
        $scope.state = STATE_MANUT;
        $("#manutCadastroRma .popup-manutencao").show("fade");
        loading.ready();
        $scope.setarRmMaterialDepositoAutomatico();
        console.log($scope.objSelecionado.rm.tipoRequisicao);
    }

    $scope.validarEstoqueMateriais = function() {

        if ($scope.objSelecionado.rm.tipoRequisicao && $scope.objSelecionado.rm.tipoRequisicao.codigo === 'RESERVA') {
            loading.loading();

            //Verifica se foi escolhido um deposito para o material
            if ($scope.rmMaterial) {

                // montar request
                var materiais = [];
                var centro = $scope.objSelecionado.rm.centro.codigo;

                // preencher materiais
                if ($scope.objSelecionado.rmMateriais.length > 0) {
                    for (var i = 0; i < $scope.objSelecionado.rmMateriais.length; i++) {
                        var rmMaterial = $scope.objSelecionado.rmMateriais[i];
                        var material = rmMaterial.material;
                        var deposito = rmMaterial.deposito;
                        var request = {};

                        request.codigoMaterial = material.codigo;
                        request.nomeMaterial = material.nome;
                        request.quantidade = rmMaterial.quantidade;

                        if (centro) {
                            request.centro = centro;
                        }

                        if (deposito) {
                            request.codigoDeposito = deposito.codigo;
                            request.nomeDeposito = deposito.nome;
                        }

                        materiais.push(request);
                    }
                }
                BuscarEstoqueMaterialService.validarEstoqueMaterial(materiais, retornoValidarEstoqueMateriais, trataErroServidor);
            } else {
                loading.ready();
            }
        } else {
            $scope.salvar();
        }
    }

    function retornoValidarEstoqueMateriais(data) {

        if (data && data.mensagem !== '' && data.mensagem !== 'Validação realizada com sucesso.') {
            $scope.alerts = Util.formataAlert("warning", data.mensagem, NEW_ALERT);
            Util.msgShowHide('#telaCadastroRma #msg');
        } else {
            $scope.salvar();
        }

        loading.ready();

    }

    $scope.salvar = function() {

        var setaFlagEnviarAprov = $scope.enviarParaAprovacaoFlag;
        $scope.enviarParaAprovacaoFlag = false;

        $scope.objSelecionado.rm.deposito = $scope.depositoSelecionado;


        //Verifica os campos obrigatorios do formulario principal
        if (Util.validaCamposDoFormulario("#telaCadastroRma #formManutencao") === 0) {
            if ($scope.painelCadastrarServico) {
                $scope.objSelecionado.rmServico = $scope.servico;
                console.log($scope.objSelecionado);
                loading.loading();
                RmaService.salvar($scope.objSelecionado, retornoSalvar, trataErroServidor);
            } else {
                if ($scope.objSelecionado.rmMateriais.length > 0) {

                    var bloquearPorValidacaoRmMaterial = false;
                    for (var i = 0; i < $scope.objSelecionado.rmMateriais.length; i++) {
                        var input = "#telaCadastroRma #manutCadastroRmaMaterialObservacao" + i;
                        if (!$scope.objSelecionado.rmMateriais[i].observacao) {
                            if (!$scope.objSelecionado.rmMateriais[i].coletorEstoque) {
                                $(input).addClass("campo-obrigatorio");
                                bloquearPorValidacaoRmMaterial = true;
                            }
                        }

                        if (!$scope.objSelecionado.rmMateriais[i].localEntrega) {
                            if ($scope.objSelecionado.rm.localEntrega) {
                                $scope.objSelecionado.rmMateriais[i].localEntrega = $scope.objSelecionado.rm.localEntrega;
                            } else {
                                if ($scope.objSelecionado.rm.centro.codigo !== 'WMG2') {
                                    $("#telaCadastroRma #manutCadastroRmaMaterialLocalEntrega" + i).addClass("campo-obrigatorio");
                                    bloquearPorValidacaoRmMaterial = true;
                                }
                            }
                        }

                        if ($scope.objSelecionado.rmMateriais[i].quantidade <= 0) {
                            if ($scope.objSelecionado.rm.quantidade) {
                                $("#telaCadastroRma #manutCadastroRmaMaterialQtde" + i).addClass("campo-obrigatorio");
                                bloquearPorValidacaoRmMaterial = true;
                            }
                        }
                    }

                    if (bloquearPorValidacaoRmMaterial) {
                        $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
                        Util.msgShowHide('#telaCadastroRma #msg');
                        return;
                    }

                    var listaAux = [];
                    for (var i = 0; i < $scope.listaDepositos.length; i++) {
                        if ($scope.listaDepositos[i].selected) {
                            var encontrado = false;
                            for (var j = 0; j < $scope.objSelecionado.rmDepositos.length; j++) {
                                if ($scope.objSelecionado.rmDepositos[j].deposito.depositoId === $scope.listaDepositos[i].depositoId) {
                                    listaAux.push($scope.objSelecionado.rmDepositos[j]);
                                    encontrado = true;
                                    break;
                                }
                            }

                            if (encontrado === false) {
                                var rmDeposito = { deposito: new Deposito($scope.listaDepositos[i]) };
                                listaAux.push(rmDeposito);
                            }
                        }
                    }
                    $scope.objSelecionado.rmDepositos = listaAux;
                    $scope.msgPrioridade = null;

                    if (setaFlagEnviarAprov) {
                        $scope.enviarParaAprovacaoFlag = setaFlagEnviarAprov;
                    }

                    console.log($scope.objSelecionado);
                    loading.loading();
                    RmaService.salvar($scope.objSelecionado, retornoSalvar, trataErroServidor);
                } else {
                    $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_qtde_minima_rm_materiais'], NEW_ALERT);
                    Util.msgShowHide('#telaCadastroRma #msg');
                }
            }
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaCadastroRma #msg');
        }
    };

    function retornoSalvar(data) {
        if (data) {
            $scope.objSelecionado = data.objeto;
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaCadastroRma #msg');

            //E necessario chamar o listar para atualizar a lista com a nova rma cadastrada,
            //pois trabalhamos com tipo de objetos diferentes.
            //E relistar nao e pesado, pois traz 20 registro paginados.
            if ($scope.listaRma && $scope.listaRma.length > 0) {
                $scope.verificaNovo = true;
                $scope.listar();
            }

            if ($scope.enviarParaAprovacaoFlag) {
                $scope.verificaValidacoes($scope.objVerificaValidacoes);
            }
        }
        $scope.validarBotoesCadastroMaterial();
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

        //alert($scope.objSelecionado.rm.centro);
        //alert($scope.objSelecionado.rm.centroId);
        //alert($scope.objSelecionado.rm.centro.centroId);
        //$scope.filtro.eapMultiEmpresa = $scope.objSelecionado.rm.centro.centroId;



        //alert($scope.filtro.)

        $scope.verificaNovo = false;
        RmaService.listarConsultaRma($scope.filtro, retornoListar, trataErroServidor);
    };

    async function retornoListar(data) {
        console.log(data);
        
        if (data) {
            $scope.filtro.paginacaoVo = data;
            $scope.listaRma = data.itensConsulta || [];
            $scope.paginaAtiva = data.pagina;
            $scope.possuiRoleVisualizarTodasRm = false;
    
            // Valida os botões de cadastro de material
            $scope.validarBotoesCadastroMaterial();
    
            // Array para armazenar os resultados das chamadas
            let statusResultados = [];
    
            for (let i = 0; i < $scope.listaRma.length; i++) {
                let rmMaterial = {};
                rmMaterial.rmMaterialId = $scope.listaRma[i].rmMaterialRmMaterialId;
    
                try {
                    // Espera pela resposta da API
                    let status = await RmaService.listarStatusRmMaterial(rmMaterial).$promise;
                    
                    if (status && status.length > 4) {
                        console.log("Índice 4:", status[4]);
                        $scope.listaRma[i].DataMigo = status[4].dataHoraStatus
                    }
                } catch (erro) {
                    trataErroServidor(erro); // Trata erro da API
                }
    
                // Lógica para calcular qtdReceber
                if ($scope.listaRma[i].tipoRequisicaoCodigo === "TIP_RET_EM_ESTOQ" ||
                    $scope.listaRma[i].tipoRequisicaoCodigo === "TIP_RET_ESTOQUISTA" ||
                    $scope.listaRma[i].tipoRequisicaoCodigo === "TIP_REQ_FRE_SER" ||
                    $scope.listaRma[i].materialIsServico === 1) {
                    $scope.listaRma[i].qtdReceber = null;
                } else if ($scope.listaRma[i].rmMaterialQuantidade < $scope.listaRma[i].qtdeRecebida) {
                    $scope.listaRma[i].qtdReceber = 0;
                } else {
                    $scope.listaRma[i].qtdReceber = $scope.listaRma[i].rmMaterialQuantidade - $scope.listaRma[i].qtdeRecebida;
                }
            }
    
            $("#selTdAtrComp").prop("checked", false);
    
            $scope.numPaginas = Math.ceil($scope.filtro.paginacaoVo.qtdeRegistros / $scope.filtro.paginacaoVo.limiteConsulta);
            obterAprovadoresRmMaterial();
        }
        
        loading.ready();
    }
    

    function obterAprovadoresRmMaterial() {

        var request = new Array();

        angular.forEach($scope.listaRma, function(res) {
            let item = {};
            item.idRm = res.rmRmId;
            item.idRmMaterial = res.rmMaterialRmMaterialId;
            request.push(item);
        });

        ObterAprovadoresRmMaterialService.obter(request, retornoObterAprovadoresRmMaterial, trataErroServidor);
    }

    function obterSaldoRmMaterial() {

        var request = new Array();

        angular.forEach($scope.listaRma, function(res) {
            request.push(res.rmMaterialRmMaterialId);
        });

        ObterSaldoRmMaterialService.obterSaldoRmMaterial(request, retornoObterSaldoRmMaterial, trataErroSaldoRmMaterial);
    }

    function trataErroSaldoRmMaterial(data) {
        console.log(data);
    }

    function retornoObterAprovadoresRmMaterial(data) {

        var mapMateriais = [];

        angular.forEach($scope.listaRma, function(rma) {
            mapMateriais[rma.rmMaterialRmMaterialId] = rma;
        });

        if (data) {
            angular.forEach(data, function(statusMaterial) {
                var tmp = mapMateriais[statusMaterial.idRmMaterial];
                if (tmp) {
                    tmp.nomeAprovCoordenador = statusMaterial.nomeAprovCoordenador;
                    tmp.dataAprovCoordenador = statusMaterial.dataAprovCoordenador;

                    tmp.nomeAprovGerenteArea = statusMaterial.nomeAprovGerenteArea;
                    tmp.dataAprovGerenteArea = statusMaterial.dataAprovGerenteArea;

                    tmp.nomeAprovGerenteCustos = statusMaterial.nomeAprovGerenteCusto;
                    tmp.dataAprovGerenteCustos = statusMaterial.dataAprovGerenteCusto;

                    tmp.nomeAprovMaquinaParada = statusMaterial.nomeAprovMaquinaParada;
                    tmp.dataAprovMaquinaParada = statusMaterial.dataAprovMaquinaParada;
                    mapMateriais[statusMaterial.idRmMaterial] = tmp;
                }
            });
        }

        obterSaldoRmMaterial();
    }

    function retornoObterSaldoRmMaterial(data) {

        var mapMateriais = [];

        angular.forEach($scope.listaRma, function(rma) {
            mapMateriais[rma.rmMaterialRmMaterialId] = rma;
        });

        if (data) {
            angular.forEach(data, function(saldoRmMaterial) {
                var tmp = mapMateriais[saldoRmMaterial.idRmMaterial];
                if (tmp) {
                    tmp.quantidadeSolicitada = saldoRmMaterial.quantidadeSolicitada;
                    tmp.quantidadeComprada = saldoRmMaterial.quantidadeComprada;
                    tmp.quantidadeRecebida = saldoRmMaterial.quantidadeRecebida;
                    tmp.saldoAReceber = saldoRmMaterial.saldoAReceber;
                    mapMateriais[saldoRmMaterial.idRmMaterial] = tmp;
                }
            });
        }
    }

    $scope.validarBotoesCadastroMaterial = function() {
        $scope.possuiRoleLeituraTodasRm = false;
        if ($scope.filtro.usuario && $scope.objSelecionado && $scope.objSelecionado.rm && $scope.objSelecionado.rm.usuario) {
            if ($scope.filtro.usuario.usuarioId == $scope.objSelecionado.rm.usuario.usuarioId) {
                return "";
            }
        }

        for (i = 0; i < $scope.filtro.usuario.roles.length; i++) {
            if ($scope.filtro.usuario.roles[i].nome == "LEITURA_TODAS_RM") {
                for (j = 0; j < $scope.listaRma.length; j++) {
                    if ($scope.listaRma[j].usuarioUsuarioId != $scope.filtro.usuario.usuarioId) {
                        $scope.possuiRoleLeituraTodasRm = true;
                    }
                }
            } else if ($scope.filtro.usuario.roles[i].nome == "CONSULTAR_TODAS_RM") {
                $scope.possuiRoleVisualizarTodasRm = true;
            }
        }
    }

    $scope.irParaPaginaEspecifica = function(pagina) {
        var paginaAtual = $scope.filtro.paginacaoVo.pagina;
        // somente ira fazer a pesquisa se clicar em uma pagina diferente da atual
        if (pagina !== paginaAtual) {
            loading.loading();
            $scope.filtro.paginacaoVo.pagina = pagina;
            RmaService.listarConsultaRma($scope.filtro, retornoListar, trataErroServidor);
        }
    };

    $scope.limparFiltro = function() {
        $scope.filtro = new FiltroCadastroRma();
        $scope.filtro.usuario = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);
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

    $scope.salvarRetiradaEstoquista = function() {
        loading.loading();
        var listaAux = [];
        for (var i = 0; i < $scope.listaDepositos.length; i++) {
            if ($scope.listaDepositos[i].selected) {
                var encontrado = false;
                for (var j = 0; j < $scope.objSelecionado.rmDepositos.length; j++) {
                    if ($scope.objSelecionado.rmDepositos[j].deposito.depositoId === $scope.listaDepositos[i].depositoId) {
                        listaAux.push($scope.objSelecionado.rmDepositos[j]);
                        encontrado = true;
                        break;
                    }
                }

                if (encontrado === false) {
                    var rmDeposito = { deposito: new Deposito($scope.listaDepositos[i]) };
                    listaAux.push(rmDeposito);
                }
            }
        }
        $scope.objSelecionado.rmDepositos = listaAux;

        RmaService.salvarRequisicaoRetiradaEstEstoquista($scope.objSelecionado, retornoSalvarRetiradaEstoquista, trataErroServidor);
    };

    function retornoSalvarRetiradaEstoquista(data) {
        $("#telaCadastroRma #modalAprovadorRma").modal('hide');
        $scope.objSelecionado = data.objeto;
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaCadastroRma #msg');
        if ($scope.objSelecionado && $scope.objSelecionado.rm) {
            $scope.objSelecionado.rm.dataEnvioAprovacao = new Date();
        }
        $scope.bloquearCampos = true;
        RmaService.listarConsultaRma($scope.filtro, retornoListar, trataErroServidor);
        loading.ready();

    }

    $scope.novo = function() {
        $scope.servico = {};
        $scope.limpaCampoSap();
        //Seta os check's da requisição de manutenção
        $scope.objColetorCusto.valor = "SAP";

        $scope.objSelecionado = {};
        $scope.objSelecionado.rm = {};

        $scope.possuiRoleLeituraTodasRm = false;
        //Seta tipo de requisição automático
        $scope.objSelecionado.rm.tipoRequisicao = null;
        $scope.tipoRequisicaoAnterior = null;
        if ($scope.listarTipoRequisicaoByUsuario != null) {
            for (var i = 0; i < $scope.listarTipoRequisicaoByUsuario.length; i++) {
                if ($scope.USUARIO_MANUTENCAO && $scope.listarTipoRequisicaoByUsuario[i].codigo === 'TIP_REQ_MANUTENCAO') {
                    $scope.objSelecionado.rm.tipoRequisicao = $scope.listarTipoRequisicaoByUsuario[i];
                    break;
                } else if ($scope.listarTipoRequisicaoByUsuario[i].codigo === 'TIP_REQ_MAT') {
                    $scope.objSelecionado.rm.tipoRequisicao = $scope.listarTipoRequisicaoByUsuario[i];
                }
            }
        }

        $scope.objSelecionado.rmMateriais = [];
        $scope.objSelecionado.rmDepositos = [];
        $scope.objSelecionado.rm.usuario = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);
        $scope.rmMaterial = {};

        $scope.bloquearCampos = false;
        $scope.listaDepositos = [];
        $scope.copiaTipoRequisicao = null;
        var usuario = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);
        console.log(usuario);
        $scope.objSelecionado.rm.centro = usuario.centro;
        console.log($scope.objSelecionado.rm.centro);
        $scope.objSelecionado.rm.area = usuario.area;

        $scope.atualizarDepositos($scope.objSelecionado.rm.centro);
    };

    $scope.setarComboRequisicao = function() {
        $scope.objSelecionado.rm.tipoRequisicao = $scope.tipoRequisicaoAnterior;
    };

    $scope.excluirListaRmMateriais = function() {
        $scope.copiaTipoRequisicao = null;
        $scope.objSelecionado.rmMateriais = [];
        $scope.tipoRequisicaoAnterior = $scope.objSelecionado.rm.tipoRequisicao;
    };

    $scope.limparRmMaterial = function() {
        $scope.indexTelaRmMaterial = null;
        $scope.rmMaterial = {};
        $scope.objColetorCusto = {};
        $scope.setarRmMaterialDepositoAutomatico();
    }

    $scope.salvarRmMaterial = function() {

        if (!$scope.objSelecionado.rm.tipoRequisicao) {
            $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_campo_tipo_requisicao_nao_informado'], NEW_ALERT);
            Util.msgShowHide('#telaCadastroRma #msg');
            return;
        }

        var inputVlrOrcado = document.getElementById("manutCadastroValorOrcado");
        var inputVlrQtde = document.getElementById("manutCadastroRmaQuantidade");
        var inputDepositoEntrega = document.getElementById("manutCadastroRmaDepositoEntrega");
        var inputObsMat = document.getElementById("manutCadastroObservacao");
        inputVlrOrcado.classList.remove("campo-obrigatorio");
        inputVlrQtde.classList.remove("campo-obrigatorio");
        inputDepositoEntrega.classList.remove("campo-obrigatorio");

        var vlrQtde = inputVlrQtde.value;
        var vlrValorOrcado = inputVlrOrcado.value;

        vlrQtde = parseFloat(vlrQtde);
        vlrValorOrcado = parseFloat(vlrValorOrcado);


        if (!vlrQtde || vlrQtde <= 0.0 || (vlrValorOrcado <= 0.0)) {

            if (!vlrQtde || vlrQtde <= 0.0) {
                inputVlrQtde.className += " campo-obrigatorio"
                $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
                Util.msgShowHide('#telaCadastroRma #msg');
            }

            if (vlrValorOrcado <= 0.0) {
                inputVlrOrcado.className += " campo-obrigatorio"
                $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
                Util.msgShowHide('#telaCadastroRma #msg');
            }

        } else {

            inputVlrOrcado.classList.remove("campo-obrigatorio");
            inputVlrQtde.classList.remove("campo-obrigatorio");
            if (Util.validaCamposDoFormulario("#telaCadastroRma #formManutencaoMateriais") === 0) {
                //TODO - essa validação de estoque não deve ser feita no frontend é responsabilidade do SAP fazer isso!
                // if($scope.objSelecionado.rm.tipoRequisicao.codigo == 'ESTOQUE'){
                // 	var possuiEstoque = false;
                // 	for(var i=0;i<$scope.listaDetalheMaterial.length;i++){
                // 		console.log($scope.listaDetalheMaterial[i]);
                // 		if($scope.listaDetalheMaterial[i]){
                // 			if($scope.rmMaterial.deposito.depositoId == $scope.listaDetalheMaterial[i].deposito.depositoId){
                // 				if($scope.listaDetalheMaterial[i].quantidade >= $scope.rmMaterial.quantidade){
                // 					possuiEstoque = true;
                // 				}
                // 			}
                // 		}
                // 	}
                // 	if(!possuiEstoque){
                // 		$scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_ESTOQUE_INSUFICIENTE);
                // 		Util.msgShowHide('#telaCadastroRma #msg');
                // 		return;
                // 	}
                // }
                var rmMaterial = new RmMaterial($scope.rmMaterial);

                if (!rmMaterial.deposito) {
                    var inputDepositoEntrega = document.getElementById("manutCadastroRmaDepositoEntrega");
                    inputDepositoEntrega.className += " campo-obrigatorio"

                    $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
                    Util.msgShowHide('#telaCadastroRma #msg');
                    return;
                } else {
                    var inputDepositoEntrega = document.getElementById("manutCadastroRmaDepositoEntrega");
                    inputDepositoEntrega.classList.remove("campo-obrigatorio");
                }

                rmMaterial.observacao = "";
                if (!(rmMaterial.ordem > 0)) {
                    rmMaterial.ordem = $scope.objSelecionado.rmMateriais.length + 1;
                }

                if (!rmMaterial.coletorCustos && !rmMaterial.diagramaRede && $scope.objSelecionado.rm.tipoRequisicao && $scope.objSelecionado.rm.tipoRequisicao.codigo === 'RESERVA') {
                    $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_coletor_custos_ou_elemento_pep_nao_informado'], NEW_ALERT);
                    Util.msgShowHide('#telaCadastroRma #msg');
                    return;
                }

                if (rmMaterial.coletorCustos != null) {
                    rmMaterial.diagramaRede = null;
                    rmMaterial.operacao = null;
                    rmMaterial.coletorOrdem = null;
                    rmMaterial.observacao = "Elemento PEP: " + rmMaterial.observacao + rmMaterial.coletorCustos;
                }

                if (rmMaterial.diagramaRede != null) {
                    rmMaterial.coletorCustos = null;
                    rmMaterial.coletorOrdem = null;
                    rmMaterial.observacao = "Centro de custo:" + rmMaterial.observacao + rmMaterial.diagramaRede;
                }

                if (rmMaterial.operacao != null) {
                    rmMaterial.coletorCustos = null;
                    rmMaterial.coletorOrdem = null;
                    rmMaterial.observacao = rmMaterial.observacao + "-" + rmMaterial.operacao;
                }

                if (rmMaterial.coletorOrdem != null) {
                    rmMaterial.diagramaRede = null;
                    rmMaterial.operacao = null;
                    rmMaterial.coletorCustos = null;
                    rmMaterial.observacao = "Estoque: " + rmMaterial.coletorOrdem;
                }

                if (!rmMaterial.observacao) {
                    rmMaterial.observacao = " ";
                }
                if (!rmMaterial.localEntrega) {
                    rmMaterial.localEntrega = $scope.objSelecionado.rm.localEntrega;
                }

                rmMaterial.nota = inputObsMat.value;
                
                if (!$scope.objSelecionado.rmMateriais) {
                    $scope.objSelecionado.rmMateriais = [];
                }
                if ($scope.indexTelaRmMaterial != null && $scope.indexTelaRmMaterial >= 0) {
                    $scope.objSelecionado.rmMateriais.splice($scope.indexTelaRmMaterial, 1, rmMaterial);
                } else {
                    $scope.objSelecionado.rmMateriais.unshift(rmMaterial);
                }


                $scope.indexTelaRmMaterial = null;
                $scope.rmMaterial = {};
                $scope.objColetorCusto = {};
                $scope.setarRmMaterialDepositoAutomatico();
            } else {
                $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
                Util.msgShowHide('#telaCadastroRma #msg');
            }
        }

    }


    $scope.setarRmMaterialDepositoAutomatico = function() {

        if ($scope.listaDepositos && !$scope.rmMaterial.deposito) {
            var qtdeSelected = 0;
            var depositoSelected = null;
            for (var i = 0; i < $scope.listaDepositos.length; i++) {
                if ($scope.listaDepositos[i].selected) {
                    qtdeSelected++;
                    depositoSelected = $scope.listaDepositos[i];
                }
            }
            if (qtdeSelected === 1 && depositoSelected) {
                $scope.rmMaterial.deposito = depositoSelected;
            }
        }

    }


    $scope.tipoRequisicaoEstoque = function() {

        //Verificar se tem deposito selecionado.
        var alertaSelecionarDeposito = false;
        for (var i = 0; i < $scope.listaDepositos.length; i++) {
            if ($scope.listaDepositos[i].selected) {
                alertaSelecionarDeposito = false;
                break;
            } else {
                alertaSelecionarDeposito = true;
            }
        }
        if (alertaSelecionarDeposito) {
            $scope.alerts = Util.formataAlert("danger", Util.setParamsLabel($scope.ResourceBundle['msg_seleciona_deposito_req_estoque']), NEW_ALERT);
            Util.msgShowHide('#telaCadastroRma #msg');
            return;
        } else {
            //Se caso for do tipo de requisicao em estoque e com deposito selecionado, então o mesmo
            ////precisa verificar se tem mat nesses depoisitos antes de adicionar o item.
            loading.loading();
            var vo = {};
            vo.material = $scope.rmMaterial.material;
            var lista = [];

            for (var i = 0; i < $scope.listaDepositos.length; i++) {
                var rmDeposito = { deposito: new Deposito($scope.listaDepositos[i]) };
                lista.push(rmDeposito);
            }

            vo.rmDepositos = lista;
        }
        RmaService.listarInformacoesMaterial(vo, retornoVerificaMatDepReqTipoEstoque, trataErroServidor);
    };

    function retornoVerificaMatDepReqTipoEstoque(data) {

        var countTemQuantidadeMenor = 0;
        var countTotal = 0;
        var materialTemDeposito = false;
        var quantidade = parseFloat($scope.rmMaterial.quantidade);

        for (var i = 0; i < $scope.objSelecionado.rmMateriais.length; i++) {
            if ($scope.objSelecionado.rmMateriais[i].material.codigo === $scope.rmMaterial.material.codigo) {
                quantidade = quantidade + parseFloat($scope.objSelecionado.rmMateriais[i].quantidade);
            }
        }

        if ($scope.objSelecionado.rm.tipoRequisicao.codigo === "TIP_RET_EM_ESTOQ" || $scope.objSelecionado.rm.tipoRequisicao.codigo === "TIP_RET_ESTOQUISTA") {
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < $scope.listaDepositos.length; j++) {
                    if ($scope.listaDepositos[j].selected) {
                        if ($scope.listaDepositos[j].depositoId === data[i].deposito.depositoId) {
                            if (quantidade <= data[i].quantidade) {
                                countTemQuantidadeMenor = countTemQuantidadeMenor + 1;
                            }
                            countTotal = countTotal + 1;
                        }
                    }
                }
            }
        }

        if (countTemQuantidadeMenor > 0) {
            materialTemDeposito = true;
        }

        if (!materialTemDeposito) {
            var voRm = {};
            voRm.rm = new Rm($scope.objSelecionado.rm);
            voRm.rmMaterial = new RmMaterial($scope.rmMaterial);
            voRm.rmMaterial.quantidade = Number(quantidade);

            RmaService.verificarDepositosEstoque(voRm, retornoValidarQuantidadeDepositosEstoque, trataErroServidor);

        } else { //Se caso estiver já em deposito, com a quantia, então o mesmo só adiciona normalmente.
            if (Util.validaCamposDoFormulario("#telaCadastroRma #formManutencaoMateriais") === 0) {
                if ($scope.rmMaterial.quantidade <= 0) {
                    $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_material_quantidade_zero'], NEW_ALERT);
                    Util.msgShowHide('#telaCadastroRma #msg');

                    return;
                }
                if (!$scope.rmMaterial.material.materialId) {
                    $scope.rmMaterial.material = null;

                    return;
                }
                var rmMaterial = new RmMaterial($scope.rmMaterial);
                rmMaterial.ordem = $scope.objSelecionado.rmMateriais.length + 1;
                if (!rmMaterial.observacao) {
                    rmMaterial.observacao = $scope.objSelecionado.rm.observacao;
                }
                if (!rmMaterial.localEntrega) {
                    rmMaterial.localEntrega = $scope.objSelecionado.rm.localEntrega;
                }

                Arrays.add($scope.objSelecionado.rmMateriais, rmMaterial);
                $scope.rmMaterial = {};
                $scope.setarRmMaterialDepositoAutomatico();

                //Seta o focus para o autocomplete do material
                $("#manutCadastroRmaMaterial").focus();
            } else {
                $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
                Util.msgShowHide('#telaCadastroRma #msg');
            }
            loading.ready();
        }
    }

    function retornoValidarQuantidadeDepositosEstoque(data) {
        //Se caso for maior que zero, então tem o item no deposito, então abro o modal ...
        if (data.depositosComQuantidade.length > 0) {
            $scope.listaDepositosNaoSelecionados = data.depositosComQuantidade;
            $("#telaCadastroRma #modalInfDepos").modal('show');
        }
        //Se caso vier com 0, quer dizer que o item não possui em nenhum deposito, então informo ao user.
        else {
            $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['label_item_indisponivel_nos_depositos_selecionados'], NEW_ALERT);
            Util.msgShowHide('#telaCadastroRma #msg');
        }
        loading.ready();
    }

    $scope.alterarColetorDeCustos = function(obj) {

        var rmMaterial = {};
        $scope.materialAux = obj.materialNome;
        rmMaterial.rmMaterialId = obj.rmMaterialRmMaterialId;
        rmMaterial.operacao = obj.rmMaterialOperacao;
        rmMaterial.diagramaRede = obj.rmMaterialDiagramaRede;
        rmMaterial.elementoPep = obj.rmMaterialElementoPep;
        rmMaterial.coletorCustos = obj.rmMaterialColetorCustos;
        rmMaterial.coletorEstoque = obj.rmMaterialColetorEstoque;
        rmMaterial.coletorOrdem = obj.rmMaterialColetorOrdem;

        $scope.objAlterarColetorCadastroRma = new RmMaterial(rmMaterial);
        $scope.objAlterarColetorAuxCadastroRma = new RmMaterial(rmMaterial);

        $("#telaCadastroRma #modalAlterarColetorCadastroRma").modal('show');

        $timeout(function() {
            if ($scope.objAlterarColetorCadastroRma.coletorCustos) {
                $scope.coletorCustosCadastroRma.aux = OPERACAO_PEP;
                $scope.alteraColetorCusto(OPERACAO_PEP);
            } else if ($scope.objAlterarColetorCadastroRma.operacao || $scope.objAlterarColetorCadastroRma.diagramaRede) {
                $scope.coletorCustosCadastroRma.aux = DIAGRAMA_DE_REDE;
                $scope.alteraColetorCusto(DIAGRAMA_DE_REDE);
            } else if ($scope.objAlterarColetorCadastroRma.coletorOrdem) {
                $scope.coletorCustosCadastroRma.aux = ORDEM;
                $scope.alteraColetorCusto(ORDEM);
            } else {
                $scope.alteraColetorCusto(OPERACAO_PEP);
            }
        });
    };

    function exibeSeletor(op, seletor) {
        if (op) {
            $(seletor).show();
        } else {
            $(seletor).hide();
        }
    }

    $scope.alterarMaterial = function(deposito) {
        $scope.rmMaterial.material = deposito.material;

        for (var i = 0; i < $scope.listaDepositos.length; i++) {
            if (!$scope.listaDepositos[i].selected) {
                if (deposito.deposito.nome === $scope.listaDepositos[i].nome) {
                    $scope.listaDepositos[i].selected = true;
                }
            }
        }


        if (Util.validaCamposDoFormulario("#telaCadastroRma #formManutencaoMateriais") === 0) {
            if ($scope.rmMaterial.quantidade <= 0) {
                $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_material_quantidade_zero'], NEW_ALERT);
                Util.msgShowHide('#telaCadastroRma #msg');

                return;
            }
            if (!$scope.rmMaterial.material.materialId) {
                $scope.rmMaterial.material = null;

                return;
            }
            var rmMaterial = new RmMaterial($scope.rmMaterial);
            rmMaterial.ordem = $scope.objSelecionado.rmMateriais.length + 1;
            if (!rmMaterial.observacao) {
                rmMaterial.observacao = $scope.objSelecionado.rm.observacao;
            }
            if (!rmMaterial.localEntrega) {
                rmMaterial.localEntrega = $scope.objSelecionado.rm.localEntrega;
            }

            Arrays.add($scope.objSelecionado.rmMateriais, rmMaterial);
            $scope.rmMaterial = {};
            $scope.setarRmMaterialDepositoAutomatico();

            //Seta o focus para o autocomplete do material
            $("#manutCadastroRmaMaterial").focus();
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaCadastroRma #msg');
        }
        loading.ready();

        $("#telaCadastroRma #modalInfDepos").modal('hide');
    };

    $scope.removerRmMaterial = function(obj) {
        $scope.objSelecionado.rmMateriais.splice(obj, 1);

        var i = $scope.objSelecionado.rmMateriais.length;
        i = i - 1;
        var contador = 1;
        for (i; i >= 0; i--) {
            $scope.objSelecionado.rmMateriais[i].ordem = contador++;
        }
    };

    $scope.salvarAntesDeEnviar = function() {
        var alertaSelecionarDeposito = false;
        if ($scope.objSelecionado.rm.tipoRequisicao.codigo === "TIP_RET_EM_ESTOQ" || $scope.objSelecionado.rm.tipoRequisicao.codigo === "TIP_RET_ESTOQUISTA") {
            for (var i = 0; i < $scope.listaDepositos.length; i++) {
                if ($scope.listaDepositos[i].selected) {
                    alertaSelecionarDeposito = false;
                    break;
                } else {
                    alertaSelecionarDeposito = true;
                }
            }
        }

        if (alertaSelecionarDeposito) {
            $scope.alerts = Util.formataAlert("danger", Util.setParamsLabel($scope.ResourceBundle['msg_seleciona_deposito_req_estoque']), NEW_ALERT);
            Util.msgShowHide('#telaCadastroRma #msg');
            return;
        }

        if (Util.validaCamposDoFormulario("#telaCadastroRma #formManutencao") === 0) {
            if ($scope.objSelecionado.rmMateriais.length > 0) {

                var bloquearPorValidacaoRmMaterial = false;
                for (var i = 0; i < $scope.objSelecionado.rmMateriais.length; i++) {
                    var input = "#telaCadastroRma #manutCadastroRmaMaterialObservacao" + i;
                    if (!$scope.objSelecionado.rmMateriais[i].observacao) {
                        $(input).addClass("campo-obrigatorio");
                        bloquearPorValidacaoRmMaterial = true;
                    }

                    if (!$scope.objSelecionado.rmMateriais[i].localEntrega) {
                        if ($scope.objSelecionado.rm.localEntrega) {
                            $scope.objSelecionado.rmMateriais[i].localEntrega = $scope.objSelecionado.rm.localEntrega;
                        } else {
                            $("#telaCadastroRma #manutCadastroRmaMaterialLocalEntrega" + i).addClass("campo-obrigatorio");
                            bloquearPorValidacaoRmMaterial = true;
                        }
                    }

                    if ($scope.objSelecionado.rmMateriais[i].coletorEstoque == true) {
                        if (!$scope.objSelecionado.rmMateriais[i].observacao) {
                            $(input).removeClass("campo-obrigatorio");
                            bloquearPorValidacaoRmMaterial = false;
                        }
                    }
                }

                if (bloquearPorValidacaoRmMaterial) {
                    $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
                    Util.msgShowHide('#telaCadastroRma #msg');
                    return;
                }

                var listaAux = [];
                for (var i = 0; i < $scope.listaDepositos.length; i++) {
                    if ($scope.listaDepositos[i].selected) {
                        var encontrado = false;
                        for (var j = 0; j < $scope.objSelecionado.rmDepositos.length; j++) {
                            if ($scope.objSelecionado.rmDepositos[j].deposito.depositoId === $scope.listaDepositos[i].depositoId) {
                                listaAux.push($scope.objSelecionado.rmDepositos[j]);
                                encontrado = true;
                                break;
                            }
                        }

                        if (encontrado === false) {
                            var rmDeposito = { deposito: new Deposito($scope.listaDepositos[i]) };
                            listaAux.push(rmDeposito);
                        }
                    }
                }
                $scope.objSelecionado.rmDepositos = listaAux;

                loading.loading();
                RmaService.salvar($scope.objSelecionado, validarQuantidadeDepositos, trataErroServidor);

            } else {
                $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_qtde_minima_rm_materiais'], NEW_ALERT);
                Util.msgShowHide('#telaCadastroRma #msg');
            }

        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaCadastroRma #msg');
        }
    };

    $scope.validarQuantidadeDepositos = function(data) {
        $scope.objEnviarAprovacao = {};
        $scope.objEnviarAprovacao.rm = data.rm;
        RmaService.verificarDepositos(data.rm, retornoValidarQuantidadeDepositos, trataErroServidor);
    };

    $scope.verificaValidacoes = function(data) {
        $scope.objVerificaValidacoes = data;
        $("#telaCadastroRma #modalAprovadorRma").modal('hide');
        $scope.enviarParaAprovacaoFlag = true;
        $scope.salvar();
    };

    $scope.enviarAprovacao = function(data) {
        $scope.objVerificaValidacoes = data;
        $("#telaCadastroRma #modalAprovadorRma").modal('hide');
        $scope.enviarParaAprovacaoFlag = true;

    };

    function validarQuantidadeDepositos(data) {
        $scope.objSelecionado = data.objeto;
        $scope.objEnviarAprovacao = {};
        $scope.objEnviarAprovacao.rm = $scope.objSelecionado.rm;
        RmaService.verificarDepositos($scope.objSelecionado.rm, retornoValidarQuantidadeDepositos, trataErroServidor);
    }

    function retornoValidarQuantidadeDepositos(data) {
        if (data.depositosComQuantidade.length > 0) {
            $scope.listaDepositosNaoSelecionados = data.depositosComQuantidade;
            if (data.materiaisCauteladosEmEstoque.length > 0) {
                $scope.listaMateriaisCauteladosEmDeposito = data.materiaisCauteladosEmEstoque;
            } else {
                $scope.listaMateriaisCauteladosEmDeposito = null;
            }
            if (($scope.objSelecionado.rm.tipoRequisicao.codigo !== "TIP_RET_EM_ESTOQ")) {
                $("#telaCadastroRma #modalJustificativaDepositosRma").modal('show');
            } else {
                $scope.objEnviarAprovacao.rm.justificativaEnvioAprovacao = null;
                $scope.abrirModalSelecionarAprovadorRRE();
            }
        } else if (data.materiaisCauteladosEmEstoque.length > 0) {
            $scope.listaMateriaisCauteladosEmDeposito = data.materiaisCauteladosEmEstoque;
            $("#telaCadastroRma #modalJustificativaMateriaisCauteladosEmDeposito").modal('show');
        } else {
            $scope.listaMateriaisCauteladosEmDeposito = null;
            $scope.objEnviarAprovacao.rm.justificativaEnvioAprovacao = null;
            $scope.objEnviarAprovacao.rm.justMateriaisCautelados = null;
            $scope.abrirModalSelecionarAprovadorMateriaisCautelados();
        }
        loading.ready();
    }

    /*
     *   APROVAÇÃO COORDENADOR - valida se a aprovação vai para o coordenador ou gerente
     */
    $scope.validarAprovacaoCoordenador = function() {
        console.log('+ + + validarAprovacaoCoordenador');
        $scope.habilitaEnvioAprovacaoCoordenador = true;
        if ($scope.objEnviarAprovacao && $scope.objEnviarAprovacao.rm && $scope.objEnviarAprovacao.rm.eapMultiEmpresa &&
            $scope.objEnviarAprovacao.rm.eapMultiEmpresa.aprovacaoCoordenador &&
            $scope.objEnviarAprovacao.rm.eapMultiEmpresa.aprovacaoCoordenador === false) {
            $scope.habilitaEnvioAprovacaoCoordenador = false;
        } else if ($scope.objEnviarAprovacao && $scope.objEnviarAprovacao.rm) {
            RmaService.validarAprovacaoCoordenador($scope.objSelecionado.rm, retornoValidarAprovacaoCoordenador, trataErroServidor);
        }
    };

    function retornoValidarAprovacaoCoordenador(data) {
        $scope.habilitaEnvioAprovacaoCoordenador = data.objeto;
    }

    $scope.abrirModalSelecionarAprovadorRRE = function() {
        $scope.validarAprovacaoCoordenador();
        $("#telaCadastroRma #modalJustificativaDepositosRma").modal('hide');
        $("#telaCadastroRma #modalAprovadorRmaRRE").modal('show');
    };

    $scope.abrirModalSelecionarAprovadorMateriaisCautelados = function() {
        $("#telaCadastroRma #modalJustificativaDepositosRma").modal('hide');
        if ($scope.listaMateriaisCauteladosEmDeposito && $scope.listaMateriaisCauteladosEmDeposito.length > 0) {
            $("#telaCadastroRma #modalJustificativaMateriaisCauteladosEmDeposito").modal('show');
        } else {
            $scope.validarAprovacaoCoordenador();
            $("#telaCadastroRma #modalAprovadorRma").modal('show');
        }
    };

    $scope.abrirModalSelecionarAprovador = function() {
        $scope.validarAprovacaoCoordenador();
        $("#telaCadastroRma #modalJustificativaMateriaisCauteladosEmDeposito").modal('hide');
        $("#telaCadastroRma #modalAprovadorRma").modal('show');
    };

    $scope.abrirModalMateriaisCauteladosEmDeposito = function() {
        $("#telaCadastroRma #modalJustificativaDepositosRma").modal('hide');
        $("#telaCadastroRma #modalAprovadorRma").modal('hide');
        if ($scope.listaMateriaisCauteladosEmDeposito && $scope.listaMateriaisCauteladosEmDeposito.length > 0) {
            $("#telaCadastroRma #modalJustificativaMateriaisCauteladosEmDeposito").modal('show');
        }
    };

    $scope.fecharModalAprovadorRma = function() {
        $("#telaCadastroRma #modalAprovadorRma").modal('hide');
        $scope.aprovador = {};
        $scope.rmId = 0;
    };

    $scope.fecharModalAprovadorRRE = function() {
        $("#telaCadastroRma #modalAprovadorRmaRRE").modal('hide');
    };

    $scope.fecharModalMateriaisCauteladosEmDeposito = function() {
        $("#telaCadastroRma #modalJustificativaMateriaisCauteladosEmDeposito").modal('hide');
        if ($scope.objEnviarAprovacao.rm.justificativaEnvioAprovacao) {
            $("#telaCadastroRma #modalJustificativaDepositosRma").modal('show');
        }
    };

    $scope.preencherAprovadores = function(data) {
        $scope.usuariosAprovadores = data;
        console.log(data);
    };

    $scope.escolherAprovador = function(rmId) {
        $scope.rmId = rmId;
        $("#telaCadastroRma #modalAprovadorRma").modal('show');
        Combo.listarAprovadoresRm(rmId, $scope.preencherAprovadores, trataErroServidor);
    };

    $scope.enviarParaAprovacao = function() {
        $("#telaCadastroRma #modalAprovadorRma").modal('hide');
        var temp = {};
        temp.rm = {};
        temp.rm.rmId = $scope.rmId;
        temp.usuario = $scope.aprovador;
        RmaService.mandarAprovar(temp, $scope.teste, $scope.testeErro);
    };

    $scope.teste = function(data) {
        $("#telaCadastroRma #modalAprovadorRma").modal('hide');
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaCadastroRma #msg');
        if ($scope.objSelecionado && $scope.objSelecionado.rm) {
            $scope.objSelecionado.rm.dataEnvioAprovacao = new Date();
        }
        $scope.bloquearCampos = true;
        RmaService.listarConsultaRma($scope.filtro, retornoListar, trataErroServidor);
    }
    $scope.testeErro = function(data) {
        console.log(data);
    }

    $scope.marcarAprovador = function(aprovador) {
        $scope.aprovador = aprovador;
    };

    $scope.detalharStatus = function(obj) {
        loading.loading();
        var rmMaterial = {};
        rmMaterial.rmMaterialId = obj.rmMaterialRmMaterialId;
        RmaService.listarStatusRmMaterial(rmMaterial, retornoDetalharStatus, trataErroServidor);
    };
    


    $scope.verificarStatus = function(obj) {
        var rmMaterial = {};
        rmMaterial.rmMaterialId = obj.rmMaterialRmMaterialId;
        RmaService.listarStatusRmMaterial(rmMaterial, retornoVerificarStatus, trataErroServidor);
    };

    $scope.anexarShow = function() {
        $("#telaCadastroRma #modalAnexarShow").modal('show');
    };

    $scope.fecharAnexarShow = function() {
        $("#telaCadastroRma #modalAnexarShow").modal('hide');
    };

    function retornoDetalharStatus(data) {
        console.log(data);
        $("#telaCadastroRma #modalDetalheStatusRma").modal('show');
        if (data && data.length > 0) {
            var ultimaFase = data[data.length - 1];
            var penultimaFase = data[data.length - 2];
            if (ultimaFase.status.codigo === "Rep") {
                ultimaFase.dataHoraStatus = penultimaFase.dataHoraStatus;
            } else if (ultimaFase.status.codigo === "Apr") {
                ultimaFase.dataHoraStatus = penultimaFase.dataHoraStatus;
            }

            data[data.length - 1] = ultimaFase;

            for (t = 0; t < data.length; t++) {
                if (data[t].status.codigo === "Rep") {
                    data.splice(t - 1, 1);
                }
            }
        }
        $scope.listaStatus = data;
        var progressbar = $("#telaCadastroRma #progressbarDiv");
        progressbar[0].style.width = 10 + $scope.listaStatus.length * 100 + 'px';
        if (data && data.length > 0) {
            var lastStatus = data[(data.length) - 1];
            $scope.status = lastStatus.status.codigo;
            if (lastStatus.status.codigo === "Rep") {
                RmaService.verificaReprovador(lastStatus.rmMaterial.rm, retornoVerificaReprovador, trataErroServidor);
            }
            if (data[0].rmMaterial.dataPrevistaEntrega) {
                $scope.mensagemDataPrevistaChegada = " - Prev. Entrega: " + data[0].rmMaterial.stDataPrevistaEntrega;
            } else {
                $scope.mensagemDataPrevistaChegada = "";
            }
        }
        loading.ready();
    }


    function retornoVerificarStatus(data) {
        if (data && data.length > 0) {
            var lastStatus = data[(data.length) - 1];
            $scope.status = lastStatus.status.codigo;
        }
    }


    $scope.formataStatusReprovadoPor = function(status) {
        var repPor = "";
        if (status.rmMaterial.rm.reprovadoPor === "GA") {
            repPor = $scope.ResourceBundle["label_gerente_area"];
        } else if (status.rmMaterial.rm.reprovadoPor === "GC") {
            repPor = $scope.ResourceBundle["label_gerente_custos"];
        } else if (status.rmMaterial.rm.reprovadoPor === "GO") {
            repPor = $scope.ResourceBundle["label_gerente_obra"];
        } else if (status.rmMaterial.rm.reprovadoPor === "CO") {
            repPor = $scope.ResourceBundle["label_coordenador"];
        } else if (status.rmMaterial.rm.reprovadoPor === "LC") {
            repPor = $scope.ResourceBundle["label_lider_custos"];
        } else if (status.rmMaterial.rm.reprovadoPor === "C") {
            repPor = $scope.ResourceBundle["label_equipe_custos"];
        }

        return Util.setParamsLabel($scope.ResourceBundle["label_reprovado_por_param"], repPor);
    };

    function retornoVerificaReprovador(data) {
        $scope.nomeReprovador = [];
        if (data.aprovador != null && data.aprovador.nome != null) {
            $scope.nomeReprovador = data.aprovador.nome;
        } else {
            $scope.nomeReprovador = $scope.listaStatus[$scope.listaStatus.length - 1].usuario;
        }
        loading.ready();
    }

    $scope.fecharDetalhe = function() {
        $("#detalheStatusRma .popup-manutencao").hide();
        $scope.state = STATE_LISTA;
    };

    $scope.detalharMaterial = function() {
        loading.loading();
        //Verifica se foi escolhido um deposito para o material
        if ($scope.rmMaterial) {
            // var vo = {material: $scope.rmMaterial.material, deposito: $scope.rmMaterial.deposito};
            $scope.consultaInformacoesMaterialSapRequest = {};
            $scope.consultaInformacoesMaterialSapRequest.materiais = [];
            $scope.consultaInformacoesMaterialSapRequest.centro = $scope.objSelecionado.rm.centro.codigo;

            if ($scope.rmMaterial.deposito) {
                $scope.consultaInformacoesMaterialSapRequest.deposito = $scope.rmMaterial.deposito.codigo;
            }

            $scope.consultaInformacoesMaterialSapRequest.materiais.push($scope.rmMaterial.material.codigo);
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

        console.log(data);
        var informacoesEstoque = [];
        $scope.listaDetalheMaterial = [];
        $scope.modelEstoqueMaterial = {};

        //Se deposito selecionado
        if ($scope.rmMaterial.deposito) {
            $scope.modelEstoqueMaterial.nomeDeposito = $scope.rmMaterial.deposito.nome;
            $scope.modelEstoqueMaterial.quantidade = 0;

            // Resumo do material        
            if (data.material.depositos) {
                for (var i = 0; i < data.material.depositos.length; i++) {
                    if (data.material.depositos[i].id == $scope.rmMaterial.deposito.codigo) {
                        $scope.modelEstoqueMaterial.quantidade = data.material.depositos[i].quantidade;
                    }
                }
            }
            informacoesEstoque.push($scope.modelEstoqueMaterial);
        }


        $scope.modelEstoqueMaterial = {};
        // Resumo do estoque do material em outros depositos
        $scope.modelEstoqueMaterial.nomeDeposito = 'Total / outros depósitos: ';
        $scope.modelEstoqueMaterial.quantidade = data.material.totalEstoque;
        informacoesEstoque.push($scope.modelEstoqueMaterial);
        $scope.listaDetalheMaterial = informacoesEstoque;

        loading.ready();
    }

    $scope.atualizarModelEstoqueMaterial = function() {

        for (var i = 0; i < $scope.listaDepositos.length; i++) {
            if ($scope.listaDepositos[i].id == $scope.rmMaterial.deposito.codigo && $scope.listaDepositos[i].quantidade !== 0) {
                $scope.modelEstoqueMaterial.nomeDeposito = $scope.rmMaterial.deposito.nome;
                $scope.modelEstoqueMaterial.quantidade = $scope.listaDepositos[i].quantidade;
            }
        }

        // atualizar quantidade retornadas por deposito
        /* angular.forEach($scope.listaDepositos, function (res) {
            // zerar quantidade
            res.quantidade = 0;

            for(var i = 0; i < data.material.depositos.length; i++) {
                if(data.material.depositos[i].id === res.codigo) {
                    res.quantidade = data.material.depositos[i].quantidade;
                }
            }
        }); */
    }

    $scope.$watch('rmMaterial.material', function(newValue, oldValue) {
        if (newValue === null || $.trim(newValue) === "") {
            $scope.listaDetalheMaterial = [];
            $scope.materialSimilarSelecionado = null;
        }
    }, true);

    $scope.listarMateriaisSimilares = function() {
        loading.loading();

        var paginacao = new PaginacaoVo();
        paginacao.pagina = 1;
        paginacao.qtdeRegPagina = 15;
        paginacao.limiteConsulta = 15;

        $scope.filtroMateriaisSimilares.paginacaoVo = paginacao;
        $scope.filtroMateriaisSimilares.material = $scope.rmMaterial.material;
        $scope.filtroMateriaisSimilares.centroId = $scope.objSelecionado.rm.centro.centroId;
        $scope.filtroMateriaisSimilares.codigoCentro = $scope.objSelecionado.rm.centro.codigo;

        RmaService.listarMateriaisSimilares($scope.filtroMateriaisSimilares, retornoListarMateriaisSimilares, trataErroServidor);
    };

    function retornoListarMateriaisSimilares(data) {
        $scope.filtroMateriaisSimilares.paginacaoVo = data.paginacaoVo;

        $scope.listaMateriaisSimilares = data.materiais;
        $scope.listaMateriaisSimilaresCabecalho = data.depositos;
        $scope.paginaAtivaMateriaisSimilares = data.paginacaoVo.pagina;
        $scope.numPaginasMateriaisSimilares = Math.ceil($scope.filtroMateriaisSimilares.paginacaoVo.qtdeRegistros / $scope.filtroMateriaisSimilares.paginacaoVo.limiteConsulta);

        //Buscar informações de estoque material
        $scope.buscarInformacoesEstoqueMateriais();

        $("#telaCadastroRma #modalMateriaisSimilares").modal('show');
        loading.ready();
    }

    $scope.buscarInformacoesEstoqueMateriais = function() {
        //Buscar informações de estoque material
        var request = {
            centro: $scope.objSelecionado.rm.centro.codigo,
            materiais: []
        };


        angular.forEach($scope.listaMateriaisSimilares, function(res) {
            request.materiais.push(res.material.codigo);
        });


        RmaService.consultaMateriaisSimilaresSap(request, responseBuscarInformacoesEstoqueMatSimilares, trataErroServidor);
    };

    function responseBuscarInformacoesEstoqueMatSimilares(res) {
        var mapMateriais = [];

        angular.forEach(res.materiais, function(mat) {

            if (mat.totalEstoque !== 0) {
                mapMateriais[mat.codigoMaterial + '-' + 0] = mat.totalEstoque;
            }

            angular.forEach(mat.depositos, function(dep) {
                if (mat.codigoMaterial !== "" && dep.id !== '') {
                    mapMateriais[mat.codigoMaterial + '-' + dep.id] = dep.quantidade;

                }
            });
        });

        //Atualiza materiais na tela
        angular.forEach($scope.listaMateriaisSimilares, function(mat) {
            angular.forEach(mat.depositoQuantidade, function(depQtde) {
                var quantidadePorDeposito = mapMateriais[mat.material.codigo + "-" + depQtde.codigoDeposito];
                if (quantidadePorDeposito) {
                    depQtde.quantidade = quantidadePorDeposito;
                }
            });
        });

    }

    $scope.irParaPaginaEspecificaMateriaisSimilares = function(pagina) {
        var paginaAtual = $scope.filtroMateriaisSimilares.paginacaoVo.pagina;
        // somente irÃ¡ fazer a pesquisa se clicar em uma pÃ¡gina diferente da atual
        if (pagina !== paginaAtual) {
            loading.loading();
            $scope.materialSimilarSelecionado = null;
            $scope.filtroMateriaisSimilares.paginacaoVo.pagina = pagina;
            RmaService.listarMateriaisSimilares($scope.filtroMateriaisSimilares, retornoListarMateriaisSimilares, trataErroServidor);
        }
    };

    $scope.alterarMaterialSimilar = function() {
        $scope.rmMaterial.material = $scope.materialSimilarSelecionado;

        $scope.detalharMaterial($scope.rmMaterial.material);

        $("#telaCadastroRma #modalMateriaisSimilares").modal('hide');

        $scope.materialSimilarSelecionado = null;
    };

    $scope.selecionarMaterialSimilar = function(material) {
        $scope.materialSimilarSelecionado = material;
    };

    $scope.cancelarRequisicaoConfirma = function(rm) {
        $scope.objCancelarRM = rm;
        $("#telaCadastroRma #modalJustificativaCancelamento").modal('show');
    };

    $scope.cancelarRequisicao = function() {
        loading.loading();
        RmaService.cancelarRequisicao($scope.objCancelarRM, retornoCancelarRequisicao, trataErroServidor);
    };

    function retornoCancelarRequisicao(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaCadastroRma #msg');

        $scope.fecharModalJustificativaCancelamento();
        RmaService.listarConsultaRma($scope.filtro, retornoListar, trataErroServidor);

        $scope.bloquearCampos = true;
        $scope.objSelecionado.rm.dataCancelamento = new Date();
    }

    $scope.fecharModalJustificativaCancelamento = function() {
        $("#telaCadastroRma #modalJustificativaCancelamento").modal('hide');
    };

    $scope.cancelarMaterialConfirma = function(rmMaterial) {
        $scope.objCancelarMaterial = rmMaterial;
        $("#telaCadastroRma #modalObservacaoCancelamentoMaterial").modal('show');
    };

    $scope.cancelarMaterial = function() {
        loading.loading();
        RmaService.cancelarMaterial($scope.objCancelarMaterial, retornoCancelarMaterial, trataErroServidor);
    };

    function retornoCancelarMaterial(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaCadastroRma #msg');

        $scope.fecharModalObservacaoCancelamentoMaterial();
        RmaService.listarConsultaRma($scope.filtro, retornoListar, trataErroServidor);

        $scope.bloquearCampos = true;
    }

    $scope.fecharModalObservacaoCancelamentoMaterial = function() {
        $("#telaCadastroRma #modalObservacaoCancelamentoMaterial").modal('hide');
    };

    $scope.copiarRequisicao = function(obj) {
        //Seta os check's da requisição de manutenção
        $scope.objColetorCusto.valor = "SAP";

        var objEnviar = {};
        if (obj.rmId != null) {
            objEnviar.rmId = obj.rmId;
        } else {
            objEnviar.rmId = obj.rmRmId;
        }
        $scope.possuiRoleLeituraTodasRm = false;
        loading.loading();
        RmaService.listarRm(objEnviar, retornoCopiar, trataErroServidor);
    };

    function retornoCopiar(data) {
        $scope.copiaTipoRequisicao = data.rm.tipoRequisicao;

        $scope.objSelecionado = data;
        $scope.listaDepositos = [];
        $scope.atualizarDepositos($scope.objSelecionado.rm.centro);

        $scope.objSelecionado.rm.rmId = null;
        $scope.objSelecionado.rm.numeroRm = null;
        $scope.objSelecionado.rm.dataEnvioAprovacao = null;
        $scope.objSelecionado.rm.dataEmissao = null;
        $scope.objSelecionado.rm.stDataEmissao = null;
        $scope.objSelecionado.rm.dataAplicacao = null;
        $scope.objSelecionado.rm.stDataAplicacao = null;
        $scope.objSelecionado.rm.dataReprovacao = null;
        $scope.objSelecionado.rm.dataAprovacaoCompra = null;
        $scope.objSelecionado.rm.dataReprovacaoCompra = null;
        $scope.objSelecionado.rm.dataRecebimento = null;
        $scope.objSelecionado.rm.dataCancelamento = null;
        $scope.objSelecionado.rm.dataEnvioComprador = null;
        $scope.objSelecionado.rm.dataAceiteComprador = null;
        $scope.objSelecionado.rm.comprador = null;
        $scope.objSelecionado.rm.justificativaCancelamento = null;
        $scope.objSelecionado.rm.justificativaEnvioAprovacao = null;
        $scope.objSelecionado.rm.gerenteCustos = null;
        $scope.objSelecionado.rm.reprovadoPor = null;
        $scope.objSelecionado.rm.justMateriaisCautelados = null;
        //$scope.objSelecionado.rm.requisitante = null;
        $scope.objSelecionado.rm.prioridade = null;
        $scope.objSelecionado.rm.usuario = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);
        $scope.objSelecionado.rm.tipoRequisicao = null;


        if ($scope.objSelecionado.rmMateriais) {
            for (var i = 0; i < $scope.objSelecionado.rmMateriais.length; i++) {
                $scope.objSelecionado.rmMateriais[i].rm = null;
                $scope.objSelecionado.rmMateriais[i].rmMaterialId = null;
                $scope.objSelecionado.rmMateriais[i].fluxoMaterial = null;
                // $scope.objSelecionado.rmMateriais[i].coletorCustos = null;
                // $scope.objSelecionado.rmMateriais[i].diagramaRede = null;
                $scope.objSelecionado.rmMateriais[i].operacao = null;
                $scope.objSelecionado.rmMateriais[i].numeroRequisicaoSap = null;
                $scope.objSelecionado.rmMateriais[i].itemRequisicaoSap = null;
                $scope.objSelecionado.rmMateriais[i].numeroPedidoCompra = null;
                $scope.objSelecionado.rmMateriais[i].numeroReserva = null;
                $scope.objSelecionado.rmMateriais[i].comprador = null;
                $scope.objSelecionado.rmMateriais[i].coletorEstoque = null;
                $scope.objSelecionado.rmMateriais[i].estaNoOrcamento = null;
                $scope.objSelecionado.rmMateriais[i].valorOrcado = null;
                $scope.objSelecionado.rmMateriais[i].observacaoCusto = null;
                $scope.objSelecionado.rmMateriais[i].observacaoEstoquista = null;
                $scope.objSelecionado.rmMateriais[i].itemDoPedido = null;
                $scope.objSelecionado.rmMateriais[i].centro = null;
                $scope.objSelecionado.rmMateriais[i].status = null;
                $scope.objSelecionado.rmMateriais[i].valorPedido = null;
                $scope.objSelecionado.rmMateriais[i].dataRecebimentoTotal = null;
                $scope.objSelecionado.rmMateriais[i].dataPrevistaEntrega = null;
                $scope.objSelecionado.rmMateriais[i].justificativaAlteracaoMaterial = null;
                $scope.objSelecionado.rmMateriais[i].justificativaAlteracaoQuantidade = null;
                $scope.objSelecionado.rmMateriais[i].dataRecebimentoSuprimentos = null;
                $scope.objSelecionado.rmMateriais[i].dataPrevEntregaSuprimentos = null;
            }
        }

        if ($scope.objSelecionado.rmDepositos) {
            for (var i = 0; i < $scope.objSelecionado.rmDepositos.length; i++) {
                $scope.objSelecionado.rmDepositos[i].rm = null;
                $scope.objSelecionado.rmDepositos[i].id = null;
            }
        }

        if ($scope.objSelecionado.rmDepositos) {
            for (var i = 0; i < $scope.objSelecionado.rmDepositos.length; i++) {
                for (var j = 0; j < $scope.listaDepositos.length; j++) {
                    if ($scope.listaDepositos[j].depositoId === $scope.objSelecionado.rmDepositos[i].deposito.depositoId) {
                        $scope.listaDepositos[j].selected = true;
                    }
                }
            }
        }
        $scope.bloquearCampos = false;

        $scope.state = STATE_MANUT;
        $("#manutCadastroRma .popup-manutencao").show("fade");
        loading.ready();
    }

    $scope.abrirPopUpRedigirJustificativa = function(rm) {
        $scope.objRedigirJustificativa = {};
        $scope.objRedigirJustificativa.rm = rm;
        $scope.objRedigirJustificativa.aprovador = {};
        if ($scope.listaGerentesObra.length === 1) {
            $scope.objRedigirJustificativa.aprovador = $scope.listaGerentesObra[0];
        }

        $("#telaCadastroRma #modalRedigirJustificativa").modal('show');
    };

    $scope.fecharModalRedigirJustificativa = function() {
        $("#telaCadastroRma #modalRedigirJustificativa").modal('hide');
    };

    $scope.redigirJustificativa = function() {
        loading.loading();
        RmaService.redigirJustificativa($scope.objRedigirJustificativa, retornoRedigirJustificativa, trataErroServidor);
    };

    function retornoRedigirJustificativa(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaCadastroRma #msg');

        $scope.objSelecionado.rm.dataEnvioAprovacao = new Date();
        $scope.objSelecionado.rm.dataReprovacao = null;
        $scope.objSelecionado.rm.reprovadoPor = null;

        RmaService.listarConsultaRma($scope.filtro, retornoListar, trataErroServidor);

        $("#telaCadastroRma #modalRedigirJustificativa").modal('hide');
    }

    $scope.abrirModalCadastroMaterial = function() {
        if (Util.validaCamposDoFormulario("#telaCadastroRma #formManutencao") === 0) {
            $scope.novoMaterial = {};
            $("#telaCadastroRma #modalCadastroMaterial").modal('show');
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaCadastroRma #msg');
        }
    };

    $scope.salvarMaterial = function() {
        if ($scope.novoMaterial.quantidade <= 0) {
            $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_material_quantidade_zero'], NEW_ALERT);
            Util.msgShowHide('#telaCadastroRma #msg');
            loading.ready();
            return;
        }

        loading.loading();
        var material = angular.copy($scope.novoMaterial);
        delete material.quantidade;

        //Seto o usuario, material e rm no cadastraMaterial, pois o mesmo precisa dos 2 na hora de enviar o e-mail se caso for para validação.
        $scope.cadastraMaterial.material = material;
        RmaService.cadastrarMaterial($scope.cadastraMaterial, retornoCadastrarMaterial, trataErroServidor);
    };

    function retornoCadastrarMaterial(data) {
        if (data) {
            if (data.codigo && data.codigo == "002") {
                if (data.mensagem && data.mensagem == "msg_preencher_nome_material") {
                    $("#modalCadastroMaterial #modalCadastroMaterialNome").addClass('campo-obrigatorio');
                } else if (data.mensagem && data.mensagem == "msg_preencher_unidade_medida") {
                    $("#modalCadastroMaterial #comboUnidadeMaterial").addClass('campo-obrigatorio');
                    $("#modalCadastroMaterial #modalCadastroMaterialNome").removeClass('campo-obrigatorio');
                } else {
                    $("#modalCadastroMaterial #modalCadastroMaterialNome").removeClass('campo-obrigatorio');
                    $("#modalCadastroMaterial #comboUnidadeMaterial").removeClass('campo-obrigatorio');
                }
                $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
                Util.msgShowHide('#telaCadastroRma #msg');
                loading.ready();

                return;
            } else {
                $("#modalCadastroMaterial #modalCadastroMaterialNome").removeClass('campo-obrigatorio');
                $("#modalCadastroMaterial #comboUnidadeMaterial").removeClass('campo-obrigatorio');
            }

            if (!$scope.novoMaterial.quantidade) {
                $("#modalCadastroMaterial #modalCadastroMaterialQuantidade").addClass('campo-obrigatorio');
                data.mensagem = 'msg_material_quantidade_zero';
                data.codigo = "002";
                data.tipo = "danger";

                $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
                Util.msgShowHide('#telaCadastroRma #msg');
                loading.ready();

                return;
            } else {
                $("#modalCadastroMaterial #modalCadastroMaterialQuantidade").removeClass('campo-obrigatorio');
            }

            var rmMaterial = new RmMaterial();

            if ($scope.novoMaterial.observacao) {
                rmMaterial.observacao = $scope.novoMaterial.observacao;
            } else if ($scope.objSelecionado && $scope.objSelecionado.rm && $scope.objSelecionado.rm.observacao) {
                rmMaterial.observacao = $scope.objSelecionado.rm.observacao;
            }

            rmMaterial.localEntrega = $scope.objSelecionado.rm.localEntrega;
            rmMaterial.material = data.objeto;
            rmMaterial.quantidade = $scope.novoMaterial.quantidade;
            rmMaterial.ordem = $scope.objSelecionado.rmMateriais.length + 1;
            Arrays.add($scope.objSelecionado.rmMateriais, rmMaterial);
            $scope.rmMaterial = {};
            $scope.setarRmMaterialDepositoAutomatico();
            $("#telaCadastroRma #modalCadastroMaterial").modal('hide');
        }

        if (!rmMaterial.isServico || rmMaterial.isServico !== "N") {
            $scope.validacao = true;
        }

        $scope.salvarSemMensagem();
    }

    $scope.salvarSemMensagem = function() {
        if (Util.validaCamposDoFormulario("#telaCadastroRma #formManutencao") === 0) {
            if ($scope.objSelecionado.rmMateriais.length > 0) {

                var listaAux = [];
                for (var i = 0; i < $scope.listaDepositos.length; i++) {
                    if ($scope.listaDepositos[i].selected) {
                        var encontrado = false;
                        for (var j = 0; j < $scope.objSelecionado.rmDepositos.length; j++) {
                            if ($scope.objSelecionado.rmDepositos[j].deposito.depositoId === $scope.listaDepositos[i].depositoId) {
                                listaAux.push($scope.objSelecionado.rmDepositos[j]);
                                encontrado = true;
                                break;
                            }
                        }

                        if (encontrado === false) {
                            var rmDeposito = {
                                deposito: new Deposito($scope.listaDepositos[i])
                            };
                            listaAux.push(rmDeposito);
                        }
                    }
                }
                $scope.objSelecionado.rmDepositos = listaAux;

                loading.loading();
                RmaService.salvar($scope.objSelecionado, retornoSalvarSemMensagem, trataErroServidor);
            }
        } else {
            loading.ready();
        }
    };

    function retornoSalvarSemMensagem(data) {
        if (data) {
            $scope.verificaNovo = true;
            $scope.objSelecionado = data.objeto;
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaCadastroRma #msg');

            //E necessario chamar o listar para atualizar a lista com a nova rma cadastrada,
            //pois trabalhamos com tipo de objetos diferentes.
            //E relistar nao tao pesado, pois traz 20 registro paginados.
            if ($scope.listaRma && $scope.listaRma.length > 0) {
                $scope.listar();
            }
        }

        //Envia o e-mail se for validacao:
        if ($scope.validacao) {
            $scope.cadastraMaterial.usuario = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);
            $scope.cadastraMaterial.rm = $scope.objSelecionado.rm;
            RmaService.enviarEmailSuprimentos($scope.cadastraMaterial, retornoEnviarEmailSuprimentos, trataErroServidor);
            $scope.validacao = false;
        }
        loading.ready();
    }

    function retornoEnviarEmailSuprimentos(data) {}

    $scope.verificaPrioridade = function() {
        if ($scope.objSelecionado && $scope.objSelecionado.rm.prioridade.descricao === "Alta") {
            $scope.alerts = Util.formataAlert("warning", Util.setParamsLabel($scope.ResourceBundle['msg_alerta_prioridade_alta']), NEW_ALERT);
            Util.msgShowHide('#telaCadastroRma #msg');
        } else if ($scope.objAlterarPrioridade && $scope.objAlterarPrioridade.prioridade.descricao === "Alta") {
            $scope.alerts = Util.formataAlert("warning", Util.setParamsLabel($scope.ResourceBundle['msg_alerta_prioridade_alta']), NEW_ALERT);
            Util.msgShowHide('#telaCadastroRma #msg');
        }
    };

    $scope.changeDataAplicacao = function() {
        if ($scope.objSelecionado.rm.stDataAplicacao) {
            var data = Util.stringToDate($scope.objSelecionado.rm.stDataAplicacao, $scope.ResourceBundle["format_date"], "/");
            var hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            if (data < hoje) {
                $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_data_aplicacao_menor_hoje'], NEW_ALERT);
                Util.msgShowHide('#telaCadastroRma #msg');
                $scope.objSelecionado.rm.stDataAplicacao = null;
                $scope.msgPrioridade = null;
            }
            console.log($scope.objSelecionado.rm);
            $scope.verificarPrioridade($scope.objSelecionado);
        }
    };

    $scope.verificarPrioridade = function() {
        console.log($scope.objSelecionado);
        RmaService.verificaPrioridade($scope.objSelecionado, retornoVerificarPrioridade, trataErroServidor);
    };

    function retornoVerificarPrioridade(data) {

        if (data.objeto) {
            $scope.prioridade = data.objeto;
            $scope.msgPrioridade = $scope.prioridade.descricao;
            $scope.objSelecionado.rm.prioridade = data.objeto;
        }

    }

    $scope.selecionarRmMaterial = function(event, vo) {
        var rmMaterial = new RmMaterial();
        rmMaterial.rmMaterialId = vo.rmMaterialRmMaterialId;

        if (event.target.checked) {
            $scope.listaAtribuirCompradores.push(rmMaterial);
        } else {
            var index = -1;

            for (var i = 0; i < $scope.listaAtribuirCompradores.length; i++) {
                var rmComp = $scope.listaAtribuirCompradores[i];
                if (rmComp.rmMaterialId === vo.rmMaterialRmMaterialId) {
                    index = i;
                    break;
                }
            }
            $scope.listaAtribuirCompradores.splice(index, 1);
        }
    };

    $scope.selTdAtrComp = function(event) {
        if (event.target.checked) {
            $scope.listaAtribuirCompradores = [];
            for (var i = 0; i < $scope.listaRma.length; i++) {
                var rm = $scope.listaRma[i];
                if (rm.statusCodigo === 'AgComp' &&
                    (rm.usuarioUsuarioId == $scope.filtro.usuario.usuarioId || $scope.possuiRoleVisualizarTodasRm)) {
                    var rmMaterial = new RmMaterial();
                    rmMaterial.rmMaterialId = rm.rmMaterialRmMaterialId;
                    $scope.listaAtribuirCompradores.push(rmMaterial);
                    $("#atribuirComprador" + i).prop("checked", true);
                }
            }

        } else {
            $scope.listaAtribuirCompradores = [];
            for (var i = 0; i < $scope.listaRma.length; i++) {
                var rm = $scope.listaRma[1];
                if (rm.statusCodigo === 'AgComp' &&
                    (rm.usuarioUsuarioId == $scope.filtro.usuario.usuarioId || $scope.possuiRoleVisualizarTodasRm)) {
                    $("#atribuirComprador" + i).prop("checked", false);
                }
            }
        }
    };

    $scope.atribuirComprador = function() {
        $scope.objAtribuirComprador = {};
        $("#telaCadastroRma #modalAtribuirComprador").modal('show');
    };

    $scope.salvarAtribuirComprador = function() {
        loading.loading();
        for (var i = 0; i < $scope.listaAtribuirCompradores.length; i++) {
            $scope.listaAtribuirCompradores[i].comprador = $scope.objAtribuirComprador.comprador;
        }
        RmaService.atribuirComprador($scope.listaAtribuirCompradores, retornoAtribuirCompradores, trataErroServidor);
    };

    function retornoAtribuirCompradores(data) {
        if (data) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaCadastroRma #msg');
        }
        $scope.listaAtribuirCompradores = [];
        $("#telaCadastroRma #modalAtribuirComprador").modal('hide');

        RmaService.listarConsultaRma($scope.filtro, retornoListar, trataErroServidor);
    }

    $scope.fecharModalAtribuirComprador = function() {
        $("#telaCadastroRma #modalAtribuirComprador").modal('hide');
    };

    $scope.novoServicoFN = function() {
        if (Util.validaCamposDoFormulario("#telaCadastroRma #formManutencao") === 0) {
            $scope.novoServico = {};
            $("#telaCadastroRma #modalCadastroServico").modal('show');
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaCadastroRma #msg');
        }
    };

    $scope.fecharModalCadastroServico = function() {
        $("#telaCadastroRma #modalCadastroServico").modal('hide');
    };

    $scope.salvarCadastroServicoMaterial = function() {
        //Bloqueia o botão salvar para evitar duplo clique
        $scope.bloqueiaBtSalvarServico = true;

        $scope.servicoMaterial = {};
        $scope.servicoMaterial.nome = $scope.novoServico.nome;
        $scope.servicoMaterial.observacao = $scope.ResourceBundle['label_servico'];
        $scope.servicoMaterial.isServico = true;

        //Cadastra o serviço como um material, para setar na rm depois
        $scope.cadastraMaterial.material = $scope.servicoMaterial;
        $scope.cadastraMaterial.material.hierarquia = "SERVIÇO";
        RmaService.cadastrarMaterial($scope.cadastraMaterial, retornoCadastrarMaterialServico, trataErroServidor);
    };

    function retornoCadastrarMaterialServico(data) {
        if (data && !data.erro) {
            loading.loading();
            var rmMaterial = new RmMaterial();

            if ($scope.novoServico.aplicacao != null) {
                rmMaterial.observacao = $scope.novoServico.aplicacao;
            } else if ($scope.objSelecionado.rm.observacao != null) {
                rmMaterial.observacao = $scope.objSelecionado.rm.observacao;
            }

            rmMaterial.localEntrega = $scope.objSelecionado.rm.localEntrega;
            rmMaterial.material = data.objeto;
            delete rmMaterial.material.quantidade;
            rmMaterial.quantidade = $scope.novoServico.quantidade;
            rmMaterial.numeroRequisicaoSap = $scope.novoServico.numeroRequisicaoSap;
            rmMaterial.itemRequisicaoSap = $scope.novoServico.itemRequisicaoSap;
            rmMaterial.ordem = $scope.objSelecionado.rmMateriais.length + 1;

            if (!!$scope.novoServico.numeroRequisicaoSap && $scope.novoServico.numeroRequisicaoSap.length < 10) {
                for (i = $scope.novoServico.numeroRequisicaoSap.length; i < 10; i++) {
                    $scope.novoServico.numeroRequisicaoSap = '0' + $scope.novoServico.numeroRequisicaoSap;
                }
                rmMaterial.numeroRequisicaoSap = $scope.novoServico.numeroRequisicaoSap;
            }

            if ($scope.objSelecionado.rm.tipoRequisicao.codigo === 'TIP_REQ_MANUTENCAO' && !$scope.novoServico.numeroRequisicaoSap) {
                $scope.bloqueiaBtSalvarServico = false;
                $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_informe_numero_requisicao_sap'], NEW_ALERT);
                Util.msgShowHide('#telaCadastroRma #msg');
                loading.ready();
                return;
            }

            Arrays.add($scope.objSelecionado.rmMateriais, rmMaterial);
            $scope.rmMaterial = {};
            $scope.setarRmMaterialDepositoAutomatico();

            $("#telaCadastroRma #modalCadastroServico").modal('hide');
            $scope.bloqueiaBtSalvarServico = false;

            $scope.salvarSemMensagem();
        } else {
            $scope.bloqueiaBtSalvarServico = false;
            $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_registro_salvo_erro'], NEW_ALERT);
            Util.msgShowHide('#telaCadastroRma #msg');
            loading.ready();
        }
    }

    $scope.abrirModalAnexo = function(escopo, escopoId) {
        $scope.filtroAnexo = {};
        $scope.filtroAnexo.escopo = escopo;
        $scope.filtroAnexo.escopoId = escopoId;
        AnexoService.listar($scope.filtroAnexo, retornoListarAnexo, trataErroServidor);
    };

    function retornoListarAnexo(data) {
        if (data.length === 0) {
            $scope.listaAnexo = [];
        } else {
            $scope.listaAnexo = data;
        }
        $("#telaCadastroRma #modalAnexo").modal('show');
    }

    $scope.adicionarAnexoServico = function() {
        var anexoServico = document.getElementById("anexoServico");
        if (anexoServico !== null) {
            if (anexoServico.files !== null && anexoServico.files.length > 0) {
                //Salva multiplos anexos selecionados
                for (var i = 0; i < anexoServico.files.length; i++) { //for multiple files
                    (function(file) {
                        var size = file.size;
                        if ((size / 1000000) <= 5) {
                            var name = file.name;
                            var reader = new FileReader();
                            reader.onload = function() {
                                var anexo = {};
                                anexo.anexoBase64 = reader.result;
                                anexo.anexo = null;
                                anexo.nome = name;
                                anexo.escopo = 'RM_SERVICO';
                                anexo.escopoId = $scope.objSelecionado.rm.rmId;

                                var listaAnexos = [];
                                listaAnexos.push(anexo);
                                AnexoService.salvar(listaAnexos, $scope.retornoSalvarAnexoServico, trataErroServidor);
                            };
                            reader.readAsDataURL(file);
                        } else {
                            $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_tamanho_maximo_arquivo_5mb'], NEW_ALERT);
                            Util.msgShowHide('#telaCadastroRma #msg');
                            loading.ready();
                        }
                    })(anexoServico.files[i]);
                }
            }
        }
    }

    $scope.retornoSalvarAnexoServico = function() {
        document.getElementById("anexoServico").value = '';
        $scope.filtroAnexo = {};
        $scope.filtroAnexo.escopo = 'RM_SERVICO';
        $scope.filtroAnexo.escopoId = $scope.objSelecionado.rm.rmId;
        AnexoService.listar($scope.filtroAnexo, $scope.atualizarListaAnexos, trataErroServidor);
    }

    $scope.atualizarListaAnexos = function(data) {
        $scope.listaAnexosServico = data;
    }

    $scope.adicionarAnexo = function() {
        loading.loading();
        var arquivoAux = document.getElementById("inputAnexoRma");

        if (arquivoAux !== null) {
            if (arquivoAux.files !== null && arquivoAux.files.length > 0) {
                //Salva multiplos anexos selecionados
                for (var i = 0; i < arquivoAux.files.length; i++) { //for multiple files
                    (function(file) {
                        var size = file.size;
                        if ((size / 1000000) <= 5) {
                            var name = file.name;
                            var reader = new FileReader();
                            reader.onload = function() {
                                var anexo = {};
                                anexo.anexoBase64 = reader.result;
                                anexo.anexo = null;
                                anexo.nome = name;
                                anexo.escopo = $scope.filtroAnexo.escopo;
                                anexo.escopoId = $scope.filtroAnexo.escopoId;

                                var listaAnexos = [];
                                listaAnexos.push(anexo);
                                AnexoService.salvar(listaAnexos, retornoSalvarAnexo, trataErroServidor);
                            };
                            reader.readAsDataURL(file);
                        } else {
                            $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_tamanho_maximo_arquivo_5mb'], NEW_ALERT);
                            Util.msgShowHide('#telaCadastroRma #msg');
                            loading.ready();
                        }
                    })(arquivoAux.files[i]);
                }
            }
        }
    };

    function retornoSalvarAnexo(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaCadastroRma #msg');

        $scope.abrirModalAnexo($scope.filtroAnexo.escopo, $scope.filtroAnexo.escopoId);

        $("#inputAnexoRma").val("");
        $scope.anexoSelecionado = null;

        loading.ready();
    }

    $scope.carregarAnexo = function(anexo) {
        loading.loading();
        AnexoService.carregarAnexo(anexo, retornoCarregarAnexo, trataErroServidor);
    };

    function retornoCarregarAnexo(data) {
        Util.download(data.anexo, data.nome);
        loading.ready();
    }

    $scope.excluirAnexo = function(anexo) {
        loading.loading();
        AnexoService.excluirAnexo(anexo, retornoExcluirAnexo, trataErroServidor);
    };

    function retornoExcluirAnexo(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaCadastroRma #msg');
        $scope.abrirModalAnexo($scope.filtroAnexo.escopo, $scope.filtroAnexo.escopoId);
        loading.ready();
    }

    $scope.exibirAprovadores = function(obj) {

        $scope.objLista = obj;
        console.log(obj);
        loading.loading();
        var request = {};
        request.idRm = obj.rmRmId;
        request.idRmMaterial = obj.rmMaterialRmMaterialId;
        request.idArea = obj.areaId;
        request.idCentro = obj.centroId;
        request.prioridade = obj.prioridadeCodigo;

        console.log('request:' + JSON.stringify(request));

        // $scope.aprovadorAlterado = null;
        // RmaService.listarAprovadores(objEnviar, retornoListarAprovadores, trataErroServidor);
        ObterAprovadoresRmMaterialService.todos(request, retornoConsultarRm, trataErroServidor);
        // RmaService.listarRm(request, retornoConsultarRm, trataErroServidor);
    };

    function retornoConsultarRm(data) {
        console.log(data);
        $scope.aprovadoresRmMaterial = data;
        $("#telaCadastroRma #modalAprovadoresRma").modal('show');
    }

    $scope.formataLabelTipoAprovador = function(rmAprovador) {
        if (rmAprovador) {
            if (rmAprovador.tipoAprovador === TIPO_APROVADOR_GERENTE_AREA) {
                return $scope.ResourceBundle["label_gerente_area"];
            } else if (rmAprovador.tipoAprovador === TIPO_APROVADOR_GERENTE_CUSTO) {
                return $scope.ResourceBundle["label_gerente_custos"];
            } else if (rmAprovador.tipoAprovador === TIPO_APROVADOR_GERENTE_OBRA) {
                return $scope.ResourceBundle["label_gerente_obra"];
            } else if (rmAprovador.tipoAprovador === TIPO_APROVADOR_CUSTOS) {
                return $scope.ResourceBundle["label_equipe_custos"];
            } else if (rmAprovador.tipoAprovador === TIPO_APROVADOR_LIDER_CUSTOS) {
                return $scope.ResourceBundle["label_lider_custos"];
            } else if (rmAprovador.tipoAprovador === TIPO_APROVADOR_COORDENADOR) {
                return $scope.ResourceBundle["label_coordenador"];
            } else if (rmAprovador.tipoAprovador === TIPO_APROVADOR_RESP_RET_ESTOQ) {
                return $scope.ResourceBundle["label_responsavel_retirada_estoque"];
            }
        }
        return "";
    };

    function retornoListarAprovadores(data) {
        $scope.listaAprovadores = data;
        $scope.auxVerificaUsuarioLogado = {};
        $scope.auxVerificaUsuarioLogado = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);

        $("#telaCadastroRma #modalAprovadoresRma").modal('show');
        loading.ready();
    }

    $scope.alterarAprovador = function(rmAprovador) {
        $scope.aprovadorAlterado = rmAprovador;
        $scope.auxRmAprovado = {};
        $scope.auxRmAprovado = rmAprovador;
    };

    $scope.salvarAlterarAprovador = function() {
        loading.loading();
        RmaService.alterarAprovador($scope.aprovadorAlterado, retornoAlterarAprovador, trataErroServidor);
    };

    $scope.salvarAlterarColetor = function() {
        //valido se o coletor possui letras e numeros
        var re = new RegExp(".*([A-Za-z][0-9]|[0-9][A-Za-z]).*");
        if ($scope.coletorCustosCadastroRma.aux === OPERACAO_PEP) {
            $("#telaCadastroRma #coletorCusto").removeClass('campo-obrigatorio');

        } else if ($scope.coletorCustosCadastroRma.aux === DIAGRAMA_DE_REDE) {
            $("#telaCadastroRma #diagramaRede").removeClass('campo-obrigatorio');
        }

        loading.loading();
        var rmMaterialEnvia = new RmMaterial();

        rmMaterialEnvia.rmMaterialId = $scope.objAlterarColetorCadastroRma.rmMaterialId;
        rmMaterialEnvia.diagramaRede = $scope.objAlterarColetorCadastroRma.diagramaRede;
        rmMaterialEnvia.operacao = $scope.objAlterarColetorCadastroRma.operacao;
        rmMaterialEnvia.coletorCustos = $scope.objAlterarColetorCadastroRma.coletorCustos;
        rmMaterialEnvia.coletorOrdem = $scope.objAlterarColetorCadastroRma.coletorOrdem;

        rmMaterialEnvia.observacao = "";

        if (rmMaterialEnvia.coletorCustos != null) {
            rmMaterialEnvia.diagramaRede = null;
            rmMaterialEnvia.operacao = null;
            rmMaterialEnvia.coletorOrdem = null;
            rmMaterialEnvia.observacao = "Elemento PEP: " + rmMaterialEnvia.observacao + rmMaterialEnvia.coletorCustos;
        }

        if (rmMaterialEnvia.diagramaRede != null) {
            rmMaterialEnvia.coletorCustos = null;
            rmMaterialEnvia.coletorOrdem = null;
            rmMaterialEnvia.observacao = "Centro de custo:" + rmMaterialEnvia.observacao + rmMaterialEnvia.diagramaRede;
        }

        if (rmMaterialEnvia.operacao != null) {
            rmMaterialEnvia.coletorCustos = null;
            rmMaterialEnvia.coletorOrdem = null;
            rmMaterialEnvia.observacao = rmMaterialEnvia.observacao + "-" + rmMaterialEnvia.operacao;
        }

        if (rmMaterialEnvia.coletorOrdem != null) {
            rmMaterialEnvia.diagramaRede = null;
            rmMaterialEnvia.operacao = null;
            rmMaterialEnvia.coletorCustos = null;
            rmMaterialEnvia.observacao = "Estoque: " + rmMaterialEnvia.coletorOrdem;
        }

        RmaService.alterarColetor(rmMaterialEnvia, retornoSalvarAlterarColetor, trataErroServidor);
    };

    function retornoSalvarAlterarColetor(data) {
        //Arrays.add($scope.listaRma, new RmMaterial(data.objeto));

        $("#telaCadastroRma #modalAlterarColetorCadastroRma").modal('hide');

        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaCadastroRma #msg');
        $scope.listar();
        loading.ready();
    }

    function retornoAlterarAprovador(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaCadastroRma #msg');

        $("#telaCadastroRma #modalAprovadoresRma").modal('hide');

        loading.ready();
    }

    $scope.abelTipoAprovador = function(rmAprovador) {
        if (rmAprovador) {
            if (rmAprovador.tipoAprovador === TIPO_APROVADOR_GERENTE_AREA) {
                return $scope.ResourceBundle["label_gerente_area"];
            } else if (rmAprovador.tipoAprovador === TIPO_APROVADOR_GERENTE_CUSTO) {
                return $scope.ResourceBundle["label_gerente_custos"];
            } else if (rmAprovador.tipoAprovador === TIPO_APROVADOR_GERENTE_OBRA) {
                return $scope.ResourceBundle["label_gerente_obra"];
            } else if (rmAprovador.tipoAprovador === TIPO_APROVADOR_CUSTOS) {
                return $scope.ResourceBundle["label_equipe_custos"];
            } else if (rmAprovador.tipoAprovador === TIPO_APROVADOR_LIDER_CUSTOS) {
                return $scope.ResourceBundle["label_lider_custos"];
            } else if (rmAprovador.tipoAprovador === TIPO_APROVADOR_COORDENADOR) {
                return $scope.ResourceBundle["label_coordenador"];
            } else if (rmAprovador.tipoAprovador === TIPO_APROVADOR_RESP_RET_ESTOQ) {
                return $scope.ResourceBundle["label_responsavel_retirada_estoque"];
            }
        }
        return "";
    };

    $scope.gerarXls = function() {
        loading.loading();

        //TODO - POC gerar PDF para um futuro
        // $scope.criarPdf();

        var popUpHide = jQuery("#formCadastroRma").hasClass("ng-hide");

        if (!popUpHide) {
            $scope.filtro.numero = $scope.objSelecionado.rm.numeroRm;
        }

        RmaService.geraExcel($scope.filtro, retornoGeraExcel, trataErroServidor);
    };

    function retornoGeraExcel(data) {


        $scope.criarExcel(data);
        //$scope.filtro.numero = '';
    }

    $scope.criarExcel = function(res) {
        var createXLSLFormatObj = [];

        if (res) {

            /* XLS Head Columns */
            var xlsHeader = res.cabecalho;

            /* XLS Rows Data */
            var xlsRows = res.linhas;

            createXLSLFormatObj.push(xlsHeader);
            $.each(xlsRows, function(index, value) {
                var innerRowData = [];
                $.each(value, function(ind, val) {
                    innerRowData.push(val);
                });
                createXLSLFormatObj.push(innerRowData);
            });


            /* File Name */
            var filename = "RM.xlsx";

            /* Sheet Name */
            var ws_name = "RM";

            if (typeof console !== 'undefined') console.log(new Date());
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);

            /* Add worksheet to workbook */
            XLSX.utils.book_append_sheet(wb, ws, ws_name);

            /* Write workbook and Download */
            if (typeof console !== 'undefined') console.log(new Date());
            XLSX.writeFile(wb, filename);
            if (typeof console !== 'undefined') console.log(new Date());

            loading.ready();
        } else {
            $scope.alerts = Util.formataAlert("Nenhuma RM foi recebida para exportar relatório", $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaCadastroRma #msg');
        }

    };

    $scope.criarPdf = function() {
        printJS('formCadastroRma', 'html');
    }

    $scope.alterarQuantidadeMaterial = function(obj) {
        var rmMaterial = {};
        rmMaterial.rmMaterialId = obj.rmMaterialRmMaterialId;
        rmMaterial.quantidade = obj.rmMaterialQuantidade;
        $scope.objAlterarQuantidade = new RmMaterial(rmMaterial);
        $scope.objAlterarQuantidadeAux = new RmMaterial(rmMaterial);
        $scope.materialAux = obj.materialNome;
        $("#telaCadastroRma #modalAlterarQuantidadeMaterial").modal('show');
    };

    $scope.salvarAlterarQuantidadeMaterial = function() {
        loading.loading();

        RmaService.alterarQuantidade($scope.objAlterarQuantidade, retornoSalvarAlterarQuantidadeMaterial, trataErroServidor);
    };

    function retornoSalvarAlterarQuantidadeMaterial(data) {
        $("#telaCadastroRma #modalAlterarQuantidadeMaterial").modal('hide');

        for (var i = 0; i < $scope.listaRma.length; i++) {
            if ($scope.listaRma[i].rmMaterialRmMaterialId == data.objeto.rmMaterialId) {
                $scope.listaRma[i].rmMaterialQuantidade = data.objeto.quantidade;
                $scope.listaRma[i].rmMaterialJustAltQuant = data.objeto.justificativaAlteracaoQuantidade;
                break;
            }
        }

        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaCadastroRma #msg');
        loading.ready();
    }

    $scope.fecharModalAlterarQuantidadeMaterial = function() {
        $("#telaCadastroRma #modalAlterarQuantidadeMaterial").modal('hide');
    };

    $scope.alterarPrioridade = function(obj) {
        var objEnviar = {};
        objEnviar.rmId = obj.rmRmId;


        //e setado null no objselecionado para exibir a mensagem de aviso sobre
        //a prioridade alta
        $scope.objSelecionado = null;

        $scope.objAlterarPrioridade = new Rm(objEnviar);
        $scope.objAlterarPrioridade.prioridade = null;

        $scope.objAlterarPrioridadeAux = new Rm(objEnviar);
        $scope.objAlterarPrioridadeAux.numeroRm = obj.rmNumeroRm;
        $scope.prioridadeAux = obj.prioridadeDescricao;


        $("#telaCadastroRma #modalAlterarPrioridade").modal('show');
    };

    $scope.salvarAlterarPrioridade = function() {
        loading.loading();
        RmaService.alterarPrioridade($scope.objAlterarPrioridade, retornoSalvarAlterarPrioridade, trataErroServidor);
    };

    function retornoSalvarAlterarPrioridade(data) {
        $("#telaCadastroRma #modalAlterarPrioridade").modal('hide');

        for (var i = 0; i < $scope.listaRma.length; i++) {
            if ($scope.listaRma[i].rmRmId === data.objeto.rmId) {
                $scope.listaRma[i].prioridadeDescricao = data.objeto.prioridade.descricao;
                $scope.listaRma[i].prioridadeCodigo = data.objeto.prioridade.codigo;
            }
        }

        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaCadastroRma #msg');
        loading.ready();
    }

    $scope.fecharModalAlterarPrioridade = function() {
        $("#telaCadastroRma #modalAlterarPrioridade").modal('hide');
    };

    $scope.changeColetorCusto = function(estoque) {
        $scope.rmMaterial.coletorOrdem = null;
        $scope.rmMaterial.operacao = null;
        $scope.rmMaterial.diagramaRede = null;
        $scope.rmMaterial.coletorCustos = null;
        $scope.rmMaterial.coletorEstoque = !!estoque;
    };

    $scope.alteraColetorCusto = function(valor) {

        if (valor === $scope.OPERACAO_PEP) {
            exibeSeletor(true, "#compDivColetorCustoCadastroRma");
            exibeSeletor(false, "#compDivDiagramaCadastroRma");
            exibeSeletor(false, "#compDivOrdemCadastroRma");

            $scope.objAlterarColetorCadastroRma.coletorOrdem = null;
            $scope.objAlterarColetorCadastroRma.operacao = null;
            $scope.objAlterarColetorCadastroRma.diagramaRede = null;
        } else if (valor === $scope.DIAGRAMA_DE_REDE) {
            exibeSeletor(false, "#compDivColetorCustoCadastroRma");
            exibeSeletor(false, "#compDivOrdemCadastroRma");
            exibeSeletor(true, "#compDivDiagramaCadastroRma");

            $scope.objAlterarColetorCadastroRma.coletorOrdem = null;
            $scope.objAlterarColetorCadastroRma.coletorCustos = null;
        } else if (valor === $scope.ORDEM) {
            exibeSeletor(false, "#compDivColetorCustoCadastroRma");
            exibeSeletor(false, "#compDivDiagramaCadastroRma");
            exibeSeletor(true, "#compDivOrdemCadastroRma");

            $scope.objAlterarColetorCadastroRma.coletorCustos = null;
            $scope.objAlterarColetorCadastroRma.operacao = null;
            $scope.objAlterarColetorCadastroRma.diagramaRede = null;
        }
    };

    $scope.listarRetiradasNaoPresenciais = function(obj) {
        loading.loading();
        $scope.rmMaterialConfirmarRetirada = obj;
        var rmMaterial = new RmMaterial();
        rmMaterial.rmMaterialId = obj.rmMaterialRmMaterialId;
        RmaService.listarRetiradasNaoPresenciais(rmMaterial, retornoListarRetiradasNaoPresenciais, trataErroServidor);
    };

    function retornoListarRetiradasNaoPresenciais(data) {
        $scope.listaRetiradasNaoPresencial = data;
        $("#telaCadastroRma #modalMateriaisRetiradosNaoPresencial").modal('show');
        loading.ready();
    }

    $scope.confirmarRetirada = function() {
        loading.loading();
        var rmMaterial = new RmMaterial();
        rmMaterial.rmMaterialId = $scope.rmMaterialConfirmarRetirada.rmMaterialRmMaterialId;
        RmaService.confirmarRetiradaNaoPresencial(rmMaterial, retornoConfirmarRetirada, trataErroServidor);
    };

    function retornoConfirmarRetirada(data) {
        $("#telaCadastroRma #modalMateriaisRetiradosNaoPresencial").modal('hide');

        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaCadastroRma #msg');

        for (var i = 0; i < $scope.listaRma.length; i++) {
            if (parseInt($scope.listaRma[i].rmMaterialRmMaterialId) === parseInt($scope.rmMaterialConfirmarRetirada.rmMaterialRmMaterialId)) {
                $scope.listaRma[i].confirmarRetirada = false;
                break;
            }
        }
        loading.ready();
    }

    $scope.editarMaterialConfirma = function(obj, index) {
        $scope.rmMaterial = JSON.parse(JSON.stringify(obj));
        $scope.indexTelaRmMaterial = index;
        if (!!$scope.rmMaterial.numeroRequisicaoSap) {
            $scope.rmMaterial.possuiReqSap = 'S';
        }
        if (!!$scope.rmMaterial.diagramaRede && !!$scope.rmMaterial.operacao) {
            $scope.objColetorCusto = { valor: $scope.DIAGRAMA_DE_REDE };
        } else if (!!$scope.rmMaterial.coletorCustos) {
            $scope.objColetorCusto = { valor: $scope.OPERACAO_PEP };
        } else if (!!$scope.rmMaterial.coletorEstoque) {
            $scope.objColetorCusto = { valor: $scope.ESTOQUE };
        } else {
            $scope.objColetorCusto = { valor: $scope.SAP };
        }
    };

    $scope.habilitaBtnEnviarParaAprovacao = function(obj) {
        if ($scope.filtro && obj.rmRmId && (!obj.rmDataEnvioAprovacao || obj.statusNome == "Reprovada") && !obj.rmDataCancelamento && obj.tipoRequisicaoCodigo != 'TIP_RET_ESTOQUISTA') {
            if (obj.usuarioUsuarioId == $scope.filtro.usuario.usuarioId || $scope.possuiRoleVisualizarTodasRm || obj.requisitanteReferencia == $scope.filtro.usuario.pessoa.referencia) {
                return true;
            }
        }
        return false;
    };

    $scope.validaDepositoEntRetirada = function() {
        $("#manutCadastroRmaDepositoEntrega").removeClass("required");
        //if($scope.objSelecionado && $scope.objSelecionado.rm && $scope.objSelecionado.rm.tipoRequisicao){
        //    if ($scope.objSelecionado.rm.tipoRequisicao.codigo === "TIP_RET_EM_ESTOQ"
        //        || $scope.objSelecionado.rm.tipoRequisicao.codigo === "TIP_RET_ESTOQUISTA") {
        //        return false;
        //    }else {
        //        $("#manutCadastroRmaDepositoEntrega").addClass("required");
        //        return true;
        //    }
        //}else{
        //    return false;
        //}

        //André
        //Esta validação foi retirada a pedido do CCSL, pois estava causando problemas no cadastro das RM's
        return false;
    }

    $scope.abrirFiltro = function() {
        $('#telaCadastroRma .popup-filtro').show("fade");
        $scope.state = STATE_FILTRO;
    };

    $scope.abrirNovo = function() {
        $('#manutCadastroRma .popup-manutencao').show("fade");
        $scope.state = STATE_MANUT;
        $scope.novo();
    };


    $scope.limpaCampoSap = function() {
        $('#manutCadastroRmaMaterialNumeroRequisicaoSap').removeClass('campo-obrigatorio');
    };

    function trataErroServidor(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_ERRO_COMUNICACAO_SERVIDOR);
        Util.msgShowHide('#telaCadastroRma #msg');
        loading.ready();
        $scope.filtro.numero = '';
    }

    $scope.affix = function() {
        Util.affix();
    };
}