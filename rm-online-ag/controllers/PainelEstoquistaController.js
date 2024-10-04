function painelEstoquistaServ($scope, loading, PainelEstoquistaService, AutoComplete, Combo, $http) {
    $scope.state = STATE_LISTA;

    if (!$scope.filtro) {
        $scope.filtro = new FiltroPainelEstoquista();
    }

    $scope.copiaMatDepositoSaida = {};
    $scope.objCopiaMatDepositoSaida = {radio: {}};
    $scope.objTransf = {};
    $scope.objSelecionado = {};
    $scope.listaPrefixoEquipamento = [];
    $scope.prefixoEquipamento = {};

    if (!$scope.lista) {
        $scope.lista = [];
    }
    $scope.divPainelEstoquistaManutencao = true;

    $scope.listaDepositos = CarregaComboDepositos(Combo);
    $scope.listaDepositosTemporarios = CarregaComboDepositosTemporarios(Combo);
    $scope.listaTipoRequisicao = [];//CarregaComboTipoRequisicaoComFrenteServico(Combo);
    $scope.listaComboStatus = CarregaComboStatus(Combo);

    $scope.materialAlteradoIndisponivel = false;
    $scope.tipoRequisicaoCampo = false;
    $scope.materialSapComprado = false;
    $scope.retirarMaterial = {};
    $scope.retiradoPor = {};
    $scope.quantidadeDisponivelRetirada = {};

    $scope.ALTERAR_MATERIAL = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_ALTERAR_MATERIAL);

    $scope.configuracao = UtilConfiguracao.getConfiguracaoSessao(SIGLA_MODULO);
    $scope.listaTodasEapMultiEmpresa = CarregaComboTodasEapMultiEmpresa(Combo);

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

    $scope.getAutoCompletePrefixoEquipamento = function (value) {
        var prefixoEquipamentoVo = {};
        if ($scope.configuracao.habilitaEapMultiEmpresa != null && $scope.configuracao.habilitaEapMultiEmpresa == true) {
            prefixoEquipamentoVo.eapDeposito = $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.deposito.eapMultiEmpresa.codigo;
        }
        prefixoEquipamentoVo.prefixoEquipamento = value;
        prefixoEquipamentoVo.codigoEquipamento = $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.material.codigo;
        prefixoEquipamentoVo.codigoDeposito = $scope.depositoCodigoPrefixoEquipamento;


        //Deixado o $http no metodo por causa do then.
        return $http.post(api + '/PainelEstoquista/autoCompletePrefixoEquipamento/', prefixoEquipamentoVo).then(function (res) {
            var info = res.data;
            if (info.erro != null) {

            } else {
                return info.objeto;
            }
        });
    };


    $scope.alteraQuantidadeRetirada = function (quantidade) {
        //Passo o mesmo para uma nova variavel $scope.quantidadeRetirada.quantidade
        //Faço o mesmo, pelo fato de ter que verificar depois se a quantidade retirada for editada,
        //Verificar se a mesma é maior que a disponivel no deposito solicitado
        $scope.quantidadeRetirada.quantidade = quantidade;
    };

    $scope.adicionarListaPrefixoEquipamento = function () {
        var jaExistente = false;
        for (var i = 0; i < $scope.listaPrefixoEquipamento.length; i++) {
            if ($scope.prefixoEquipamento.value == $scope.listaPrefixoEquipamento[i]) {
                jaExistente = true;
            }
        }
        if (jaExistente == false) {
            $scope.listaPrefixoEquipamento.push($scope.prefixoEquipamento.value);
        } else {
            $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_prefixo_equipamento_existe'], NEW_ALERT);
            Util.msgShowHide('#telaPainelEstoquista #msg');
        }
    };

    $scope.removerListaPrefixoEquipamento = function (prefixoEquipamento) {
        $scope.listaPrefixoEquipamento.splice(prefixoEquipamento, 1);
    };

    $scope.editar = function (obj) {
        $("#transferenciaPainelEstoquista .popup-manutencao").hide("fade");
        $scope.divPainelEstoquistaManutencao = true;
        loading.loading();
        PainelEstoquistaService.selectById(obj.materialDepositoSaidaReserva, retornoEditar, trataErroServidor);
    };

    function retornoEditar(data) {
        $scope.objSelecionado = data;
        //Feito para o autoComplete do prefixoEquipamento
        if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.deposito != null && $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.deposito.codigo != null) {
            $scope.depositoCodigoPrefixoEquipamento = $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.deposito.codigo;
        }
        var codigo = data.materialDepositoSaidaReserva.rmMaterial.rm.tipoRequisicao.codigo;
        $scope.tipoRequisicaoCampo = codigo === TIPO_REQUISICAO_FRENTE_SERVICO;
        $scope.tipoRequisicaoManutencao = codigo === TIPO_REQUISICAO_MANUTENCAO;
        getQuantidadeDisponivelDeposito();
        $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.qtdRetirado = $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.quantidade;
        $scope.materialSapComprado = false;
        if (data.materialDepositoSaidaReserva.rmMaterial.comprador
            && data.materialDepositoSaidaReserva.rmMaterial.numeroPedidoCompra
            && $scope.tipoRequisicaoManutencao) {
            $scope.materialSapComprado = true;
        }

        if (data.materialDepositoSaidaReserva.itemIndisponivel && $scope.tipoRequisicaoCampo) {
            $scope.materialSelecionado = {indisponivel: true};
        } else {
            $scope.materialSelecionado = {indisponivel: false};
            loading.ready();
            $scope.state = STATE_MANUT;
            $("#manutPainelEstoquista .popup-manutencao").show("fade");
        }
    }

    function getQuantidadeDisponivelDeposito() {
        $scope.quantidadeDisponivelEstoque = 0;
        PainelEstoquistaService.getMaterialDeposito($scope.objSelecionado.materialDepositoSaidaReserva, retornoGetQuantidadeDisponivelDeposito, trataErroServidor);
    }

    function retornoGetQuantidadeDisponivelDeposito(data) {
        if (data.quantidade) {
            $scope.quantidadeDisponivelEstoque = data.quantidade;
            $scope.materialSelecionado.indisponivel = $scope.objSelecionado.materialDepositoSaidaReserva.quantidadeSolicitada
                > $scope.quantidadeDisponivelEstoque;
        }
        if ($scope.tipoRequisicaoCampo) {
            if ($scope.materialSelecionado.indisponivel) {
                listarDepositosDisponiveis($scope.objSelecionado.materialDepositoSaidaReserva);
            } else {

                loading.ready();
                $scope.state = STATE_MANUT;
                $("#manutPainelEstoquista .popup-manutencao").show("fade");
            }
        }
    }

    function listarDepositosDisponiveis(obj) {
        loading.loading();
        $scope.obetoParam = obj;
        PainelEstoquistaService.listarDepositosDisponiveis(obj, retornoDepositosDisponiveis, trataErroServidor);
    }

    function retornoDepositosDisponiveis(data) {
        $scope.listaDepositosDisponiveis = data;
        getUltimoStatusRmMaterial($scope.obetoParam);
    }

    function getUltimoStatusRmMaterial(obj) {
        loading.loading();
        PainelEstoquistaService.getUltimoStatusTransferenciaRmMaterial(obj, retornoGetUltimoStatusRmMaterial, trataErroServidor);
    }

    function retornoGetUltimoStatusRmMaterial(dados) {
        $scope.materialSelecionado.isTransferencia = false;
        if (dados && dados.status) {
            $scope.materialSelecionado.isTransferencia = true;
        }
        $scope.state = STATE_MANUT;
        $("#manutPainelEstoquista .popup-manutencao").show("fade");
        loading.ready();
    }

    $scope.modalSolicitarTransferencia = function () {
        $("#telaPainelEstoquista #modalSolicitarTransferencia").modal('show');
    };

    $scope.fecharModalSolicitarTransferencia = function () {
        $("#telaPainelEstoquista #modalSolicitarTransferencia").modal('hide');
    };

    $scope.solicitarTransferenciaModal = function () {

        if (Util.validaCamposDoFormulario("#telaPainelEstoquista #formModalSolicitarTransferencia") === 0) {

            loading.loading();

            PainelEstoquistaService.solicitarTransferenciaMaterial($scope.objSelecionado.materialDepositoSaidaReserva, retornoSolicitarTransferencia, trataErroServidor);
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaPainelEstoquista #msg');
        }

    };

    function retornoSolicitarTransferencia(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaPainelEstoquista #msg');

        $("#telaPainelEstoquista #modalSolicitarTransferencia").modal('hide');
        $scope.state = STATE_LISTA;
        $scope.objSelecionado.materialDepositoSaidaReserva = {};

        PainelEstoquistaService.listar($scope.filtro, retornoListar, trataErroServidor);
    }

    $scope.alteraDivPainelEstoquista = function (exibe) {
        $scope.divPainelEstoquistaManutencao = exibe;
        if ($scope.divPainelEstoquistaManutencao === false) {
            $scope.abrirTelaTransferencia();
        } else {
            $("#manutPainelEstoquista .popup-manutencao").hide("fade");
            $scope.state = STATE_LISTA;
        }
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    $scope.abrirTelaTransferencia = function (obj) {
        $scope.divPainelEstoquistaManutencao = false;
        if (obj) {
            $scope.objTransf = {};
            $scope.objTransf.material = $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.material;
            $scope.objTransf.depositoOrigem = obj.deposito;
            $scope.objTransf.depositoDestino = $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.deposito;
            $scope.objTransf.quantidadeDisponivel = obj.quantidade;
            $scope.objTransf.quantidadeTransferencia = $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.quantidade;
        }
    };

    $scope.alterarDepositoOrigem = function () {
        if ($scope.objTransf.depositoOrigem && $scope.objTransf.material) {
            loading.loading();
            var obj = angular.copy($scope.objSelecionado);
            if ($scope.objSelecionado.materialDepositoSaidaReserva) {
                obj = angular.copy($scope.objSelecionado.materialDepositoSaidaReserva);
            }
            obj.rmMaterial = obj.rmMaterial ? obj.rmMaterial : {};
            obj.rmMaterial.deposito = $scope.objTransf.depositoOrigem;
            obj.rmMaterial.material = $scope.objTransf.material;

            $scope.objTransf.quantidadeDisponivel = 0;
            PainelEstoquistaService.getMaterialDeposito(obj, retornoAlterarDepositoOrigem, trataErroServidor);
        }
    };

    function retornoAlterarDepositoOrigem(data) {
        loading.ready();
        if (data.quantidade) {
            $scope.objTransf.quantidadeDisponivel = data.quantidade;
        }
    }

    $scope.salvarTransferencia = function () {

        if (Util.validaCamposDoFormulario("#telaPainelEstoquista #formTransferencia") > 0) {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaPainelEstoquista #msg');
            return;
        }

        if ($scope.objTransf.material.patrimoniado == 'S') {
            exibeDanger("msg_bloq_transf_equip_patrimoniados");
            return;
        }

        if (parseInt($scope.objTransf.quantidadeDisponivel) === 0) {
            exibeDanger("label_item_indisponivel_no_deposito");
            return;
        }
        if (parseFloat($scope.objTransf.quantidadeTransferencia) === 0) {
            exibeDanger("msg_material_quantidade_zero");
            return;
        }
        if (parseFloat($scope.objTransf.quantidadeTransferencia) > parseFloat($scope.objTransf.quantidadeDisponivel)) {
            exibeDanger("msg_quantidade_retirada_maior_quantidade_solicitada");
            return;
        }
        if ($scope.objTransf.depositoOrigem.depositoId === $scope.objTransf.depositoDestino.depositoId) {
            exibeDanger("msg_selecione_depositos_diferentes");
            return;
        }

        loading.loading();
        var obj = $scope.objTransf;
        if ($scope.objSelecionado.materialDepositoSaidaReserva) {
            obj.quantidadeSolicitada = $scope.objSelecionado.materialDepositoSaidaReserva.quantidadeSolicitada;
            obj.materialDepositoSaidaReserva = $scope.objSelecionado.materialDepositoSaidaReserva;
            obj.rmMaterial = $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial;
        }

        delete obj.quantidadeDisponivel;
        PainelEstoquistaService.salvarTransferencia(obj, retornoSalvarTransferencia, trataErroServidor);

    };

    function exibeDanger(msg) {
        var mensagem = {mensagem: msg, tipo: "danger"};
        $scope.alerts = Util.formataAlert(mensagem, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaPainelEstoquista #msg');
    }

    function retornoSalvarTransferencia(data) {
        loading.ready();
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaPainelEstoquista #msg');

        $scope.state = STATE_LISTA;
        $scope.divPainelEstoquistaManutencao = true;
        $scope.objSelecionado.materialDepositoSaidaReserva = {};
        $scope.objTransf = {};

        PainelEstoquistaService.listar($scope.filtro, retornoListar, trataErroServidor);
    }

    $scope.listar = function () {
        loading.loading();
        $scope.filtro.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();
        $scope.filtro.paginacaoVo.limiteConsulta = 15;
        $scope.filtro.paginacaoVo.qtdeRegPagina = 15;
        PainelEstoquistaService.listar($scope.filtro, retornoListar, trataErroServidor);
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
            PainelEstoquistaService.listar($scope.filtro, retornoListar, trataErroServidor);
        }
    };

    $scope.limparFiltro = function () {
        $scope.filtro = new FiltroPainelEstoquista();
    };

    $scope.aceitarMaterial = function () {
        $scope.prefixoEquipamento = {};
        $scope.listaPrefixoEquipamento = [];
        $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.qtdRetirado = $scope.objSelecionado.materialDepositoSaidaReserva.quantidadeSolicitada;

        $("#telaPainelEstoquista #modalAprovarMaterial").modal('show');
    };

    $scope.fecharModalAprovarMaterial = function () {
        $("#telaPainelEstoquista #modalAprovarMaterial").modal('hide');
    };

    $scope.salvarAceite = function () {
        //verifica se é requisição de frente de serviço, se for, verifica se o depósito está preenchido
        if ($scope.tipoRequisicaoCampo) {
            if ($scope.objSelecionado.materialDepositoSaidaReserva.deposito == null) {
                $("#modalAprovarMaterial #manutCadastroDeposito").addClass("campo-obrigatorio");
                $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
                Util.msgShowHide('#telaPainelEstoquista #msg');

                return;
            }
        }

        //Verifica quantidade do prefixo equipamento.
        var liberaSalvarAceite = true;
        if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.material.tipoMaterial.codigo == 'C' && $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.material.patrimoniado == 'S') {
            if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.qtdRetirado != $scope.listaPrefixoEquipamento.length) {
                liberaSalvarAceite = false;
            } else {
                //Concatena para enviar para o java
                var prefixoEquipamento = "";
                for (var i = 0; i < $scope.listaPrefixoEquipamento.length; i++) {
                    prefixoEquipamento = prefixoEquipamento + $scope.listaPrefixoEquipamento[i] + ";";
                }
                $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.prefixoEquipamento = prefixoEquipamento;

            }
        }
        if (liberaSalvarAceite == true) {

            //Verificação, caso a quantidade digitada seja maior que a quantidade solicitada.
            if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.qtdRetirado < $scope.objSelecionado.materialDepositoSaidaReserva.quantidadeSolicitada) {

                if (!$scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.observacaoEstoquista) {
                    var mensagem = {mensagem: "msg_justificativa_estoque_menor_qtde", tipo: "danger"};
                    $scope.alerts = Util.formataAlert(mensagem, $scope.ResourceBundle, ALERT_DEFAULT);
                    Util.msgShowHide('#telaPainelEstoquista #msg');

                    return;
                }

            }
            if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.qtdRetirado <= $scope.objSelecionado.materialDepositoSaidaReserva.quantidadeSolicitada) {
                if (Util.validaCamposDoFormulario("#telaPainelEstoquista #formModalAprovarMaterial") === 0) {

                    loading.loading();

                    if (!$scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.observacaoEstoquista) {
                        $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.observacaoEstoquista = $scope.ResourceBundle["label_aceite_total_quantidade"];
                    }

                    PainelEstoquistaService.salvarAceite($scope.objSelecionado.materialDepositoSaidaReserva, retornoSalvarAceite, trataErroServidor);
                } else {
                    $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
                    Util.msgShowHide('#telaPainelEstoquista #msg');
                }
            } else {

                var mensagem = {mensagem: "msg_quantidade_aceita_maior_solicitada", tipo: "danger"};
                $scope.alerts = Util.formataAlert(mensagem, $scope.ResourceBundle, ALERT_DEFAULT);
                Util.msgShowHide('#telaPainelEstoquista #msg');
            }
        } else {
            var mensagem = {mensagem: "msg_quantidade_equipamento_prefixo_igual_aceite", tipo: "danger"};
            $scope.alerts = Util.formataAlert(mensagem, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaPainelEstoquista #msg');
        }
    };

    function retornoSalvarAceite(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaPainelEstoquista #msg');

        $("#telaPainelEstoquista #modalAprovarMaterial").modal('hide');
        $scope.state = STATE_LISTA;
        $scope.objSelecionado.materialDepositoSaidaReserva = {};

        PainelEstoquistaService.listar($scope.filtro, retornoListar, trataErroServidor);
    }

    $scope.recusarMaterial = function () {
        if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.fluxoMaterial === 'Compra') {
            var mensagem = {mensagem: "msg_compra_recusa_painel_estoquista", tipo: "danger"};
            $scope.alerts = Util.formataAlert(mensagem, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaPainelEstoquista #msg');

        } else {
            $("#telaPainelEstoquista #modalReprovarMaterial").modal('show');
        }
    };

    $scope.fecharModalReprovarMaterial = function () {
        $("#telaPainelEstoquista #modalReprovarMaterial").modal('hide');
    };

    $scope.salvarRecusa = function () {
        if (Util.validaCamposDoFormulario("#telaPainelEstoquista #formModalReprovarMaterial") === 0) {
            loading.loading();

            PainelEstoquistaService.salvarRecusar($scope.objSelecionado.materialDepositoSaidaReserva, retornoSalvarRecusa, trataErroServidor);
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaPainelEstoquista #msg');
        }
    };

    function retornoSalvarRecusa(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaPainelEstoquista #msg');

        $("#telaPainelEstoquista #modalReprovarMaterial").modal('hide');
        if (data && !data.erro) {
            $scope.objSelecionado.materialDepositoSaidaReserva = null;
            $scope.state = STATE_LISTA;
        }

        PainelEstoquistaService.listar($scope.filtro, retornoListar, trataErroServidor);
    }

    $scope.abrirModalReceberMaterial = function () {
        loading.loading();
        PainelEstoquistaService.getQuantidadeRecebimentos($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial, retornoAbrirModalReceberMaterial, trataErroServidor);
    };

    function retornoAbrirModalReceberMaterial(info) {

        if (info && !info.erro) {
            var obj = info.objeto;
            $scope.recebimentoMaterial = {rmMaterial: $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial};
            $scope.recebimentoMaterial.maxItens = obj.quantidade;
            $scope.recebimentoMaterial.saldoItens = obj.quantidade - obj.qtdRecebido;
            if ($scope.recebimentoMaterial.saldoItens > 0) {
                $("#telaPainelEstoquista #modalReceberMaterial").modal('show');
            } else {
                var mensagem = {mensagem: "msg_mat_nao_possui_qtde_recebimento", tipo: "danger"};
                $scope.alerts = Util.formataAlert(mensagem, $scope.ResourceBundle, ALERT_DEFAULT);
                Util.msgShowHide('#telaPainelEstoquista #msg');
            }

        } else {
            $scope.alerts = Util.formataAlert(info, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaPainelEstoquista #msg');
        }


        loading.ready();
    }

    $scope.validaEquipamentoEpi = function () {
        PainelEstoquistaService.verificaEquipamentoEpi($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.material, retornoVerificaEquipamentoEpi, trataErroServidor);
    };

    function retornoVerificaEquipamentoEpi(isEquipamentoEpi) {
        if (isEquipamentoEpi.valorBoolean == false) {
            $scope.abrirModalRetirarMateriais();
        } else {
            var mensagem = {mensagem: "msg_verifica_equipamentos_epi", tipo: "danger"};
            $scope.alerts = Util.formataAlert(mensagem, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaPainelEstoquista #msg');
        }
    }

    $scope.abrirModalRetirarMateriais = function () {
        $scope.objCopiaMatDepositoSaida.radio = {};
        $scope.quantidadeRetirada = {};
        $scope.retiradoPor = {};
        loading.loading();
        PainelEstoquistaService.getQuantidadeRetirada($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial, retornoAbrirModalRetirarMaterial, trataErroServidor);
    };

    function retornoAbrirModalRetirarMaterial(quantidade) {
        $scope.retirarMaterial = {rmMaterial: $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial};
        $scope.quantidadeDisponivelRetirada = quantidade.valorDouble;
        PainelEstoquistaService.listaMaterialDepositoSaida($scope.objSelecionado.materialDepositoSaidaReserva, retornoListaMaterialDepositoSaida, trataErroServidor);
    }

    function retornoListaMaterialDepositoSaida(data) {
        $scope.listaMatDepositoSaida = [];
        if (data.length > 0) {
            $scope.listaMatDepositoSaida = data;
        }
        if ($scope.listaMatDepositoSaida.length > 0) {
            $("#telaPainelEstoquista #modalRetirarMaterial").modal('show');
        } else {
            var mensagem = {mensagem: "msg_mat_nao_possui_qtde_retirada", tipo: "danger"};
            $scope.alerts = Util.formataAlert(mensagem, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaPainelEstoquista #msg');
        }

        loading.ready();
    }

    $scope.abrirModalSalvarRecebimento = function () {
        if (validaReceberMaterial()) {
            $("#telaPainelEstoquista #modalConfirmaRecebimentoMaterial").modal('show');
        }
    };

    $scope.abrirModalReservarMaterial = function () {
        if (validaReceberMaterial()) {
            $("#telaPainelEstoquista #modalConfirmaReservarMaterial").modal('show');
        }
    };
    $scope.abrirModalRetirarMaterialComBiometria = function () {
        if (Util.validaCamposDoFormulario("#telaPainelEstoquista #formModalRetirarMaterial") === 0) {
            //Verifico se a quantidade que vai ser enviada para a retirada, é maior que a disponivel no deposito, se for maior, o mesmo envia um "danger".
            //Verifico se a quantidade que vai ser enviada para a retirada, é maior que a disponivel no deposito, se for maior, o mesmo envia um "danger".
            if ($scope.quantidadeRetirada.quantidade <= $scope.objCopiaMatDepositoSaida.radio.quantidade) {
                $("#telaPainelEstoquista #modalConfirmaEfetuarRetiradaMaterialComBiometrica").modal('show');
            } else {
                var mensagem = {mensagem: "msg_qtde_indisponivel_dep", tipo: "danger"};
                $scope.alerts = Util.formataAlert(mensagem, $scope.ResourceBundle, ALERT_DEFAULT);
                Util.msgShowHide('#telaPainelEstoquista #msg');
            }
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaPainelEstoquista #msg');
            return false;
        }
    };

    $scope.abrirModalRetirarMaterialNaoPresencial = function () {
        if (Util.validaCamposDoFormulario("#telaPainelEstoquista #formModalRetirarMaterial") === 0) {
            //Verifico se a quantidade que vai ser enviada para a retirada, é maior que a disponivel no deposito, se for maior, o mesmo envia um "danger".
            if ($scope.quantidadeRetirada.quantidade <= $scope.objCopiaMatDepositoSaida.radio.quantidade) {
                $("#telaPainelEstoquista #modalConfirmaEfetuarRetiradaMaterialNaoPresencial").modal('show');
            } else {
                var mensagem = {mensagem: "msg_qtde_indisponivel_dep", tipo: "danger"};
                $scope.alerts = Util.formataAlert(mensagem, $scope.ResourceBundle, ALERT_DEFAULT);
                Util.msgShowHide('#telaPainelEstoquista #msg');
            }
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaPainelEstoquista #msg');
            return false;
        }

    };


    $scope.salvarRecebimentoMaterial = function () {
        loading.loading();
        var obj = {};
        obj.quantidade = $scope.recebimentoMaterial.quantidade;
        obj.rmMaterial = $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial;
        obj.rmMaterial.deposito = $scope.recebimentoMaterial.deposito;
        obj.numeroNotaFiscal = $scope.recebimentoMaterial.numeroNotaFiscal;
        obj.stDataEmissaoNf = $scope.recebimentoMaterial.stDataEmissaoNf;
        var recebimento = {rmMaterialRecebimento: obj};
        PainelEstoquistaService.salvarRecebimentoMat(recebimento, retornoSalvarRecebimentoMaterial, trataErroServidor);
    };

    function retornoSalvarRecebimentoMaterial(data) {
        loading.ready();
        if (data) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaPainelEstoquista #msg');
            $("#telaPainelEstoquista #modalConfirmaEfetuarRetiradaMaterial").modal('hide');
            $("#telaPainelEstoquista #modalConfirmaReservarMaterial").modal('hide');
            $("#telaPainelEstoquista #modalReceberMaterial").modal('hide');
            if (!data.erro) {
                $scope.objSelecionado.materialDepositoSaidaReserva = null;
                $scope.state = STATE_LISTA;
                $scope.listar();
            }
        }
    }

    $scope.reservarMaterial = function () {
        $scope.receberMaterial(false);
    };

    $scope.retirarMaterialComBiometria = function () {
        loading.loading();
        var obj = {};
        obj.retiradoPor = $scope.retiradoPor.pessoa;
        obj.quantidade = $scope.quantidadeRetirada.quantidade;
        obj.comBiometria = true;
        obj.rmMaterial = $scope.objCopiaMatDepositoSaida.radio.materialDepositoSaidaReserva.rmMaterial;
        obj.deposito = $scope.objCopiaMatDepositoSaida.radio.materialDeposito.deposito;
        obj.quantidadeMaxDepSelecionado = $scope.objCopiaMatDepositoSaida.radio.quantidade;
        PainelEstoquistaService.salvarRetiroMaterial(obj, retornoSalvarRetiroMaterial, trataErroServidor);
    };

    $scope.retirarMaterialNaoPresencial = function () {
        loading.loading();
        var obj = {};
        obj.retiradoPor = $scope.retiradoPor.pessoa;
        obj.quantidade = $scope.quantidadeRetirada.quantidade;
        obj.comBiometria = false;
        obj.rmMaterial = $scope.objCopiaMatDepositoSaida.radio.materialDepositoSaidaReserva.rmMaterial;
        obj.deposito = $scope.objCopiaMatDepositoSaida.radio.materialDeposito.deposito;
        obj.quantidadeMaxDepSelecionado = $scope.objCopiaMatDepositoSaida.radio.quantidade;
        PainelEstoquistaService.salvarRetiroMaterial(obj, retornoSalvarRetiroMaterial, trataErroServidor);
    };

    function retornoSalvarRetiroMaterial(data) {
        loading.ready();
        if (data) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaPainelEstoquista #msg');
            $("#telaPainelEstoquista #modalConfirmaEfetuarRetiradaMaterial").modal('hide');
            $("#telaPainelEstoquista #modalConfirmaReservarMaterial").modal('hide');
            $("#telaPainelEstoquista #modalRetirarMaterial").modal('hide');
            if (!data.erro) {
                $scope.objSelecionado.materialDepositoSaidaReserva = null;
                $scope.state = STATE_LISTA;
                $scope.listar();
            }
        }
    }

    function validaReceberMaterial() {
        if (Util.validaCamposDoFormulario("#telaPainelEstoquista #formModalReceberMaterial") === 0) {
            if (parseFloat($scope.recebimentoMaterial.quantidade) > parseFloat($scope.recebimentoMaterial.saldoItens)) {
                var label = "msg_a_quantidade_inserida_supera_a_quantidade_de_materiais_a_serem_recebidos";
                var mensagem = {mensagem: label, tipo: "danger"};
                $scope.alerts = Util.formataAlert(mensagem, $scope.ResourceBundle, ALERT_DEFAULT);
                Util.msgShowHide('#telaPainelEstoquista #msg');
                return false;
            }
            return true;
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaPainelEstoquista #msg');
            return false;
        }
    }

    $scope.receberMaterial = function (op) {
        loading.loading();
        var obj = {};
        obj.quantidade = $scope.recebimentoMaterial.quantidade;
        obj.rmMaterial = $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial;
        obj.rmMaterial.deposito = $scope.recebimentoMaterial.deposito;
        var recebimento = {baixaMaterial: op, rmMaterialRecebimento: obj};
        PainelEstoquistaService.receberMaterial(recebimento, retornoReceberMaterial, trataErroServidor);
    };

    function retornoReceberMaterial(data) {
        loading.ready();
        if (data) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaPainelEstoquista #msg');

            $("#telaPainelEstoquista #modalConfirmaEfetuarRetiradaMaterial").modal('hide');
            $("#telaPainelEstoquista #modalConfirmaReservarMaterial").modal('hide');
            $("#telaPainelEstoquista #modalReceberMaterial").modal('hide');
            if (!data.erro) {
                $scope.objSelecionado.materialDepositoSaidaReserva = null;
                $scope.state = STATE_LISTA;
                $scope.listar();
            }
        }
    }

    $scope.habilitarBotaoAceitarMaterial = function () {
        if ($scope.state !== 'STATE_MANUT') {
            return false;
        }

        //Verifica se possui um objeto selecionado
        if (!$scope.objSelecionado.materialDepositoSaidaReserva) {
            return false;
        }

        //Caso nao esteja na div de requisicoes
        if (!$scope.divPainelEstoquistaManutencao) {
            return false;
        }

        //se ja foi aceitado ou recusado
        if ($scope.objSelecionado.materialDepositoSaidaReserva.dataAvaliacao) {
            return false;
        }

        //se o material ja foi comprado
        if ($scope.materialSapComprado) {
            return false;
        }

        //se nao possui estoque disponivel
        if ($scope.materialSelecionado.indisponivel) {
            return false;
        }

        //Se for uma compra pra estoque, apenas habilita o recebimen to manual
        if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.coletorEstoque == true) {
            return false;
        }

        //se estiver aguardando compra
        if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.fluxoMaterial === 'Compra') {
            return false;
        }

        //Requisicao de campo e item indisponivel
        if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.fluxoMaterial === 'Campo' &&
            $scope.objSelecionado.rmMaterialStatus.status.codigo === 'Indisp' &&
            ($scope.objSelecionado.materialDepositoSaidaReserva.quantidadeSolicitada > $scope.quantidadeDisponivelEstoque)) {
            return false;
        }

        return true;
    };

    $scope.habilitarBotaoRecusarMaterial = function () {
        if ($scope.state !== 'STATE_MANUT') {
            return false;
        }

        //Verifica se possui um objeto selecionado
        if (!$scope.objSelecionado.materialDepositoSaidaReserva) {
            return false;
        }

        //Caso nao esteja na div de requisicoes
        if (!$scope.divPainelEstoquistaManutencao) {
            return false;
        }

        //se ja foi aceitado ou recusado
        if ($scope.objSelecionado.materialDepositoSaidaReserva.dataAvaliacao) {
            return false;
        }

        //se o material ja foi comprado
        if ($scope.materialSapComprado) {
            return false;
        }

        //Se for uma compra pra estoque, apenas habilita o recebimento manual
        if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.coletorEstoque) {
            return false;
        }

        //se estiver aguardando compra
        if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.fluxoMaterial === 'Compra') {
            return false;
        }

        return true;
    };

    $scope.habilitarBotaoSolicitarTransferencia = function () {
        if ($scope.state !== 'STATE_MANUT') {
            return false;
        }

        if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.fluxoMaterial !== 'Campo') {
            return false;
        }

        //se nao possui estoque disponivel
        if (!$scope.materialSelecionado.indisponivel) {
            return false;
        }

        //se estiver aguardando compra
        if ($scope.objSelecionado.materialDepositoSaidaReserva.quantidadeSolicitada <= $scope.quantidadeDisponivelEstoque) {
            return false;
        }

        return true;
    };

    $scope.habilitarBotaoReceberMaterial = function () {
        if ($scope.state !== 'STATE_MANUT') {
            return false;
        }

        //Verifica se possui um objeto selecionado
        if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.fluxoMaterial !== 'Compra') {
            return false;
        }

        //se ja foi aceitado ou recusado
        if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.isRecSap) {
            return false;
        }

        return true;
    };

    $scope.habilitarBotaoRetirarMaterial = function () {
        if ($scope.state !== 'STATE_MANUT') {
            return false;
        }

        //se ja foi aceitado ou recusado
        if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.fluxoMaterial === 'Campo') {
            return false;
        }

        //Verifica se possui um objeto selecionado
        if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.coletorEstoque) {
            return false;
        }

        return true;
    };

    $scope.labelBotaoRecusar = function () {
        if ($scope.state !== 'STATE_MANUT') {
            return;
        }

        //Verifica se possui um objeto selecionado
        if (!$scope.objSelecionado.materialDepositoSaidaReserva) {
            return;
        }

        if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.rm.tipoRequisicao.codigo === 'TIP_REQ_MANUTENCAO' ||
            $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.rm.tipoRequisicao.codigo === 'TIP_REQ_MAT') {

            return $scope.ResourceBundle['label_enviar_para_compra'];
        } else {
            return $scope.ResourceBundle['label_recusar_material'];
        }
    };

    $scope.glyphiconBotaoRecusar = function () {
        if ($scope.state !== 'STATE_MANUT') {
            return;
        }

        //Verifica se possui um objeto selecionado
        if (!$scope.objSelecionado.materialDepositoSaidaReserva) {
            return;
        }

        if ($scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.rm.tipoRequisicao.codigo === 'TIP_REQ_MANUTENCAO' ||
            $scope.objSelecionado.materialDepositoSaidaReserva.rmMaterial.rm.tipoRequisicao.codigo === 'TIP_REQ_MAT') {
            return 'glyphicon glyphicon-send';
        } else {
            return 'glyphicon glyphicon-remove';
        }
    };

    function trataErroServidor(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_ERRO_COMUNICACAO_SERVIDOR);
        Util.msgShowHide('#telaPainelEstoquista #msg');
        loading.ready();
    }

    $scope.affix = function () {
        Util.affix();
    };

    $scope.alterarMaterial = function (obj) {
        $scope.vwMaterialDepositoSaidaReservaAux = new VwMaterialDepositoSaidaReserva(obj);

        $scope.quantidadeMaterialAlterado = null;
        $scope.objAlterarMaterial = new RmMaterial(obj.materialDepositoSaidaReserva.rmMaterial);
        $scope.objAlterarMaterialAux = new RmMaterial(obj.materialDepositoSaidaReserva.rmMaterial);
        $scope.objAlterarMaterial.material = null;

        $scope.vo = new PainelEstoquistaVo(obj);

        $("#telaPainelEstoquista #modalAlterarMaterialPainelEstoquista").modal('show');

    };

    $scope.salvarAlterarMaterial = function () {
        loading.loading();
        $scope.vo.materialAtual.codMaterialAnterior = $scope.objAlterarMaterial.material.codigo;
        $scope.vo.materialAtual.material = $scope.objAlterarMaterial.material;
        $scope.vo.materialAtual.justificativaAlteracaoMaterial = $scope.objAlterarMaterial.justificativaAlteracaoMaterial;
        PainelEstoquistaService.alterarMaterial($scope.vo, retornoSalvarAlterarMaterial, trataErroServidor);
    };

    function retornoSalvarAlterarMaterial(data) {
        if (data && data.mensagem === $scope.ResourceBundle['label_item_indisponivel_no_deposito']) {
            $scope.alerts = Util.formataAlert("danger", data.mensagem, NEW_ALERT);
            Util.msgShowHide('#telaPainelEstoquista #msg');
            $scope.materialAlteradoIndisponivel = true;
            $scope.quantidadeMaterialAlterado = 0;
        }
        else {
            $scope.vwMaterialDepositoSaidaReservaAux.materialDepositoSaidaReserva.rmMaterial = new RmMaterial(data.objeto);
            $("#telaPainelEstoquista #modalAlterarMaterialPainelEstoquista").modal('hide');
            Arrays.add($scope.lista, new VwMaterialDepositoSaidaReserva($scope.vwMaterialDepositoSaidaReservaAux));
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaPainelEstoquista #msg');
            $scope.materialAlteradoIndisponivel = false;
        }

        loading.ready();
    }

    $scope.verificaMaterialIndisponivel = function () {
        loading.loading();
        PainelEstoquistaService.verificaMaterialIndisponivel($scope.objAlterarMaterial, retornoVerificaMaterialIndisponivel, trataErroServidor);
    };

    function retornoVerificaMaterialIndisponivel(data) {
        if (data && data.codigo === "002") {
            $scope.alerts = Util.formataAlert("danger", data.mensagem, NEW_ALERT);
            Util.msgShowHide('#telaPainelEstoquista #msg');
            $scope.materialAlteradoIndisponivel = true;
        }
        else
            $scope.materialAlteradoIndisponivel = false;
        $scope.quantidadeMaterialAlterado = data.objeto;
        loading.ready();
    }
}