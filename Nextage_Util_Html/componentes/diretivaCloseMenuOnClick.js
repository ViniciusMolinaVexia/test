app.directive('closeMenuOnClick', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {

                if (elem.hasClass('hideObjFlex')) {
                    $('#objFlexId').height(0);
                    $('#titulo-objFlex').hide();
                }
                if (elem.hasClass('showObjFlex')) {
                    var height = $(window).height();
                    $('#objFlexId').height(height - 65);
                    $('#titulo-objFlex').show();

                }


                if ($('.navbar-collapse').is(":visible")) {

                    //se o pai 'li' mais próximo do link(tag 'a') clicado tiver um filho 'ul', significa que é um dropdown, ou seja um submenu.
                    //por isso não deve fechar o menu ao ser clicado.
                    //se não tiver um filho 'ul', significa que é somente o link, então o menu pode ser fechado.
                    if ($(this).closest('li').find('ul').length === 0) {

                        //"clica" no botão com class 'navbar-toggle' para fechar;
                        // $(".navbar-toggle").click();

                        $(this).closest('.navbar-nx').find(".navbar-toggle").click();
                    }
                }

                //recupera o conteúdo do atributo aba
                var aba = elem.attr('aba');

                //remove todas a classe 'active' de todos os elementos
                $('#abasHome li').removeClass('active');

                //exibe a aba que foi clicada no menu
                $('#abasHome #' + aba).show();
                $('#abasHome #' + aba).css("display", "inline-block");
                //adiciona a classe 'active' somente nessa aba
                $('#abasHome #' + aba).addClass('active');

                //recupera os atributos da aba
                var tabPane = $('#abasHome #' + aba).attr('tab-pane');

                /*
                 * oculta o conteúdo de todas as abas referente ao menu(nx-tab-pane-principal)
                 * evitando assim, se caso tiver abas internas(nx-tab-pane-interno) abertas, que as mesmas também sejam fechadas
                 */

                $('#abasHome').closest('.tab-container').find('.tab-content').first().find('.nx-tab-pane-principal:not(#pageFlex)').hide();
                $('#abasHome').closest('.tab-container').find('.tab-content').first().find('#pageFlex').css('visibility', 'hidden');

                //compila a aba
                $compile($('#abasHome #' + aba))(scope);


                var tabTemplate = $('#abasHome #' + aba).attr('tab-template');
                var ngController = $('#abasHome #' + aba).attr('controller');

                //verifica se o conteúdo da aba já existe, senão cria 
                if ($('#abasHome').closest('.tab-container').find('.tab-content').first().find('#' + tabPane).length) {
                    //Se existe, apenas exibe
                    if (tabPane === "pageFlex") {
                        $('#abasHome').closest('.tab-container').find('.tab-content').first().find('#' + tabPane).css('visibility', 'visible');
                    } else {
                        $('#abasHome').closest('.tab-container').find('.tab-content').first().find('#' + tabPane).show();
                    }
                } else {
                    var element;

                    //verifica se existe o atributo "ng-controller"
                    if (ngController) {
                        //recupera o template que está no atributo "tab-template" e adiciona o "ng-controller"
                        var template = $(tabTemplate);
                        $(template).attr("ng-controller", ngController);

                        //adiciona dentro do "nx-tab-pane" o conteúdo html do template
                        element = "<nx-tab-pane nx-class='nx-tab-pane-principal' id='" + tabPane + "' >" + $(template)[0].outerHTML + "</nx-tab-pane>";

                    } else {
                        //Se não tiver o atributo "ng-controller", apenas adiciona o tab-template" passado
                        element = "<nx-tab-pane nx-class='nx-tab-pane-principal' id='" + tabPane + "'  >" + tabTemplate + "</nx-tab-pane>";

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
                    $('#abasHome').closest('.tab-container').find('.tab-content').first().append($compile(element)(scope));

                }

            });
        }
    };
});

