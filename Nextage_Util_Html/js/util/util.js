/**
 *<pre>
 *<b>author:</b> Marlos M. Novo
 *<b>date:  </b> 16/04/2014
 *</pre>
 *
 * <p>Classe com funções para auxiliar no desenvolvimento do projeto, funções utilitárias
 *  e que seu uso possa ser de maneira genérica no projeto.
 *
 *  Funções uteis em geral.
 *  [Marlos M. Novo]
 **/
Util = {
    /*
     * Essa função é chamada no retornoLogin do FLEX
     *
     */
    configuraLoading: function () {
        /*
         * Simula um click na aba onde está o Objeto FLEX, que por sua vez, chama a diretiva "flex",
         * para assim controlar quando o loading será exibido e ocultado
         */
        $("[flex]").click();
    },
    /**
     * Valida a lista do autocomplete
     *
     * @param {type} lista
     * @param {type} id
     * @param {type} nome
     * @returns {undefined}
     */
    verificaListaAutoComplete: function (lista, id, nome) {
        if (!lista.length) {
            var obj = {};
            obj[id] = 0;
            obj[nome] = AUTOCOMPLETE_CADASTRAR;
            Arrays.add(lista, obj);
            $('ul[typeahead-popup]').addClass('autocomplete-cadastrar');
        } else {
            $('ul[typeahead-popup]').removeClass('autocomplete-cadastrar');
        }
    },
    /**
     *  Monta efeito para mensagens do sistema.
     * @param {type} id
     * @returns {undefined}
     */
    msgShowHide: function (id) {
        if (!id) {
            id = "#msg";
        }
        var isiPhone = /iphone/i.test(navigator.userAgent.toLowerCase());
        if (isiPhone) {
            $('html,body').animate({scrollTop: 0}, 'fast');
        }
        $(id).slideDown(500);
    },
    /**
     *  Monta efeito para mensagens do sistema.
     *  @param {type} id
     *  @param {type} loading
     *  @param {type} delay
     */
    msgShowHide2: function (id, loading, delay) {
        if (!id) {
            id = "#msg";
        }
        var isiPhone = /iphone/i.test(navigator.userAgent.toLowerCase());
        if (isiPhone) {
            $('html,body').animate({scrollTop: 0}, 'fast');
        }
        if ($(id).is(":hidden")) {

            $(id).slideDown(500, function () {
                if (loading) {
                    loading.ready();
                }
                if (delay !== undefined && delay === true) {
                    //TRAVA
                } else if (delay) {
                    $(id).delay(delay).slideUp(500);
                } else {
                    $(id).delay(3000).slideUp(500);
                }
            });
        }
    },
    /**
     *
     * @param {type} listaDeLabels
     * @returns {}
     */
    labelMesNumeroToMesNome: function (listaDeLabels) {
        var months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        var label;
        var labelAno;
        var labelMes;
        var labelArray = [];
        for (var i = 0; i < listaDeLabels.length; i++) {
            label = listaDeLabels[i];
            labelArray = label.split("-");
            labelAno = labelArray[0];
            labelMes = months[parseInt(labelArray[1] - 1)];
            listaDeLabels[i] = labelMes + "-" + labelAno;
        }

    },
    /**
     *
     * @param {type} id
     * @param {type} nomeRelatorio
     * @returns {}
     */
    exportToExcel: function (id, nomeRelatorio) {
        if (nomeRelatorio === undefined || nomeRelatorio === null || nomeRelatorio === "") {
            nomeRelatorio = "Relatório";
        }
        //Recupera o elemento html através do id
        var element = document.getElementById(id);
        //Clona a table para não efetuar mudanças na view
        var tableAux = element.cloneNode(true);
        //verifica se pelo menos um elemento possui a propriedade
        var pattern = /.*export-excel="false".*/igm;
        //Remove os itens que contiverem a propriedade export-excel="false" para criar o excel
        if (pattern.test(tableAux.innerHTML)) {
            elements = tableAux.querySelectorAll('table,th,td');
            for (var j = 0; j < elements.length; j++) {
                if (elements[j].getAttribute('export-excel') === "false") {
                    elements[j].parentNode.removeChild(elements[j]);
                }
            }
        }

        //Pega o conteúdo do elemento
        var content = tableAux.innerHTML;
        //O conteúdo é inserido no arquivo xml
        var template =
            '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]>' +
            '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>' + nomeRelatorio + '</x:Name><x:WorksheetOptions><x:DisplayGridlines/>' +
            '</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
            '</head><body><table>' + content + '</table></body></html>';
        //transforma pra base64
        var base64data = $.base64.encode(template);
        var blobObject = Util.b64toBlob(base64data, 'application/vnd.ms-excel');
        //A chamada do IE para salvar um arquivo é diferente, então é utilizado esse verificação
        if (window.navigator.msSaveOrOpenBlob !== undefined) {
            //pergunta se quer salvar ou abrir
            window.navigator.msSaveOrOpenBlob(blobObject, nomeRelatorio + ".xls");
        } else if (window.navigator.msSaveBlob !== undefined) {
            //salva direto
            window.navigator.msSaveBlob(blobObject, nomeRelatorio + ".xls");
        } else {
            //Utilizado para salvar em outros navegadores
            saveAs(blobObject, nomeRelatorio + ".xls");
        }


    }, /**
     *
     * @param {type} b64Data
     * @param {type} contentType
     * @param {type} sliceSize
     * @returns {Blob}
     */
    b64toBlob: function (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    },
    /**
     *
     * @returns {undefined}
     */
    divider: function () {
        //Recupera os width iniciais de cada elemento
        var widthLista = parseInt($(".listaObjetos").width());
        var widthFormManutencao = parseInt($(".formManutencao").width());
        var widthFormFiltro = parseInt($(".formFiltro").width());
        //variável usada para setar o width do form que está visível (formManutencao ou formFiltro)
        var widthFormVisivel;
        //Verifica se o tamanho da tela é maior que 991, indicando que não está em um mobile com tela pequena
        if ($(window).width() > 991) {

            //pega a distancia que a table está do topo
            var top = $(".listaObjetos table").offset().top;
            //pega a altura da janela
            var height = $(window).height();
            //limita a altura da div table-responsive.
            $(".listaObjetos .table-responsive").height(height - top - 30);
        }

        //Respensável por controlar a movimentação do divider
        $(".divider").draggable({
            axis: "x",
            containment: "parent",
            scroll: false,
            drag: function () {
                //variável usada para setar o form que está sendo redimensionado
                var formResize = '';
                if ($(".formManutencao").is(':visible')) {
                    //o form a ser redimensionado será o formManutencao
                    formResize = $(".formManutencao");
                    //seta na variavel o width original do formManutencao
                    widthFormVisivel = widthFormManutencao;
                } else {
                    if ($(".formFiltro").is(':visible')) {

                        //o form a ser redimensionado será o formManutencao
                        formResize = $(".formFiltro");
                        //seta na variavel o width original do formFiltro
                        widthFormVisivel = widthFormFiltro;
                    }
                }
                var a = parseInt($(this).position().left);
                $(".listaObjetos").css({width: a});
                //redimensiona o form que está visível
                $(formResize).css({width: widthLista + widthFormVisivel - a});
            }
        });
        //Responsável por fazer o menu dos formulários ficarem fixos no topo quando gerar o scroll
        $(document).on('scroll', function () {
            //distância do scroll em ralação ao topo
            var topAtual = $(window).scrollTop();
            //se o top for maior que o height dos botões, é adicionado a classe .affix que é responsável por deixar os botões fixos no topo
            if (topAtual > $('.affix-nx').height()) {
                $('.affix-nx').addClass('affix');
            } else {
                //retira a classw .affix quando o top for igual a 0, indicando que não tem mais scroll
                if ($('.affix-nx').hasClass('affix') && topAtual === 0) {
                    $('.affix-nx').removeClass('affix');
                }

            }
        });
    },
    isMobile: function () {
        if (
            navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ) {
            return true;
        } else {
            return false;
        }
    },
    /*
     * Função responsável por ordenar uma lista de acordo
     * com a propriedade passada como parametro(campo).
     *
     * O 'campo' pode ser uma String ou Objeto
     *
     * @param {$scope} scope
     * @param {String} lista
     * @param {event} event
     * @param {String}/{Object} campo
     *
     */
    ordenarLista: function (scope, lista, event, campo) {
        var nxOrder = new NxOrder().getNovoNxOrder();
        var propriedade;
        //Verifica se o parametro 'campo' é um objeto ou uma String
        if (typeof campo === 'object') {
            propriedade = campo.campo.propriedadeExibicao;
        } else {
            propriedade = campo;
        }

        //Identifica se é para adicionar uma nova ordenação na lista
        var adicionarNxOrder = true;
        /*
         * Verifica se a lista já contém a propriedade passada como parametro
         */
        for (var i = 0; i < scope[lista].length; ++i) {
            if (scope[lista][i].propriedade === propriedade) {
                /*
                 * Inverte a ordenação para descrescente caso a ordem atual seja crescente
                 */
                if (scope[lista][i].ordem === ASC) {
                    scope[lista][i].ordem = DESC;
                    //Muda a imagem de ordenação para decrescente (seta para baixo)
                    $(event.currentTarget).find('img').attr('src', IMG_DESC);
                } else {
                    /*
                     * Se a ordenação atual for decrescente, é removido essa ordenação da lista
                     */
                    scope[lista].splice(i, 1);
                    //Muda a imagem de ordenação para 'both' (seta pra cima e pra baixo)
                    $(event.currentTarget).find('img').attr('src', IMG_BOTH);
                }

                //Identifica que a propriedade já existe na lista, então, não é para inserir uma nova ordenação
                adicionarNxOrder = false;
            }
        }
        /*
         * Se a variavel 'adicionarNxOrder' for TRUE,
         * significa que não foi encontrado essa propriedade na lista,
         * então, a mesma será adicionada inicialmente com ordem crescente.
         */
        if (adicionarNxOrder) {
            nxOrder.propriedade = propriedade;
            nxOrder.ordem = ASC;
            //Muda a imagem de ordenação para crescente (seta para cima)
            $(event.currentTarget).find('img').attr('src', IMG_ASC);
            //Adiciona na lista a nova ordenação
            scope[lista].push(nxOrder);
        }

    },
    /**
     *
     * @param {type} aba
     * @param {type} scope
     * @param {type} compile
     * @returns {undefined}
     */
    carregaAbaController: function (aba, scope, compile) {
        var tabPane = $('#abasHome #' + aba).attr('tab-pane');
        if (!$('#abasHome').closest('.tab-container').find('.tab-content').first().find('#' + tabPane).length) {

            //compila a aba
            compile($('#abasHome #' + aba))(scope);
            var tabTemplate = $('#abasHome #' + aba).attr('tab-template');
            var ngController = $('#abasHome #' + aba).attr('controller');
            var element;
            //verifica se existe o atributo "ng-controller"
            if (ngController) {
                //recupera o template que está no atributo "tab-template" e adiciona o "ng-controller"
                var template = $(tabTemplate);
                $(template).attr("ng-controller", ngController);
                //adiciona dentro do "nx-tab-pane" o conteúdo html do template
                element = "<nx-tab-pane nx-class='display-none  nx-tab-pane-principal' id='" + tabPane + "' >" + $(template)[0].outerHTML + "</nx-tab-pane>";
            } else {
                //Se não tiver o atributo "ng-controller", apenas adiciona o tab-template" passado
                element = "<nx-tab-pane nx-class='display-none nx-tab-pane-principal' id='" + tabPane + "'  >" + tabTemplate + "</nx-tab-pane>";
            }

            /*
             * recupera o elemento pai com a classe '.tab-container' mais próximo de #abasHome",
             * encontra o seu primeiro elemento com classe ".tab-content" e adiciona o "nx-tab-pane" compilado
             *
             * Obs:
             * Teve que ser utilizado o "first" para pegar o primeiro elemento com classe '.tab-container',
             * porque se tiver uma ou mais abas internas não será possível identificar em qual adicionar.
             * No caso das abas principais('#abasHome'), sempre será o primeiro
             */
            $('#abasHome').closest('.tab-container').find('.tab-content').first().append(compile(element)(scope));
        }
    },
    /**
     *
     * @param {type} id
     * @returns {undefined}
     */
    exibeAba: function (id) {
        //recupera o id do conteúdo da aba
        var idPane = $(id).attr('tab-pane');
        //verifica se o conteúdo da aba j´anão está visível
        if (!$("#" + idPane).is(":visible")) {
            //remove a classe "active" de todas as abas
            $(id).closest('ul').find('li').removeClass('active');
            //oculta o conteúdo de todas as abas
            $(id).closest('.tab-container').find('.tab-content').first().find('.nx-tab-pane-interno').hide();
            //Exibe o conteúdo da aba passado como parametro, através do seu id
            $(id).closest('.tab-container').find('.tab-content').first().find('#' + idPane).show();
            $(id).closest('li').addClass('active');
        }
    },
    /**
     * Vai para o topo da página
     *
     * @returns {undefined}
     */
    irParaOTopo: function () {
        $('body,html').animate({scrollTop: 0}, 600);
    },
    /*
     * Formata o tipo de alert a ser exibido
     *
     * @param {Object} data
     * @param {Array} resourceBundle
     * @param {String} tipo
     * @returns {Array}
     */
    formataAlert2: function (data, resourceBundle, tipo, msg) {
        var alert;
        var mensagem = "";
        var type = "";
        //pega a mensagem eo tipo
        if (data) {
            if (data.mensagem) {
                mensagem = data.mensagem;
            } else if (data.Mensagem) {
                mensagem = data.Mensagem;
            }
            if (data.tipo) {
                type = data.tipo;
            } else if (data.Tipo) {
                type = data.Tipo;
            }
            if (tipo === NEW_ALERT) {
                mensagem = resourceBundle;
                type = data;
            }
        }
        switch (tipo) {
            case ALERT_DEFAULT:
                //formata alert padrão
                alert = [
                    {type: type, msg: resourceBundle[mensagem]}
                ];
                break;
            case ALERT_ERRO_COMUNICACAO_SERVIDOR:
                //formata alert de erro de comunicação com o servidor
                alert = [
                    {
                        type: "danger",
                        msg: resourceBundle["label_erro_comunicacao_servidor"],
                        title: (data ? data.MessageDetail : "")
                    }
                ];
                break;
            case ALERT_CAMPOS_OBRIGATORIOS:
                //formata alert de campos obrigatórios
                alert = [
                    {type: "danger", msg: resourceBundle["label_preencha_os_campos_obrigatorios"]}
                ];
                break;
            case ALERT_ESTOQUE_INSUFICIENTE:
                //formata alert de campos obrigatórios
                alert = [
                    {type: "danger", msg: resourceBundle["label_estoque_insuficiente"]}
                ];
                break;
            case ALERT_CAMPOS_INVALIDOS:
                //formata alert de campos inválidos
                alert = [
                    {type: "danger", msg: resourceBundle['label_campos_invalidos_formulario']}
                ];
                break;
            case ALERT_ERRO_DOC_CADASTRADO:
                //formata alert de campos inválidos
                alert = [
                    {type: "danger", msg: resourceBundle['label_cpf_ja_cadastrado']}
                ];
                break;
            case ALERT_WARNING_DOC_CADASTRADO:
                //formata alert de campos inválidos
                alert = [
                    {type: "warning", msg: resourceBundle['label_cpf_ja_cadastrado']}
                ];
                break;
            case ALERT_ERRO_DEFAULT:
                //formata alert de erro com a mensagem vindo do backend
                alert = [
                    {type: "danger", msg: resourceBundle[mensagem]}
                ];
                break;
            case ALERT_SUCCESS_DEFAULT:
                //formata alert de success com a mensagem vindo do backend
                alert = [
                    {type: "success", msg: resourceBundle[mensagem]}
                ];
                break;
            case ALERT_SUCCESS_DOC_CADASTRADO:
                //formata alert de success com a mensagem vindo do backend
                alert = [
                    {type: "success", msg: resourceBundle['label_cpf_ja_cadastrado']}
                ];
                break;
            case ALERT_ERRO_LABEL:
                //formata alert com texto "erro"
                alert = [
                    {type: "danger", msg: resourceBundle['label_erro']}
                ];
                break;
            case NEW_ALERT:
                /*
                 * Cria um novo alert, com o tipo e mensagem sendo passado por parametro.
                 * onde:
                 * data = tipo do alert (success, danger, ect,)
                 * resourceBundle = será a mensagem(texto)
                 */
                alert = [
                    {type: type, msg: mensagem}
                ];
                break;
        }
        if (msg.id !== undefined) {
            Util.msgShowHide2(msg.id, msg.loading, msg.delay);
        } else {
            Util.msgShowHide2(msg, null, null);
        }
        return alert;
    },
    /*
     * Formata o tipo de alert a ser exibido
     *
     * @param {Object} data
     * @param {Array} resourceBundle
     * @param {String} tipo
     * @returns {Array}
     */
    formataAlert: function (data, resourceBundle, tipo, msgId) {
        var alert;
        var mensagem = "";
        var type = "";
        //pega a mensagem eo tipo
        if (data) {
            if (data.mensagem) {
                mensagem = data.mensagem;
            } else if (data.Mensagem) {
                mensagem = data.Mensagem;
            } else if (data.warning) {
                mensagem = data.warning;
            } else if (data.Warning) {
                mensagem = data.Warning;
            } else if (data.erro) {
                mensagem = data.erro;
            } else if (data.Erro) {
                mensagem = data.Erro;
            }
            if (data.tipo) {
                type = data.tipo;
            } else if (data.Tipo) {
                type = data.Tipo;
            }
            if (tipo === NEW_ALERT) {
                mensagem = resourceBundle;
                type = data;
            }
        }
        switch (tipo) {
            case ALERT_DEFAULT:
                //formata alert padrão
                alert = [
                    {type: type, msg: resourceBundle[mensagem]}
                ];
                break;
            case ALERT_ERRO_COMUNICACAO_SERVIDOR:
                //formata alert de erro de comunicação com o servidor
                alert = [
                    {
                        type: "danger",
                        msg: resourceBundle["label_erro_comunicacao_servidor"],
                        title: (data ? data.MessageDetail : "")
                    }
                ];
                break;
            case ALERT_CAMPOS_OBRIGATORIOS:
                //formata alert de campos obrigatórios
                alert = [
                    {type: "danger", msg: resourceBundle["label_preencha_os_campos_obrigatorios"]}
                ];
                break;
            case ALERT_ESTOQUE_INSUFICIENTE:
                //formata alert de campos obrigatórios
                alert = [
                    {type: "danger", msg: resourceBundle["label_estoque_insuficiente"]}
                ];
                break;
            case ALERT_CAMPOS_INVALIDOS:
                //formata alert de campos inválidos
                alert = [
                    {type: "danger", msg: resourceBundle['label_campos_invalidos_formulario']}
                ];
                break;
            case ALERT_ERRO_DOC_CADASTRADO:
                //formata alert de campos inválidos
                alert = [
                    {type: "danger", msg: resourceBundle['label_cpf_ja_cadastrado']}
                ];
                break;
            case ALERT_WARNING_DOC_CADASTRADO:
                //formata alert de campos inválidos
                alert = [
                    {type: "warning", msg: resourceBundle['label_cpf_ja_cadastrado']}
                ];
                break;
            case ALERT_ERRO_DEFAULT:
                //formata alert de erro com a mensagem vindo do backend
                alert = [
                    {type: "danger", msg: resourceBundle[mensagem]}
                ];
                break;
            case ALERT_SUCCESS_DEFAULT:
                //formata alert de success com a mensagem vindo do backend
                alert = [
                    {type: "success", msg: resourceBundle[mensagem]}
                ];
                break;
            case ALERT_SUCCESS_DOC_CADASTRADO:
                //formata alert de success com a mensagem vindo do backend
                alert = [
                    {type: "success", msg: resourceBundle['label_cpf_ja_cadastrado']}
                ];
                break;
            case ALERT_ERRO_LABEL:
                //formata alert com texto "erro"
                alert = [
                    {type: "danger", msg: resourceBundle['label_erro']}
                ];
                break;
            case NEW_ALERT:
                /*
                 * Cria um novo alert, com o tipo e mensagem sendo passado por parametro.
                 * onde:
                 * data = tipo do alert (success, danger, ect,)
                 * resourceBundle = será a mensagem(texto)
                 */
                alert = [
                    {type: type, msg: mensagem}
                ];
                break;
        }
        if (msgId) {
            Util.msgShowHide(msgId);
        }
        return alert;
    },
    /**
     *
     * @returns {undefined}
     */
    affix: function () {

        //Responsável por fazer o menu dos formulários ficarem fixos no topo quando gerar o scroll
        $(document).on('scroll', function () {

            //distância do scroll em ralação ao topo
            var topAtual = $(window).scrollTop();
            var $nxManuts = $('.nx-tab-pane-principal:visible').find('nx-manut');
            //se o top for maior que o height dos botões, é adicionado a classe .affix que é responsável por deixar os botões fixos no topo
            if (topAtual > $('.affix-nx').height()) {
                $('.affix-nx').addClass('affix');
                $nxManuts.each(function (index) {
                    $(this).find('.popup-backdrop').first().css('top', 0);
                });
            } else {
                //retira a classw .affix quando o top for igual a 0, indicando que não tem mais scroll
                if ($('.affix-nx').hasClass('affix') && topAtual === 0) {
                    $('.affix-nx').removeClass('affix');
                    $nxManuts.each(function (index) {
                        var offset = $(this).offset();
                        $(this).find('.popup-backdrop').first().css('top', offset.top + 3);
                    });
                }

            }
        });
    },
    /**
     * Configura affix para o filtro, função reponsável por deixar a barra com o filtro sempre no topo quando for rolado a barra de rolagem
     * @returns {undefined}
     */
    affixFiltro: function () {
        //Responsável por fazer o menu dos formulários ficarem fixos no topo quando gerar o scroll
        $(document).on('scroll', function () {

            //distância do scroll em ralação ao topo
            var topAtual = $(window).scrollTop();
            //se o top for maior que o height dos botões, é adicionado a classe .affix que é responsável por deixar os botões fixos no topo.

            //Na verificação teve que ser fixado uma altura fixa, pois para o botão ficar ao lado do menu no mobile, o mesmo deve ter a position fixed ou absolute.
            //com isso a div pai(.affix-nx) dele não 'consegue' pegar as dimensões do botão do filtro, ficando assim, como height igual a zero e consequentemente não pasaria na condição.
            //A verificação natural e dinamica seria topAtual > $('.affix-nx').height()
            if (topAtual > 44) {
                $('.affix-nx').addClass('affix');
                $('.navbar-nx-filtro').removeClass('navbar-nx-filtro-default');
                $('.navbar-nx-filtro').addClass('navbar-nx-filtro-affix');
            } else {
                //retira a classe .affix quando o top for igual a 0, indicando que não tem mais scroll
                if ($('.affix-nx').hasClass('affix') && topAtual === 0) {
                    $('.affix-nx').removeClass('affix');
                    $('.navbar-nx-filtro').addClass('navbar-nx-filtro-default');
                    $('.navbar-nx-filtro').removeClass('navbar-nx-filtro-affix');
                }

            }
        });
    },
    /**
     *
     * @param {type} e
     * @param {type} functionToCall
     * @returns {undefined}
     */
    aumentarDiminuirDashboardPanel: function (e, functionToCall) {
        //Verifica se possui a classe reponsável por aumentar o dashboard-panel.
        //Se possuir, significa que o usuário cicou no botão para diminuir a tela
        //Se não possuir, siginifica que o usuário clicou no botão para aumentar a tela
        if ($(e.target).closest('.dashboard-panel').hasClass('dashboard-panel-aumentar')) {
            //Altera o title do tooltip
            $(e.currentTarget).attr('title', 'Expandir');
            //Altera o data-original-title do tooltip
            $(e.currentTarget).attr('data-original-title', 'Expandir');
            //Altera o glyphicon do botão
            $(e.currentTarget).children('i').removeClass('glyphicon-resize-small').addClass('glyphicon-resize-full');
            //Substitui a altura que estava ocupando a tela inteira pela a altura padrão
            $(e.currentTarget).closest('.dashboard-panel').children('.panel-body').css('height', '350px');
            //Remove a classe reponsável por aumentar o dashboard-panel e deixá-lo acima dos demais
            $(e.currentTarget).closest('.dashboard-panel').removeClass('dashboard-panel-aumentar');
            //Adiciona a classe default do dashboard-panel
            $(e.currentTarget).closest('.dashboard-panel').addClass('dashboard-panel-default');
        } else {
            //Altura da janela
            var heightWindow = $(window).height();
            //Distância do dashboard-panel do elemento clicado, em relação ao top/left
            var offset = $(e.currentTarget).closest('.dashboard-panel').children('.panel-body').offset();
            $(e.currentTarget).closest('.dashboard-panel').css('top', 'auto');
            //Para a altura do elemento preencher toda a tela, é feito a altura da tela MENOS a distância do elemento em relação ao topo.
            //É diminuido também 13, que é referente a margim-bottom 10px do dashboard-panel MAIS a margin-bottom 3px da barra onde está os botões
            $(e.currentTarget).closest('.dashboard-panel').children('.panel-body').css('height', heightWindow - offset.top - 13);
            //Altera o title do tooltip
            $(e.currentTarget).attr('title', 'Diminuir');
            //Altera o data-original-title do tooltip
            $(e.currentTarget).attr('data-original-title', 'Diminuir');
            //Altera o glyphicon do botão
            $(e.currentTarget).children('i').removeClass('glyphicon-resize-full').addClass('glyphicon-resize-small');
            //Remove a classe default do dashboard-panel
            $(e.currentTarget).closest('.dashboard-panel').removeClass('dashboard-panel-default');
            //Adiciona a classe reponsável por aumentar o dashboard-panel e deixá-lo acima dos demais
            $(e.currentTarget).closest('.dashboard-panel').addClass('dashboard-panel-aumentar');
        }
        //chama a função para exibir o gráfico, o nome da função foi passado por parametro, para chamá-la basta usar ()
        if (functionToCall !== null) {
            functionToCall();
        }
    },
    /**
     *
     * @param {type} idShow
     * @param {type} idHide
     * @param {type} functionToCall
     * @returns {undefined}
     */
    alterarTelaExibicao: function (idShow, idHide, functionToCall) {
        $('#' + idShow).show();
        $('#' + idHide).hide();
        //chama a função para exibir o gráfico, o nome da função foi passado por parametro, para chamá-la basta usar ()
        if (functionToCall !== null) {
            functionToCall();
        }

    },
    /**
     * Abre o formulário de cadastro e diminui a lista (tabela)
     * @returns {undefined}
     */
    openFormManut: function () {
        //remove o atributo style desses 3 elementos, pois se caso já tivesse sido redimensionado, o width fixo ficaria no atributo style do elemento,
        //se não fizer isso ao abrir o filtro, o width fixo iria ter prioiridade em cima da classe do bootstrap que é em porcentagem,
        //podendo assim ao abrir, o layout ficar bagunbçado.
        $('.listaObjetos').removeAttr('style');
        $('.formManutencao').removeAttr('style');
        $('.form-position-fixed').removeAttr('style');
        $('.barra-divider').removeAttr('style');
        // Diminui o tamanho da lista de col-md-12 para col-md-4 e adiciona as classes hidden-xs e hidden-sm
        //que servem para ocultar a lista quando o sistema estiver sendo usado em tablets e smartphones
        $('.listaObjetos').removeClass("col-md-12").addClass("col-md-4 hidden-xs hidden-sm");
        // Exibe o formulário manutenção, retirando a classe hidden e adicionando a classe col-md-8
        //Ao fazer isso, dispara uma trigger que será utilizada no controller, "avisando" que deve exibir os botões referente ao form de manutenção
        $('.formManutencao').removeClass("hidden").addClass("col-md-8").trigger("showBtnsManut");
        //para o formulário ficar fixo enquanto rola a barra de rolagem, é necessário colocar o position como fixed,
        //porém ao fazer isso, ele precisará ter um width fixo para não esconder parte do fomrulário em alguns monitores,
        //então, é colocado o mesmo width do seu pai (formManutencao).
        //exibe o divider (a barra que redimensiona)
        $('.divider').show();
        //recupera a largura da listaObjetos adiciona mais 25px e coloca esse valor como left da classe .divider,
        // que será adistância em relação a margem esquerda
        $('.divider').css('left', $('.listaObjetos').width() + 30);
        $('.divider').addClass('hidden-xs hidden-sm');
        //coloca a mesma altura da listaObjetos no divider,
        // mas caso a lista esteja vazia, no caso de um novo registro, é estipulado que o height tenha a mesma altura do elemento formManutencao
        if ($('.listaObjetos').height() > $('.formManutencao').height()) {
            $('.divider').css('height', $('.listaObjetos').height());
        } else {
            $('.divider').css('height', $('.formManutencao').height() + 30);
        }
        // pelo fato do formulário ter posiiton fixed, a barra-divider que é reponsável pela borda cinza,
        // não acompanha o height do formulário caso a lista estiver vazia,
        //por isso, ao abrir o fomulário, é estipulado que o min-height, seja altura do divider + 10px
        $('.barra-divider').css('min-height', $('.divider').height());
        // Caso o formulario filtro etiver visível, oculta o mesmo
        $('.formFiltro').removeClass("col-md-8").addClass("hidden");
        // Recupera o top inicial da barra-divider
        var topDefault = $(".barra-divider").offset().top;
        // Seta o top da barra-divider como top do form-position-fixed.
        // Como o filtro e o form-position-fixed estão dentro da mesma div e ambos estão com position=fixed,
        // Eles ficam por padrão com o top=0, ou seja, encostados no topo do "pai",ficando assim, um em cima do outro.
        // para evitar isso é utilizado o top da barra-divider, que fica abaixo do filtro. Fazendo isso, sempre o form-position-fixed ficará abaixo do filtro
        // o +5 foi utilizado somente para deixar um pequeno espaço entre os dois elementos
    },
    /**
     * Fecha o formulário de cadastro e aumenta a lista (tabela)
     * @returns {undefined}
     */
    closeFormManut: function () {
        // Aumenta o tamanho da lista de col-md-4 para col-md-12 e retira as classes hidden-xs e hidden-sm
        //que servem para ocultar a lista quando o sistema estiver sendo usado em tablets e smartphones
        $('.listaObjetos').removeClass("col-md-4 hidden-xs hidden-sm").addClass("col-md-12");
        //remove o atributo style desses 3 elementos, pois se caso já tivesse sido redimensionado, o width fixo ficaria no atributo style do elemento,
        //se não fizer isso ao abrir o filtro, o width fixo iria ter prioiridade em cima da classe do bootstrap que é em porcentagem,
        //podendo assim ao abrir, o layout ficar bagunbçado.
        $('.listaObjetos').removeAttr('style');
        $('.formManutencao').removeAttr('style');
        // oculta o formulário manutenção, retirando a classe  col-md-8 e adicionando a classe hidden
        //Ao fazer isso, dispara uma trigger que será utilizada no controller, "avisando" que deve ocultar os botões referente ao form de manutenção
        $('.formManutencao').removeClass("col-md-8").addClass("hidden").trigger("hideBtnsManut");
        //remove o atributo style, onde fica o valor do min-height utlizado ao abrir o formulário.
        $('.barra-divider').removeAttr('style');
        //oculta divider (a barra que redimensiona)
        $('.divider').hide();
    },
    /**
     * Abre e fecha o formulário filtro
     * @returns {undefined}
     */
    openCloseFormFilter: function () {
        // Quando o botão com classe .openFilter for clicado
        $('.openFilter').click(function () {
            $('html, body').animate({scrollTop: 0}, 'fast');
            //remove o atributo style desses 3 elementos, pois se caso já tivesse sido redimensionado, o width fixo ficaria no atributo style do elemento,
            //se não fizer isso ao abrir o filtro, o width fixo iria ter prioiridade em cima da classe do bootstrap que é em porcentagem,
            //podendo assim ao abrir, o layout ficar bagunbçado.
            $('.listaObjetos').removeAttr('style');
            $('.formFiltro').removeAttr('style');
            // Diminui o tamanho da lista de col-md-12 para col-md-4 e adiciona as classes hidden-xs e hidden-sm
            //que servem para ocultar a lista quando o sistema estiver sendo usado em tablets e smartphones
            $('.listaObjetos').removeClass("col-md-12").addClass("col-md-4 hidden-xs hidden-sm");
            // Exibe o formulário filtro, retirando a classe hidden e adicionando a classe col-md-8
            //Ao fazer isso, dispara uma trigger que será utilizada no controller, "avisando" que deve exibir os botões referente ao form de filtro
            $('.formFiltro').removeClass("hidden").addClass("col-md-8").trigger("showBtnsFiltro");
            // Caso o formulario manutenção etiver visível, oculta o mesmo
            $('.formManutencao').removeClass("col-md-8").addClass("hidden");
            //exibe o divider (a barra que redimensiona)
            $('.divider').show();
            //recupera a largura da listaObjetos adiciona mais 25px e coloca esse valor como left da classe .divider,
            // que será adistância em relação a margem esquerda
            $('.divider').css('left', $('.listaObjetos').width() + 30);
            $('.divider').addClass('hidden-xs hidden-sm');
            //coloca a mesma altura da listaObjetos no divider,
            // mas caso a lista esteja vazia, no caso de um novo registro, é estipulado que o height tenha a mesma altura do elemento formManutencao
            if ($('.listaObjetos').height() > $('.formManutencao').height()) {
                $('.divider').css('height', $('.listaObjetos').height());
            } else {
                $('.divider').css('height', $('.formManutencao').height() + 30);
            }
            // pelo fato do formulário ter posiiton fixed, a barra-divider que é reponsável pela borda cinza,
            // não acompanha o height do formulário caso a lista estiver vazia,
            //por isso, ao abrir o fomulário, é estipulado que o min-height, seja altura do divider + 10px
        });
        // Quando o botão com classe .closeFilter for clicado
        $('.closeFilter').click(function () {
            // Aumenta o tamanho da lista de col-md-4 para col-md-12 e retira as classes hidden-xs e hidden-sm
            //que servem para ocultar a lista quando o sistema estiver sendo usado em tablets e smartphones
            $('.listaObjetos').removeClass("col-md-4 hidden-xs hidden-sm").addClass("col-md-12");
            // oculta o formulário filtro, retirando a classe  col-md-8 e adicionando a classe hidden
            $('.formFiltro').removeClass("col-md-8").addClass("hidden").trigger("hideBtnsFiltro");
            //$('#content-slider').width($('.listaObjetos').width());
            $('.divider').hide();
            //remove o atributo style desses 3 elementos, pois se caso já tivesse sido redimensionado, o width fixo ficaria no atributo style do elemento,
            //se não fizer isso ao abrir o filtro, o width fixo iria ter prioiridade em cima da classe do bootstrap que é em porcentagem,
            //podendo assim ao abrir, o layout ficar bagunbçado.
            $('.listaObjetos').removeAttr('style');
            $('.formFiltro').removeAttr('style');
            //$('.form-position-fixed').removeAttr('style');
            //remove o atributo style, onde fica o valor do min-height utlizado ao abrir o formulário.
            $('.barra-divider').removeAttr('style');
        });
        // Quando o botão com classe .closeFilterMobile  for clicado e estiver em um mobile
        $('.closeFilterMobile').click(function () {
            if ($(window).width() <= 991) {
                // Aumenta o tamanho da lista de col-md-4 para col-md-12 e retira as classes hidden-xs e hidden-sm
                //que servem para ocultar a lista quando o sistema estiver sendo usado em tablets e smartphones
                $('.listaObjetos').removeClass("col-md-4 hidden-xs hidden-sm").addClass("col-md-12");
                // oculta o formulário filtro, retirando a classe  col-md-8 e adicionando a classe hidden
                //Ao fazer isso, dispara uma trigger que será utilizada no controller, "avisando" que deve ocultar os botões referente ao form de manutenção
                $('.formFiltro').removeClass("col-md-8").addClass("hidden").trigger("hideBtnsFiltro");
                $('.divider').hide();
                //remove o atributo style desses 3 elementos, pois se caso já tivesse sido redimensionado, o width fixo ficaria no atributo style do elemento,
                //se não fizer isso ao abrir o filtro, o width fixo iria ter prioiridade em cima da classe do bootstrap que é em porcentagem,
                //podendo assim ao abrir, o layout ficar bagunbçado.
                $('.listaObjetos').removeAttr('style');
                $('.formFiltro').removeAttr('style');
                //remove o atributo style, onde fica o valor do min-height utlizado ao abrir o formulário.
                $('.barra-divider').removeAttr('style');
            }
        });
    },
    /**
     *
     * @param {type} form
     * @returns {undefined}
     */
    openClosePopUp: function (form) {
        //Verifica se o botão com a class ".open-popup", que tem um pai com a class ".open-close-popup" foi clicado
        $('.open-close-popup .open-popup').click(function () {
            // Como o que foi clicado foi o botão ".open-popup"(this) e o mesmo NÃO é pai do ".dropdown-menu",
            // então é necessário referenciar o pai mais próximo (closest) do botão ".open-popup",
            // que contenha a class ".open-close-popup" com um filho (children) ".dropdown-menu".
            // Isso é feito para garantir que será ABERTO o popup certo.
            $(this).closest('.open-close-popup').children('.dropdown-menu').show();
        });
        $('.open-close-popup .close-popup').click(function () {
            //Ao fechar, verifica se o form possui campos com a borda vermelha, indicando que o mesmo é obrigatporio e não foi preenchido
            // caso possua, remove a class responsável.
            var id = $(this).closest('.open-close-popup').children('.dropdown-menu').find('.form').first().attr('id');
            Util.limpaValidacaoDoFormulario(id);
            // Como o que foi clicado foi o botão ".open-popup"(this) e o mesmo NÃO é pai do ".dropdown-menu",
            // então é necessário referenciar o pai mais próximo (closest) do botão ".open-popup",
            // que contenha a class ".open-close-popup" com um filho (children) ".dropdown-menu".
            // Isso é feito para garantir que será FECHADO o popup certo.
            $(this).closest('.open-close-popup').children('.dropdown-menu').hide();
        });
        $('.close-form').click(function () {
            $('.listaObjetos').switchClass("col-md-4", "col-md-12", 1, "easeInOutQuad");
            $('.manutencao').switchClass("col-md-8", "hidden", 1, "easeInOutQuad");
        });
    },
    /**
     * Quando o meu estiver em uma tela menor, fecha o menu quando clicar no link do menu
     *
     * */
    closeMenuOnClick: function () {
        //Ao clicar em uma tag 'a' do menu, é chamado essa função
        $('.nav a').on('click', function () {
            //como esse função será chamada independente do tamanho da tela, é verificado se o botão com class 'navbar-toggle' está visível,
            // indicando que o menu está em uma tela menor.
            if ($('.navbar-toggle').is(":visible")) {
                //se o pai 'li' mais próximo do link(tag 'a') clicado tiver um filho 'ul', significa que é um dropdown, ou seja um submenu.
                //por isso não deve fechar o menu ao ser clicado.
                //se não tiver um filho 'ul', significa que é somente o link, então o menu pode ser fechado.
                if ($(this).closest('li').find('ul').length === 0) {
                    //"clica" no botão com class 'navbar-toggle' para fechar;
                    $(".navbar-toggle").click();
                }
            }
        });
    },
    verificaCoresDoDatasets: function (datasets) {
        if (!datasets.fillColor || datasets.fillColor === "") {
            datasets.fillColor = "rgba(151,187,205,0.5)";
        }
        if (!datasets.strokeColor || datasets.strokeColor === "") {
            datasets.strokeColor = "rgba(151,187,205,0.8)";
        }
        if (!datasets.highlightFill || datasets.highlightFill === "") {
            datasets.highlightFill = "rgba(151,187,205,0.75)";
        }
        if (!datasets.highlightStroke || datasets.highlightStroke === "") {
            datasets.highlightStroke = "rgba(151,187,205,1)";
        }
    },
    /**
     *  Fecha o item com delay de 400, fadeout de 700, e slow.
     *  caso nao seja passado um id fecha a msg
     *
     * @param {type} id
     * @returns {undefined}
     */
    closeWhithDelay: function (id) {
        if (!id) {
            id = "#msg";
        }

        $(id).delay(400).fadeOut(700);
        $(id).hide('slow');
    },
    /**
     *<pre>
     *<b>author:</b> Marlos M. Novo
     *<b>date:  </b> 24/04/2014
     *</pre>
     *
     *  Função para validar CNPJ.
     *
     * @param {type} cnpj
     * @returns {Boolean}
     */
    validarCNPJ: function (cnpj) {

        cnpj = cnpj.replace(/[^\d]+/g, '');
        if (cnpj === '')
            return false;
        if (cnpj.length !== 14)
            return false;
        // Elimina CNPJs invalidos conhecidos
        if (cnpj === "00000000000000" ||
            cnpj === "11111111111111" ||
            cnpj === "22222222222222" ||
            cnpj === "33333333333333" ||
            cnpj === "44444444444444" ||
            cnpj === "55555555555555" ||
            cnpj === "66666666666666" ||
            cnpj === "77777777777777" ||
            cnpj === "88888888888888" ||
            cnpj === "99999999999999")
            return false;
        // Valida DVs
        var tamanho = cnpj.length - 2;
        var numeros = cnpj.substring(0, tamanho);
        var digitos = cnpj.substring(tamanho);
        var soma = 0;
        var pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado.toString() !== digitos.charAt(0))
            return false;
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado.toString() !== digitos.charAt(1))
            return false;
        return true;
    },
    /**
     *<pre>
     *<b>author:</b> Darlei
     *</pre>
     *
     *  Limpa as validações dos campos do formulário.
     * @param {type} form
     * @returns {undefined}
     */
    limpaValidacaoDoFormulario: function (form) {
        var hash = "#" + form;
        hash = hash.replace("##", "#");
        $(hash + " .required").removeClass('campo-obrigatorio');
    },
    /**
     *<pre>
     *<b>author:</b> Darlei
     *</pre>
     *
     *  Valida campos de um determindao formulário.
     * @param {type} form
     * @param {type} isInterno valida de é de um modal ou de um form normal
     * @param {type} nivelRequiredInterno
     * @returns {Number}
     * */
    validaCamposDoFormulario: function (form, isInterno, nivelRequiredInterno) {
        var cont = 0;
        var form = form;
        form = form.replace("#", "");
        var required = (isInterno ? "required-interno" + nivelRequiredInterno : "required");
        // pega os inputs, selects e textareas do form
        var $inputs = $('#' + form + ' input, #' + form + ' select, #' + form + ' textarea');
        // passa por cada input
        $inputs.each(function (index) {
                //pega o id do input
                var id = $(this).attr('id');
                if (id) {
                    var campo = $("#" + form + " #" + id);
//                var idFormPai = campo[0].form.attributes.id.value;
//
//                if (idFormPai == form) {
                    //veirifica se possui a class 'required', o que indica que o campo é obrigatório
                    if ($("#" + form + " #" + id).hasClass(required)) {
                        //se possui a classe, verifica se o campo está vazio.
                        if ($("#" + form + " #" + id).val() === '' ||
                            $("#" + form + " #" + id).val() === null ||
                            $("#" + form + " #" + id).val() === '?' ||
                            $("#" + form + " #" + id).val() === '? undefined:undefined ?'
                        ) {
                            // verifica se o componente é um Select
                            if ($("#" + form + " #" + id).is("select")) {
                                //se for select verifica se o primeiro option está vazio
                                if ($("#" + form + " #" + id + " option:eq(0)").text() === "--" ||
                                    $("#" + form + " #" + id + " option:eq(0)").text() === "" ||
                                    $("#" + form + " #" + id + " option:eq(0)").text() === "?" ||
                                    $("#" + form + " #" + id + " option:eq(0)").text() === "? undefined:undefined ?"

                                ) {
                                    // adiciona mais 1 ao cont, isso é feito para saber que pelo menos um campo obrigatório não está preenchido
                                    cont = cont + 1;
                                    // adiciona a classe css responsável por colocar a borda vermelha
                                    $("#" + form + " #" + id).addClass('campo-obrigatorio');
                                    //$scope[id] = true;
                                } else {
                                    // $scope[id] = false;
                                    $("#" + form + " #" + id).removeClass('campo-obrigatorio');
                                }
                            } else {
                                // se estiver vazio, seta no scope correspondente 'true', para exibir a mensagem de campo obrigatório
                                //no ng-show da tag span do input atual, deve ter o mesmo nome do id
                                // $scope[id] = true;

                                // adiciona a classe css responsável por colocar a borda vermelha
                                $("#" + form + " #" + id).addClass('campo-obrigatorio');
                                // adiciona mais 1 ao cont, isso é feito para saber que pelo menos um campo obrigatório não está preenchido
                                cont = cont + 1;
                            }
                        } else {
                            // $scope[id] = false;
                            // se estiver preenchido, é romovido a classe
                            $("#" + form + " #" + id).removeClass('campo-obrigatorio');
                        }
                    }
                }
            }
            //}
        );
        return cont;
    },
    /**
     *
     * @param {type} id
     * @returns {Boolean}
     */
    isAoMenosUmCheckboxMarcado: function (id) {
        var count = 0;
        $("#" + id + " input[type=checkbox]").each(function (index) {
            if ($(this).is(':checked')) {
                count++;
            }
        });
        if (count > 0) {
            return true;
        } else {
            return false;
        }
    },
    /**
     *
     * @param {type} data
     * @returns {Date}
     */
    formataData: function (data) {

        var dia = data.substring(0, 2);
        var mes = data.substring(2, 4);
        var ano = data.substring(4, 8);
        var novaData = ano + "-" + mes + "-" + dia + "T12:00:00";
        var dataTimeZone = new Date(novaData.toLocaleString());
        return dataTimeZone;
    },
    diferencaDias: function (data1, data2) {
        if (data1 === null || data2 === null)
            return 0;
        var diferenca;
        return diferenca = (((data2.getTime() - data1.getTime()) / (1000 * 60 * 60 * 24)).toString());
    },
    /**
     *
     * @param {type} data
     * @param {type} formatoAtual
     * @param {type} formatoNovo
     * @returns {Date}
     */
    formataDataToFormat: function (data, formatoAtual, formatoNovo) {
        var formatos = formatoAtual.split("/");
        var numeros = data.split("/");
        var dia = 0;
        var mes = 0;
        var ano = 0;
        for (var i = 0; i < formatos.length; i++) {
            if (formatos[i].indexOf("dd") !== -1) {
                dia = parseInt(numeros[i]);
            }
            if (formatos[i].indexOf("MM") !== -1 || formatos[i].indexOf("mm") !== -1) {
                mes = parseInt(numeros[i]);
            }
            if (formatos[i].indexOf("yy") !== -1
                || formatos[i].indexOf("yyyy") !== -1
                || formatos[i].indexOf("YY") !== -1
                || formatos[i].indexOf("YYYY") !== -1) {
                ano = parseInt(numeros[i]);
            }
        }

//        Esta parte do metodo foi comentado pois o IE não aceita criar uma data
//        passando uma string no formato "yyyy-mm-dd"
//
//        var novaData = "";
//        if (formatoNovo) {
//            var formatosNovo = formatoNovo.split("/");
//            for (var i = 0; i < formatosNovo.length; i++) {
//                if (formatosNovo[i].indexOf("dd") !== -1) {
//                    novaData += dia;
//                }
//                if (formatosNovo[i].indexOf("MM") !== -1 || formatosNovo[i].indexOf("mm") !== -1) {
//                    novaData += mes;
//                }
//                if (formatosNovo[i].indexOf("yy") !== -1
//                        || formatosNovo[i].indexOf("yyyy") !== -1
//                        || formatosNovo[i].indexOf("YY") !== -1
//                        || formatosNovo[i].indexOf("YYYY") !== -1) {
//                    novaData += ano;
//                }
//                if (i < formatosNovo.length - 1) {
//                    novaData += "-";
//                }
//            }
//        } else {
//            novaData = ano + "-" + mes + "-" + dia;
//        }
//        var dataTimeZone = new Date(novaData.toLocaleString());

        var dataTimeZone = new Date(ano, mes - 1, dia);
        return dataTimeZone;
    },
    /**
     *<pre>
     *<b>author:</b> Marlos M. Novo
     *<b>date:  </b> 23/09/2014
     *</pre>
     *
     *  Transforma a data passada por parametro no padrão ddmmaaaa. Ex 23092014
     **/
    /**
     *
     * @param {Date} data
     * @returns {String} dateString
     */
    formataDataToString: function (data) {
        var dia = data.getDate().toString();
        dia = dia < 10 ? "0" + dia : dia;
        var mes = (data.getMonth() + 1).toString();
        mes = mes < 10 ? "0" + mes : mes;
        var ano = data.getFullYear().toString();
        var dateString = dia + mes + ano;
        return dateString;
    },
    /**
     *<pre>
     *<b>author:</b> Lucas Heitor
     *<b>date:  </b> 11/03/2016
     *</pre>
     *
     *  Verifica uma data string em portugues,  exemplo: 11/03/2016, e logo, verifica se o mesmo está com o mes e dia correto.
     **/
    /**
     *
     * @param {String} dataString
     * @returns {Boolean} verificaData
     */
    verificaData: function (dataString, locale) {
        var verificaData;
        var dataAux = dataString.split("");
        if (dataAux.length === 10) {
            if (locale == "pt_BR" || "es_ES") {
                var dia = dataAux[0] + dataAux[1];
                var mes = dataAux[3] + dataAux[4];
            } else if (locale == "en_US") {
                var mes = dataAux[0] + dataAux[1];
                var dia = dataAux[3] + dataAux[4];
            }
            var ano = dataAux[6] + dataAux[7] + dataAux[8] + dataAux[9];

            if (dia >= 32 || dia == 00) {
                return false;
            } else if (mes >= 13 || mes == 00) {
                return false;
            }
        } else {
            return false;
        }

        return true;
    },
    /**
     *<pre>
     *<b>author:</b> Marlos Morbis Novo
     *<b>date:  </b> 05/05/2015
     *</pre>
     *
     *  Transforma a String passada por parametro em uma data, obedecendo o
     *  formato e o delimitador informado.
     *
     * @param {String} _date
     * @param {String} _format
     * @param {String} _delimiter
     * @returns {Date}
     */
    stringToDate: function (_date, _format, _delimiter) {
        var formatLowerCase = _format.toLowerCase();
        var formatItems = formatLowerCase.split(_delimiter);
        var dateItems = _date.split(_delimiter);
        var monthIndex = formatItems.indexOf("mm");
        var dayIndex = formatItems.indexOf("dd");
        var yearIndex = formatItems.indexOf("yyyy");
        var month = parseInt(dateItems[monthIndex]);
        month -= 1;
        var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
        return formatedDate;
    },
    /**
     *<pre>
     *<b>author:</b> Giovani L. Fiszt
     *<b>date:  </b> 02/05/2014
     *</pre>
     *
     *  Função para validar CPF
     *
     * @param {String} strCPF
     * @returns {Boolean}
     */
    validarCPF: function (strCPF) {
        var Soma;
        var Resto;
        Soma = 0;
        if (!strCPF) {
            return false;
        }
        //remove a formatação do cpf
        if (strCPF.indexOf(".") > -1) {
            strCPF = StringUtil.replaceAll(strCPF, ".", "");
        }
        if (strCPF.indexOf("-") > -1) {
            strCPF = StringUtil.replaceAll(strCPF, "-", "");
        }
        //strCPF  = RetiraCaracteresInvalidos(strCPF,11);
        if (strCPF === "00000000000" || strCPF === "11111111111"
            || strCPF === "22222222222" || strCPF === "33333333333"
            || strCPF === "44444444444" || strCPF === "55555555555"
            || strCPF === "66666666666" || strCPF === "77777777777"
            || strCPF === "88888888888" || strCPF === "99999999999")
            return false;
        for (i = 1; i <= 9; i++)
            Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;
        if ((Resto === 10) || (Resto === 11))
            Resto = 0;
        if (Resto !== parseInt(strCPF.substring(9, 10)))
            return false;
        Soma = 0;
        for (i = 1; i <= 10; i++)
            Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;
        if ((Resto === 10) || (Resto === 11))
            Resto = 0;
        if (Resto !== parseInt(strCPF.substring(10, 11)))
            return false;
        return true;
    },
    validaEmail: function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    /**
     * Função para recarregar o combo
     *
     * @param {type} comboId
     * @param {type} funcao
     * @returns {undefined}
     */
    reloadCombo: function (comboId, funcao) {
        Sessao.excluiObjDaSessao(comboId);
        funcao();
    },
    /**
     * Valida se o parametro contem somente numeros
     * @param {type} meucampo
     * @param {type} e
     * @param {type} dec
     * @returns {Boolean}
     */
    SomenteNumeros: function (meucampo, e, dec) {
        var key;
        var keychar;
        if (window.event)
            key = window.event.keyCode;
        else if (e)
            key = e.which;
        else
            return true;
        keychar = String.fromCharCode(key);
        // control keys
        if ((key === null) || (key === 0) || (key === 8) ||
            (key === 9) || (key === 13) || (key === 27))
            return true;
        // numbers
        else if ((("0123456789").indexOf(keychar) > -1))
            return true;
        // decimal point jump
        else if (dec && (keychar === ".")) {
            meucampo.form.elements[dec].focus();
            return false;
        } else
            return false;
    },
    /**
     * @author Luan Luiz freitas
     * @param {string} entrada
     * @returns {String|saida}
     */
    inverteBarra: function (entrada) {
        var saida = "";
        // recebe a string vinda do java com o acento e barra invertida
        // seleciona a string do acento faz o descrito na função
        // a com acento
        saida = (entrada.replace("/u00e1", "\u00e1"));
        saida = (saida.replace("/u00e0", "\u00e0"));
        saida = (saida.replace("/u00e2", "\u00e2"));
        saida = (saida.replace("/u00e3", "\u00e3"));
        saida = (saida.replace("/u00e4", "\u00e4"));
        saida = (saida.replace("/u00c1", "\u00c1"));
        saida = (saida.replace("/u00c0", "\u00c0"));
        saida = (saida.replace("/u00c2", "\u00c2"));
        saida = (saida.replace("/u00c3", "\u00c3"));
        saida = (saida.replace("/u00c4", "\u00c4"));
        //e com acento
        saida = (saida.replace("/u00e9", "\u00e9"));
        saida = (saida.replace("/u00e8", "\u00e8"));
        saida = (saida.replace("/u00ea", "\u00ea"));
        saida = (saida.replace("/u00eb", "\u00eb"));
        saida = (saida.replace("/u00c9", "\u00c9"));
        saida = (saida.replace("/u00c8", "\u00c8"));
        saida = (saida.replace("/u00ca", "\u00ca"));
        saida = (saida.replace("/u00cb", "\u00cb"));
        //i com acento
        saida = (saida.replace("/u00ed", "\u00ed"));
        saida = (saida.replace("/u00ec", "\u00ec"));
        saida = (saida.replace("/u00ee", "\u00ee"));
        saida = (saida.replace("/u00ef", "\u00ef"));
        saida = (saida.replace("/u00ed", "\u00ed"));
        saida = (saida.replace("/u00cc", "\u00cc"));
        saida = (saida.replace("/u00ce", "\u00ce"));
        saida = (saida.replace("/u00cf", "\u00cf"));
        //o com acento
        saida = (saida.replace("/u00f3", "\u00f3"));
        saida = (saida.replace("/u00f2", "\u00f2"));
        saida = (saida.replace("/u00f4", "\u00f4"));
        saida = (saida.replace("/u00f5", "\u00f5"));
        saida = (saida.replace("/u00f6", "\u00f6"));
        saida = (saida.replace("/u00d3", "\u00d3"));
        saida = (saida.replace("/u00d2", "\u00d2"));
        saida = (saida.replace("/u00d4", "\u00d4"));
        saida = (saida.replace("/u00d5", "\u00d5"));
        saida = (saida.replace("/u00d6", "\u00d6"));
        //u com acento
        saida = (saida.replace("/u00fa", "\u00fa"));
        saida = (saida.replace("/u00f9", "\u00f9"));
        saida = (saida.replace("/u00fb", "\u00fb"));
        saida = (saida.replace("/u00fc", "\u00fc"));
        saida = (saida.replace("/u00da", "\u00da"));
        saida = (saida.replace("/u00d9", "\u00d9"));
        saida = (saida.replace("/u00dc", "\u00dc"));
        saida = (saida.replace("/u00dc", "\u00dc"));
        //Ç
        saida = (saida.replace("/u00e7", "\u00e7"));
        saida = (saida.replace("/u00c7", "\u00c7"));
        //Ñ
        saida = (saida.replace("/u00f1", "\u00f1"));
        saida = (saida.replace("/u00d1", "\u00d1"));
        //&
        saida = (saida.replace("/u0026", "\u0026"));
        //'
        saida = (saida.replace("/u0027", "\u0027"));
        return saida;
    },
    /**
     * @author Luan Luiz freitas
     * @param {string} parametro
     * @param {string} url
     */
    getParameters: function (parametro, url) {
        url = url ? url : window.location.href.toString();
        parametro = parametro.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + parametro + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        if (results === null) {
            return "";
        } else {
            return results[1];
        }
    },
    /**
     * Método faz o download de bytes passados por parametro
     * @param {type} obj seja o ArquivoVo que o conteudo
     * @param {type} nome nome do arquivo
     * @param {type} tipo tipo do arquivo
     * @returns {undefined}
     */
    download: function (obj, nome, tipo) {
        if (obj) {
            if (obj.arquivo && obj.nmAnexo) {
                nome = obj.nmAnexo;
                obj = obj.arquivo;
            }
            if (!tipo && nome.indexOf(".") > -1) {
                var tipoArr = nome.split(".");
                tipo = nome.split(".")[tipoArr.length];
            }
            var blobObject = Util.b64toBlob(obj, tipo);
            if (window.navigator.msSaveOrOpenBlob !== undefined) {
                window.navigator.msSaveOrOpenBlob(blobObject, nome);
            } else if (window.navigator.msSaveBlob !== undefined) {
                window.navigator.msSaveBlob(blobObject, nome);
            } else {
                saveAs(blobObject, nome);
            }
        }
    },
    /**
     * Método retorno o primeiro dia do Mês
     * @returns {undefined}
     */
    primeiroDiaMes: function () {
        var data = null;
        try {
            data = new Date();
            data = new Date(data.getFullYear(), data.getMonth(), 1, data.getHours(), data.getMinutes(), data.getSeconds(), data.getMilliseconds());
        } catch (e) {
            console.log(e);
        }
        return data;
    },
    /**
     * Formata as labels com os valores passados por parametro
     * @author Luan L Domingues
     * @param {string} label label a ser formatada
     * @param {Array} parametros lista de pamaetros para substituicao
     * @returns {String}
     */
    formataLabel: function (label, parametros) {
        if (label && parametros && parametros.length > 0) {
            if (label.indexOf("{0}") > -1) {
                var i = 0;
                var numPara = "{" + i + "}";
                var parametro = parametros[0];
                while (label.indexOf(numPara) !== -1) {
                    label = label.replace(numPara, parametro);
                    i++;
                    numPara = "{" + i + "}";
                    parametro = parametros[i];
                    if (!parametro) {
                        parametro = " ";
                    }
                }
                return label;
            }
        }
    },
    clipboardPaste: function () {
        // Created by STRd6
        // MIT License
        // jquery.paste_image_reader.js
        (function ($) {
            var defaults;
            $.event.fix = (function (originalFix) {
                return function (event) {
                    event = originalFix.apply(this, arguments);
                    if (event.type.indexOf('copy') === 0 || event.type.indexOf('paste') === 0) {
                        event.clipboardData = event.originalEvent.clipboardData;
                        ELEMENTO_CLIPBOARD = $(event.target).closest('.anexoClipboard');
                    }
                    return event;
                };
            })($.event.fix);
            defaults = {
                callback: $.noop,
                matchType: /image.*/
            };
            return $.fn.pasteImageReader = function (options) {
                if (typeof options === "function") {
                    options = {
                        callback: options
                    };
                }
                options = $.extend({}, defaults, options);
                return this.each(function () {
                    var $this, element;
                    element = this;
                    $this = $(this);
                    return $this.bind('paste', function (event) {
                        var clipboardData, found;
                        found = false;
                        clipboardData = event.clipboardData;
                        return Array.prototype.forEach.call(clipboardData.types, function (type, i) {
                            var file, reader;
                            if (found) {
                                return;
                            }
                            if (type.match(options.matchType) || clipboardData.items[i].type.match(options.matchType)) {
                                file = clipboardData.items[i].getAsFile();
                                reader = new FileReader();
                                reader.onload = function (evt) {
                                    return options.callback.call(element, {
                                        dataURL: evt.target.result,
                                        event: evt,
                                        file: file,
                                        name: file.name
                                    });
                                };
                                reader.readAsDataURL(file);
                                snapshoot();
                                return found = true;
                            }
                        });
                    });
                });
            };
        })(jQuery);
        $("html").pasteImageReader(function (results) {
            var dataURL, filename;
            filename = results.filename, dataURL = results.dataURL;
            $data.text(dataURL);
            $size.val(results.file.size);
            $type.val(results.file.type);
            $test.attr('href', dataURL);
            var img = document.createElement('img');
            img.src = dataURL;
            var w = img.width;
            var h = img.height;
            $width.val(w);
            $height.val(h);
            //            ID_LISTA_ANEXOS = ID_LISTA_ANEXOS + 1;
            //            var anexo = new AtividadeAnexo().getNovaAtividadeAnexo();
            //            anexo.IdAtivAnexo = ID_LISTA_ANEXOS
            //            anexo.ArquivoBase64 = dataURL;
            //            Arrays.add(LISTA_ANEXOS, anexo);

            $(ELEMENTO_CLIPBOARD).append('<img width="90%" src="' + dataURL + '" alt="...">');
            return $(ELEMENTO_CLIPBOARD);
        });
        var $data, $size, $type, $test, $width, $height;
        $(function () {
            $data = $('.data');
            $size = $('.size');
            $type = $('.type');
            $test = $('#test');
            $width = $('#width');
            $height = $('#height');
            $('.target').on('click', function () {
                var $this = $(this);
                var bi = $this.css('background-image');
                if (bi !== 'none') {
                    $data.text(bi.substr(4, bi.length - 6));
                }

                $('.anexoClipboard').removeClass('anexoClipboard');
                $this.addClass('anexoClipboard');
                $this.toggleClass('contain');
                $width.val($this.data('width'));
                $height.val($this.data('height'));
                if ($this.hasClass('contain')) {
                    $this.css({'width': $this.data('width'), 'height': $this.data('height'), 'z-index': '10'});
                } else {
                    $this.css({'width': '', 'height': '', 'z-index': ''});
                }

            });
        });
    },
    /**
     * Seta os parametros na label
     * @author Daniel H Parisotto
     *
     * Como usar:
     *
     * var label = "Frutas: {0}, {1}
     * var val1 = "maça"
     * var val2 = "banana"
     *
     * var result = Util.setParamsLabel(label, val1, val2);
     *
     * Frutas: maça, banana
     *
     * @param {type} s
     * @returns {String}
     */
    setParamsLabel: function (s) {
        var i = 1;
        while (i < arguments.length)
            s = s.replace("{" + (i - 1) + "}", arguments[i++]);
        return s;
    }
};
/**
 *  Funções uteis para Array Javascript.
 *  [Marlos M. Novo]
 **/
Arrays = {
    /**
     *<pre>
     *<b>author:</b> Marlos M. Novo
     *<b>date:  </b> 16/04/2014
     *</pre>
     *
     *  Remove item do Array passado por parametro de acordo com o id, somente
     *  irá funcionar se o nome do atributo de Identificador unico for (id).
     *
     * @param {type} arr
     * @param {type} item
     * @returns {undefined}
     */
    remove: function (arr, item, prop) {
        if (item) {
            for (var i = arr.length; i--;) {
                if (prop) {
                    if (item[prop] === arr[i][prop]) {
                        arr.splice(i, 1);
                    }
                } else {
                    if (item.equals(arr[i])) {
                        arr.splice(i, 1);
                    }
                }
            }
        }
        return arr;
    },
    add: function (arr, item, prop) {
        if (item) {
            if (arr) {
                for (var i = arr.length; i--;) {
                    if (prop) {
                        if (item[prop] === arr[i][prop]) {
                            arr[i] = item;
                            return;
                        }
                    } else {
                        if (item.equals(arr[i])) {
                            arr[i] = item;
                            return;
                        }
                    }
                }
                arr.unshift(item);
            } else {
                arr = [];
                arr[0] = item;
            }
        }
    },
    orderByNumeric: function (arr, prop, asc) {
        if (arr && arr.length > 1) {
            if (prop) {
                var nan = parseInt("a") + 1;
                for (var i = 0; i < arr.length; i++) {
                    var proximo = parseInt(i) + 1;
                    var anterior = parseInt(i) - 1;
                    if (proximo !== nan &&
                        proximo !== arr.length &&
                        arr[i][prop] > arr[proximo][prop]
                        && asc) {
                        var aux = arr[proximo];
                        arr[proximo] = arr[i];
                        arr[i] = aux;
                        i--;
                    } else if (anterior !== nan &&
                        anterior >= 0 &&
                        arr[i][prop] < arr[anterior][prop]
                        && !asc) {
                        var aux = arr[anterior];
                        arr[anterior] = arr[i];
                        arr[i] = aux;
                        i--;
                    }
                }
            }
        }
        return arr;
    }
};
StringUtil = {
    replace: function (string, token, newtoken) {
        while (string.indexOf(token) !== -1) {
            string = string.replace(token, newtoken);
        }
        return string;
    },
    // nao eliminar o metodo abaixo
    // aconteceram erros em lugares onde estava sendo usado antes de ser renomeado
    replaceAll: function (string, token, newtoken) {
        while (string.indexOf(token) !== -1) {
            string = string.replace(token, newtoken);
        }
        return string;
    },
    primeiraMaiuscula: function (strInicial) {
        var strFinal = null;
        if (strInicial) {
            strFinal = strInicial.substring(0, 1).toUpperCase() + strInicial.substring(1);
        }
        return strFinal;
    },
    primeiraMinuscula: function (strInicial) {
        var strFinal = null;
        if (strInicial) {
            strFinal = strInicial.substring(0, 1).toLowerCase() + strInicial.substring(1);
        }
        return strFinal;
    }


};
