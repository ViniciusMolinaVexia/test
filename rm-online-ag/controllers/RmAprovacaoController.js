/**
 * Configuração dos métodos que serão requisitados pela View, onde serão responsáveis
 * por controlar iteração entre a View e os Serviços (Persistência, Consultas, Exclusões, etc)
 *
 * @author Nextage
 *
 * @param $scope Escopo de váriaveis do Controller / View
 * @param {type} loading
 * @param {type} ResourceBundle
 * @param {type} rmAprovacaoService
 * @param {type} AutoComplete
 * @param {type} $timeout
 * @param {type} Combo
 * @param {type} AnexoService
 * @param {type} RmaService
 * @returns {mmoServ}
 */
function rmAprovacaoServ($scope, loading, rmAprovacaoService, AnexoService,
    ResourceBundle, Combo, AutoComplete, $timeout, RmaService, AnexoServicoService) {

    $scope.ResourceBundle = CarregaResourceBundle($scope, ResourceBundle);

    $scope.state = STATE_LISTA;

    $scope.OPERACAO_PEP = OPERACAO_PEP;
    $scope.DIAGRAMA_DE_REDE = DIAGRAMA_DE_REDE;
    $scope.ORDEM = ORDEM;
    $scope.ESTOQUE = ESTOQUE;

    $scope.verificaObrigValor = false;

    $scope.comboGerenteCusto = CarregaComboGerenteCustos(Combo);
    $scope.comboGerenteObra = CarregaComboGerenteObra(Combo);
    $scope.comboEquipeCustos = CarregaComboEquipeCustos(Combo);
    $scope.listaCentros = CarregaComboCentros(Combo);
    $scope.listaTipoRequisicao = CarregaComboTipoRequisicao(Combo);

    $scope.TIPO_REQUISICAO_MANUTENCAO = TIPO_REQUISICAO_MANUTENCAO;
    $scope.TIP_REQ_MAT = TIP_REQ_MAT;

    $scope.objColetorCusto = [];
    $scope.listaAuxAprovar = [];

    $scope.filtro = new FiltroRmAprovacao().getNovo();
    $scope.lista = [];

    $scope.configuracao = UtilConfiguracao.getConfiguracaoSessao(SIGLA_MODULO);

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

    $scope.getAutoCompletePessoa = function(value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;

        return AutoComplete.CarregaAutoCompletePessoas(filtroAutoComplete);
    };

    $scope.getAutoCompleteGerenteAreaEncarregado = function(value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;

        if ($scope.configuracao.habilitaEapMultiEmpresa != null && $scope.configuracao.habilitaEapMultiEmpresa == true) {
            if ($scope.objSelecionado.rmAprovador.rm != null && $scope.objSelecionado.rmAprovador.rm.eapMultiEmpresa != null) {
                var eapMultiEmpresaId = $scope.objSelecionado.rmAprovador.rm.eapMultiEmpresa.id;
            }
        }

        var gsonString;
        if (eapMultiEmpresaId != null) {
            gsonString = "{" + '"' + "isGerenteArea" + '"' + ":" + '"' + $scope.compra + '"' + ", " + '"' + "eapMultiEmpresaId" + '":"' + eapMultiEmpresaId + '"' + "}";
        } else {
            gsonString = "{" + '"' + "isGerenteArea" + '"' + ":" + '"' + $scope.compra + '"' + "}";
        }

        filtroAutoComplete.objetoFiltro = gsonString;

        return AutoComplete.CarregaAutoCompleteGerenteAreaEncarregado(filtroAutoComplete);
    };

    $scope.listar = function() {
        loading.loading();

        var paginacao = new PaginacaoVo();
        paginacao.pagina = 1;
        paginacao.limiteConsulta = 15;
        paginacao.qtdeRegPagina = 15;

        $scope.filtro.paginacaoVo = paginacao;
        $scope.filtro.usuario = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);
        console.log($scope.filtro);
        rmAprovacaoService.listar($scope.filtro, retornoListar, trataErroServidor);
    };

    function retornoListar(data) {
        console.log(data);
        if (data) {
            $scope.filtro.paginacaoVo = data;
            $scope.lista = data.itensConsulta;
            $scope.paginaAtiva = data.pagina;
            $scope.numPaginas = Math.ceil($scope.filtro.paginacaoVo.qtdeRegistros / $scope.filtro.paginacaoVo.limiteConsulta);
            //console.log($scope.lista[0]);
        }
        loading.ready();
    }

    $scope.irParaPaginaEspecifica = function(pagina) {
        var paginaAtual = $scope.filtro.paginacaoVo.pagina;
        // somente irá fazer a pesquisa se clicar em uma página diferente da atual
        if (pagina !== paginaAtual) {
            loading.loading();
            $scope.filtro.paginacaoVo.pagina = pagina;
            rmAprovacaoService.listar($scope.filtro, retornoListar, retornoErro);
        }
    };

    $scope.editar = function(id) {
        loading.loading();
        console.log($scope.filtro);
        $scope.filtro.idRmAprovacao = id;
        rmAprovacaoService.selectUniqueRmAprovador($scope.filtro, retornoEditar, trataErroServidor);
    };

    function retornoEditar(data) {
        if (data) {
            $scope.objSelecionado = data;
            console.log(data);

            //Carrega o combo novamente se tiver eap ligada com a RM.
            if ($scope.objSelecionado != null && $scope.objSelecionado.rmAprovador != null &&
                $scope.objSelecionado.rmAprovador.rm != null && $scope.objSelecionado.rmAprovador.rm.eapMultiEmpresa != null &&
                $scope.configuracao.habilitaEapMultiEmpresa != null && $scope.configuracao.habilitaEapMultiEmpresa == true) {
                $scope.comboGerenteCusto = CarregaComboGerenteCustosEap(Combo, $scope.objSelecionado.rmAprovador.rm.eapMultiEmpresa.id);
                $scope.comboEquipeCustos = CarregaComboEquipeCustosEap(Combo, $scope.objSelecionado.rmAprovador.rm.eapMultiEmpresa.id);
            }

            $scope.atuacaoCusto = false;

            if ($scope.objSelecionado.rmAprovador.dataAvaliacao) {
                var info = {};
                if ($scope.objSelecionado.rmAprovador.tipoAprovador === TIPO_APROVADOR_CUSTOS) {
                    info = { mensagem: "label_requisicao_ja_complementada", tipo: "warning" };
                } else {
                    info = { mensagem: "label_requisicao_ja_avaliada", tipo: "warning" };
                }
                $scope.alerts = Util.formataAlert(info, $scope.ResourceBundle, ALERT_DEFAULT);
                Util.msgShowHide('#telaRmAprovacao #msg');
            }

            if ($scope.objSelecionado.rmAprovador.tipoAprovador == "LC" ||
                $scope.objSelecionado.rmAprovador.tipoAprovador == "GC" ||
                $scope.objSelecionado.rmAprovador.tipoAprovador == "C") {
                $scope.atuacaoCusto = true;
            }

            validaExibicaoCampos();

            $scope.state = STATE_MANUT;
            $('.popup-manutencao').show("fade");
        }
    }

    function validaExibicaoCampos() {
        $scope.exibirCamposCustos = false;
        $scope.bloquearCamposCustos = false;
        $scope.aprovadorCustos = false;
        $scope.aprovadorGerenteCustos = false;
        $scope.aprovadorLiderCustos = false;
        $scope.exibirComboCustosRRE = false;
        $scope.exibirComboGerenteObra = false;
        $scope.bloquearComboGerenteCustos = false;
        $scope.bloquearComboGerenteObra = false;
        $scope.exibirComboGerenteArea = false;
        $scope.frenteDeServico = false;
        $scope.bloquearBotaoAprovarReprovar = false;
        $scope.bloqueiaComboGerenteCustos = false;
        $scope.requisicaoRetiradaEstoquistaCusto = false;
        $scope.requisicaoRetiradaResponsavelEstoque = false;
        $scope.requisicaoFrenteServico = false;
        $scope.painelAprovarServico = 0;

        console.log($scope.objSelecionado);

        if ($scope.objSelecionado.rmAprovador.nivelAprovador === 'CUSTO') {
            $scope.exibirCamposCustos = true;
            $scope.aprovadorLiderCustos = true;
        }

        if ($scope.objSelecionado.rmAprovador.rm.tipoRm === 'SER') {
            $scope.painelAprovarServico = 1;
            $scope.aprovadorLiderCustos = false;
            $scope.exibirCamposCustos = false;
        } else {
            $scope.painelAprovarServico = 0;
        }

        if ($scope.objSelecionado.rmAprovador.tipoAprovador === TIPO_APROVADOR_GERENTE_CUSTO) {
            $scope.exibirCamposCustos = true;
            $scope.bloquearComboGerenteCustos = true;
            $scope.aprovadorGerenteCustos = true;
        }

        if ($scope.objSelecionado.rmAprovador.tipoAprovador === TIPO_APROVADOR_GERENTE_OBRA) {
            $scope.exibirCamposCustos = false;
            $scope.bloquearComboGerenteCustos = true;
            $scope.exibirComboGerenteObra = true;
            $scope.bloquearComboGerenteObra = true;
        }

        if ($scope.objSelecionado.rmAprovador.tipoAprovador === TIPO_APROVADOR_CUSTOS) {
            if ($scope.objSelecionado.rmAprovador.rm.tipoRequisicao &&
                $scope.objSelecionado.rmAprovador.rm.tipoRequisicao.codigo &&
                ($scope.objSelecionado.rmAprovador.rm.tipoRequisicao.codigo === TIPO_REQUISICAO_RESP_ESTOQ || $scope.objSelecionado.rmAprovador.rm.tipoRequisicao.codigo === TIPO_REQUISICAO_RET_ESTOQUISTA)) {
                $scope.aprovadorCustos = false;
                $scope.exibirCamposCustos = false;
            } else {
                $scope.aprovadorCustos = true;
                $scope.exibirCamposCustos = true;
            }

            if ($scope.objSelecionado.rmAprovador.aprovada) {
                $scope.bloquearCamposCustos = true;
                $scope.bloquearComboGerenteCustos = true;
            }
        }

        if ($scope.objSelecionado.rmAprovador.rm.tipoRequisicao &&
            $scope.objSelecionado.rmAprovador.rm.tipoRequisicao.codigo &&
            ($scope.objSelecionado.rmAprovador.rm.tipoRequisicao.codigo === TIPO_REQUISICAO_RESP_ESTOQ || $scope.objSelecionado.rmAprovador.rm.tipoRequisicao.codigo === TIPO_REQUISICAO_RET_ESTOQUISTA)) {
            $scope.bloqueiaComboGerenteCustos = true;
        }

        if ($scope.objSelecionado.rmAprovador.tipoAprovador === TIPO_APROVADOR_RESP_RET_ESTOQ) {
            $scope.exibirComboCustosRRE = false;
            $scope.exibirCamposCustos = false;
            $scope.requisicaoRetiradaResponsavelEstoque = false;
            $scope.requisicaoRetiradaEstoquistaCusto = false;
        }

        // Caso for frente de serviço exibir botões:
        // Salvar, Encaminhar estoquista, Atribuir para ...
        if ($scope.objSelecionado.rmAprovador.rm.tipoRequisicao &&
            $scope.objSelecionado.rmAprovador.rm.tipoRequisicao.codigo &&
            $scope.objSelecionado.rmAprovador.rm.tipoRequisicao.codigo === TIPO_REQUISICAO_FRENTE_SERVICO) {
            $scope.frenteDeServico = true;
            if ($scope.objSelecionado.rmAprovador.rm.atribuidoPara) {
                $scope.objSelecionado.pessoaCusto = $scope.objSelecionado.rmAprovador.rm.atribuidoPara;
            }
        }

        if ($scope.objSelecionado.rmAprovador.tipoAprovador === TIPO_APROVADOR_COORDENADOR) {
            $scope.exibirComboGerenteArea = true;
        }

        $timeout(function() {
            $scope.objColetorCusto = [];
            if ($scope.objSelecionado && $scope.objSelecionado.listaRmMaterial) {
                for (var i = 0; i < $scope.objSelecionado.listaRmMaterial.length; i++) {
                    var obj = $scope.objSelecionado.listaRmMaterial[i].rmMaterial;
                    if (obj.coletorCustos) {
                        $scope.objColetorCusto[i] = OPERACAO_PEP;
                        $scope.changeColetorCusto(OPERACAO_PEP, i);
                    } else if (obj.operacao || obj.diagramaRede) {
                        $scope.objColetorCusto[i] = DIAGRAMA_DE_REDE;
                        $scope.changeColetorCusto(DIAGRAMA_DE_REDE, i);
                    } else if (obj.coletorOrdem) {
                        $scope.objColetorCusto[i] = ESTOQUE;
                        $scope.changeColetorCusto(ESTOQUE, i);
                    } else if (obj.coletorEstoque) {
                        $scope.objColetorCusto[i] = ESTOQUE;
                        $scope.changeColetorCusto(ESTOQUE, i);
                    } else {
                        $scope.objColetorCusto[i] = OPERACAO_PEP;
                        $scope.changeColetorCusto(OPERACAO_PEP, i);
                    }

                    if ($scope.objSelecionado.listaRmMaterial[i].rmMaterialStatus.status.codigo === "Can") {
                        $scope.objColetorCusto[i] = null;
                    }
                }
            }
        });

        if ($scope.objSelecionado.rmAprovador.rm.dataCancelamento != null) {
            $scope.bloquearBotaoAprovarReprovar = true;
        } else {
            $scope.bloquearBotaoAprovarReprovar = false;
        }
        //mexer aqui HM
        console.log($scope.objSelecionado.rmAprovador.rm.tipoRm);
        if ($scope.objSelecionado.rmAprovador.rm.tipoRm == "SER") {
            loading.ready();
        } else {

            RmaService.verificarDepositos($scope.objSelecionado.rmAprovador.rm, retornoValidarQuantidadeDepositos, trataErroServidor);
        }
    }

    function retornoValidarQuantidadeDepositos(data) {
        if (data.materiaisCompra.length > 0) {
            $scope.compra = true;
        } else {
            $scope.compra = false;
        }

        $scope.mensagemMateriaisCautelados = false;
        for (var i = 0; i < $scope.objSelecionado.listaRmMaterial.length; i++) {
            if ($scope.objSelecionado.listaRmMaterial[i].rmMaterial.material.tipoMaterial.codigo === 'C') {
                $scope.mensagemMateriaisCautelados = true;
                break;
            }
        }

        loading.ready();
    }

    $scope.changeEstaNoOrcamento = function(index, valor) {
        var campo = "#telaRmAprovacao #valorOrcado" + index;
        if (valor === 'S') {
            $(campo).addClass("campo-obrigatorio");
            $scope.verificaObrigValor = true;
        } else {
            $(campo).removeClass("campo-obrigatorio");
            $scope.verificaObrigValor = false;
        }
    };

    $scope.fecharModalEnviarGerenteObra = function() {
        $('#telaRmAprovacao #modalGerenteObra').modal('hide');
    };

    $scope.salvarEnviarGerenteObra = function() {
        if (Util.validaCamposDoFormulario("#modalGerenteObra #formGerenteObra") === 0) {

            $scope.objSelecionado.verificaGerenteObra = true;
            $scope.objSelecionado.rmAprovador.aprovada = true;
            $scope.objSelecionado.usuario = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);

            rmAprovacaoService.aprovarReprovar($scope.objSelecionado, retornoSalvarEnviarGerenteObra, trataErroServidor);

        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaRmAprovacao #msg');
        }

    };


    function retornoSalvarEnviarGerenteObra(data) {
        if (data) {
            var msg = data.mensagem ? data.mensagem : "";
            if (msg.indexOf("label_") >= 0 || msg.indexOf("msg_") >= 0) {
                $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            } else {
                $scope.alerts = Util.formataAlert(data.tipo, msg, NEW_ALERT);
            }

            $scope.listaAuxAprovar = [];
            //Retira da lista a Rm aprovada
            if (data.codigo === "001") {
                for (var i = 0; i < $scope.lista.length; i++) {
                    if ($scope.lista[i].id !== $scope.objSelecionado.rmAprovador.id) {
                        $scope.listaAuxAprovar.push($scope.lista[i]);
                    }
                }
                $scope.lista = $scope.listaAuxAprovar;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                $scope.state = STATE_LISTA;
                $('#telaRmAprovacao .popup-manutencao').hide("fade");
                $scope.objSelecionado = null;
            }

            $('#telaRmAprovacao #modalGerenteObra').modal('hide');

            Util.msgShowHide('#telaRmAprovacao #msg');
        }

        loading.ready();
    }

    $scope.aprovarConfirma = function() {
        console.log("Entrou AprovarConfirma");
        if (Util.validaCamposDoFormulario("#telaRmAprovacao #formManutencao") === 0) {
            if ($scope.objSelecionado.rmAprovador.rm.prioridade.codigo === 'ALTA' &&
                ($scope.objSelecionado.rmAprovador.tipoAprovador === 'GA' ||
                    $scope.objSelecionado.rmAprovador.tipoAprovador === 'CO') &&
                ($scope.objSelecionado.rmAprovador.observacao === undefined ||
                    $scope.objSelecionado.rmAprovador.observacao === "" ||
                    $scope.objSelecionado.rmAprovador.observacao === null)) {

                $scope.alerts = Util.formataAlert("danger", Util.setParamsLabel($scope.ResourceBundle['msg_obrig_prioridade_alta_aprov']), NEW_ALERT);
                Util.msgShowHide('#telaRmAprovacao #msg');

                $("#telaRmAprovacao #observacaoRmAprovacao").addClass('campo-obrigatorio');
            } else {
                $("#telaRmAprovacao #observacaoRmAprovacao").removeClass("campo-obrigatorio");
                var aux = true;
                if ($scope.verificaObrigValor) {
                    for (var i = 0; i < $scope.objSelecionado.listaRmMaterial.length; i++) {
                        if (!$scope.objSelecionado.listaRmMaterial[i].rmMaterial.valorOrcado &&
                            $scope.objSelecionado.listaRmMaterial[i].rmMaterial.estaNoOrcamento === 'S') {
                            aux = false;
                        }
                    }
                }
                if (!aux) {
                    $scope.verificaObrigValor = true;
                } else {
                    $scope.verificaObrigValor = false;
                }

                if ((Util.validaCamposDoFormulario("#telaRmAprovacao #formManutencao") === 0) &&
                    (!$scope.verificaObrigValor)) {

                    if ($scope.objSelecionado.rmAprovador.tipoAprovador === TIPO_APROVADOR_CUSTOS && $scope.objSelecionado.rmAprovador.rm.tipoRequisicao.codigo !== TIPO_REQUISICAO_RESP_ESTOQ && $scope.objSelecionado.rmAprovador.rm.tipoRequisicao.codigo !== TIPO_REQUISICAO_RET_ESTOQUISTA) {
                        if ($scope.objSelecionado.rmAprovador.rm.gerenteCustos.pessoaId === $scope.objSelecionado.rmAprovador.rm.requisitante.pessoaId) {
                            $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_requisitante_igual_aprovador'], NEW_ALERT);
                            Util.msgShowHide('#telaRmAprovacao #msg');

                            return;
                        }
                    }

                    if ($scope.objSelecionado.rmAprovador.tipoAprovador === 'GA' ||
                        $scope.objSelecionado.rmAprovador.tipoAprovador === 'CO' ||
                        $scope.objSelecionado.rmAprovador.tipoAprovador === 'RRE') {
                        $("#telaRmAprovacao #diagramaRede" + i).removeClass('campo-obrigatorio');
                        $("#telaRmAprovacao #operacao" + i).removeClass('campo-obrigatorio');
                        $('#telaRmAprovacao #modalConfirmaAprovarRm').modal('show');
                    } else {
                        //valido se o coletor possui letras e numeros
                        // var re = new RegExp(".*([A-Za-z][0-9]|[0-9][A-Za-z]).*");
                        // for (var i = 0; i < $scope.objSelecionado.listaRmMaterial.length; i++) {
                        //     if ($scope.objColetorCusto[i] === OPERACAO_PEP) {
                        //         if ($scope.objSelecionado.listaRmMaterial[i].rmMaterial.coletorCustos !== null && $scope.objSelecionado.listaRmMaterial[i].rmMaterial.coletorCustos !== "") {
                        //             if (!re.test($scope.objSelecionado.listaRmMaterial[i].rmMaterial.coletorCustos)) {
                        //                 $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_coletor_custos_incorreto'], NEW_ALERT);
                        //                 Util.msgShowHide('#telaRmAprovacao #msg');

                        //                 $("#telaRmAprovacao #coletorCusto" + i).addClass('campo-obrigatorio');
                        //                 return;
                        //             } else {
                        //                 $("#telaRmAprovacao #coletorCusto" + i).removeClass('campo-obrigatorio');
                        //             }
                        //         } else {
                        //             $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
                        //             Util.msgShowHide('#telaRmAprovacao #msg');
                        //             $("#telaRmAprovacao #coletorCusto" + i).addClass("campo-obrigatorio");
                        //             return;


                        //         }
                        //     } else if ($scope.objColetorCusto[i] === DIAGRAMA_DE_REDE) {
                        //         if ($scope.objSelecionado.listaRmMaterial[i].rmMaterial.operacao !== null && $scope.objSelecionado.listaRmMaterial[i].rmMaterial.operacao !== "") {
                        //             if ($scope.objSelecionado.listaRmMaterial[i].rmMaterial.operacao.length < 4) {
                        //                 for (i = $scope.objSelecionado.listaRmMaterial[i].rmMaterial.operacao.length; i < 4; i++) {
                        //                     $scope.objSelecionado.listaRmMaterial[i].rmMaterial.operacao = '0' + $scope.objSelecionado.listaRmMaterial[i].rmMaterial.operacao;
                        //                 }
                        //             }
                        //             if (!re.test($scope.objSelecionado.listaRmMaterial[i].rmMaterial.diagramaRede)) {
                        //                 $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_diagrama_rede_incorreto'], NEW_ALERT);
                        //                 Util.msgShowHide('#telaRmAprovacao #msg');

                        //                 $("#telaRmAprovacao #diagramaRede" + i).addClass('campo-obrigatorio');
                        //                 $("#telaRmAprovacao #operacao" + i).removeClass('campo-obrigatorio');
                        //                 return;
                        //             } else {
                        //                 $("#telaRmAprovacao #diagramaRede" + i).removeClass('campo-obrigatorio');
                        //                 $("#telaRmAprovacao #operacao" + i).removeClass('campo-obrigatorio');
                        //             }
                        //         } else {
                        //             $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
                        //             Util.msgShowHide('#telaRmAprovacao #msg');
                        //             $("#telaRmAprovacao #diagramaRede" + i).addClass('campo-obrigatorio');
                        //             $("#telaRmAprovacao #operacao" + i).addClass('campo-obrigatorio');
                        //             return;
                        //         }
                        //     }

                        // }

                        $("#telaRmAprovacao #diagramaRede" + i).removeClass('campo-obrigatorio');
                        $("#telaRmAprovacao #operacao" + i).removeClass('campo-obrigatorio');
                        $('#telaRmAprovacao #modalConfirmaAprovarRm').modal('show');

                    }

                } else {
                    $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
                    Util.msgShowHide('#telaRmAprovacao #msg');
                }

                $scope.verificaObrigValor = true;
            }
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaRmAprovacao #msg');
        }
    };

    $scope.aprovar = function() {
        console.log("Entrou Aprovar");
        $('#telaRmAprovacao #modalConfirmaAprovarRm').modal('hide');

        loading.loading();

        $scope.objSelecionado.rmAprovador.aprovada = true;
        $scope.objSelecionado.usuario = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);

        if (Util.validaCamposDoFormulario("#telaRmAprovacao #formManutencao") === 0) {
            rmAprovacaoService.aprovarReprovar($scope.objSelecionado, retornoAprovar, trataErroServidor);
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaRmAprovacao #msg');
            loading.ready();
        }
    };

    function retornoAprovar(data) {
        if (data) {
            var msg = data.mensagem ? data.mensagem : "";
            if (msg.indexOf("label_") >= 0 || msg.indexOf("msg_") >= 0) {
                $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            } else {
                $scope.alerts = Util.formataAlert(data.tipo, msg, NEW_ALERT);
            }

            $scope.listaAuxAprovar = [];
            //Retira da lista a Rm aprovada
            if (data.codigo === "001") {
                for (var i = 0; i < $scope.lista.length; i++) {
                    if ($scope.lista[i].id !== $scope.objSelecionado.rmAprovador.id) {
                        $scope.listaAuxAprovar.push($scope.lista[i]);
                    }
                }
                $scope.lista = $scope.listaAuxAprovar;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                $scope.state = STATE_LISTA;
                $('#telaRmAprovacao .popup-manutencao').hide("fade");
                $scope.objSelecionado = null;
            }

            Util.msgShowHide('#telaRmAprovacao #msg');
        }

        loading.ready();
    }

    $scope.reprovarConfirma = function() {
        if ($scope.objSelecionado.rmAprovador.observacao === undefined ||
            $scope.objSelecionado.rmAprovador.observacao === "" ||
            $scope.objSelecionado.rmAprovador.observacao === null) {

            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaRmAprovacao #msg');

            $("#telaRmAprovacao #observacaoRmAprovacao").addClass('campo-obrigatorio');
        } else {
            $("#telaRmAprovacao #observacaoRmAprovacao").removeClass('campo-obrigatorio');
            $('#telaRmAprovacao #modalConfirmaReprovarRm').modal('show');
        }
    };

    $scope.reprovar = function() {
        loading.loading();

        $scope.objSelecionado.rmAprovador.aprovada = false;

        rmAprovacaoService.aprovarReprovar($scope.objSelecionado, retornoReprovar, trataErroServidor);
    };

    function retornoReprovar(data) {
        if (data) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);

            Util.msgShowHide('#telaRmAprovacao #msg');

            $scope.objSelecionado.rmAprovador.aprovadorVez = false;
            rmAprovacaoService.selectUniqueRmAprovador($scope.filtro, retornoEditarAprovacao, trataErroServidor);
        }
        $scope.listaAuxAprovar = [];

        //Retira da lista a Rm reprovada
        if (data.codigo === "001") {
            for (var i = 0; i < $scope.lista.length; i++) {
                if ($scope.lista[i].id !== $scope.objSelecionado.rmAprovador.id) {
                    $scope.listaAuxAprovar.push($scope.lista[i]);
                }

            }
            $scope.lista = $scope.listaAuxAprovar;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            $scope.state = STATE_LISTA;
            $('.popup-manutencao').hide("fade");
            $scope.objSelecionado = null;
        }
        loading.ready();
    }






    //Aprovar Serviço
    $scope.aprovarConfirmaServico = function() {
        console.log("Entrou AprovarConfirmaServico");
        if (Util.validaCamposDoFormulario("#telaRmAprovacao #formManutencao") === 0) {
            if ($scope.objSelecionado.rmAprovador.rm.prioridade.codigo === 'ALTA' &&
                ($scope.objSelecionado.rmAprovador.tipoAprovador === 'GA' ||
                    $scope.objSelecionado.rmAprovador.tipoAprovador === 'CO') &&
                ($scope.objSelecionado.rmAprovador.observacao === undefined ||
                    $scope.objSelecionado.rmAprovador.observacao === "" ||
                    $scope.objSelecionado.rmAprovador.observacao === null)) {

                $scope.alerts = Util.formataAlert("danger", Util.setParamsLabel($scope.ResourceBundle['msg_obrig_prioridade_alta_aprov']), NEW_ALERT);
                Util.msgShowHide('#telaRmAprovacao #msg');

                $("#telaRmAprovacao #observacaoRmAprovacao").addClass('campo-obrigatorio');
            } else {
                $("#telaRmAprovacao #observacaoRmAprovacao").removeClass("campo-obrigatorio");

                if ((Util.validaCamposDoFormulario("#telaRmAprovacao #formManutencao") === 0)) {

                    console.log($scope.objSelecionado);
                    if ($scope.objSelecionado.rmAprovador.tipoAprovador === TIPO_APROVADOR_CUSTOS && $scope.objSelecionado.rmAprovador.rm.tipoRequisicao.codigo !== TIPO_REQUISICAO_RESP_ESTOQ && $scope.objSelecionado.rmAprovador.rm.tipoRequisicao.codigo !== TIPO_REQUISICAO_RET_ESTOQUISTA) {
                        if ($scope.objSelecionado.rmAprovador.rm.gerenteCustos.pessoaId === $scope.objSelecionado.rmAprovador.rm.requisitante.pessoaId) {
                            $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_requisitante_igual_aprovador'], NEW_ALERT);
                            Util.msgShowHide('#telaRmAprovacao #msg');

                            return;
                        }
                    }

                    if ($scope.objSelecionado.rmAprovador.tipoAprovador === 'GA' ||
                        $scope.objSelecionado.rmAprovador.tipoAprovador === 'CO' ||
                        $scope.objSelecionado.rmAprovador.tipoAprovador === 'RRE') {
                        $("#telaRmAprovacao #diagramaRede").removeClass('campo-obrigatorio');
                        $("#telaRmAprovacao #operacao").removeClass('campo-obrigatorio');
                        $('#telaRmAprovacao #modalConfirmaAprovarRmServico').modal('show');
                    } else {
                        $("#telaRmAprovacao #diagramaRede").removeClass('campo-obrigatorio');
                        $("#telaRmAprovacao #operacao").removeClass('campo-obrigatorio');
                        $('#telaRmAprovacao #modalConfirmaAprovarRmServico').modal('show');

                    }

                } else {
                    console.log($scope.ResourceBundle);
                    $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
                    Util.msgShowHide('#telaRmAprovacao #msg');
                }
            }
        } else {
            console.log($scope.ResourceBundle);
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaRmAprovacao #msg');
        }
    };

    $scope.aprovarServico = function() {
        console.log("Entrou AprovarServico");
        $('#telaRmAprovacao #modalConfirmaAprovarRm').modal('hide');

        loading.loading();

        $scope.objSelecionado.rmAprovador.aprovada = true;
        $scope.objSelecionado.usuario = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);

        if (Util.validaCamposDoFormulario("#telaRmAprovacao #formManutencao") === 0) {
            console.log($scope.objSelecionado);
            rmAprovacaoService.aprovarReprovarServico($scope.objSelecionado, retornoAprovarServico, trataErroServidor);
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaRmAprovacao #msg');
            loading.ready();
        }
    };

    function retornoAprovarServico(data) {
        if (data) {
            var msg = data.mensagem ? data.mensagem : "";
            if (msg.indexOf("label_") >= 0 || msg.indexOf("msg_") >= 0) {
                $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            } else {
                $scope.alerts = Util.formataAlert(data.tipo, msg, NEW_ALERT);
            }

            $scope.listaAuxAprovar = [];
            //Retira da lista a Rm aprovada
            if (data.codigo === "001") {
                for (var i = 0; i < $scope.lista.length; i++) {
                    if ($scope.lista[i].id !== $scope.objSelecionado.rmAprovador.id) {
                        $scope.listaAuxAprovar.push($scope.lista[i]);
                    }
                }
                $scope.lista = $scope.listaAuxAprovar;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                $scope.state = STATE_LISTA;
                $('#telaRmAprovacao .popup-manutencao').hide("fade");
                $scope.objSelecionado = null;
            }

            Util.msgShowHide('#telaRmAprovacao #msg');
        }

        loading.ready();
    }

    $scope.reprovarConfirmaServico = function() {
        if ($scope.objSelecionado.rmAprovador.observacao === undefined ||
            $scope.objSelecionado.rmAprovador.observacao === "" ||
            $scope.objSelecionado.rmAprovador.observacao === null) {

            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaRmAprovacao #msg');

            $("#telaRmAprovacao #observacaoRmAprovacao").addClass('campo-obrigatorio');
        } else {
            $("#telaRmAprovacao #observacaoRmAprovacao").removeClass('campo-obrigatorio');
            $('#telaRmAprovacao #modalConfirmaReprovarServicoRm').modal('show');
        }
    };

    $scope.reprovarServico = function() {
        loading.loading();

        $scope.objSelecionado.rmAprovador.aprovada = false;

        rmAprovacaoService.aprovarReprovarServico($scope.objSelecionado, retornoReprovarServico, trataErroServidor);
    };

    function retornoReprovarServico(data) {
        if (data) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);

            Util.msgShowHide('#telaRmAprovacao #msg');

            $scope.objSelecionado.rmAprovador.aprovadorVez = false;
            rmAprovacaoService.selectUniqueRmAprovador($scope.filtro, retornoEditarAprovacao, trataErroServidor);
        }
        $scope.listaAuxAprovar = [];

        //Retira da lista a Rm reprovada
        if (data.codigo === "001") {
            for (var i = 0; i < $scope.lista.length; i++) {
                if ($scope.lista[i].id !== $scope.objSelecionado.rmAprovador.id) {
                    $scope.listaAuxAprovar.push($scope.lista[i]);
                }

            }
            $scope.lista = $scope.listaAuxAprovar;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            $scope.state = STATE_LISTA;
            $('.popup-manutencao').hide("fade");
            $scope.objSelecionado = null;
        }
        loading.ready();
    }











    function retornoEditarAprovacao(data) {
        if (data) {
            $scope.objSelecionado = data;
            validaExibicaoCampos();
            $scope.state = STATE_MANUT;
            $('.popup-manutencao').show("fade");
        }
        loading.ready();
    }

    $scope.changeColetorCusto = function(valor, index) {
        if (valor === $scope.OPERACAO_PEP) {
            exibeSeletor(true, "#aprDivColetorCusto" + index);
            exibeSeletor(false, "#aprDivDiagrama" + index);
            exibeSeletor(false, "#aprDivOrdem" + index);
            exibeSeletor(false, "#aprDivEstoque" + index);

            $scope.objSelecionado.listaRmMaterial[index].rmMaterial.coletorOrdem = null;
            $scope.objSelecionado.listaRmMaterial[index].rmMaterial.operacao = null;
            $scope.objSelecionado.listaRmMaterial[index].rmMaterial.diagramaRede = null;
            $scope.objSelecionado.listaRmMaterial[index].rmMaterial.coletorEstoque = false;
        } else if (valor === $scope.DIAGRAMA_DE_REDE) {
            exibeSeletor(false, "#aprDivColetorCusto" + index);
            exibeSeletor(true, "#aprDivDiagrama" + index);
            exibeSeletor(false, "#aprDivOrdem" + index);
            exibeSeletor(false, "#aprDivEstoque" + index);

            $scope.objSelecionado.listaRmMaterial[index].rmMaterial.coletorOrdem = false;
            $scope.objSelecionado.listaRmMaterial[index].rmMaterial.coletorCustos = null;
            $scope.objSelecionado.listaRmMaterial[index].rmMaterial.coletorEstoque = false;
        } else if (valor === $scope.ORDEM) {
            exibeSeletor(false, "#aprDivColetorCusto" + index);
            exibeSeletor(false, "#aprDivDiagrama" + index);
            exibeSeletor(true, "#aprDivOrdem" + index);
            exibeSeletor(false, "#aprDivEstoque" + index);

            $scope.objSelecionado.listaRmMaterial[index].rmMaterial.coletorCustos = null;
            $scope.objSelecionado.listaRmMaterial[index].rmMaterial.operacao = null;
            $scope.objSelecionado.listaRmMaterial[index].rmMaterial.diagramaRede = null;
            $scope.objSelecionado.listaRmMaterial[index].rmMaterial.coletorEstoque = false;
        } else if (valor === $scope.ESTOQUE) {
            exibeSeletor(false, "#aprDivColetorCusto" + index);
            exibeSeletor(false, "#aprDivDiagrama" + index);
            exibeSeletor(false, "#aprDivOrdem" + index);
            exibeSeletor(true, "#aprDivEstoque" + index);

            $scope.objSelecionado.listaRmMaterial[index].rmMaterial.coletorCustos = null;
            $scope.objSelecionado.listaRmMaterial[index].rmMaterial.operacao = null;
            $scope.objSelecionado.listaRmMaterial[index].rmMaterial.diagramaRede = null;
        }
    };

    function exibeSeletor(op, seletor) {
        if (op) {
            $(seletor).show();
        } else {
            $(seletor).hide();
        }
    }

    $scope.voltarCustosConfirma = function() {
        if (!$scope.objSelecionado.rmAprovador.rm.justRetornoEquipeCustos) {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaRmAprovacao #msg');

            $("#telaRmAprovacao #justificativaVoltarCustos").addClass('campo-obrigatorio');
        } else {
            $("#telaRmAprovacao #justificativaVoltarCustos").removeClass('campo-obrigatorio');
            $('#telaRmAprovacao #modalConfirmaVoltarCustos').modal('show');
        }
    };

    $scope.voltarCustos = function() {
        loading.loading();
        rmAprovacaoService.voltarCustos($scope.objSelecionado, retornoVoltarCustos, trataErroServidor);
    };

    function retornoVoltarCustos(data) {
        if (data) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide('#telaRmAprovacao #msg');
        }
        $scope.objSelecionado.rmAprovador.aprovadorVez = false;
        loading.ready();
    }

    $scope.atribuirEquipeCustos = function() {
        loading.loading();

        rmAprovacaoService.atribuirEquipeCusto($scope.objSelecionado, retornoAtribuirEquipeCusto, trataErroServidor);
    };

    function retornoAtribuirEquipeCusto(data) {
        var msg = data.mensagem ? data.mensagem : "";
        if (msg.indexOf("label_") >= 0 || msg.indexOf("msg_") >= 0) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        } else {
            $scope.alerts = Util.formataAlert(data.tipo, msg, NEW_ALERT);
        }
        Util.msgShowHide('#telaRmAprovacao #msg');

        $scope.objSelecionado.rmAprovador.aprovadorVez = false;

        loading.ready();
    }

    $scope.salvar = function() {
        loading.loading();

        rmAprovacaoService.salvar($scope.objSelecionado, retornoSalvar, trataErroServidor);
    };

    function retornoSalvar(data) {
        var msg = data.mensagem ? data.mensagem : "";
        if (msg.indexOf("label_") >= 0 || msg.indexOf("msg_") >= 0) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        } else {
            $scope.alerts = Util.formataAlert(data.tipo, msg, NEW_ALERT);
        }
        Util.msgShowHide('#telaRmAprovacao #msg');

        loading.ready();
    }

    $scope.encaminharEstoquistaConfirma = function() {
        $("#telaRmAprovacao #observacaoRmAprovacao").removeClass("campo-obrigatorio");
        var aux = true;
        if ($scope.verificaObrigValor) {
            for (var i = 0; i < $scope.objSelecionado.listaRmMaterial.length; i++) {
                if (!$scope.objSelecionado.listaRmMaterial[i].rmMaterial.valorOrcado &&
                    $scope.objSelecionado.listaRmMaterial[i].rmMaterial.estaNoOrcamento === 'S') {
                    aux = false;
                }
            }
        }
        if (!aux) {
            $scope.verificaObrigValor = true;
        } else {
            $scope.verificaObrigValor = false;
        }

        if ((Util.validaCamposDoFormulario("#telaRmAprovacao #formManutencao") === 0) &&
            (!$scope.verificaObrigValor)) {
            //valido se o coletor possui letras e numeros
            var re = new RegExp(".*([A-Za-z][0-9]|[0-9][A-Za-z]).*");
            for (var i = 0; i < $scope.objSelecionado.listaRmMaterial.length; i++) {
                if (!$scope.objSelecionado.listaRmMaterial[i].rmMaterial.coletorCustos && $scope.objSelecionado.listaRmMaterial[i].rmMaterialStatus.status.codigo != "Fim" &&
                    $scope.objSelecionado.listaRmMaterial[i].rmMaterialStatus.status.codigo != "Can" && $scope.objSelecionado.listaRmMaterial[i].rmMaterial.material.estoqueSap == 'S') {
                    $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
                    Util.msgShowHide('#telaRmAprovacao #msg');
                    $("#telaRmAprovacao #coletorCusto" + i).addClass('campo-obrigatorio');
                    return;
                }
                if ($scope.objColetorCusto[i] === OPERACAO_PEP) {
                    if (!re.test($scope.objSelecionado.listaRmMaterial[i].rmMaterial.coletorCustos)) {
                        $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_coletor_custos_incorreto'], NEW_ALERT);
                        Util.msgShowHide('#telaRmAprovacao #msg');

                        $("#telaRmAprovacao #coletorCusto" + i).addClass('campo-obrigatorio');
                        return;
                    } else {
                        $("#telaRmAprovacao #coletorCusto" + i).removeClass('campo-obrigatorio');
                    }
                } else if ($scope.objColetorCusto[i] === DIAGRAMA_DE_REDE) {
                    if (!re.test($scope.objSelecionado.listaRmMaterial[i].rmMaterial.diagramaRede)) {
                        $scope.alerts = Util.formataAlert("danger", $scope.ResourceBundle['msg_diagrama_rede_incorreto'], NEW_ALERT);
                        Util.msgShowHide('#telaRmAprovacao #msg');

                        $("#telaRmAprovacao #diagramaRede" + i).addClass('campo-obrigatorio');
                        return;
                    } else {
                        $("#telaRmAprovacao #diagramaRede" + i).removeClass('campo-obrigatorio');
                    }
                }
            }

            $('#telaRmAprovacao #modalConfirmaEncaminharEstoquista').modal('show');

        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaRmAprovacao #msg');
        }

        $scope.verificaObrigValor = true;
    };

    $scope.encaminharEstoquista = function() {
        loading.loading();

        $scope.objSelecionado.usuario = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);

        if (Util.validaCamposDoFormulario("#telaRmAprovacao #formManutencao") === 0) {
            rmAprovacaoService.encaminharEstoquista($scope.objSelecionado, retornoEncaminharEstoquista, trataErroServidor);
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide('#telaRmAprovacao #msg');
            loading.ready();
        }
    };

    function retornoEncaminharEstoquista(data) {
        loading.ready();

        if (data) {
            var msg = data.mensagem ? data.mensagem : "";
            if (msg.indexOf("label_") >= 0 || msg.indexOf("msg_") >= 0) {
                $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            } else {
                $scope.alerts = Util.formataAlert(data.tipo, msg, NEW_ALERT);
            }

            $scope.listaAuxAprovar = [];
            //Retira da lista a Rm aprovada
            if (data.codigo === "001") {
                for (var i = 0; i < $scope.lista.length; i++) {
                    if ($scope.lista[i].id !== $scope.objSelecionado.rmAprovador.id) {
                        $scope.listaAuxAprovar.push($scope.lista[i]);
                    }

                }
                $scope.lista = $scope.listaAuxAprovar;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                $scope.state = STATE_LISTA;
                $('.popup-manutencao').hide("fade");
                $scope.objSelecionado = null;
            }
            Util.msgShowHide('#telaRmAprovacao #msg');
        }
    }

    $scope.replicarColetorCustos = function() {
        for (i = 0; i < $scope.objSelecionado.listaRmMaterial.length; i++) {
            if ($scope.objSelecionado.listaRmMaterial[i].rmMaterialStatus.status.codigo !== "Can" &&
                ($scope.objSelecionado.listaRmMaterial[i].rmMaterial.material.estoqueSap === 'S' ||
                    $scope.objSelecionado.listaRmMaterial[i].rmMaterial.rm.tipoRequisicao.codigo != TIPO_REQUISICAO_FRENTE_SERVICO)) {
                if ($scope.objColetorCusto.valor === $scope.OPERACAO_PEP) {
                    $scope.objSelecionado.listaRmMaterial[i].rmMaterial.coletorCustos = $scope.objColetorCusto.coletorCustos;

                    $scope.objColetorCusto[i] = OPERACAO_PEP;
                    $scope.changeColetorCusto(OPERACAO_PEP, i);

                    info = { mensagem: "msg_coletor_custo_replicado" };
                } else if ($scope.objColetorCusto.valor === $scope.DIAGRAMA_DE_REDE) {
                    if ($scope.objColetorCusto.operacao.length < 4) {
                        for (i = $scope.objColetorCusto.operacao.length; i < 4; i++) {
                            $scope.objColetorCusto.operacao = '0' + $scope.objColetorCusto.operacao;
                        }
                    }
                    $scope.objSelecionado.listaRmMaterial[i].rmMaterial.diagramaRede = $scope.objColetorCusto.diagramaRede;
                    $scope.objSelecionado.listaRmMaterial[i].rmMaterial.operacao = $scope.objColetorCusto.operacao;

                    $scope.objColetorCusto[i] = DIAGRAMA_DE_REDE;
                    $scope.changeColetorCusto(DIAGRAMA_DE_REDE, i);

                    info = { mensagem: "msg_coletor_custo_replicado" };
                } else {
                    $scope.objSelecionado.listaRmMaterial[i].rmMaterial.coletorOrdem = $scope.objColetorCusto.estoque;
                    $scope.objColetorCusto[i] = ESTOQUE;
                    $scope.changeColetorCusto(ESTOQUE, i);

                    info = { mensagem: "msg_coletor_custo_replicado" };
                }
            }
        }
        $scope.alerts = Util.formataAlert(info, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide('#telaRmAprovacao #msg');
    };

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

    $scope.formataLabelEstoqueSap = function(estoqueSap) {
        if (estoqueSap === 'S') {
            return $scope.ResourceBundle["label_sim"];
        } else {
            return $scope.ResourceBundle["label_nao"];
        }
    };

    $scope.limparFiltro = function() {
        $scope.filtro = new FiltroRmAprovacao().getNovo();

        $scope.lista = [];
        $scope.paginaAtiva = null;
        $scope.numPaginas = null;
    };

    function trataErroServidor(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_ERRO_COMUNICACAO_SERVIDOR);
        Util.msgShowHide('#telaRmAprovacao #msg');
        loading.ready();
    }

    //Anexo Material
    $scope.carregarAnexo = function(anexo) {
        loading.loading();
        AnexoService.carregarAnexo(anexo, retornoCarregarAnexo, trataErroServidor);
    };

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

        $("#telaRmAprovacao #modalAnexo").modal('show');
    }

    function retornoCarregarAnexo(data) {
        Util.download(data.anexo, data.nome);

        loading.ready();
    }
    //

    //Anexo Serviço
    $scope.abrirModalAnexoServico = function(escopo, escopoId) {
        $scope.filtroAnexo = {};
        $scope.filtroAnexo.escopo = escopo;
        $scope.filtroAnexo.escopoId = escopoId;

        AnexoServicoService.listar($scope.filtroAnexo, retornoListarAnexoServico, trataErroServidor);
    };

    function retornoListarAnexoServico(data) {
        if (data.length === 0) {
            $scope.listaAnexo = [];
        } else {
            $scope.listaAnexo = data;
        }

        $("#telaRmAprovacao #modalAnexoServico").modal('show');
    }

    $scope.carregarAnexoServico = function(anexo) {
        loading.loading();
        AnexoServicoService.carregarAnexo(anexo, retornoCarregarAnexoServico, trataErroServidor);
    };

    function retornoCarregarAnexoServico(data) {
        Util.download(data.anexo, data.nome);

        loading.ready();
    }
    //

    $scope.affix = function() {
        Util.affix();
    };

    var url = window.location.href.toString();
    if (Util.getParameters("id", url)) {
        $scope.filtro.idRmAprovacaoCriptografada = Util.getParameters("id", url);
        $scope.editar(null);
    }

    $scope.listar();
}