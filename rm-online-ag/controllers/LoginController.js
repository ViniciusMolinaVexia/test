/**
 * Configuração dos métodos que serão requisitados pela View, onde serão responsáveis
 * por controlar iteração entre a View e os Serviços (Persistência, consulta, exclusão, etc)
 *
 * @param $scope
 * @param LoginService
 * @param loading
 * @param ResourceBundle
 * @param ConfigService
 * @param $http
 * @param $rootScope
 * @param $timeout
 */
function LoginServ($scope, LoginService, loading, ResourceBundle, ConfigService, $http, $rootScope, $timeout) {

    /**
     *  Definir a sigla do módulo SOMENTE UMA VEZ no controller, utilizar sempre
     *  que for passar a sigla para os métodos, a SIGLA_MODULO.
     *  [Marlos Morbis Novo
     **/
    var SIGLA_MODULO = SIGLA_RMA;

    $scope.setaLogin = function () {
        var url = window.location.href.toString();
        var arrUrl = url.split('=');
        var param = arrUrl[1];
        $scope.filtroLogin.login = param;
    };

    $scope.configuraTela = function () {

        /**
         * Função chamada no ng-init da div com id objFlexId.
         * Apenas carrega a tela flex se as configurações já estiverem carregadas em returnGetConfiguracao e
         * o $scope.isRedimensionarTelaFlex tiver sido setada true.
         * Este é o caso onde a tela é carregada DEPOIS que tiver sido passado por returnGetConfiguracao
         */
        if ($scope.isRedimensionarTelaFlex) {
            carregaTelaFlex();
        }

        //Toda vez que o browser for redimensionado, será recalculado a altura do object
        $(window).resize(function () {
            //Será calculado somente se a altura atual existir, ou seja, for maior que zero.
            //Feito isso por que estava dando problema ao redimentsionar a tela
            //e estar em outra tela que não a do flex, ele voltava para a do flex.
            if ($('#objFlexId').height() > 0) {
                var height = $(window).height();
                $('#objFlexId').css('height', height - 60);

                $('#titulo-objFlex').show();
            }
        });
    };
    /**
     * Apenas carrega a tela flex se as configurações já estiverem carregadas em returnGetConfiguracao,
     * o $scope.isRedimensionarTelaFlex tiver sido setada true e a div com id objFlexId já estiver visível
     * Este é o caso onde a tela é carregada ANTES que tiver sido passado por returnGetConfiguracao
     */
    $scope.$watch('isRedimensionarTelaFlex', function (newValue, oldValue) {
        if (newValue === true && $('#objFlexId').length) {
            carregaTelaFlex();
        }
    });

    //Carrega Labels do ResouceBundle e seta na variavel ResourceBundle do scope.
    $scope.ResourceBundle = CarregaResourceBundle($scope, ResourceBundle);
    $scope.autenticado = false;
    $scope.loading = false;

    $scope.filtroLogin = new FiltroLogin().getNovo();
    $scope.login = function () {
    	$scope.loading=true;
        if (Util.validaCamposDoFormulario("formLoginRma") === 0) {
            $scope.filtroLogin.siglaSistema = SIGLA_MODULO;
            LoginService.login($scope.filtroLogin, retornoLogin, retornoErro);
        } else {
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);

            Util.msgShowHide('#telaLogin #msg');
            $scope.loading=false;
        }
    };

    /**
     * Trata retorno de login.
     * @param data
     * */
    function retornoLogin(data) {
        if (!data.erro && data.objeto) {
            try {
                UtilUsuario.saveUsuarioSessao(data.objeto, SIGLA_MODULO, $http);
                $scope.usuarioLogado = data.objeto;
                $scope.autenticado = true;
                ConfigService.getConfiguracao(null, returnGetConfiguracao, retornoErro);
                $timeout(function () {
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            } catch (e) {
                $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_ERRO_LABEL);
                Util.msgShowHide('#telaLogin #msg');
            }
        } else {
            $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_ERRO_DEFAULT);
            Util.msgShowHide('#telaLogin #msg');
        }
        $scope.loading=false;
    }

    function returnGetConfiguracao(data) {
        if (data !== null) {
            try {
                data.logomarca = undefined;
                UtilConfiguracao.saveConfiguracaoSessao(data, SIGLA_MODULO);
                $scope.configuracao = UtilConfiguracao.getConfiguracaoSessao(SIGLA_MODULO);
                //verifica permissões e funcionalidades habilitadas.
                habilitaMenus();
                $scope.isRedimensionarTelaFlex = true;
            } catch (e) {
                $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_ERRO_LABEL);
                Util.msgShowHide('#telaLogin #msg');
            }
        }
        loading.ready();
    }

    /**
     * Quando o meu estiver em uma tela menor, fecha o menu quando clicar no link do menu
     *
     * */
    $scope.closeMenuOnClick = function () {
        Util.closeMenuOnClick();
    };

    /**
     * Trata erro de comunicação com o servidor.
     *
     * @param data Objeto com detalhes do erro.
     * */
    function retornoErro(data) {
        $scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_ERRO_COMUNICACAO_SERVIDOR);
        loading.ready();
    }

    function carregaTelaFlex() {
        loading.loading();
        //recupero usuario e conf da sessão para passar para o flex em JSON.
        var userJson = UtilUsuario.getUsuarioSessaoJSON(SIGLA_MODULO);
        var confJson = UtilConfiguracao.getConfiguracaoSessaoJSON(SIGLA_MODULO);
        //Substitui " por ' para evitar problemas com string e html
        userJson = StringUtil.replaceAll(userJson, '"', "'");
        confJson = StringUtil.replaceAll(confJson, '"', "'");
        userJson = StringUtil.replaceAll(userJson, "\\", "/");
        confJson = StringUtil.replaceAll(confJson, "\\", "/");
        var isIE = false;
        if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
            isIE = true;
        }

        $scope.objFlex = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%" id="Principal">' +
                '<param name="movie" value="../../swf/Principal.swf" />' +
                '<param name="quality" value="high" />' +
                '<param name="bgcolor" value="#ffffff" />' +
                '<param name="allowScriptAccess" value="sameDomain" />' +
                '<param name="allowFullScreen" value="true" />';
        if (isIE) {
            $scope.objFlex = $scope.objFlex + '<param name="wmode" value="transparent"/>';
        }

        var valorFlex = userJson + "||" + confJson;
        $scope.objFlex = $scope.objFlex + '<param name="flashVars" value="valorFlex=' + valorFlex + '"/>' +
                '<!--[if !IE]>-->' +
                '<object type="application/x-shockwave-flash" data="../../swf/Principal.swf" width="100%" height="100%">' +
                '<param name="quality" value="high" />' +
                '<param name="bgcolor" value="#ffffff" />' +
                '<param name="allowScriptAccess" value="sameDomain" />' +
                '<param name="allowFullScreen" value="true" />';
        if (isIE) {
            $scope.objFlex = $scope.objFlex + '<param name="wmode" value="transparent"/>';
        }
        $scope.objFlex = $scope.objFlex +
                '<param name="flashVars" value="valorFlex=' + valorFlex + '"/>' +
                '<!--<![endif]-->' +
                '<!--[if gte IE 6]>-->' +
                '   <p> ' +
                '      Either scripts and active content are not permitted to run or Adobe Flash Player version' +
                '      10.2.0 or greater is not installed.' +
                '</p>' +
                '<!--<![endif]-->' +
                '   <a href="http://www.adobe.com/go/getflashplayer">' +
                '       <img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash Player" />' +
                '   </a>' +
                '<!--[if !IE]>-->' +
                '</object>' +
                '<!--<![endif]-->' +
                '</object>';
        $('#objFlexId').removeAttr("ng-init");
        $('#objFlexId').html($scope.objFlex);
        //Somente vai exibir o flex se a página atual for a index.html
        var height = $(window).height();
        if ($scope.CORPORATIVO) {
            $('#objFlexId').css('height', height - 130);
        } else {
            $('#objFlexId').css('height', height - 60);
        }
        $('#titulo-objFlex').show();
        $scope.isRedimensionarTelaFlex = false;
        loading.ready();
    }

    /**
     * Esta função verifica as roles do usuário e habilita e desabilita os
     * menus
     * @returns {undefined}
     */
    function habilitaMenus() {
        //menus de RMA
        $scope.ROLE_CADASTRAR_CONSULTAR = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_CADASTRAR_CONSULTAR);
        $scope.ROLE_APROVAR = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_APROVAR);
        $scope.ROLE_ADMINISTRAR_ENVIO_SAP = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_ADMINISTRAR_ENVIO_SAP);
        $scope.ROLE_RASTREABILIDADE = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_RASTREABILIDADE);
        $scope.habilitaMenuRma = $scope.ROLE_CADASTRAR_CONSULTAR || $scope.ROLE_APROVAR || $scope.ROLE_ADMINISTRAR_ENVIO_SAP || $scope.ROLE_RASTREABILIDADE;

        //menus Suprimentos
        $scope.ROLE_SUPRIMENTOS = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_SUPRIMENTOS);
        $scope.ROLE_COMPRADOR = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_COMPRADOR);
        $scope.ROLE_ALMOXARIFE = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_ALMOXARIFE);
        $scope.ROLE_MATERIAIS_SEM_CODIGO_SAP = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_MATERIAIS_SEM_CODIGO_SAP);
        $scope.ROLE_DOCUMENTO_RESPONSABILIDADE = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_DOCUMENTO_RESPONSABILIDADE);
        $scope.ROLE_GESTAO_ESTOQUE = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_GESTAO_ESTOQUE);
        $scope.habilitaMenuSuprimentos = $scope.ROLE_SUPRIMENTOS || $scope.ROLE_COMPRADOR || $scope.ROLE_ALMOXARIFE || $scope.ROLE_MATERIAIS_SEM_CODIGO_SAP || $scope.ROLE_DOCUMENTO_RESPONSABILIDADE || $scope.ROLE_GESTAO_ESTOQUE;

        //menus Relatorios
        $scope.ROLE_RELATORIO_GESTAO = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_RELATORIO_GESTAO);
        $scope.ROLE_RELATORIO_PREVISOES_PENDENCIA_RECEBIMENTO = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_RELATORIO_PREVISOES_PENDENCIA_RECEBIMENTO);
        $scope.ROLE_LOG_INTERFACE = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_LOG_INTERFACE);
        $scope.habilitaMenuRelatorios = $scope.ROLE_RELATORIO_GESTAO || $scope.ROLE_RELATORIO_PREVISOES_PENDENCIA_RECEBIMENTO || $scope.ROLE_LOG_INTERFACE;
        
        //menu Configuracao
        $scope.ROLE_HIERARQUIA_COMPRADOR = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_HIERARQUIA_COMPRADOR);
        $scope.ROLE_USUARIOS = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_USUARIOS);
        $scope.ROLE_PERFIL = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_PERFIL);
        $scope.ROLE_CADASTRO_OBRA = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_CADASTRO_OBRA);
        $scope.ROLE_WORKFLOW = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_WORKFLOW);
        $scope.habilitaMenuConfiguracao = $scope.ROLE_HIERARQUIA_COMPRADOR || $scope.ROLE_USUARIOS || $scope.ROLE_PERFIL || $scope.ROLE_CADASTRO_OBRA || $scope.ROLE_WORKFLOW;

        //Check de compra de estoque na tela de cadastrar rma ao realizar o cadastro de uma requisição de materias com estoque_sap no material
        $scope.REQ_COMP_MAT_ESTOQUE = UtilUsuario.verificaRole(SIGLA_MODULO, ROLE_REQ_COMP_MAT_ESTOQUE);
        
    }

    /**
     * Realiza a configuração das Abas ao iniciá-las.
     * Método chamado no ng-init da div das abas.
     * [Marlos M. Novo]
     * */
    $scope.configuraAbas = function () {
        $('#abasHome a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
    };

    $scope.logout = function () {
        $scope.autenticado = false;
        UtilUsuario.removerUsuarioDaSessao(SIGLA_MODULO, $http);
        time = 0;
        window.location = "index.html";
    };

    var time = 0;
    $rootScope.$on(ACESSO_EXPIRADO, function (event) {
        $timeout(function () {
            if (time === 0) {
                time = 1;
                $scope.msgErroLogin = $scope.ResourceBundle[SESSAO_EXPIRADA_I18N];
                alert($scope.msgErroLogin);
                $scope.logout();
            }
        }, 1000);

    });
}