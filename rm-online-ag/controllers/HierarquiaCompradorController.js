/**
 *
 * @author Nextage
 * @param  $scope
 *
 *
 */
function hierarquiaCompradorServ($scope,loading,hierarquiaCompradorService,Combo) {
    $scope.hierarquiaCompradorExcluir = {};
    $scope.objManut = {};
    $scope.listaHierarquiaComprador = [];
    $scope.listaComboComprador = CarregaComboComprador(Combo);
    $scope.compradorCombo={};

    $scope.filtro = new FiltroHierarquiaComprador();
    $scope.filtroHierarquiaComprador = new FiltroHierarquiaComprador();
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

    $scope.configuracao = UtilConfiguracao.getConfiguracaoSessao(SIGLA_MODULO);

    $scope.getAutoCompletePessoa = function (value) {
        var filtroAutoComplete = {};
        filtroAutoComplete.strFiltro = value;

        return AutoComplete.CarregaAutoCompletePessoas(filtroAutoComplete);
    };

    $scope.novo = function () {
        $scope.objManut ={};
        $scope.filtroHierarquiaComprador.hierarquiaBuscar = "";
        $scope.compradorCombo.comprador={};
        $scope.compradorNome = "";
        $scope.objSelecionado = null;
        $scope.listaHierarquiaComprador = [];
        $scope.state = STATE_MANUT;
        $scope.manutHierarquiaComprador = true;
        $("#manutHierarquiaComprador .popup-manutencao").show("show");
    };

    $scope.comboSelecionado = function (obj) {
        if(obj && obj.comprador != "" ) {
            loading.loading();
            $scope.objManut = {};
            $scope.filtroHierarquiaComprador.hierarquiaBuscar = "";
            $scope.filtroHierarquiaComprador.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();
            $scope.filtroHierarquiaComprador.paginacaoVo.limiteConsulta = 10;
            $scope.filtroHierarquiaComprador.paginacaoVo.qtdeRegPagina = 10;
            $scope.filtroHierarquiaComprador.comprador = obj;
            hierarquiaCompradorService.selectById($scope.filtroHierarquiaComprador, retornoComboSelecionado, trataErroServidor);
        }
    };

    function retornoComboSelecionado (data) {

        $scope.filtroHierarquiaComprador.paginacaoVo = data;
        $scope.paginaAtivaManut = data.pagina;
        $scope.numPaginasManut = Math.ceil($scope.filtroHierarquiaComprador.paginacaoVo.qtdeRegistros / $scope.filtroHierarquiaComprador.paginacaoVo.limiteConsulta);
        $scope.listaHierarquiaComprador = data.itensConsulta;
        loading.ready();
    }

    $scope.listar = function () {
        loading.loading();
        $scope.filtro.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();
        $scope.filtro.paginacaoVo.limiteConsulta = 15;
        $scope.filtro.paginacaoVo.qtdeRegPagina = 15;
        hierarquiaCompradorService.listar($scope.filtro, retornoListar, trataErroServidor);
    };

    function retornoListar(data) {
        $scope.state = STATE_LISTA;
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
            hierarquiaCompradorService.listar($scope.filtro, retornoListar, retornoErro);
        }
    };
    $scope.irParaPaginaEspecificaManut = function (pagina) {
        var paginaAtual = $scope.filtroHierarquiaComprador.paginacaoVo.pagina;
        // somente irá fazer a pesquisa se clicar em uma página diferente da atual
        if (pagina !== paginaAtual) {
            loading.loading();
            $scope.filtroHierarquiaComprador.paginacaoVo.pagina = pagina;
            hierarquiaCompradorService.selectById($scope.filtroHierarquiaComprador, retornoEditar, retornoErro);
        }
    };

    $scope.listarrHierarquia = function (){
        hierarquiaCompradorService.listarHierarquiaComprador($scope.hierarquiaComprador.hierarquia, retornoEditar, trataErroServidor);
    };

    $scope.editar = function (obj) {
        loading.loading();
        $scope.objManut ={};
        $scope.filtroHierarquiaComprador.hierarquiaBuscar = "";
        $scope.filtroHierarquiaComprador.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();
        $scope.filtroHierarquiaComprador.paginacaoVo.limiteConsulta = 10;
        $scope.filtroHierarquiaComprador.paginacaoVo.qtdeRegPagina = 10;
        $scope.filtroHierarquiaComprador.comprador = obj;
        $scope.compradorNome = obj.nome;
        hierarquiaCompradorService.selectById($scope.filtroHierarquiaComprador , retornoEditar, trataErroServidor);
    };

    function retornoEditar (data) {

        $scope.filtroHierarquiaComprador.paginacaoVo = data;
        $scope.paginaAtivaManut = data.pagina;
        $scope.numPaginasManut = Math.ceil($scope.filtroHierarquiaComprador.paginacaoVo.qtdeRegistros / $scope.filtroHierarquiaComprador.paginacaoVo.limiteConsulta);
        $("#manutHierarquiaComprador .popup-manutencao").show("fade");
        $scope.listaHierarquiaComprador = data.itensConsulta;
        $scope.manutHierarquiaComprador = true;
        $scope.state = STATE_MANUT;
        loading.ready();
    }

    $scope.buscarHierarquia = function () {
        loading.loading();
        $scope.filtroHierarquiaComprador.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo();
        $scope.filtroHierarquiaComprador.paginacaoVo.limiteConsulta = 15;
        $scope.filtroHierarquiaComprador.paginacaoVo.qtdeRegPagina = 15;
        hierarquiaCompradorService.selectById($scope.filtroHierarquiaComprador, retornoBuscarHierarquia, trataErroServidor);
    };
    $scope.excluir = function(obj){
        $('#telaHierarquiaComprador #modalExcluirHierarquiaComprador').modal('show');
        obj.comprador = null;
        $scope.objSelecionado = obj;
    };

    $scope.excluirHierarquia = function () {
        loading.loading();
        hierarquiaCompradorService.excluir($scope.objSelecionado, retornoExcluir, trataErroServidor);
    };

    function retornoExcluir(data) {
        var msg = data.mensagem ? data.mensagem : "";
        var objeto = new HierarquiaComprador().getHierarquiaComprador(data.objeto);
        if (msg.indexOf("label_") >= 0 || msg.indexOf("msg_") >= 0) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        } else {
            $scope.alerts = Util.formataAlert(data.tipo,  msg, NEW_ALERT);
        }
        Util.msgShowHide('#telaHierarquiaComprador #msg');
        Arrays.remove($scope.listaHierarquiaComprador,objeto);
        loading.ready();
    }

    $scope.adicionarHierarquia = function () {
        if ($scope.objManut.hierarquiaAdicionar && $scope.objManut.hierarquiaAdicionar !== "" && $scope.objManut.hierarquiaAdicionar !== " "){
            loading.loading();
            var hierarquiaComprador = {};
            hierarquiaComprador.comprador = $scope.filtroHierarquiaComprador.comprador;
            hierarquiaComprador.hierarquia = $scope.objManut.hierarquiaAdicionar;
            hierarquiaComprador.compradorVez = false;
            hierarquiaCompradorService.salvar(hierarquiaComprador, retornoSalvar, trataErroServidor);
        }

    };

    function  retornoSalvar(data){
        var msg = data.mensagem ? data.mensagem : "";
        if(data.objeto) {
            var objeto = new HierarquiaComprador().getHierarquiaComprador(data.objeto);
            Arrays.add($scope.listaHierarquiaComprador,objeto);
        }
        if (msg.indexOf("label_") >= 0 || msg.indexOf("msg_") >= 0) {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_DEFAULT);
        } else {
            $scope.alerts = Util.formataAlert(data.tipo,  msg, NEW_ALERT);
        }
        Util.msgShowHide('#telaHierarquiaComprador #msg');

        loading.ready();
    }


    function retornoBuscarHierarquia (data) {
        $scope.listaHierarquiaComprador = [];
        $scope.listaHierarquiaComprador = data.itensConsulta;
        $scope.manutHierarquiaComprador = true;
        $scope.state = STATE_MANUT;
        $scope.filtroHierarquiaComprador.paginacaoVo = data;
        $scope.paginaAtiva = data.pagina;
        $scope.numPaginas = Math.ceil($scope.filtroHierarquiaComprador.paginacaoVo.qtdeRegistros / $scope.filtroHierarquiaComprador.paginacaoVo.limiteConsulta);
        loading.ready();
    }

    


    $scope.limparFiltro = function () {
        $scope.filtro = new FiltroHierarquiaComprador().getNovo();

        $scope.lista = [];
        $scope.paginaAtiva = null;
        $scope.numPaginas = null;
    };

    function trataErroServidor(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_ERRO_COMUNICACAO_SERVIDOR);
        Util.msgShowHide('#telaHierarquiaComprador #msg');
        loading.ready();
    }


    $scope.affix = function () {
        Util.affix();
    };

    var url = window.location.href.toString();
    if (Util.getParameters("id", url)) {
        $scope.filtro.hierarquiaCompradorId = Util.getParameters("id", url);
        $scope.editar(null);
    }

    $scope.listar();
}
