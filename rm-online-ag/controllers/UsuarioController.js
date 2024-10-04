/**
 * Configuracão dos métodos que serão requisitados pela View, onde serão responsáveis
 * por controlar a interação entre a View e os Serviços (Persistência, consulta, exclusão, etc)
 *
 * @author Giovani L. Fiszt
 *
 * @param $scope Escopo de variaveis do Controller / View
 * @param UsuarioService UsuarioServ
 * @param ResourceBundle
 * @param loading
 * @param $http
 *
 * */
function usuarioController($scope, $http, ResourceBundle, UsuarioService, loading, AutoComplete, Combo) {
    $scope.ResourceBundle = CarregaResourceBundle($scope, ResourceBundle);
    $scope.state = STATE_LISTA;

    $scope.userLogado = UtilUsuario.getUsuarioSessao(SIGLA_MODULO);
    $scope.ROLE_USUARIOS_CADASTRO = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_USUARIOS_CADASTRO);
    $scope.userLogado.senha = "";
    $scope.userLogado.confirmarSenha = "";
    $scope.listaTipoAtuacao = [];
    $scope.listaEapMultiEmpresa = [];
    $scope.listaCentrosAuxiliar = [];
    $scope.lstAuxCentrosSelecionados = [];
    $scope.lstAuxCentrosNSelecionados = [];
    $scope.perfil;
    $scope.perfis = CarregaComboPerfis(Combo);
    $scope.obra;
    $scope.obras = CarregaComboCentros(Combo);
    $scope.area;
    $scope.areas = CarregaComboAreas(Combo);
    $scope.centroAll = [];

    //Caso seja a primeira execucao cria filtro da tela
    if (!$scope.filtro) {
        $scope.filtro = {};
        $scope.filtro.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();
    }

    if (!$scope.listaFiltroUsuario) {
        $scope.listaUsuario = [];
    }

    $scope.listaComboComprador = CarregaComboComprador(Combo);


    $scope.getAutoCompletePessoa = function (value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;

        return AutoComplete.CarregaAutoCompletePessoas(filtroAutoComplete);
    };

    $scope.limparFiltro = function () {
        $scope.filtro = {};
        $scope.filtro.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();
        $scope.listaUsuario = null;
    };

    $scope.limparCampos= function () {
        for(var a=0;a<$scope.objSelecionado.centro.length;a++){
			$scope.objSelecionado.centro[a].selected = false;
		}
        $scope.lstAuxCentrosSelecionados = [];
        $scope.lstAuxCentrosNSelecionados = [];
    };

    $scope.paginas = [];
    $scope.paginaAtiva = 1;
    $scope.numPaginas = 0;

    /**
     * instancia novo objeto para manutenção.
     * */
    $scope.novo = function () {
        $("#abaManutUsuario a").click();
        $scope.objSelecionado = {};
        //$scope.objSelecionado.usuario = [];

        $scope.objSelecionado.tipoRequisicoes = [];
        $scope.objSelecionado.centro = [];
        $scope.objSelecionado.ativo = 'S';
        $scope.objSelecionado.perfil = '';
        $scope.objSelecionado.area = '';
        $scope.listaUsuarioRoles = [];

        //André
        //Limpa a lista de tipo de atuações, para que seja carregada somente quando o usuário clicar na aba
        //Evita erro ao salvar o usuário
        $scope.listaTipoAtuacao = [];
        $scope.perfil = '';
        $scope.obra = '';

        UsuarioService.listaUsuarioTipoRequisicaoToUsuario(-1, retornoListarTipoRequisicao, trataErroServidor);
        UsuarioService.listaUsuarioCentroCustoToUsuario(-1, retornoListarCentroCusto, trataErroServidor);
        UsuarioService.listaUsuarioEapMultiEmpresaToUsuario(-1, retornoListarEapMultiEmpresa, trataErroServidor);
    };

    function retornoListarCentroCustoListados(data) {
        if (data) {
            $scope.centro = data;
            if ($scope.centro && $scope.centro.length > 0) {
                for (var i = 0; i < $scope.centro.length; i++) {
                    $scope.centro[i].descricao = $scope.centro[i].descricao;
                }
            }
        }
    }

    function retornoListarTipoRequisicao(data) {
        if (data) {
            $scope.objSelecionado.tipoRequisicoes = data;
            if ($scope.objSelecionado.tipoRequisicoes && $scope.objSelecionado.tipoRequisicoes.length > 0) {
                for (var i = 0; i < $scope.objSelecionado.tipoRequisicoes.length; i++) {
                    $scope.objSelecionado.tipoRequisicoes[i].descricao = $scope.objSelecionado.tipoRequisicoes[i].descricao;
                }
            }
        }
    }
    function retornoListarCentroCusto(data) {
        if (data) {
            $scope.objSelecionado.centro = data;
            if ($scope.objSelecionado.centro && $scope.objSelecionado.centro.length > 0) {
                for (var i = 0; i < $scope.objSelecionado.centro.length; i++) {
                    $scope.objSelecionado.centro[i].descricao = $scope.objSelecionado.centro[i].descricao;
                }
            }
        }
    }
    function retornoListarEapMultiEmpresa(data) {
        if (data) {
            $scope.objSelecionado.eapMultiEmpresas = data;
            if ($scope.objSelecionado.eapMultiEmpresas && $scope.objSelecionado.eapMultiEmpresas.length > 0) {
                for (var i = 0; i < $scope.objSelecionado.eapMultiEmpresas.length; i++) {
                    $scope.objSelecionado.eapMultiEmpresas[i].descricao = $scope.objSelecionado.eapMultiEmpresas[i].eapMultiEmpresa.descricao;
                }
            }
        }
    }

    $scope.alterarPerfil = function (perfil) {
        $scope.perfil = perfil;
        $scope.listaUsuarioRoles = $scope.perfil.roles;
    }

    $scope.alterarObra = function (obra) {
        $scope.obra = obra;
    }

    $scope.alterarArea = function (area) {
        $scope.area = area;
    }

    /**
     * Método para limpar filtro e lista da tela
     * */
    $scope.limpar = function () {
        $scope.novo();
        $scope.listaUsuario = null;
    };
    /**
     * Método para realizar a chamada para a lista dos objetos.
     * */
    $scope.listar = function () {
        loading.loading();
        UsuarioService.listar($scope.filtro, retornoListar, trataErroServidor);
    };


    function retornoListar(data) {
        if (data) {
            $scope.filtro.paginacaoVo = data;
            $scope.listaUsuario = data.itensConsulta;
            var paginas = [];
            $scope.numPaginas = Math.ceil($scope.filtro.paginacaoVo.qtdeRegistros / $scope.filtro.paginacaoVo.limiteConsulta);
            for (var i = 1; i <= $scope.numPaginas; i++) {
                paginas.push(i);
            }
            $scope.paginas = paginas;
            $scope.paginaAtiva = $scope.filtro.paginacaoVo.pagina;
            loading.ready();
        }
    }

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

    /**
     * Método para realizar a chamada para salvar a lista de objetos
     **/
    $scope.salvar = function () {

        $scope.objSelecionado.usuario.login = $('#inputLogin').val();
        $scope.objSelecionado.usuario.senha = $('#inputSenha').val();
        $scope.objSelecionado.usuario.confirmarSenha = $('#inputConfirmarSenha').val();

        if($scope.objSelecionado.usuario.senha != $scope.objSelecionado.usuario.confirmarSenha){
             var msgObj = {mensagem:'msg_senhas_nao_conferem',tipo:'danger'};
             $scope.alerts = Util.formataAlert(msgObj, $scope.ResourceBundle, ALERT_DEFAULT);
             Util.msgShowHide("#telaUsuario #msg");

             $("#telaUsuario #inputSenha").addClass("campo-obrigatorio");
             $("#telaUsuario #inputConfirmarSenha").addClass("campo-obrigatorio");
             return "";
         }else{

             $("#telaUsuario #inputSenha").removeClass("campo-obrigatorio");
             $("#telaUsuario #inputConfirmarSenha").removeClass("campo-obrigatorio");
         }
         console.log("entrou aqui");
        //#region .:Obtém todos os Centros selecionados no multi-select
        if($scope.objSelecionado.centro){
            for (var i = 0; i < $scope.objSelecionado.centro.length; i++) {
                if ($scope.objSelecionado.centro[i].selected) {
                    $scope.listaCentrosAuxiliar.push($scope.objSelecionado.centro[i]);
                }
            }
        }
        
        
        console.log($scope.listaCentrosAuxiliar);
        //#endregion

        if (Util.validaCamposDoFormulario("#telaUsuario #formManutencao") === 0 && $scope.objSelecionado.usuario.ativo && $scope.objSelecionado.usuario.ativo.length > 0) {
            loading.loading();
            
            //#region .:Informações Array[Usuario]  
            $scope.objSelecionado.usuario.perfil = $scope.perfil;
            $scope.objSelecionado.pessoa = $scope.objSelecionado.usuario.pessoa;
            $scope.objSelecionado.usuario.centro = $scope.listaCentrosAuxiliar[0];
            //#endregion 

            //#region .:Informações Array[Centro]
            $scope.objSelecionado.centro = $scope.listaCentrosAuxiliar;
            $scope.listaCentrosAuxiliar=[];
            //#endregion 

            $scope.objSelecionado.area = $scope.area;

            console.log($scope.objSelecionado);
            UsuarioService.salvar($scope.objSelecionado, retornoSalvar, trataErroServidor);

        }
        else {
            if ($scope.objSelecionado.ativo == null || $scope.objSelecionado.ativo.length == 0) {
                $("#telaUsuario #comboAtivo").addClass("campo-obrigatorio");
            }
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide("#telaUsuario #msg");
        }
    };

    /**
     * Trata retorno de salvar obj da manutenção.
     *
     * @param data Objeto que foi salvo.
     * */
    function retornoSalvar(data) {
        console.log("datas");
        console.log(data);
        if (data) {
            if (data.tipo === "success") {
                //var usuarioObj = new Usuario().getUsuario(data.objeto);
                var usuarioObj = new CadastroUsuarioVo().getUsuario(data.objeto);
                console.log(data.objeto);
                console.log("----------usuarioObj--------");
                console.log(usuarioObj);

                //Coloca obj como primeiro elemento da lista.
                Arrays.add($scope.listaUsuario, usuarioObj);
                $scope.objSelecionado.usuarioId = data.objeto.usuario.usuarioId;
                $scope.objSelecionado = usuarioObj;
                $('#inputConfirmarSenha').val('');
                $('#inputSenha').val('');

                if ($scope.objSelecionado.tipoRequisicoes && $scope.objSelecionado.tipoRequisicoes.length > 0) {
                    console.log("entrou for requisicoes");
                    for (var i = 0; i < $scope.objSelecionado.tipoRequisicoes.length; i++) {
                        $scope.objSelecionado.tipoRequisicoes[i].descricao = $scope.objSelecionado.tipoRequisicoes[i].descricao;
                    }
                }
                if ($scope.objSelecionado.eapMultiEmpresas && $scope.objSelecionado.eapMultiEmpresas.length > 0) {
                    console.log("entrou for eap");
                    for (var i = 0; i < $scope.objSelecionado.eapMultiEmpresas.length; i++) {
                        $scope.objSelecionado.eapMultiEmpresas[i].descricao = $scope.objSelecionado.eapMultiEmpresas[i].eapMultiEmpresa.descricao;
                    }
                }
                $scope.salvarTipoAtuacao();

                //Limpa Combo
                Sessao.gravaObjNaSessao([], COMBO_TIPO_REQUISICAO_USUARIO);
            } else {
                $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
                Util.msgShowHide("#telaUsuario #msg");
            }
        }
        loading.ready();
    }
    /**
     * Método para sincronização de Pessoas com o RHWEB
     */
    $scope.sincronizarPessoa = function () {
        loading.loading();
        UsuarioService.sincronizar(null, retornoSincronizar, trataErroServidor);

    };

    function retornoSincronizar(data) {
        loading.ready();
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide("#telaUsuario #msg");
    }

    /**
     * Método para realizar a chamada de edição do objeto selecionado.
     * Consulta o objeto antes de por para Edição.
     * @param id
     * */
    $scope.editar = function (id) {
        $("#abaManutUsuario a").click();
        /*
         * O popup abre no topo da página, pois fica fixo neste local.
         * Quando clicar para editar um item que está muito embaixo da lista,
         * essa função faz o scroll ir para o topo da página, caso contrário,
         * o popup será aberto mas será necessário rolar o scroll manualmente até o topo, para assim, visualizar o popup
         */
        $scope.empresaUsuario = null;
        Util.irParaOTopo();
        loading.loading();
        UsuarioService.selectById(id, retornoEditar, trataErroServidor);
    };

    /**
     * Trata retorno do método de pesquisa para editar registro selecionado.
     *
     * @param data Objeto a ser editado.
     * */
    function retornoEditar(data) {
        console.log(data);
        //$scope.objSelecionado = data;
        $scope.objSelecionado = data;
        //$scope.obra = data.centro;
        $scope.area = data.area;

        $scope.state = STATE_MANUT;
        $('.popup-manutencao').show("fade");

        $scope.limparCampos();

            var lstAuxSelecionados = [];
            for (var i = 0; i < $scope.objSelecionado.allCentro.length; i++) {
                for(var j = 0; j < $scope.objSelecionado.centro.length; j++){
                    if($scope.objSelecionado.allCentro[i].descricao == $scope.objSelecionado.centro[j].descricao){
                        $scope.objSelecionado.allCentro[i].selected = true;
                        
                        
                    }
                }
                lstAuxSelecionados.push($scope.objSelecionado.allCentro[i]);
            }
            $scope.objSelecionado.centro = lstAuxSelecionados;
        console.log(lstAuxSelecionados);


        //console.log(listaAux);

        if ($scope.objSelecionado.eapMultiEmpresas && $scope.objSelecionado.eapMultiEmpresas.length > 0) {
            for (var i = 0; i < $scope.objSelecionado.eapMultiEmpresas.length; i++) {
                $scope.objSelecionado.eapMultiEmpresas[i].descricao = $scope.objSelecionado.eapMultiEmpresas[i].eapMultiEmpresa.descricao;
            }
        }
        //André
        //Limpa a lista de tipo de atuações, para que seja carregada somente quando o usuário clicar na aba
        //Evita erro ao salvar o usuário
        $scope.listaTipoAtuacao = [];

        $scope.perfil = data.usuario.perfil;
        if ($scope.perfil) {
            for (var a = 0; a < $scope.perfis.length; a++) {
                if ($scope.perfis[a].perfilId == $scope.perfil.perfilId) {
                    $scope.listaUsuarioRoles = $scope.perfis[a].roles;
                    $scope.perfil = $scope.perfis[a];
                }
            }
        }
        loading.ready();
    }


    function retornoListarAllCentroCusto(data) {
        console.log(data);
        if (data) {
            $scope.objSelecionado.centroAll = data;
            console.log($scope.objSelecionado.centroAll)
            if ($scope.objSelecionado.centroAll && $scope.objSelecionado.centroAll.length > 0) {
                for (var i = 0; i < $scope.objSelecionado.centroAll.length; i++) {
                    $scope.objSelecionado.centroAll[i].descricao = $scope.objSelecionado.centroAll[i].descricao;
                }
            }
        }
    }
    /**
     * Método para realizar a chamada do modal de confirmação
     * para exclusão do objeto selecionado.
     * @param obj
     * */
    $scope.excluirConfirma = function (obj) {
        $scope.objExcluir = obj;
        $('#telaUsuario #modalConfirma').modal('show');
    };

    /**
     * Método para realizar a chamada do modal de confirmação
     * para exclusão do objeto selecionado.
     * */
    $scope.baixaCrachaConfirma = function () {
        $('#telaUsuario #modalConfirmaBaixaCracha').modal('show');
    };


    /**
     * Método para realizar a chamada para exclusão do objeto selecionado.
     * */
    $scope.excluir = function () {

        loading.loading();
        UsuarioService.excluir($scope.objExcluir, retornoExcluir, trataErroServidor);

    };


    /**
     * Trata retorno de salvar obj da manutenção.
     *
     * @param data Objeto que foi salvo.
     * */
    function retornoExcluir(data) {
        if (data) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide("#telaUsuario #msg");

            if (data.tipo === "success") {

                var usuario = new Usuario().getUsuario(data.objeto);
                Arrays.remove($scope.listaUsuario, usuario);

            }
            loading.ready();
        }
    }
    $scope.setAllValueCheck = function (valor) {
        if ($scope.listaUsuarioRoles) {
            for (var i = 0; i < $scope.listaUsuarioRoles.length; i++) {
                $scope.listaUsuarioRoles[i].check = valor + "";
            }
        }
    };

    /**
     * Método para realizar a chamada para salvar a lista de objetos
     **/
    $scope.salvarSenha = function () {

        if (Util.validaCamposDoFormulario("#telaUsuario #formAlterarSenha") > 0) {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide("#telaUsuario #msg");

        } else if ($scope.userLogado.senha != $scope.userLogado.confirmarSenha) {
            var msgObj = { mensagem: 'msg_senhas_nao_conferem', tipo: 'danger' };
            $scope.alerts = Util.formataAlert(msgObj, $scope.ResourceBundle, ALERT_DEFAULT);
            Util.msgShowHide("#telaUsuario #msg");
            return "";
        } else {
            loading.loading();
            UsuarioService.salvarSenha($scope.userLogado, retornoSalvarSenha, trataErroServidor);
        }

    };


    /**
     * Trata retorno de salvar obj da manutenção.
     *
     * @param data Objeto que foi salvo.
     * */
    function retornoSalvarSenha(data) {
        if (data) {
            if (data.tipo === "success") {
                $scope.userLogado.senha = "";
                $scope.userLogado.confirmarSenha = "";

                $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
                Util.msgShowHide("#telaUsuario #msg");
            }
        }
        loading.ready();
    }
    //==============================================================================
    //TIPO ATUAÇÃO
    /**
     * Método para realizar a chamada para salvar a lista de objetos
     **/
    $scope.habilitaAbaTipoAtuacao = function () {
        if ($scope.objSelecionado == null || $scope.objSelecionado.pessoa == null ||
            $scope.objSelecionado.pessoa.pessoaId == null || $scope.objSelecionado.pessoa.pessoaId < 1) {
            $scope.listaTipoAtuacao = [];
            return false;
        } else {

            if ($scope.idPessoaTipoAtuacao != $scope.objSelecionado.pessoa.pessoaId || (!$scope.carregando && $scope.listaTipoAtuacao.length == 0)) {
                $scope.idPessoaTipoAtuacao = $scope.objSelecionado.pessoa.pessoaId;
                UsuarioService.listaTipoAtuacaoByPessoaId($scope.idPessoaTipoAtuacao, retornoListaTipoAtuacao, trataErroServidor);
                $scope.carregando = true;
            }
            return true;
        }
    };

    function retornoListaTipoAtuacao(lista) {
        $scope.carregando = false;
        if (lista) {
            $scope.listaTipoAtuacao = lista;
            for (var i = 0; i < $scope.listaTipoAtuacao.length; i++) {
                $scope.listaTipoAtuacao[i].selected = $scope.listaTipoAtuacao[i].selected;
            }
        }

    }
    $scope.salvarTipoAtuacao = function () {
        console.log("lista");
        if ($scope.objSelecionado.pessoa && $scope.objSelecionado.pessoa.pessoaId > 0) {
            var listaAux = [];
            for (var i = 0; i < $scope.listaTipoAtuacao.length; i++) {
                $scope.listaTipoAtuacao[i].pessoaId = $scope.objSelecionado.pessoa.pessoaId;
                //if($scope.listaTipoAtuacao[i].selected){
                listaAux.push($scope.listaTipoAtuacao[i]);
                //}
            }
            console.log("lista");
            console.log(listaAux);
            UsuarioService.salvarTipoAtuacao(listaAux, retornoSalvarTipoAtuacao, trataErroServidor);
        }
        loading.ready();
        console.log("listando.....");
        //UsuarioService.selectById($scope.objSelecionado.usuarioId, retornoEditar, trataErroServidor);
        
        //$scope.objSelecionado.centro = [];
        $scope.listar();
        //$scope.novo();
        
    };

    function retornoSalvarTipoAtuacao(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        Util.msgShowHide("#telaUsuario #msg");
    }

    $scope.setAllTipoAtuacaoValueCheck = function (valor) {
        if ($scope.listaTipoAtuacao) {
            for (var i = 0; i < $scope.listaTipoAtuacao.length; i++) {
                $scope.listaTipoAtuacao[i].selected = valor;
            }
        }
    };

    //==============================================================================
    // abaixo se encontram as funcionalidaes do sistema
    /**
     * Trata erro de comunicação com o servidor.
     *
     * @param data Objeto com detalhes do erro.
     * */
    function trataErroServidor(data) {

        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_ERRO_COMUNICACAO_SERVIDOR);
        loading.ready();
    }
    /**
     * Trata botão para fechar Alerta.
     * @param index
     * */
    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    /*
     * Formata o tooltip, caso existam. (balões com informaççoes)
     */
    $(document).ready(function () {
        $("[data-toggle=tooltip]").tooltip({ placement: 'right' });
    });

    /*
     * limpa o formulário de manutenção, para quando abrir novamente, o mesmo estar com os campos limpos
     */
    $scope.limpaValidacaoDoFormulario = function () {
        Util.limpaValidacaoDoFormulario('formManutencao');
    };

    /*
     * Função responsável por deixar o botões fixos no topo quando rolar o scroll
     */
    $scope.affix = function () {
        Util.affix();
    };

    //////////////////////////////////////////
    //            PAGINACAO          //
    //////////////////////////////////////////
    $scope.numPaginas = 0;

    /* Vai para a página anterior clicada na view, na paginação */
    $scope.paginacaoAnterior = function () {
        loading.loading();
        try {
            var paginaAtual = $scope.filtro.paginacaoVo.pagina;
            //calcula o número de páginas
            $scope.numPaginas = Math.ceil($scope.filtro.paginacaoVo.qtdeRegistros / $scope.filtro.paginacaoVo.qtdeRegPagina);
            // somente irá fazer a pesquisa para a página anterior se o paginaAtual - 1 não for menor que umm, ou seja, não tem página anterior, jpa está na primeira
            if (paginaAtual - 1 >= 1) {
                $scope.filtro.paginacaoVo.pagina = paginaAtual - 1;
                UsuarioService.listar($scope.filtro, retornoListar, trataErroServidor);
            }
            else {
                loading.ready();
            }
        } catch (e) {
            loading.ready();
        }
    };

    /* Vai para Página clicada na view, na paginação */
    $scope.irParaPaginaEspecifica = function (pagina) {
        loading.loading();
        try {

            var paginaAtual = $scope.filtro.paginacaoVo.pagina;
            // somente irá fazer a pesquisa se clicar em uma página diferente da atual
            if (pagina !== paginaAtual) {
                $scope.filtro.paginacaoVo.pagina = pagina;
                UsuarioService.listar($scope.filtro, retornoListar, trataErroServidor);
            } else {
                loading.ready();
            }

        } catch (e) {
            loading.ready();
        }
    };

    /* Vai para a próxima página clicada na view, na paginação */
    $scope.paginacaoProxima = function () {
        loading.loading();
        try {

            var paginaAtual = $scope.filtro.paginacaoVo.pagina;
            //calcula numero de páginas
            $scope.numPaginas = Math.ceil($scope.filtro.paginacaoVo.qtdeRegistros / $scope.filtro.paginacaoVo.qtdeRegPagina);
            // somente irá fazer a pesquisa para a próxima página se o paginaAtual + 1 não for maior que o número de paginas,
            // ou seja é a última página
            if (paginaAtual + 1 <= $scope.numPaginas) {
                $scope.filtro.paginacaoVo.pagina = paginaAtual + 1;
                UsuarioService.listar($scope.filtro, retornoListar, trataErroServidor);
            }
            else {
                loading.ready();
            }

        } catch (e) {
            loading.ready();
        }
    };

    $scope.montaPaginacao = function () {
        var listaPaginas = [];
        try {
            //Controla quais paginas irão aparecer na tela
            var posIni = 0;
            var posFin = $scope.paginas.length;
            //Joga as paginas em uma lista aux
            if (posFin <= 5) {
                posIni = 0;
                posFin = $scope.paginas.length;
            } else {
                if ($scope.paginaAtiva <= 3) {
                    posIni = 0;
                    posFin = 5;
                } else if ($scope.paginaAtiva > $scope.paginas.length - 3) {
                    posIni = $scope.paginas.length - 5;
                    posFin = $scope.paginas.length;
                } else {
                    posIni = $scope.paginaAtiva - 3;
                    posFin = $scope.paginaAtiva + 2;
                }
            }
            //Joga as paginas em uma lista aux
            for (var i = posIni; i < posFin; i++) {
                listaPaginas.push($scope.paginas[i]);
            }
        } catch (e) {
        }
        return listaPaginas;
    };
}