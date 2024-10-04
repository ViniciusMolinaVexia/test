/**
 * Configuração dos métodos que serão requisitados pela View, onde serão responsáveis
 * por controlar iteração entre a View e os Serviços (Persistência, Consultas, Exclusões, etc)
 *
 * @author Nextage
 *
 *
 * @param {$scope} $scope
 * @param {$rootScope} $rootScope
 * @param {$http} $http
 * @param {diretiva} loading
 * @param {Service} funcionalidadeService
 * @param {Service} ResourceBundle
 * @param {Service} AutoCompleteGeral
 * @returns {function}
 */
function funcionalidadeServ($scope, $rootScope, $http, loading, funcionalidadeService, ResourceBundle, AutoCompleteGeral) {
    //Inicialização das variaveis

    //utilizado na montagem dinâmica das telas
    $scope.propriedadeSisema = "funcionalidade";
    //é o caminho do objeto da funcionalidade
    //ex br.com.nextage.rhweb.entitybean.Pessoa;
    $scope.CAMINHO_CLASSE_COMPLETO = "";
    //Utilizada para saber qual funcionalidade será montada para o usuário.
    //O valor tem que ser o mesmo do campo código da tabela TB_FUNCIONALIDADE
    $scope.CODIGO_FUNCIONALIDADE = "";
    $scope.nomeEntidadePai = "";
    //objeto funcionalidade com as listas dos filhos
    $scope.funcionalidade = {};
    //id da tela
    $scope.idTela = "";
    //nome da propriedade id do objeto
    //padrão id
    $scope.nomePropId = "id";
    //id da mensagem padronizada
    var idMsg = "";
    //sigla dos modulos que sera utilizado para salvar e listar
    $scope.modulo = "";
    //propriedade onde sera feita a validacao do modulo.
    //A propriedade default e 'modulo' na tabela principal
    $scope.propriedadeModulo = "modulo";


    if (!$scope.filtroCampos) {
        $scope.filtroCampos = {};
        $scope.filtroCampos.funcionalidade = {};
    }
    if (!$scope.filtro) {
        $scope.filtro = {};
        $scope.filtro.funcionalidade = {};
    }
    if (!$scope.objSelecionado) {
        $scope.objSelecionado = {};
    }
    if (!$scope.objSelecionadoAba) {
        $scope.objSelecionadoAba = {};
    }

    $scope.state = STATE_LISTA;
    //Carrega Labels do ResouceBundle e seta na variavel ResourceBundle do scope.
    $scope.ResourceBundle = CarregaResourceBundle($scope, ResourceBundle, $scope.idTela);

    $scope.filtroPag = {};
    $scope.paginaAtiva = 1;
    $scope.numPaginas = 0;
    /*
     * Método para limpar filtros e lista da tela.
     */
    $scope.limparFiltro = function() {
        //filtro
        $scope.filtro = {};
        $scope.filtro.funcionalidade = {};
        //filtro campo
        $scope.filtroCampos = {};
        $scope.filtroCampos.funcionalidade = {};
        if (temEapMultiEmpresa) {
            $scope.filtroCampos.funcionalidade[$scope.nomeEapMultiEmpresa] = Sessao.getObjDaSessao(PRIMEIRO_EAP_MULTI_EMPRESA);
            if ($scope.campoEapMultiEmpresa &&
                $scope.campoEapMultiEmpresa.eventos &&
                $scope.campoEapMultiEmpresa.eventos.length > 0) {
                $scope.eventoNgChange($scope.campoEapMultiEmpresa);
            }
        }
        //filtro Aux
        $scope.filtroCampos2 = {};
        $scope.filtroCampos2.funcionalidade = {};
        if (temEapMultiEmpresa) {
            $scope.filtroCampos2.funcionalidade[$scope.nomeEapMultiEmpresa] = Sessao.getObjDaSessao(PRIMEIRO_EAP_MULTI_EMPRESA);
            if ($scope.campoEapMultiEmpresa &&
                $scope.campoEapMultiEmpresa.eventos &&
                $scope.campoEapMultiEmpresa.eventos.length > 0) {
                $scope.eventoNgChange($scope.campoEapMultiEmpresa);
            }
        }
        $scope.paginaAtiva = 1;
        $scope.numPaginas = 0;

        $scope.listaFuncionalidade = [];
        $scope.limpaValidacaoDoFormulario();
        $scope.botaoEscluir = false;
        $scope.botaoSalvar = false;
        $scope.botaoEviarAprovacao = false;
        $scope.botaoEnviaFluxo = false;
        $scope.bloqueioCampos = false;

        //Limpa os campos datas do filtro.
        if ($scope.listaCamposDataVo && $scope.listaCamposDataVo.length > 0) {
            angular.forEach($scope.listaCamposDataVo, function(campoData, key) {
                campoData.stDataInicio = null;
                campoData.stDataFim = null;
                campoData.dataNull = null;
                campoData.dataNotNull = null;
            });
        }
    };
    /*
     * Novo objeto manutenção
     */
    $scope.novo = function() {
        console.log('acessando funcionalidades.....')
        $scope.objSelecionado = {};
        if (temEapMultiEmpresa) {
            $scope.objSelecionado[$scope.nomeEapMultiEmpresa] = Sessao.getObjDaSessao(PRIMEIRO_EAP_MULTI_EMPRESA);
            if ($scope.campoEapMultiEmpresa &&
                $scope.campoEapMultiEmpresa.eventos &&
                $scope.campoEapMultiEmpresa.eventos.length > 0) {
                $scope.eventoNgChange($scope.campoEapMultiEmpresa);
            }
        }
        if ($scope.listaAbas && $scope.listaAbas.length > 0) {
            $scope.objSelecionadoAba = {};
            angular.forEach($scope.listaAbas, function(aba, key) {
                $scope.objSelecionadoAba[aba.codigo] = {};
            });
        }
        $scope.state = STATE_MANUT;
        $('#' + $scope.idTela + ' .popup-manutencao').show("fade");
        $(primeiraAba).tab('show');
        $scope.bloqueioCampos = false;

        limparCamposFormulario('#' + $scope.idTela + ' #formManutencao' + $scope.idTela);
    };

    $scope.novoFilho = function() {
        $scope.objSelecionadoAba[abaAtual.codigo] = {};
        limparCamposFormulario('#' + $scope.idTela + ' #formManutencao' + $scope.idTela + abaAtual.codigo);
    };

    //<editor-fold defaultstate="collapsed" desc="Combos">
    $scope.comboEapMultiEmpresa = Sessao.getObjDaSessao(LISTA_EAP_MULTI_EMPRESA);
    $scope.listaCombos = {};
    $scope.filtroCombo = {};
    /*
     * Carrega os combos dos campos passados por parametro
     * @param {type} arr - lista de campos 
     * @param {type} isFiltro
     * @returns {undefined}
     */
    $scope.carregaCombos = function(arr, isFiltro) {
        if (arr && arr.length > 0) {
            angular.forEach(arr, function(campo, key) {
                if (campo.campo.modoExibicao === COMBO || campo.campo.modoExibicao === COMBOCODIGO) {
                    var filtro = {};
                    filtro.funcionalidadeVo = {};
                    filtro.funcionalidadeVo.obj = "{}";
                    filtro.funcionalidadeVo.classe = campo.campo.classePai;
                    if ($scope.filtroCombo &&
                        $scope.filtroCombo[campo.campo.propriedadeEntity] &&
                        ($scope.filtroCombo[campo.campo.propriedadeEntity].manut &&
                            $scope.filtroCombo[campo.campo.propriedadeEntity].manut.objetoFiltro ||
                            $scope.filtroCombo[campo.campo.propriedadeEntity].filtro &&
                            $scope.filtroCombo[campo.campo.propriedadeEntity].filtro.objetoFiltro)) {
                        if (isFiltro) {
                            filtro.eapMultiEmpresa = $scope.filtroCombo[campo.campo.propriedadeEntity].filtro.objetoFiltro;
                        } else {
                            filtro.eapMultiEmpresa = $scope.filtroCombo[campo.campo.propriedadeEntity].manut.objetoFiltro;
                        }
                    }
                    filtro.vo = {};
                    filtro.vo.listaCamposLista = [];
                    filtro.vo.listaCamposLista.push(campo);
                    funcionalidadeService.getCombo(filtro, retornoCarregaCombo, trataErroServidor);
                }
            });
        }
    };

    function retornoCarregaCombo(data) {
        if (data && data.obj && data.classe) {
            $scope.listaCombos[data.classe] = JSON.parse(data.obj);
        }
    }

    /**
     * Metodo responsavel por crair o $rootScope.on() paar recarregar os combos
     *
     * @author Luan l domingues
     * @param {type} arr
     * @returns {undefined}
     */
    function createRecarregaCombo(arr) {
        if (arr && arr.length > 0) {
            angular.forEach(arr, function(campo, key) {
                if (campo.campo.modoExibicao === COMBO || campo.campo.modoExibicao === COMBOCODIGO) {
                    $rootScope.$on(campo.campo.classePai, function(event) {
                        //FOR EACH DE CAMPOS Combo PARA VER QUAL CAMPO PRECISA BUSCAR
                        angular.forEach($scope.listaCamposCombo, function(campoCombo, key) {
                            if (campoCombo && campoCombo.campo.classePai === event.name) {
                                var campoRec = [campoCombo];
                                $scope.carregaCombos(campoRec);
                            }
                        });
                    });
                }
            });
        }
    }

    /**
     * Dispara o evento do recarrega Combo
     * @param {type} nomeCombo
     * @returns {undefined}
     */
    function recarregaComboFuncionalidade(nomeCombo) {
        Sessao.excluiObjDaSessao(nomeCombo);
        $rootScope.$broadcast(nomeCombo);
    }

    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="AutoComplete">
    //filtro especifico para a aba Manutenção
    //caso este filtro existir irá substituir a logica do autocomplete
    $scope.filtroAutoComplete = {};


    function CarregaAutocomplete(filtro) {
        return $http.post('../../rhwebService/FuncionalidadeController/getAutoComplete/', filtro).then(function(res) {
            return res.data;
        });
    }

    /**
     * Metodo responsavel para disparar o evento do autocomplete para cada campo
     *
     * @param {String} val Valor para comparação
     * @param {String} entidade Nome da entidade
     * @param {boolean} isFiltro valida se é um filtro
     * @param {FuncionalidadeCampo} campo FuncionalidadeCampo
     * @returns {Array}
     */
    $scope.getAutoComplete = function(val, entidade, isFiltro, campo) {
        var filtroAuto = {};
        filtroAuto.strFiltro = val;
        filtroAuto.limite = 50;
        //a entidade pessoa tem um auto complete especifico pois deve trazer mais dados em tela
        if (entidade === "pessoa") {
            return AutoCompleteGeral.CarregaAutocompleteGeralPessoa(filtroAuto);
        } else {
            var filtro = {};
            //caso tenhaeo filtro acima irá filtrar o autocomplete por eap multi empresa
            if ($scope.filtroCombo &&
                $scope.filtroAutoComplete[campo.campo.propriedadeEntity] &&
                ($scope.filtroAutoComplete[campo.campo.propriedadeEntity].manut &&
                    $scope.filtroAutoComplete[campo.campo.propriedadeEntity].manut.objetoFiltro ||
                    $scope.filtroAutoComplete[campo.campo.propriedadeEntity].filtro &&
                    $scope.filtroAutoComplete[campo.campo.propriedadeEntity].filtro.objetoFiltro)) {
                if (isFiltro) {
                    filtro.eapMultiEmpresa = $scope.filtroAutoComplete[campo.campo.propriedadeEntity].filtro.objetoFiltro;
                } else {
                    filtro.eapMultiEmpresa = $scope.filtroAutoComplete[campo.campo.propriedadeEntity].manut.objetoFiltro;
                }
            }
            filtro.funcionalidadeVo = {};
            filtro.funcionalidadeVo.obj = JSON.stringify(filtroAuto);
            filtro.funcionalidadeVo.classe = "br.com.nextage.util.filter.FiltroAutoComplete";
            //seta a lista de campos para pegar as propriedades
            filtro.vo = {};
            filtro.vo.listaCamposLista = [];
            filtro.vo.listaCamposLista.push(campo);

            var filtroAux = JSON.parse(JSON.stringify(filtro));

            if ($scope.modulo) {
                filtroAux.modulo = $scope.modulo;
                if ($scope.propriedadeModulo) {
                    filtroAux.propriedadeModulo = $scope.propriedadeModulo;
                }
            } else {
                filtroAux.modulo = Sessao.getObjDaSessao('SIGLA_MODULO');
            }

            if (filtroAux.vo.listaCamposLista[0].campo && filtroAux.vo.listaCamposLista[0].campo.propriedadeFiltro) {
                delete filtroAux.vo.listaCamposLista[0].campo.propriedadeFiltro;
            }
            if (filtroAux.vo.listaCamposLista[0].campo && filtroAux.vo.listaCamposLista[0].campo.propriedadeAutoCompleteEnt) {
                delete filtroAux.vo.listaCamposLista[0].campo.propriedadeAutoCompleteEnt;
            }
            if (filtroAux.vo.listaCamposLista[0].campo && filtroAux.vo.listaCamposLista[0].campo.propriedadeAutoCompleteExb) {
                delete filtroAux.vo.listaCamposLista[0].campo.propriedadeAutoCompleteExb;
            }
            return CarregaAutocomplete(filtroAux);
        }

    };

    /**
     * Metodo responsavel para formatar os labels seje no manut
     * que em lista que no autocomplete
     * @param {ngModel} model
     * @param {String} propriedade
     * @returns {String}
     */
    $scope.formataLabel = function(model, propriedade) {
        if (model) {
            if (propriedade) {
                var propriedades = propriedade.split(".");
                if (propriedades.length === 2) {
                    if (model[propriedades[1]]) {
                        return model[propriedades[1]];
                    }
                } else {
                    if (model[propriedades[1]]) {
                        var obj = model[propriedades[1]];
                        if (obj[propriedades[2]]) {
                            return obj[propriedades[2]];
                        }
                    }
                }
            } else if (model.descricao) {
                if (model.codigo) {
                    return model.codigo + " - " + model.descricao;
                }
                return model.descricao;
            } else if (model.nome) {
                return model.nome;
            }
        }
        return "";
    };
    //</editor-fold>

    ///********************************************************//
    ///********************************************************//
    ///******************Parte dinamica dos campos*************//
    ///********************************************************//
    ///********************************************************//
    //<editor-fold defaultstate="collapsed" desc="Campos">
    //////////////////////////////////////////////////////////////////////////
    ////////////////////////////   variaveis   ///////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //<editor-fold defaultstate="collapsed" desc="Variaveis">
    //tipo variaveis
    $scope.INTEGER = INTEGER;
    $scope.STRING = STRING;
    $scope.FLOAT = FLOAT;
    $scope.DOUBLE = DOUBLE;
    $scope.DATE = DATE;
    $scope.OBJECT = OBJECT;
    $scope.BOOLEAN = BOOLEAN;
    //tipo exibição OBJECT
    $scope.COMBO = COMBO;
    $scope.COMBOAUX = COMBOAUX;
    $scope.COMBOSIMNAO = COMBOSIMNAO;
    $scope.AUTOCOMPLETE = AUTOCOMPLETE;
    $scope.AUTOCOMPLETEPESSOA = AUTOCOMPLETEPESSOA;
    $scope.TEXTAREA = TEXTAREA;
    $scope.COMBOEAPMULTIEMPRESA = COMBOEAPMULTIEMPRESA;
    $scope.COMBOCODIGO = COMBOCODIGO;
    $scope.AUTOCOMPLETECODIGO = AUTOCOMPLETECODIGO;
    $scope.COMBOSTATUS = COMBOSTATUS;
    //tipo exibição Boolean
    $scope.NORMAL = NORMAL;
    $scope.CHECKLIST = CHECKLIST;
    //listas para trabalhar os campos em ela
    $scope.listaCamposFiltro = [];
    $scope.listaCamposDataVo = [];
    $scope.listaCamposManut = [];
    $scope.listaCamposLista = [];
    //backup dos campos
    $scope.vo = null;
    //filtro do combo no manut
    $scope.filtroManut = {};
    //primeira aba do sistema para não precisaor ficar calculando toda vez que chamar um metodo para visualizar a aba
    var primeiraAba = "";
    //abas
    $scope.voAbas = {};
    //eap
    var temEapMultiEmpresa = false;
    $scope.nomeEapMultiEmpresa = false;
    $scope.campoEapMultiEmpresa = false;

    //</editor-fold>

    //////////////////////////////////////////////////////////////////////////
    ///////////////////////////   variaveis    ///////////////////////////////
    //////////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////////
    /////////////////////////////   Metodos    ///////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //<editor-fold defaultstate="collapsed" desc="Metodos">
    //carreca os campos
    $scope.carregaCampos = function() {
        loading.loading();
        $scope.listaCamposFiltro = [];
        $scope.listaCamposManut = [];
        $scope.listaCamposLista = [];
        var vo = Sessao.getObjDaSessao(LISTA_CAMPOS_FUNCIONALIDADE + $scope.CODIGO_FUNCIONALIDADE);
        if (vo) {
            retornoCarregaCampos(vo);
        } else {
            loading.loading();
            funcionalidadeService.listarCampos($scope.CODIGO_FUNCIONALIDADE, retornoCarregaCampos, trataErroServidor);
        }
    };
    //retorno da lista de campos e grupos
    function retornoCarregaCampos(vo) {
        if (vo) {
            //validação para que na frente não dar problema na hora de fazer o JSON.parse(JSON.stringify())
            //pois se for undefined dá erro
            if (!vo.listaCamposManut) {
                vo.listaCamposManut = [];
            }
            if (!vo.listaCamposFiltro) {
                vo.listaCamposFiltro = [];
            }
            if (!vo.listaCamposLista) {
                vo.listaCamposLista = [];
            }
            //seta um vo para conseguir recuperar os campos sem serem editados
            //usado o stringfy e o parse para termos uma nova referencia de memoria
            $scope.vo = JSON.parse(JSON.stringify(vo));
            Sessao.gravaObjNaSessao(vo, LISTA_CAMPOS_FUNCIONALIDADE + $scope.CODIGO_FUNCIONALIDADE);

            $scope.listaCamposManut = JSON.parse(JSON.stringify(vo.listaCamposManut));
            $scope.listaCamposLista = JSON.parse(JSON.stringify(vo.listaCamposLista));
            //$scope.listaCamposFiltro = JSON.parse(JSON.stringify(vo.listaCamposFiltro));
            var listaCamposFiltroAux = JSON.parse(JSON.stringify(vo.listaCamposFiltro));
            if (vo.listaCamposChecklist && vo.listaCamposChecklist.length > 0) {
                $scope.listaCamposChecklist = JSON.parse(JSON.stringify(vo.listaCamposChecklist));
            }
            if (vo.listaCamposCombo && vo.listaCamposCombo.length > 0) {
                $scope.listaCamposCombo = JSON.parse(JSON.stringify(vo.listaCamposCombo));
            }
            //cria uma variavel para poder ser chamada para exibir a primeira aba quando clicar em novo ou m editar
            primeiraAba = '#abas' + $scope.idTela + ' a[href="#abaManut' + $scope.idTela + '"]';
            //padroniza o id da msg
            idMsg = "#" + $scope.idTela + " #msg";
            //manut
            $scope.carregaCombos($scope.listaCamposCombo, null);
            createRecarregaCombo($scope.listaCamposCombo);
            //os metodo dentro do interval são utilizados para acelerar o carregamento da tela
            //assim serao executados em um segundo momento
            var meuTempo = setInterval(function() {
                //manut
                arrumaCampos($scope.listaCamposManut, false);
                //filtro
                $scope.listaCamposFiltro = arrumaCampos(listaCamposFiltroAux, true);
                if ($scope.listaAbas && $scope.listaAbas.length > 0) {
                    carregaCamposAbas();
                }
                clearTimeout(meuTempo);
            }, 100);
            $scope.listar();
        }
    }


    function carregaCamposAbas() {
        angular.forEach($scope.listaAbas, function(aba, key) {
            funcionalidadeService.listarCampos(aba.codigo, retornoCarregaCamposAbas, trataErroServidor);
        });
    }

    function retornoCarregaCamposAbas(obj) {
        if (obj && (obj.listaCamposManut && obj.listaCamposManut.length > 0 ||
                obj.listaCamposLista && obj.listaCamposLista.length > 0)) {
            var codigoFunc = obj.listaCamposManut[0].funcionalidade.codigo;
            //seta um vo para recuperar as listas osteriormente
            $scope.voAbas[codigoFunc] = JSON.parse(JSON.stringify(obj));

            obj.listaCamposManut = arrumaCampos(obj.listaCamposManut, false);
            $scope.listaCamposAbas[codigoFunc].listaCamposManut = JSON.parse(JSON.stringify(obj.listaCamposManut));
            $scope.listaCamposAbas[codigoFunc].listaCamposLista = JSON.parse(JSON.stringify(obj.listaCamposLista));
            if (obj.listaCamposChecklist && obj.listaCamposChecklist.length > 0) {
                $scope.listaCamposAbas[codigoFunc].listaCamposChecklist = JSON.parse(JSON.stringify(obj.listaCamposChecklist));
            }
        }
    }

    //fim carregar campos

    /**
     * @author Luan L Domingues
     * @param {Array} arr array dos campos
     * @param {boolean} isFiltro true/false para validar se é filtro ou manut
     * @returns {Array}
     * <pre>
     *       Metodo Criado para executar as validações sobre as listas de campos
     *       Substitui os metodos do Mmo: criaPropriedadeFiltro, arrumaNomeData,
     *       CriaPropriedadeComboAux, CriaCampoDataVo
     * </pre>
     */
    function arrumaCampos(arr, isFiltro) {
        if (arr && arr.length > 0) {
            var campoVo = new CampoDataVo().getNovoCampoDataVo();
            $scope.listaCamposDataVo = [];
            for (var i = 0; i < arr.length; i++) {
                var funcionalidadeCampo = arr[i];
                //angular.forEach(arr, function (funcionalidadeCampo, key) {
                //ambos
                //combo aux
                if (funcionalidadeCampo.campo.propriedadeComboAux !== undefined &&
                    funcionalidadeCampo.campo.propriedadeComboAux !== null &&
                    funcionalidadeCampo.campo.propriedadeComboAux !== "") {

                    var labelsSplit = funcionalidadeCampo.campo.propriedadeComboAux.split(";");
                    if (labelsSplit && labelsSplit.length > 0) {
                        var arrLabels = [];
                        angular.forEach(labelsSplit, function(label, key) {
                            if (label.indexOf('label_') === 0 || label.indexOf('msg_') === 0) {
                                label = $scope.ResourceBundle[label];
                            }
                            arrLabels.push(label);
                        });
                        funcionalidadeCampo.campo.propriedadesComboAux = arrLabels;
                    }
                }
                if (funcionalidadeCampo.campo.modoExibicao === COMBOEAPMULTIEMPRESA) {
                    $scope.nomeEapMultiEmpresa = funcionalidadeCampo.campo.propriedadeEntity;
                    $scope.campoEapMultiEmpresa = funcionalidadeCampo;
                    temEapMultiEmpresa = true;
                }
                //manut
                if (!isFiltro) {
                    //datas
                    if (funcionalidadeCampo.campo.tipoCampo.nome === DATE &&
                        funcionalidadeCampo.campo.propriedadeEntity.indexOf("data") > -1) {
                        var nome = "st" + StringUtil.primeiraMaiuscula(funcionalidadeCampo.campo.propriedadeEntity);
                        funcionalidadeCampo.campo.propriedadeEntityDate = nome;
                        if (!$scope.objSelecionado) {
                            $scope.objSelecionado = {};
                        }
                        $scope.objSelecionado[nome] = "";
                    }
                }
                //Filtro
                //caso seja filtro cria as propriedades extras
                if (isFiltro) {
                    //seta o campo eapMultiEmpresa no filtro
                    if (temEapMultiEmpresa) {
                        $scope.filtroCampos.funcionalidade[$scope.nomeEapMultiEmpresa] = Sessao.getObjDaSessao(PRIMEIRO_EAP_MULTI_EMPRESA);
                        if ($scope.campoEapMultiEmpresa &&
                            $scope.campoEapMultiEmpresa.eventos &&
                            $scope.campoEapMultiEmpresa.eventos.length > 0) {
                            $scope.eventoNgChange($scope.campoEapMultiEmpresa);
                        }
                    }
                    //campo data VO
                    if (funcionalidadeCampo.campo.tipoCampo.nome === DATE) {
                        campoVo.campo = funcionalidadeCampo.campo;
                        $scope.listaCamposDataVo.push(campoVo);
                        campoVo = new CampoDataVo().getNovoCampoDataVo();
                        arr.splice(i, 1);
                        i--;
                    }

                    //propriedade filtro para 3º
                    if (funcionalidadeCampo.campo &&
                        funcionalidadeCampo.campo.nivelConsulta === 3 &&
                        funcionalidadeCampo.campo.propriedadeExibicao.indexOf(".") > -1 &&
                        funcionalidadeCampo.campo.tipoCampo.nome !== DATE) {
                        funcionalidadeCampo.campo.propriedadeFiltro = funcionalidadeCampo.campo.propriedadeExibicao.split(".");
                        if (funcionalidadeCampo.campo.nivelConsulta > 2) {
                            var ultimo = funcionalidadeCampo.campo.propriedadeFiltro.length - 1;
                            if (funcionalidadeCampo.campo.modoExibicao === $scope.AUTOCOMPLETE ||
                                funcionalidadeCampo.campo.modoExibicao === $scope.AUTOCOMPLETECODIGO) {
                                funcionalidadeCampo.campo.propriedadeAutoCompleteEnt = JSON.parse(JSON.stringify(funcionalidadeCampo.campo.propriedadeFiltro));
                                funcionalidadeCampo.campo.propriedadeAutoCompleteEnt.splice(ultimo);
                                funcionalidadeCampo.campo.propriedadeAutoCompleteEnt = funcionalidadeCampo.campo.propriedadeAutoCompleteEnt.splice(1);
                                if (funcionalidadeCampo.campo.propriedadeAutoCompleteEnt.length > 1) {
                                    funcionalidadeCampo.campo.propriedadeAutoCompleteEnt = funcionalidadeCampo.campo.propriedadeAutoCompleteEnt.join(".");
                                } else {
                                    funcionalidadeCampo.campo.propriedadeAutoCompleteEnt = funcionalidadeCampo.campo.propriedadeAutoCompleteEnt[0];
                                }
                                funcionalidadeCampo.campo.propriedadeAutoCompleteExb = JSON.parse(JSON.stringify(funcionalidadeCampo.campo.propriedadeFiltro));
                                funcionalidadeCampo.campo.propriedadeAutoCompleteExb = funcionalidadeCampo.campo.propriedadeAutoCompleteExb.splice(1);
                                funcionalidadeCampo.campo.propriedadeAutoCompleteExb = funcionalidadeCampo.campo.propriedadeAutoCompleteExb.join(".");

                                if ($scope.filtroCampos && $scope.filtroCampos.funcionalidade === null) {
                                    $scope.filtroCampos.funcionalidade = {};
                                    $scope.filtroCampos.funcionalidade[funcionalidadeCampo.campo.propriedadeFiltro[0]] = {};
                                    $scope.filtroCampos.funcionalidade[funcionalidadeCampo.campo.propriedadeAutoCompleteEnt] = {};
                                }

                                var propSetFiltro = funcionalidadeCampo.campo.propriedadeFiltro[0] + "." + funcionalidadeCampo.campo.propriedadeAutoCompleteEnt;
                                funcionalidadeCampo.campo.propriedadeFiltro = propSetFiltro;
                            }
                        }
                    }
                }
            }
        }
        return arr;
    }

    /**
     *  Controla check box de preenchido / não preenchido para os filtros de data da MP.
     *  [Marlos Morbis Novo]
     *  [08/05/2015]
     *  @param dataManut
     *  @param tipo
     **/
    $scope.checkFiltroDataNullNotNull = function(dataManut, tipo) {
        if (tipo === 'null') {
            //Se marcado check nao preenchido, zera e bloqueia as datas de periodo para preenchimento.
            dataManut.stDataInicio = null;
            dataManut.stDataFim = null;
            if (dataManut.dataNull &&
                dataManut.dataNull !== null &&
                dataManut.dataNull === true) {
                //Caso esteja marcado, desmarca.
                dataManut.dataNull = false;
            } else {
                dataManut.dataNotNull = false;
                dataManut.dataNull = true;
            }
        } else if (tipo === 'notNull') {

            //Se marcado check preenchido, desbloqueia as datas de periodo para preenchimento (opcional).
            if (dataManut.dataNotNull &&
                dataManut.dataNotNull !== null &&
                dataManut.dataNotNull === true) {
                //Caso esteja marcado, desmarca.
                dataManut.dataNotNull = false;
            } else {
                dataManut.dataNotNull = true;
                dataManut.dataNull = false;
            }
        }
    };
    /**Valida as datas dos filtros
     @param dataManut
     **/
    $scope.validaDataFiltro = function(dataManut) {

        if (dataManut.stDataInicio && dataManut.stDataFim) {

            var dataInicio = Util.formataDataToFormat(dataManut.stDataInicio, $scope.ResourceBundle['format_date']);
            var dataFim = Util.formataDataToFormat(dataManut.stDataFim, $scope.ResourceBundle['format_date']);
            if (dataInicio > dataFim) {
                var msg = Util.setParamsLabel($scope.ResourceBundle['msg_filtro_periodo'], dataManut.stDataInicio, dataManut.stDataFim);
                $scope.alerts = Util.formataAlert(danger, msg, NEW_ALERT);
                Util.msgShowHide("#msg");

                dataManut.stDataFim = null;

            }
        }
    };
    /**
     * valida campos do formulario
     * percore a lista e se necessario adiciona a classe campo-obrigatorio
     *
     * @author Luan L Domingues
     * @param {String} id id da tela e do formulario
     * @param {Array} arr Array de campos
     * @param {Object} obj Objeto para excecutaer as validações
     * @returns {Number}
     */
    function validaCamposFormulario(id, arr, obj) {
        var valor = 0;
        id += " #";
        if (obj) {
            angular.forEach(arr, function(campo, key) {
                var nomeVariavel = (campo.campo.propriedadeEntityDate ? campo.campo.propriedadeEntityDate : campo.campo.propriedadeEntity);
                var idCampo = id + campo.id;
                if (campo.isObrigatorio === "S") {
                    if (!obj[nomeVariavel]) {
                        if ($(idCampo)[0] && ($(idCampo)[0].nodeName !== "DIV" &&
                                $(idCampo)[0].nodeName !== "NX-NUMERO")) {
                            $(idCampo).addClass("campo-obrigatorio");
                        }
                        if ($(idCampo + campo.campo.propriedadeEntity)[0]) {
                            $(idCampo + campo.campo.propriedadeEntity).addClass("campo-obrigatorio");
                        }
                        valor++;
                    } else {
                        if ($(idCampo)[0] && ($(idCampo)[0].nodeName !== "DIV" &&
                                $(idCampo)[0].nodeName !== "NX-NUMERO")) {
                            $(idCampo).removeClass("campo-obrigatorio");
                        }
                        if ($(idCampo + campo.campo.propriedadeEntity)[0]) {
                            $(idCampo + campo.campo.propriedadeEntity).removeClass("campo-obrigatorio");
                        }

                    }
                }
            });
        }
        return valor;
    }

    //limpa campos do formulario , percorre a lista e retira a Classe campo-obrigatorio
    function limparCamposFormulario(id) {
        $(id + " .campo-obrigatorio").removeClass('campo-obrigatorio');
    }

    //////////////////////////////////////////////////////////////////////////
    ///////////////////////////   fim Metodos    /////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    //</editor-fold>

    //</editor-fold>
    ///********************************************************//
    ///********************************************************//
    ///******************Parte dinamica dos campos*************//
    ///********************************************************//
    ///********************************************************//


    ///********************************************************//
    ///********************************************************//
    ///*************      Funcionalidade         **************//
    ///********************************************************//
    ///********************************************************//
    //<editor-fold defaultstate="collapsed" desc="Funcionalidade">
    //<editor-fold defaultstate="collapsed" desc="Carregar Funcionalidade">
    /*
     * Método Carregar a funcionalidade e as funcionalidades filhas.
     */
    $scope.carregarFuncionalidade = function() {
        funcionalidadeService.carregarFuncionalidade($scope.CODIGO_FUNCIONALIDADE, retornoCarregarFuncionalidade, trataErroServidor);
    };
    /**
     * Trata retorno do método carregarFuncionalidade.
     *@param obj
     ** */
    function retornoCarregarFuncionalidade(obj) {
        if (obj && obj.id) {
            $scope.funcionalidade = JSON.parse(JSON.stringify(obj));
            $scope.CODIGO_FUNCIONALIDADE = obj.codigo;
            $scope.CAMINHO_CLASSE_COMPLETO = obj.caminhoClasse;
            if (obj.propriedadeId) {
                $scope.nomePropId = obj.propriedadeId;
            }
            //caso tenha lista de funcionalidades cria o objeto que irá conter os campos de cada aba
            $scope.listaAbas = [];
            if (obj.listaFunc && obj.listaFunc.length > 0) {
                //nome da entidade que está no objeto usada para salvar e para filtrar ex funcionalidade em funcionalidadeCampo
                $scope.nomeEntidadePai = StringUtil.primeiraMinuscula(obj.caminhoClasse.substring(obj.caminhoClasse.lastIndexOf(".") + 1));
                //objeto para manter as lista de campos de cada aba
                $scope.listaCamposAbas = {};
                //mantem o objeto selecionado de cada aba
                $scope.objSelecionadoAba = {};
                //mantem o filtro selecionado de cada aba
                $scope.filtroAba = {};
                //mantem as listas de cada aba
                $scope.listaFuncFilhos = {};
                //num pagina e pagina ativa de cada aba
                $scope.numPaginasFilho = {};
                $scope.paginaAtivaFilho = {};
                angular.forEach(obj.listaFunc, function(funcionalidade, key) {
                    //pega o codigo para crar as abas
                    var chave = funcionalidade.codigo;
                    //cria a liste da abas
                    $scope.listaAbas.push(funcionalidade);
                    //cria o objeto selecionado por cada aba
                    $scope.objSelecionadoAba[chave] = {};
                    //cria o filtroAba selecionado por cada aba
                    $scope.filtroAba[chave] = {};
                    //cria a lista de caba aba
                    $scope.listaFuncFilhos[chave] = [];
                    //cria a numero de paginas de caba aba
                    $scope.numPaginasFilho[chave] = 0;
                    //cria a pagina ativa de caba aba
                    $scope.paginaAtivaFilho[chave] = 1;
                    //cria o objeto para adicionar os campos posteriormente
                    $scope.listaCamposAbas[chave] = {};
                    $scope.listaCamposAbas[chave].listaCamposManut = [];
                    $scope.listaCamposAbas[chave].listaCamposLista = [];
                });
            }
            $scope.carregaCampos();
        }

    }


    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="Listar">
    /*
     * Método para realizar a chamada para a lista dos objetos.
     */
    $scope.listar = function() {
        loading.loading();
        $scope.filtro.funcionalidadeVo = {};

        //Configura objeto funcionalidade do filtro, para que a conversão fique correto.    
        var funcionalidadeFitroAux = configuraFiltroFuncionalidade();

        $scope.filtro.funcionalidadeVo.obj = JSON.stringify(funcionalidadeFitroAux);
        $scope.filtro.funcionalidadeVo.classe = $scope.CAMINHO_CLASSE_COMPLETO;

        if ($scope.modulo) {
            $scope.filtro.modulo = $scope.modulo;
            if ($scope.propriedadeModulo) {
                $scope.filtro.propriedadeModulo = $scope.propriedadeModulo;
            }
        }

        //campos de data
        $scope.filtro.listaDatas = $scope.listaCamposDataVo;
        //seta a lista de campos para pegar as propriedades
        $scope.filtro.vo = {};
        $scope.filtro.vo.listaCamposLista = $scope.vo.listaCamposLista;
        var paginacao = new PaginacaoVo().getNovoPaginacaoVo();
        paginacao.pagina = 1;
        paginacao.qtdeRegPagina = 20;
        paginacao.limiteConsulta = 20;
        $scope.filtro.paginacaoVo = paginacao;
        $scope.filtro.funcionalidade = $scope.funcionalidade;
        funcionalidadeService.listar($scope.filtro, retornoListar, trataErroServidor);
    };
    /* Vai para Página clicada na view, na paginação */
    $scope.irParaPaginaEspecifica = function(pagina) {
        loading.loading();
        if (pagina !== $scope.paginaAtual) {
            $scope.filtro.paginacaoVo.pagina = pagina;
            funcionalidadeService.listar($scope.filtro, retornoListar, trataErroServidor);
        } else {
            loading.ready();
        }
    };

    /**
     * @author Marlos Morbis Novo
     * @date   06/08/2015
     *
     * Configura objeto funcionalidade de filtro para niveis maiores que 2º.
     * Obs.: Hoje somente implementado para terceiro nivel.
     *
     * Exemplo do que arrumará no objeto:
     * Supondo uma estrutura precisando de um filtro por titulo em terceiro nivel,
     * temos treinamentoCusto.treinamento.titulo, o objeto no meu filtro será montado
     * como filtro.funcionalidade[treinamento.titulo], quebro meu objeto e transformo em niveis
     * com a finalidade de deixa-lo assim: filtro.funcionalidade.treinamento.titulo.
     * Antes:
     * filtro
     * --funcionalidade
     * ----treinamento.titulo
     *
     * Depois:
     * filtro
     * --funcionalidade
     * ----treinamento
     * ------titulo
     **/
    function configuraFiltroFuncionalidade() {

        //Faz copia de objeto funcionalidade do filtro.
        var funcionalidadeFitroAux = JSON.parse(JSON.stringify($scope.filtroCampos.funcionalidade));

        //Itera sobre suas propriedades para manipular o objeto de filtro e arrumar suas propriedades
        //e niveis
        for (var i in funcionalidadeFitroAux) {

            //Verifica se o atributo do filtro possui niveis, exemplo: treinamento.titulo
            var split = i.split(".");
            var final = split.length;

            //Se for mais de um nivel processa conversão.
            if (final > 1) {
                //Recupera o valor do atributo da iteração.
                var value = funcionalidadeFitroAux[i];
                var cont = 1;
                //Pega cada atributo ja quebrado e vai montando o objeto.
                for (var prop in split) {
                    //Se primeiro objeto, joga como propriedade direta do objeto do filtro.
                    if (cont === 1) {
                        funcionalidadeFitroAux[split[0]] = {};
                    } else { //Senão joga como propriedade filha da propriedade anterior
                        funcionalidadeFitroAux[split[0]][split[prop]] = {};
                    }
                    //Se for a ultima propriedade, adicona o value anteriormente recuperado.
                    if (cont === final) {
                        funcionalidadeFitroAux[split[0]][split[prop]] = value;
                        //Deleta a proprieda originalmente criado pela view.
                        delete funcionalidadeFitroAux[i];
                    }

                    cont = cont + 1;
                }
            }
        }
        return funcionalidadeFitroAux;
    }

    /**
     * Trata retorno do método listar.
     *@param obj    * */
    function retornoListar(obj) {
        if (obj) {
            $scope.filtro.paginacaoVo = obj;
            $scope.listaFuncionalidade = obj.itensConsulta;
            $scope.paginaAtiva = obj.pagina;
            $scope.numPaginas = Math.ceil($scope.filtro.paginacaoVo.qtdeRegistros / $scope.filtro.paginacaoVo.limiteConsulta);
            $scope.state = STATE_LISTA;
        }
        loading.ready();
    }

    $scope.ordenarLista = function(campo) {
        if (campo.campo.nivelConsulta === 1) {
            $scope.ordemLista = campo.campo.propriedadeEntity;
            $scope.reverse = !$scope.reverse;
        } else {
            $scope.ordemLista = campo.campo.propriedadeEntity;
            $scope.reverse = !$scope.reverse;
        }
    };
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="Salvar">

    /*
     *Método para realizar a chamada para que irá salvar o objeto
     * que foi colocado para edição.
     */
    $scope.salvar = function() {

        var filtro = {};
        if (validaCamposFormulario('#' + $scope.idTela + ' #formManutencao' + $scope.idTela, $scope.vo.listaCamposManut, $scope.objSelecionado) === 0) {
            loading.loading();
            filtro = {};
            filtro.funcionalidadeVo = {};
            filtro.vo = {};
            filtro.vo.listaCamposManut = $scope.vo.listaCamposManut;
            filtro.funcionalidadeVo.obj = JSON.stringify($scope.objSelecionado);
            filtro.funcionalidadeVo.classe = $scope.CAMINHO_CLASSE_COMPLETO;

            if ($scope.modulo) {
                filtro.modulo = $scope.modulo;
                if ($scope.propriedadeModulo) {
                    filtro.propriedadeModulo = $scope.propriedadeModulo;
                }
            }

            funcionalidadeService.salvar(filtro, retornoSalvar, trataErroServidor);
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide(idMsg);
        }
    };
    /**
     * Trata retorno de salvar obj da manutenção.
     * @param data Objeto que foi salvo.
     */
    function retornoSalvar(data) {
        if (data && !data.erro) {
            recarregaComboFuncionalidade($scope.CAMINHO_CLASSE_COMPLETO);
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide(idMsg);
            if (data.tipo === success) {
                Arrays.add($scope.listaFuncionalidade, new ObjetoGenerico($scope.nomePropId).getObjetoGenerico(data.objeto));
                $scope.objSelecionado = data.objeto;
            }
        } else {
            if (data.erro) {
                if (data.erro.indexOf(";") > -1) {
                    var possuiParam;
                    var indexParam = 0;
                    var erro = data.erro.split(";");
                    for (var i in erro) {
                        if (erro[i].indexOf("label_") === 0 ||
                            erro[i].indexOf("msg_") === 0) {
                            erro[i] = $scope.ResourceBundle[erro[i]];
                            if (erro[i].indexOf("{0}") > -1) {
                                indexParam = i;
                                possuiParam = true;
                            }
                        }
                    }
                    if (possuiParam) {
                        var label = erro[indexParam];
                        erro.arr.splice(indexParam, 1);
                        Util.formataLabel(label, erro);
                    } else {
                        data.erro = erro.join(" ");
                    }
                }
                $scope.alerts = Util.formataAlert(data.tipo, data.erro, NEW_ALERT);
                Util.msgShowHide(idMsg);
            } else {
                $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
                Util.msgShowHide(idMsg);
            }
        }
        loading.ready();
    }

    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="Editar">
    /**
     * Método para realizar a chamada de edição do objeto selecionado.
     * @param id
     */
    $scope.editar = function(id) {
        if ($scope.listaCamposManut && $scope.listaCamposManut.length > 0) {
            Util.irParaOTopo();
            var filtro = {};
            filtro.id = id;
            loading.loading();
            filtro.vo = {};
            filtro.vo.listaCamposLista = $scope.vo.listaCamposManut;
            filtro.funcionalidadeVo = {};
            filtro.funcionalidadeVo.obj = JSON.stringify($scope.filtroCampos.funcionalidade);
            filtro.funcionalidadeVo.classe = $scope.CAMINHO_CLASSE_COMPLETO;
            funcionalidadeService.selectById(filtro, retornoEditar, trataErroServidor);
        }
    };
    /**
     * Trata retorno de editar.
     * @param obj Objeto que foi carregado para edição.
     */
    function retornoEditar(obj) {
        $scope.listaAprovadores = [];
        if (obj) {
            $scope.objSelecionado = obj;
            $scope.state = STATE_MANUT;
            $('.popup-manutencao').show("fade");
            $(primeiraAba).tab('show');
            limparCamposFormulario('#' + $scope.idTela + ' #formManutencao' + $scope.idTela);
        }
        loading.ready();
    }

    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="Excluir">
    /**
     * Método para realizar a chamada de confirmação.
     * @param obj
     * para exclusão do objeto selecionado.
     */
    $scope.excluirConfirma = function(obj) {
        $scope.objExcluir = obj;
        $('#' + $scope.idTela + ' #modalConfirma').modal('show');
    };
    /*
     * Método para realizar a chamada para exclusão do objeto selecionado.
     */
    $scope.excluir = function() {
        loading.loading();
        var vo = {};
        vo.obj = JSON.stringify($scope.objExcluir);
        vo.classe = $scope.CAMINHO_CLASSE_COMPLETO;
        if ($scope.funcionalidade.propriedadeDeleteLogico) {
            var filtro = {};
            filtro.funcionalidade = $scope.funcionalidade;
            filtro.funcionalidadeVo = vo;
            funcionalidadeService.deletarLogico(filtro, retornoExcluir, trataErroServidor);
        } else {
            funcionalidadeService.excluir(vo, retornoExcluir, trataErroServidor);
        }
    };
    /**
     * Trata retorno de excluir obj da lista.
     * @param data Objeto que foi excluido.
     */
    function retornoExcluir(data) {
        if (data) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide(idMsg);
            if (data.tipo === success) {
                recarregaComboFuncionalidade($scope.CAMINHO_CLASSE_COMPLETO);
                Arrays.remove($scope.listaFuncionalidade, new ObjetoGenerico($scope.nomePropId).getObjetoGenerico(data.objeto));
                $scope.novo();
            }
        }
        loading.ready();
    }

    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="gerarReltorio">
    /**
     * Método para realizar a chamada de gerar Relatorio.
     */
    $scope.gerarRelatorio = function() {
        Util.irParaOTopo();
        var mmoControleVo = new FiltroMmo().getNovoFiltroMmo();
        loading.loading();
        mmoControleVo.vo = {};
        mmoControleVo.vo.listaCamposManut = $scope.vo.listaCamposManut;
        mmoControleVo.mmo = new Mmo().getMmo($scope.objSelecionado);
        mmoControleVo.mmo.mmoTipo = $scope.mmoTipo;
        funcionalidadeService.geraRelatorioJasper(mmoControleVo, retornoGerarRelatorio, trataErroServidor);
    };
    /**
     * Trata retorno de editar.
     * @param obj Objeto que foi carregado para edição.
     */
    function retornoGerarRelatorio(obj) {
        if (obj) {
            Util.download(obj.arquivo, obj.nmAnexo, "pdf");
        }
        loading.ready();
    }

    //</editor-fold>

    ////<editor-fold defaultstate="collapsed" desc="gerarReltorioExcel">
    /**
     * Método para realizar a chamada de gerar Relatorio.
     */
    $scope.gerarRelatorioExcel = function() {
        loading.loading();

        //Configura objeto funcionalidade do filtro, para que a conversão fique correto.    
        var funcionalidadeFitroAux = configuraFiltroFuncionalidade();

        var filtroRel = {};
        filtroRel.funcionalidade = $scope.funcionalidade;
        filtroRel.funcionalidadeVo = {};
        filtroRel.funcionalidadeVo.obj = JSON.stringify(funcionalidadeFitroAux);
        filtroRel.funcionalidadeVo.classe = $scope.CAMINHO_CLASSE_COMPLETO;

        //campos de data
        filtroRel.listaDatas = $scope.listaCamposDataVo;
        //seta a lista de campos para pegar as propriedades
        filtroRel.vo = {};
        filtroRel.vo.listaCamposLista = $scope.vo.listaCamposLista;
        funcionalidadeService.gerarRelatorioExcel(filtroRel, retornoGerarRelatorioExcel, trataErroServidor);
    };
    /**
     * Trata retorno de editar.
     * @param obj Objeto que foi carregado para edição.
     */
    function retornoGerarRelatorioExcel(obj) {
        if (obj) {
            Util.download(obj.arquivo, obj.nmAnexo, "xls");
        }
        loading.ready();
    }

    //</editor-fold>
    //</editor-fold>

    ///********************************************************//
    ///********************************************************//
    ///*************   Funcionalidade Filho   *****************//
    ///********************************************************//
    ///********************************************************//
    //<editor-fold defaultstate="collapsed" desc="Funcionalidade Filho">
    //<editor-fold defaultstate="collapsed" desc="Listar">
    /*
     * Método para realizar a chamada para a lista dos objetos.
     */
    function listarFilho(aba) {
        loading.loading();
        //cria o objeto pai com somente o id para filtrar
        var obj = {};
        obj[$scope.nomePropId] = $scope.objSelecionado[$scope.nomePropId];
        //cria o filtro para enviar o save
        $scope.filtroAba[aba.codigo] = { "funcionalidadeVo": {} };
        $scope.filtroAba[aba.codigo].funcionalidadeVo.obj = "{" + $scope.nomeEntidadePai + ":" + JSON.stringify(obj) + "}";
        $scope.filtroAba[aba.codigo].funcionalidadeVo.classe = aba.caminhoClasse;

        //seta a lista de campos para pegar as propriedades
        $scope.filtroAba[aba.codigo].vo = {};
        $scope.filtroAba[aba.codigo].vo.listaCamposLista = $scope.voAbas[aba.codigo].listaCamposLista;

        var paginacao = new PaginacaoVo().getNovoPaginacaoVo();
        paginacao.pagina = 1;
        paginacao.qtdeRegPagina = 20;
        paginacao.limiteConsulta = 20;
        paginacao.filtro = $scope.nomeEntidadePai;
        $scope.filtroAba[aba.codigo].paginacaoVo = paginacao;
        funcionalidadeService.listar($scope.filtroAba[aba.codigo], retornoListarFilho, trataErroServidor);
    }

    /* Vai para Página clicada na view, na paginação */
    $scope.irParaPaginaEspecificaFilho = function(pagina) {
        loading.loading();
        if (pagina !== $scope.paginaAtual) {
            $scope.filtroAba[abaAtual.codigo].paginacaoVo.pagina = pagina;
            funcionalidadeService.listar($scope.filtroAba[abaAtual.codigo], retornoListarFilho, trataErroServidor);
        } else {
            loading.ready();
        }
    };
    /**
     * Trata retorno do método listar.
     *@param obj    * */
    function retornoListarFilho(obj) {
        if (obj && obj.itensConsulta) {
            $scope.filtroAba[abaAtual.codigo].paginacaoVo = obj;
            $scope.listaFuncFilhos[abaAtual.codigo] = obj.itensConsulta;
            $scope.paginaAtivaFilho[abaAtual.codigo] = obj.pagina;
            var qtdeRegistros = $scope.filtroAba[abaAtual.codigo].paginacaoVo.qtdeRegistros;
            var limiteConsulta = $scope.filtroAba[abaAtual.codigo].paginacaoVo.limiteConsulta;
            $scope.numPaginasFilho[abaAtual.codigo] = Math.ceil(qtdeRegistros / limiteConsulta);
        }
        loading.ready();
    }

    $scope.ordenarListaAba = function(campo) {
        if (!$scope.ordemListaAba) {
            $scope.ordemListaAba = {};
            $scope.reverseAba = {};
        }
        if (campo.campo.nivelConsulta === 1) {
            $scope.ordemListaAba[abaAtual.codigo] = campo.campo.propriedadeEntity;
            $scope.reverseAba[abaAtual.codigo] = !$scope.reverseAba[abaAtual.codigo];
        } else {
            $scope.ordemListaAba[abaAtual.codigo] = campo.campo.propriedadeExibicao;
            $scope.reverseAba[abaAtual.codigo] = !$scope.reverseAba[abaAtual.codigo];
        }
    };
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="Salvar">

    /*
     *Método para realizar a chamada para que irá salvar o objeto
     * que foi colocado para edição.
     */
    $scope.salvarFilho = function() {

        var filtro = {};
        if (validaCamposFormulario('#' + $scope.idTela + ' #formManutencao' + $scope.idTela + abaAtual.codigo,
                $scope.listaCamposAbas[abaAtual.codigo].listaCamposManut,
                $scope.objSelecionadoAba[abaAtual.codigo]) === 0) {
            loading.loading();
            filtro = {};
            filtro.funcionalidadeVo = {};
            filtro.vo = {};
            $scope.objSelecionadoAba[abaAtual.codigo][$scope.nomeEntidadePai] = {};
            $scope.objSelecionadoAba[abaAtual.codigo][$scope.nomeEntidadePai][$scope.nomePropId] = $scope.objSelecionado[$scope.nomePropId];
            filtro.vo.listaCamposManut = $scope.voAbas[abaAtual.codigo].listaCamposManut;
            filtro.funcionalidadeVo.obj = JSON.stringify($scope.objSelecionadoAba[abaAtual.codigo]);
            filtro.funcionalidadeVo.classe = abaAtual.caminhoClasse;
            funcionalidadeService.salvar(filtro, retornoSalvarFilho, trataErroServidor);
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide(idMsg);
        }
    };
    /**
     * Trata retorno de salvar obj da manutenção.
     * @param data Objeto que foi salvo.
     */
    function retornoSalvarFilho(data) {
        if (data && !data.erro) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide(idMsg);
            if (data.tipo === success) {
                recarregaComboFuncionalidade(abaAtual.caminhoClasse);
                Arrays.add($scope.listaFuncFilhos[abaAtual.codigo], new ObjetoGenerico(abaAtual.propriedadeId).getObjetoGenerico(data.objeto));
                $scope.objSelecionadoAba[abaAtual.codigo] = data.objeto;
            }
        } else {
            if (data.erro.indexOf(";")) {
                var erro = data.erro.split(";");
                for (var i in erro) {
                    if (erro[i].indexOf("label_") === 0 ||
                        erro[i].indexOf("msg_") === 0) {
                        erro[i] = $scope.ResourceBundle[erro[i]];
                    }
                }
                data.erro = erro.join(" ");
                $scope.alerts = Util.formataAlert(data.tipo, data.erro, NEW_ALERT);
                Util.msgShowHide(idMsg);
            } else {
                $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
                Util.msgShowHide(idMsg);
            }
        }
        loading.ready();
    }

    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="Editar">
    /**
     * Método para realizar a chamada de edição do objeto selecionado.
     * @param id
     */
    $scope.editarFilho = function(id) {
        Util.irParaOTopo();
        var filtro = {};
        filtro.id = id;
        loading.loading();
        filtro.vo = {};
        filtro.vo.listaCamposLista = $scope.voAbas[abaAtual.codigo].listaCamposManut;
        filtro.funcionalidadeVo = {};
        filtro.funcionalidadeVo.obj = "{}";
        filtro.funcionalidadeVo.classe = abaAtual.caminhoClasse;
        funcionalidadeService.selectById(filtro, retornoEditarFilho, trataErroServidor);
    };
    /**
     * Trata retorno de editar.
     * @param obj Objeto que foi carregado para edição.
     */
    function retornoEditarFilho(obj) {
        if (obj) {
            $scope.objSelecionadoAba[abaAtual.codigo] = obj;
            limparCamposFormulario('#' + $scope.idTela + ' #formManutencao' + $scope.idTela + abaAtual.codigo);
        }
        loading.ready();
    }

    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="Excluir">
    /**
     * Método para realizar a chamada de confirmação.
     * @param obj
     * para exclusão do objeto selecionado.
     */
    $scope.excluirConfirmaFilho = function(obj) {
        $scope.objExcluir = obj;
        $('#' + $scope.idTela + ' #modalConfirmaFilho').modal('show');
    };
    /*
     * Método para realizar a chamada para exclusão do objeto selecionado.
     */
    $scope.excluirFilho = function() {
        loading.loading();
        var vo = {};
        vo.obj = JSON.stringify($scope.objExcluir);
        vo.classe = abaAtual.caminhoClasse;
        funcionalidadeService.excluir(vo, retornoExcluirFilho, trataErroServidor);
    };
    /**
     * Trata retorno de excluir obj da lista.
     * @param data Objeto que foi excluido.
     */
    function retornoExcluirFilho(data) {
        if (data) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide(idMsg);
            if (data.tipo === success) {
                recarregaComboFuncionalidade(abaAtual.caminhoClasse);
                Arrays.remove($scope.listaFuncFilhos[abaAtual.codigo], new ObjetoGenerico(abaAtual.propriedadeId).getObjetoGenerico(data.objeto));
                $scope.objSelecionadoAba[abaAtual.codigo] = {};
            }
        }
        loading.ready();
    }

    //</editor-fold>
    //</editor-fold>

    ///********************************************************//
    ///********************************************************//
    ///*************  Funcionalidade Eventos  *****************//
    ///********************************************************//
    ///********************************************************//
    //<editor-fold defaultstate="collapsed" desc="Funcionalidade Eventos">
    //<editor-fold defaultstate="collapsed" desc="eventoNgChange">
    $scope.eventoNgChange = function(campo) {
        if (campo.eventos && campo.eventos.length > 0) {
            for (var i in campo.eventos) {
                if (campo.eventos[i].funcao && campo.eventos[i].tipo === "ngChange") {
                    if (campo.eventos[i].funcao.indexOf(";") > -1) {
                        var funcoes = campo.eventos[i].funcao.split(";");
                        for (var j in funcoes) {
                            if ($scope[funcoes[j]]) {
                                $scope[funcoes[j]]($scope, retornoEventos, trataErroServidor, abaAtual);
                            }
                        }
                    } else {
                        if ($scope[campo.eventos[i].funcao]) {
                            $scope[campo.eventos[i].funcao]($scope, retornoEventos, trataErroServidor, abaAtual);
                        }
                    }
                }
            }
        }
    };
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="eventoNgClick">
    $scope.eventoNgClick = function(campo) {
        if (campo.eventos && campo.eventos.length > 0) {
            for (var i in campo.eventos) {
                if (campo.eventos[i].funcao && campo.eventos[i].tipo === "ngClick") {
                    if (campo.eventos[i].funcao.indexOf(";") > -1) {
                        var funcoes = campo.eventos[i].funcao.split(";");
                        for (var j in funcoes) {
                            if ($scope[funcoes[j]]) {
                                $scope[funcoes[j]]($scope, retornoEventos, trataErroServidor, abaAtual);
                            }
                        }
                    } else {
                        if ($scope[campo.eventos[i].funcao]) {
                            $scope[campo.eventos[i].funcao]($scope, retornoEventos, trataErroServidor, abaAtual);
                        }
                    }
                }
            }
        }
    };
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="eventoNgBlur">
    $scope.eventoNgBlur = function(campo) {
        if (campo.eventos && campo.eventos.length > 0) {
            for (var i in campo.eventos) {
                if (campo.eventos[i].funcao && campo.eventos[i].tipo === "ngBlur") {
                    if (campo.eventos[i].funcao.indexOf(";") > -1) {
                        var funcoes = campo.eventos[i].funcao.split(";");
                        for (var j in funcoes) {
                            if ($scope[funcoes[j]]) {
                                $scope[funcoes[j]]($scope, retornoEventos, trataErroServidor, abaAtual);
                            }
                        }
                    } else {
                        if ($scope[campo.eventos[i].funcao]) {
                            $scope[campo.eventos[i].funcao]($scope, retornoEventos, trataErroServidor, abaAtual);
                        }
                    }
                }
            }
        }
    };
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="eventoNgFocus">
    $scope.eventoNgFocus = function(campo) {
        if (campo.eventos && campo.eventos.length > 0) {
            for (var i in campo.eventos) {
                if (campo.eventos[i].funcao && campo.eventos[i].tipo === "ngFocus") {
                    if (campo.eventos[i].funcao.indexOf(";") > -1) {
                        var funcoes = campo.eventos[i].funcao.split(";");
                        for (var j in funcoes) {
                            if ($scope[funcoes[j]]) {
                                $scope[funcoes[j]]($scope, retornoEventos, trataErroServidor, abaAtual);
                            }
                        }
                    } else {
                        if ($scope[campo.eventos[i].funcao]) {
                            $scope[campo.eventos[i].funcao]($scope, retornoEventos, trataErroServidor, abaAtual);
                        }
                    }
                }
            }
        }
    };
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="retornoEventos">
    function retornoEventos(data) {
        //valida se o retorno é um info
        //caso for exibe a mensagem
        if (data) {
            if (data.mensagem && data.tipo) {
                if (data.erro) {
                    if (data.erro.indexOf(";")) {
                        var erro = data.erro.split(";");
                        for (var i in erro) {
                            if (erro[i].indexOf("label_") === 0 ||
                                erro[i].indexOf("msg_") === 0) {
                                erro[i] = $scope.ResourceBundle[erro[i]];
                            }
                        }
                        data.erro = erro.join(" ");
                        $scope.alerts = Util.formataAlert(data.tipo, data.erro, NEW_ALERT);
                        Util.msgShowHide(idMsg);
                    } else {
                        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
                        Util.msgShowHide(idMsg);
                    }
                } else {
                    $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
                    Util.msgShowHide(idMsg);
                }
            }
            //valida se é um objeto set
            //criado para setar valores especificos
            if (data.funcao && data.valor && data.local) {
                if (data.funcao === "set" && data.aba) {
                    $scope.objSelecionadoAba[abaAtual.codigo][data.local] = data.valor;
                }
                if (data.funcao === "set" && !data.aba) {
                    $scope.objSelecionado[data.local] = data.valor;
                }
            }
        } else {

        }
        loading.ready();
    }

    //</editor-fold>

    //</editor-fold>

    ///********************************************************//
    ///********************************************************//
    ///*********                Sistema             ***********//
    ///********************************************************//
    ///********************************************************//
    //<editor-fold defaultstate="collapsed" desc=" funcionalidaes do sistema ">

    // abaixo se encontram as funcionalidaes do sistema
    /**
     * Trata erro de comunicação com o servidor.
     *
     * @param data Objeto com detalhes do erro.
     */
    function trataErroServidor(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_ERRO_COMUNICACAO_SERVIDOR);
        Util.msgShowHide(idMsg);
        loading.ready();
    }

    /**
     * Trata botão para fechar Alerta.
     * @param index
     */
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    $(document).ready(function() {
        $("[data-toggle=tooltip]").tooltip({ placement: 'right' });
    });
    $scope.limpaValidacaoDoFormulario = function() {
        Util.limpaValidacaoDoFormulario('formManutencao');
    };
    $scope.affix = function() {
        Util.affix();
    };

    //variavel da aba atual pode iniciada como undefined
    //pois caso não tenha nenhuma aba irá permanecer neste valor
    //aba manutenção é undefined
    var abaAtual = undefined;
    $scope.abas = function(e, idAba, aba) {
        abaAtual = aba;
        e.preventDefault();
        var id = "";
        if (e.currentTarget !== null && e.currentTarget !== undefined &&
            e.currentTarget.parentElement !== null && e.currentTarget.parentElement !== undefined &&
            e.currentTarget.parentElement.parentElement !== null && e.currentTarget.parentElement.parentElement !== undefined) {
            id = e.currentTarget.parentElement.parentElement.id;
        }
        if (id === "") {
            id = 'abas' + $scope.idTela + '';
        }
        $('#' + id + ' a[href="#' + idAba + '"]').tab('show');
        if (aba) {
            $scope.novoFilho();
            listarFilho(aba);
        }
    };

    $scope.bloqueioCampos = false;
    //</editor-fold>
}