/*
 * 
 * Essa diretiva será chamada sempre que for clicado em qualquer parte da página.
 * Então, ao clicar, ela verifica se o menu está aberto, se estiver, o menu é fechado.
 * 
 * Obs:
 * Apenas fechará o menu, se o local clicado não for o prórpio menu
 * 
 */
app.directive('html', function () {
    return {
        restrict: 'E',
        scope: true,
        link: function (scope, elem, attrs) {
            $(window).on("orientationchange", function () {
                // window.location.reload(); 

            });
            //Quando a tela é redimensionada
            $(window).resize(function () {
                /*
                 * Para elementos que precisam ter a mesma altura da tela, 
                 * é necessário colocar no mesmo o atributo "resize-full"
                 */
                var height = $(window).height() - 5;
                $('[resize-full]').css('height', height);
            });
            elem.bind('click', function (e) {

                /*
                 * Verifica se o local clicado possui um pai com classe '.navbar-nx', indicando que foi clicado dentro menu.
                 * 
                 */
                if (!$(e.target).closest('.navbar-nx').length) {
                    if ($('.navbar-nx').find($('.navbar-collapse')).hasClass("in")) {
                        //fecha o menu
                        $('.navbar-collapse').collapse('hide');
                    }
                }


            });
        }
    };
});
/*
 * Diretiva para adaptar a altura do elemento a altura da página
 */
app.directive('adaptHeight', function ($timeout) {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, elem, attrs) {
            $timeout(function () {
                var windowHeight = $(window).height();
                var offset = $(elem).offset();
                var top = offset.top;
                var height = windowHeight - top;
                $(elem).css('height', height);

            });

        }
    }
});

/*
 * Quando o elemento com atributo 'adapt-height-click' for clicado,
 * a diretiva adapta a altura dos elementos, com atributo "adapt-height", a altura da página,
 *
 */
app.directive('adaptHeightClick', function ($timeout) {
    return {
        restrict: 'A',
        scope: true,
        link: function (scope, elem, attrs) {
            elem.bind('click', function (e) {
                $timeout(function () {
                    var $elements = $(elem).closest('nx-tela-padrao').find('[adapt-height]');
                    $elements.each(function (index, value) {


                        var windowHeight = $(window).height();
                        var offset = $(this).offset();
                        var top = offset.top;
                        var height = windowHeight - top;
                        $(this).css('height', height);

                    });

                });
            });

        }
    }
});


/*
 * Adiciona o tooltip nos elementos
 */
app.directive('tooltip', function ($timeout, $compile) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            /*
             * Se utilizar o atributo 'title' com ResourceBundle não funciona.
             * Foi necessário criar o atributo 'nx-title' com ResourceBundle e setar o atributo 'title' com o valor contido no atributo 'nx-title'
             */
            $(elem).attr('title', attrs.nxTitle);
            $(elem).tooltip();


        }
    };

});

/*
 * Adiciona nos TH das tabelas que possuem ordenação, a imagem com a seta pra cima e pra baixo
 */
app.directive('tableOrder', function ($timeout, $compile) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            /*
             * No caso onde os THs são criados dinamicamente, o atributo table-order deve estar no elemento TH.
             * Quando os THs forem fixos, o table-order deve ser colocado na TABLE.
             */
//            if ($(elem).is("th")) {
//                $(elem).append("<img style='float:right' src='../Nextage_Util_Html5/images/sort_both.png' />");
//            } else {
//                $(elem).find('th').append("<img src='../Nextage_Util_Html5/images/sort_both.png' />");
//            }

        }
    };

});

/*
 * Diretiva responsável por adicionar as imagens de ordenação e fixar o cabeçalho(thead) da tabela
 */

app.directive('tr', function ($timeout, $rootScope) {
    $rootScope.editRow = -1;
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {

            //caso não tenha as tags table ou tbody
            //ou a classe table responsive irá retornar 
            if (!$(element).closest('table')[0]
                || !$(element).closest('.table-responsive')[0]
                || !$(element).closest('table').find('tbody')) {
                return;
            }
            element.bind('click', function (e) {
                $rootScope.editRow = $(element)[0].rowIndex;

            });
            /*
             * Será feito o cáculo para fixar o width de cada TD e TH quando for o último TR do ng-repeat
             * ou quando for adicionado um novo objeto
             * 
             * Se for incluído o atributo not-fix='true' em uma tabela, a mesma não será fixada 
             * nem calculada as suas colunas.
             */
            if ((scope.$last &&
                $(element).closest('nx-paginacao').length &&
                $(element).closest('table').attr('not-fix') === undefined)
                || ($(element).closest('table').attr('not-fix') === undefined && $rootScope.editRow === $(element)[0].rowIndex)) {

                $rootScope.editRow = -1;
                var diferencaMaxWidth = 0;
                var fixarThead = function () {
                    /*
                     * Como existem tabelas onde o cabeçalho é dinamico, ou seja, os TRs do THEAD são adicionados por um ng-repeat,
                     * assim como os TRs do TBODY, apenas é feito o cáculo quando o ng-repeat dos TBODY estiver concluído
                     * 
                     */
                    if ($(element).closest('tbody').length) {
                        $(element).closest('.table-responsive').addClass('table-responsive-redimensionamento');
                        $(element).closest('table').find('tbody').css('visibility', 'hidden');


                        $timeout(function () {
                            //Adiciona a imagem de ordenção em cada TH, caso as mesmas não existam
                            if ($(element).closest('table').attr('nx-table-order') !== undefined) {
                                if (!$(element).closest('table').find("th").not('[no-order]').find('img').length) {
                                    $(element).closest('table').find("th").not('[no-order]').append("<img  src='../Nextage_Util_Html5/images/sort_both.png' />");
                                }
                            }

                            //'reseta' a table e seus th e td para o tamanho original
                            $(element).closest('table').find('th').find('img').removeClass('pull-right');
                            $(element).closest('table').find('th,td').addClass('no-wrap');
                            $(element).closest('table').find('th,td').removeClass('col-md-1 col-md-2 col-md-3 col-md-4 col-md-5 col-md-6 col-md-7 col-md-8 col-md-9 col-md-10 col-md-11 col-md-12');
                            //$(element).closest('table').find('[no-resize]').resizable('destroy');
                            $(element).closest('table').removeAttr('style');
                            $(element).closest('tbody').removeClass('tbody-scroll');
                            $(element).closest('table').find('thead,tbody').removeClass("display-block");
                            $(element).closest('table').find('thead,tbody').removeAttr('style');
                            $(element).closest('table').find('th,td').removeAttr('style');
                            $(element).closest('table').find('tbody').find('.tr-fixo').remove();


                            var trWidth = "<tr class='tr-fixo'>";
                            var widthImagemOrdenacao = 0;
                            var widthImages = 0;
                            // $timeout(function() {
                            //Recupera todos os THs 
                            var $colsName = $(element).closest('table').find('thead tr th');
                            var posicao = 0;
                            $colsName.each(function (index) {
                                //Para cada TH é verificado se o mesmo terá a imagem de ordenação, para isso é verificado se possui o atributo no-order
                                var noOrder = $(this).attr('no-order');

                                if (noOrder !== undefined || $(element).closest('table').attr('nx-table-order') === undefined) {
                                    //Se a coluna não precisar de ordenação, Seta o tamanho da imagem como 0
                                    widthImagemOrdenacao = 0;

                                } else {

                                    widthImagemOrdenacao = 20;
                                }


                                //Recupera o index da coluna, ou seja, a o posição que a célula(TD) está dentro do seu TR
                                var cell = $(this)[0].cellIndex;
                                //Recupera o width
                                var width = $(this)[0].offsetWidth;


                                /*
                                 * Define uma largura máxima que uma célula pode ter.
                                 * Se tiver apenas uma coluna por linha, a mesma deve ocupar a largura inteira da tabela,
                                 * por isso, é feito a verificação abaixo, onde não é setado o maxWidth.
                                 */
                                var maxWidth;
                                if ($colsName.length === 1) {
                                    maxWidth = null;
                                    /*
                                     * Cálcula as bordas, resultando em um valor negativo.
                                     * Com isso, ao somar o width com widthImagemOrdenacao, será descontado do width o valor calculado.
                                     * Se isso não for feito e pegar apenas o width, irá gerar um scroll horizontal, mesmo sendo apenas uma coluna.
                                     */
                                    widthImagemOrdenacao = width - ($(this)[0].offsetWidth + 1);
                                } else {
                                    //Limite máximo da largura de cada coluna
                                    maxWidth = 350;
                                }

                                if (width > maxWidth && maxWidth !== null) {
                                    diferencaMaxWidth = diferencaMaxWidth + (width - maxWidth);
                                    width = maxWidth;

                                }
                                //Soma o tamanho desse TD com o width referente a imagem de ordenação
                                width = width + widthImagemOrdenacao;


                                //Recupera todos os TRs da table
                                var $trs = $(element).closest('table').find("tbody tr");

                                var classIcone = "";
                                if ($(this).hasClass('icone')) {
                                    classIcone = "icone";
                                }

                                //Veirifca se o TD atual possui o atributo colspan
                                if ($(this).attr('colspan') !== undefined) {

                                    var colspan = parseInt($(this).attr('colspan'));
                                    var widthTotal = 0;
                                    posicao = cell;

                                    for (var i = 0; i < colspan; i++) {

                                        //Recupera o width da célula atual
                                        var widthTd = $(element).closest('table').find("tbody td:eq(" + posicao + ")")[0].clientWidth;
                                        if (widthTd > maxWidth && maxWidth !== null) {
                                            widthTd = maxWidth;
                                        }

                                        trWidth += "<td class='td-fixo " + classIcone + "' style='min-width:" + widthTd + "px;'></td>";

                                        //$(element).closest('table').find("tbody td:eq(" + posicao + ")").first().css("min-width", widthTd);
                                        //Para cada TR é setado o min-width na célula com a posição setada na variavel "posicao"
                                        // $trs.each(function(index) {
                                        // $(this).find("td:eq(" + posicao + ")").css("min-width", widthTd);
                                        // });

                                        //É somado o Width dos TDs
                                        widthTotal = widthTotal + widthTd;
                                        posicao = posicao + 1;
                                    }
                                    //Por ser uma célula com atributo 'colspan', o seu width deve ser a soma dos TDs
                                    $(this).css("min-width", widthTotal);
                                } else {
                                    //Se não possuir o atributo 'colspan', apenas seta no TH o min-width definido acima
                                    $(this).css("min-width", width);

                                    trWidth += "<td class='td-fixo " + classIcone + "'  style='min-width:" + width + "px;'></td>";

                                    // $(element).closest('table').find("tbody td:eq(" + cell + ")").first().css("min-width", width);
                                    //Para cada TR é setado o min-width na célula com a posição setada na variavel "posicao"
//                                    $trs.each(function(index) {
//                                        $(this).find("td:eq(" + posicao + ")").css("min-width", width);
//                                    });

                                    posicao = posicao + 1;
                                }
                                //Soma todos o widths das imagens
                                widthImages = widthImages + widthImagemOrdenacao;
                            });

                            //Recupera o width da table
                            trWidth += "</tr>";
                            $(element).closest('table').find('tbody').prepend(trWidth);
                            var tableWidth = $(element).closest('table')[0].clientWidth - diferencaMaxWidth;
                            var tableResponsiveWidth = $(element).closest('.table-responsive')[0].clientWidth;
                            //Calcula o tamanho da borda da table
                            var bordasTable = $(element).closest('table')[0].offsetWidth - $(element).closest('table')[0].clientWidth;

                            //Diminui o tamanho da borda do tamanho da table e seta o width na mesma
                            var tableWidthTotal = tableWidthTotal - bordasTable;

                            if (tableWidth < tableResponsiveWidth) {
                                tableWidth = tableResponsiveWidth - bordasTable - 2;
                                $(element).closest('table').css("width", tableWidth);
                            } else {
                                $(element).closest('table').css("min-width", tableWidth);
                            }

                            $(element).closest('table').find('thead,tbody').css("width", tableWidth);

                            //Coloca todas as imagens a direita
                            $(element).closest('table').find('th').find('img').addClass('pull-right');

                            /*
                             * Adiciona a classe 'tbody-scroll' no TBODY, que é responsável por definir que ao estourar o limite da
                             * altura do tbody, o mesmo irá gerar um scroll
                             */
                            $(element).closest('tbody').addClass('tbody-scroll');

                            /*
                             * A classe 'display-block', como prórprio nome diz, seta o THEAD e o TBODY como display:block;
                             */
                            $(element).closest('table').find('thead,tbody').addClass("display-block");

                            /*
                             * Remove a classe no-wrap, permitindo que os texto possam ser quebrados dentro do TD e TH
                             */
                            $(element).closest('table').find('th,td').removeClass('no-wrap');
                            $(element).closest('table').find('th:last,.td-fixo:last').css("width", "100%");

                            /*
                             * Cálcula a altura o tbody, de modo que os botões de paginação e a tabela fiquem visíveis na tela,
                             * sem gerar scroll.                             * 
                             */
                            if (attrs.notFixHeight === undefined) {
                                //Altura da tela
                                var documentHeight = $(window).height();
                                //Recupera o elemento TBODY
                                var tbody = $(element).closest('table').find('tbody');
                                var offset = tbody.offset();
                                var alturaPaginacao = 105;

                                //A altura do TBODY é setado diminuindo da altura da tela, a distancia do TBODY para topo e a altura da paginação
                                $(element).closest('table').find('tbody').height(documentHeight - offset.top - alturaPaginacao);
                                $(element).closest('table').find('tbody').css('min-height', '300px');
                            }
                            $(element).closest('.table-responsive').removeClass('table-responsive-redimensionamento');
                            //Exibe novamente o TBODY
                            $(element).closest('table').find('tbody').css('visibility', 'visible');
                        });
                        //});

                    }
                };
                /*
                 * Se a tabela estiver dentro de um modal, somente irá chamar a função reponsável por fixar o thead
                 * após o modal estiver visível. 
                 * Caso contrário, apenas chama função.
                 */
                if ($(element).closest('.modal').length) {
                    $(element).closest('.modal').on('shown.bs.modal', function () {
                        fixarThead();
                    });
                } else {
                    fixarThead();
                }

            }
        }
    };
});


/*
 * GRUPO DE DIRETIVAS RESPONSÁVEIS POR FECHAR OU MANTER ABERTO O ALERT
 * INICIO
 */
app.directive('a', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            $timeout(function () {
                /*
                 * O ALERT não será fechado se o elemento tiver os atributos 'ng-click', 'tab-click' ou 'close-menu-on-click'.
                 * Assim o Alert permanecerá aberto se clicar no menu e na troca de abas.
                 * É verificado também se tem o atriuto "ng-click", pois já tem uma diretiva especifíca que fecha o alert em elementos que tem esse atributo, 
                 * ao fazer essa verificação, evita que quando tiver um elemento A com atributo NG-CLICK, as duas diretivas sejam chamadas.
                 */
                if (attrs.ngClick === undefined && attrs.tabClick === undefined && attrs.closeMenuOnClick === undefined) {
                    elem.bind('click', function (e) {
                        //Verificação para não fechar a msg caso seja o botão buscar
                        if (elem.attr('is-btn-listar') !== "true") {
                            var msg = $(elem).closest('nx-tela-padrao').find('#msg');
                            if ($(msg).is(':visible')) {
                                $(msg).slideUp(500);
                            }
                        }
                    });
                }
            });
        }
    };

});
app.directive('button', function ($timeout) {
    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            $timeout(function () {
                /*
                 * O ALERT não será fechado se o elemento tiver os atributos 'ng-click', 'tab-click' ou 'close-menu-on-click'.
                 * Assim o Alert permanecerá aberto se clicar no menu e na troca de abas.
                 * É verificado também se tem o atriuto "ng-click", pois já tem uma diretiva especifíca que fecha o alert em elementos que tem esse atributo, 
                 * ao fazer essa verificação, evita que quando tiver um elemento BUTTON com atributo NG-CLICK, as duas diretivas sejam chamadas.
                 */
                if (attrs.ngClick === undefined && attrs.tabClick === undefined && !$(elem).hasClass('navbar-toggle')) {
                    elem.bind('click', function (e) {
                        var msg = $(elem).closest('nx-tela-padrao').find('#msg');
                        if ($(msg).is(':visible')) {
                            $(msg).slideUp(500);
                        }

                    });
                }
            });
        }
    };

});
app.directive('ngClick', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function (e) {
                var msg = $(elem).closest('nx-tela-padrao').find('#msg');
                if ($(msg).is(':visible')) {
                    $(msg).slideUp(500);
                }

            });
        }
    };

});

app.directive('closeAlert', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function (e) {

                $(elem).closest('#msg').slideUp(500);

            });
        }
    };

});
/*
 * GRUPO DE DIRETIVAS RESPONSÁVEIS POR FECHAR OU MANTER ABERTO O ALERT
 * FIM
 */



/*
 * Diretiva responsável por exibir o loading enquanto a tela flex é carregada e ocultar quando já estiver totalmente carregada
 */
app.directive('flex', function ($rootScope) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs, loading) {
            elem.bind('click', function (e) {

                /*
                 * Quando muda de uma aba para a aba onde contém o FLEX, no IE o FLEX NÃO é carregado novemente, mas no Chorme o FLEX É carregado novamente
                 * Por isso, foi feito a verificação de navegador, de modo que o loading só seja chamado no IE na primeira vez que for carregado, caso contrário,
                 * o Loading não será fechado, pois não é chamado a função no FLEX que iria chamar essa Diretiva novamente e fechar o Loading.
                 */
                var isIE = false;
                if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
                    isIE = true;
                }

                /*
                 * Verifica atráves do conteúdo das abas, quantas abas estão ou foram abertas(e depois fechadas).
                 * 
                 */
                var qtdeDeAbasAbertas = $("#abasHome").closest(".tab-container").children(".tab-content").children(".nx-tab-pane").length;

                /*
                 * No caso se for IE, Somente irá exibir o loading se estiver apenas um conteúdo carregado(visível e não visível).
                 * indicicando que é a primeira execução do sistema
                 */
                if (scope.status === "loading" || qtdeDeAbasAbertas > 1) {
                    $rootScope.status = "ready";
                } else {
                    $rootScope.status = "loading";
                }

                $rootScope.$apply();
            });
        }
    };
});


/*
 * 
 * Quando o botão com o atributo 'open-popup-manut' for clicado, irá alterar o STATE para MANUT
 * 
 */
app.directive('openPopupManut', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                //Aletra o STATE para MANUT
                scope.state = STATE_MANUT;
                //Faz o apply para fazer o diggest (atualizar a view)
                scope.$apply();
                //Abre o popup manutenção
                $('.popup-manutencao').show("fade");
                //Util.irParaOTopo();


            });
        }
    };
});


app.directive('openLoading', function ($rootScope) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                $rootScope.status = 'loading';
                $rootScope.$apply();
            });
        }
    };
});


/*
 *O elemento SPAN (icone calendario) que está dentro da DIV com class '.input-group', na página nxDateField.html,
 *tem como atributo 'open-datepicker', que quando clicado abre o datepicker.
 */
app.directive('openDatepicker', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                if (!$(elem).closest('.dateField').find('.datepicker').attr('disabled')) {
                    $(elem).closest('.dateField').find('.datepicker').datepicker("show");
                    scope.$apply();
                }

            });
        }
    };
});


/*
 * 
 * Quando o botão com o atributo 'open-popup-filtro' for clicado, irá alterar o STATE para FILTRO
 * 
 */
app.directive('openPopupFiltro', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {

                //Abre o popup manutenção
                $('.popup-filtro').show("fade");
                //Aletra o STATE para FILTRO
                scope.state = STATE_FILTRO;
                //Faz o apply para fazer o diggest (atualizar a view)
                scope.$apply();
                Util.irParaOTopo();

            });
        }
    };
});


/*
 * 
 * Quando o botão com o atributo 'open-popup-filtro' for clicado, irá alterar o STATE para FILTRO
 * 
 */
app.directive('closeTab', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function (e) {
                e.preventDefault();

                /*
                 * O elemento clicado é o 'X' que está dentro do 'LI', porém é preciso saber qual o ID do TAB-CONTENT,
                 * pra isso é preciso recuperar o atributo tab-pane da tag A.                 * 
                 */
                var idTabPane = $(elem).closest('li').find('a').attr('tab-pane');

                //Encontra o pai LI do elemento(x) clicado.
                var li = $(elem).closest('li');
                //Oculta a aba
                $(li).hide();
                //Oculta o conteudo da aba(tab-pane)
                if (idTabPane == "pageFlex") {
                    $('#' + idTabPane).css('visibility', 'hidden');
                } else {
                    $('#' + idTabPane).hide();
                }

                /*
                 * Somente vai verificar as abas anteriores/posteiores se a aba fechada estiver ativa.
                 * Caso contrário não há a necessidade de verificação, pois a aba não vai estar com a class 'active' e
                 * seu conteúdo não estará sendo exibido.
                 */
                if ($(li).hasClass('active')) {
                    //Encontra o pai UL do elemento(x) clicado.
                    var ul = $(elem).closest('ul');
                    //Remove a classe 'active' de todos os filhos LI
                    $(ul).children('li').removeClass('active');

                    //Passa por todos os filhos(children) do elemento UL onde estão as abas
                    $(ul).children('li').each(function (index) {
                        //Verifica se o conteúdo do atributo 'tab-pane' é igual ao conteúdo do 'tab-pane' da aba que está snedo fechada
                        if ($(this).attr('tab-pane') === idTabPane) {
                            //Guarda a posição no array da aba fechada;
                            var posicaoNoArray = index;
                            //Indica se vai ser necessário procurar por abas postreiores a fechada
                            var verificarAbasPosteriores = true;

                            /*
                             * Verifica se existe abas visíveis anteriores a fechada.
                             * Se não existir, verifica as posteriores.
                             * A primeira aba anterior/posteior encontrada, será exibida
                             * 
                             */

                            //Verifica abas anteriores
                            for (var i = posicaoNoArray - 1; i >= 0; i--) {
                                //Recupera o filho que está na posição "i"
                                var li = $(ul).children()[i];
                                //verifica se está visível
                                if ($(li).is(':visible')) {
                                    $(li).addClass('active');
                                    //Recupera o valor que está no atributo 'tab-pane' da aba, que é o ID do conteúdo
                                    idTabPane = $(li).find('a').attr('tab-pane');
                                    //exibe o conteúdo através do ID
                                    if (idTabPane === "pageFlex") {
                                        $('#' + idTabPane).css('visibility', 'visible');
                                    } else {
                                        $('#' + idTabPane).show();
                                    }

                                    //indica que não precisa pesquisar por abas posteriores, pois já encontrou um anterior que está visível
                                    verificarAbasPosteriores = false;
                                    break;
                                }
                            }

                            //Verifica abas posteriores
                            if (verificarAbasPosteriores) {
                                for (var i = posicaoNoArray + 1; i < $(ul).children().length; i++) {
                                    //Recupera o filho que está na posição "i"
                                    var li = $(ul).children()[i];
                                    //verifica se está visível
                                    if ($(li).is(':visible')) {
                                        $(li).addClass('active');
                                        //Recupera o valor que está no atributo 'tab-pane' da aba, que é o ID do conteúdo
                                        idTabPane = $(li).find('a').attr('tab-pane');
                                        //exibe o conteúdo através do ID
                                        if (idTabPane === "pageFlex") {
                                            $('#' + idTabPane).css('visibility', 'visible');
                                        } else {
                                            $('#' + idTabPane).show();
                                        }
                                        break;
                                    }
                                }
                            }
                            //Para dar um break em um loop com each deve se usar "return false"
                            return false;
                        }
                    });
                }

            });
        }
    };
});


app.directive('tabClick', function ($rootScope) {

    return {
        restrict: 'A',
        scope: false,
        link: function (scope, elem, attrs) {
            elem.bind('click', function (e) {
                e.preventDefault();
                var idPane = $(this).attr('tab-pane');
                //remove a classe "active" de todas as abas
                $(elem).closest('ul').find('li').removeClass('active');

                var abaInterna = $(elem).closest('ul').find('li').attr('aba-interna');

                //Verifica se é uma aba interna
                if (abaInterna !== undefined) {
                    //Se for aba interna, oculta apenas o conteúdo das abas que tiverem a classe "nx-tab-pane-interno"
                    $(elem).closest('.tab-container').find('.tab-content').first().find('.nx-tab-pane-interno').hide();
                    $rootScope.executedOnRootScope = false;
                } else {
                    //Se NÃO for aba interna, oculta apenas o conteúdo das abas que tiverem a classe "nx-tab-pane-principal"   
                    $(elem).closest('.tab-container').find('.tab-content').first().find('.nx-tab-pane-principal:not(#pageFlex)').hide();
                    $(elem).closest('.tab-container').find('.tab-content').first().find('#pageFlex').css('visibility', 'hidden');

                }
                //Exibe o conteúdo da aba clicada através do seu id
                if (idPane === "pageFlex") {
                    $(elem).closest('.tab-container').find('.tab-content').first().find('#' + idPane).css('visibility', 'visible');
                } else {
                    $(elem).closest('.tab-container').find('.tab-content').first().find('#' + idPane).show();
                }

                $(elem).closest('li').addClass('active');


                /*
                 * Verifica se o menu da aba HOME está visível, indicando que a aba ativa é a HOME.
                 * Se estiver visível oculta o outro menu que é utilizado nas demais abas.
                 */
                if ($('#painel-metro').find('#menu-metro').is(':visible')) {
                    $('.tab-container').find('#menu-metro').first().hide();
                    $('.tab-container').find('#btn-menu-metro').first().hide();
                } else {
                    $('.tab-container').find('#menu-metro').first().show();
                    $('.tab-container').find('#btn-menu-metro').first().show();
                }
            });

//            elem.on("click", function(e) {
//                scope.$apply(function() {
//                   e.preventDefault();
//                    $(e.currentTarget).tab('show');
//                     $(e.currentTarget).closest('li').addClass('active');
//                     $compile($(e.currentTarget).closest('li'))(scope);
//               });
//            });
        }
    };
});

/*
 * 
 * Quando o botão com o atributo 'btn-open-close-filtro-toogle' for clicado, irá fazer o toogle(abrir ou fechar) da DIV com a classe ".panel-filtro-toogle",
 * onde se encontra o FORM do filtro.
 */
app.directive('btnOpenCloseFiltroToogle', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {



                /* 
                 * Após executar o toogle (abrir ou fechar), é chamada a função ao lado do paramatero "fast".
                 * Essa função é resposável por verificar se o toogle foi completamente aberto ou fechado.
                 * Se estiver aberto é alterado o STATE para STATE_FILTRO.
                 * Se estiver fechado é alterado o STATE para STATE_LISTA.
                 * 
                 * Obs:
                 * - Se o state atual, no momento que o botão for clicado, for STATE_FILTRO, significa que a DIV está visível, então a mesma será fechada,
                 * alterando o STATE para LISTA
                 * - Se o state atual, no momento que o botão for clicado, for diferente de STATE_FILTRO, significa que a DIV está oculta, então a mesma será aberta,
                 * alterando o STATE para FILTRO
                 * 
                 */
                $('.panel-filtro-toogle').slideToggle("fast", function () {
                    if (scope.state === STATE_FILTRO) {
                        //Aletra o STATE para LISTA
                        scope.state = STATE_LISTA;
                        //Faz o apply para fazer o diggest (atualizar a view)
                        scope.$apply();

                    } else {
                        //Aletra o STATE para FILTRO
                        scope.state = STATE_FILTRO;
                        //Faz o apply para fazer o diggest (atualizar a view)
                        scope.$apply();
                    }
                });


            });
        }
    };
});


/*
 * 
 * Quando o botão com o atributo 'btn-close' for clicado, irá alterar o STATE para LISTA
 * 
 */
app.directive('btnClose', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                /*
                 * Para os popups que devem ficar abertos quando campos obrigatórios não forem preenchidos,
                 * deve-se utilizar no controller "$scope.manterPopupAberto = true" se retornar maior que "0" 
                 * e "$scope.manterPopupAberto = false" se retornar igual a "0"
                 * 
                 * ex:
                 * if (Util.validaCamposDoFormulario("telaId #formId") === 0) {
                 * 
                 *      $scope.manterPopupAberto = false;
                 * }else
                 *      $scope.manterPopupAberto = true;
                 * }
                 * 
                 * Para os casos em que não é necessário fazer essa validação, não precisa inserir o $scope.manterPopupAberto 
                 */
                if (!scope.manterPopupAberto || $(elem).closest('nx-btn-fechar').length) {

                    /*
                     * Ao fechar, limpa a validação do formulário, retirando as bordas vermelhas.
                     * Isso é feito caso o usuário tenha clicado em salvar com campo obrigatórios em branco e, logo em seguida tenha fechado o formulário
                     */
                    try {
                        scope.limpaValidacaoDoFormulario();
                    } catch (e) {

                    }
                    if ($(elem).closest("[nx-manut-interno]").length) {
                        // Se for um nx-manut-interno, o state alterado será recuperado através do attr ng-show com um split
                        var ngShow = $(elem).closest("[nx-manut-interno]").attr("ng-show").split("===");
                        var state = $.trim(ngShow[0]);
                        scope[state] = STATE_LISTA;
                        //O closest é utilizado para identificar o popup pai mais próximo.                        
                        $(elem).closest("[nx-manut-interno]").hide();
                    } else {
                        //Aletra o STATE para LISTA
                        scope.state = STATE_LISTA;
                    }

                    //Faz o apply para fazer o diggest (atualizar a view)
                    scope.$apply();

                }

            });
        }
    };
});


app.directive('exibeAba', function ($compile, $timeout, $route, $rootScope) {
    var emit;
    return {
        restrict: 'A',
        scope: "true",
        link: function (scope, elem, attrs) {

            //Fica observando quando o $rootScope.executarEmit for alterado pra true,
            //indicando que o controller foi carregado e que já pode executar o emit
            $rootScope.$watch('executarEmit', function (newValue, oldValue) {
                if (newValue === true) {
                    if (emit) {

                        scope.$emit(emit);

                    }
                }
            });

            elem.bind('click', function (e) {
                //recupera o conteúdo do atributo aba
                emit = attrs.emit;

                var aba = attrs.exibeAba;

                //remove todas a classe 'active' de todos os elementos
                $('#abasHome li').removeClass('active');

                //exibe a aba que foi clicada no menu
                $('#abasHome #' + aba).show();
                $('#abasHome #' + aba).css("display", "inline-block");
                //adiciona a classe 'active' somente nessa aba
                $('#abasHome #' + aba).addClass('active');

                /*
                 * oculta o conteúdo de todas as abas referente ao menu(nx-tab-pane-principal)
                 * evitando assim, se caso tiver abas internas(nx-tab-pane-interno) abertas, que as mesmas também sejam fechadas
                 */
                $('#abasHome').closest('.tab-container').find('.tab-content').first().find('.nx-tab-pane-principal').hide();

                //compila a aba
                $compile($('#abasHome #' + aba))(scope);

                //recupera os atributos da aba
                var tabPane = $('#abasHome #' + aba).attr('tab-pane');
                var tabTemplate = $('#abasHome #' + aba).attr('tab-template');
                var ngController = $('#abasHome #' + aba).attr('controller');

                //verifica se o conteúdo da aba já existe, senão cria 
                if ($('#abasHome').closest('.tab-container').find('.tab-content').first().find('#' + tabPane).length) {
                    //Se existe, apenas exibe
                    $('#abasHome').closest('.tab-container').find('.tab-content').first().find('#' + tabPane).show();
                    //Se a aba já está carregada, apenas faz o emit.
                    if (emit) {
                        scope.$emit(emit);

                    }
                } else {
                    var element;

                    //verifica se existe o atributo "ng-controller"
                    if (ngController) {
                        //recupera o template que está no atributo "tab-template" e adiciona o "ng-controller"
                        var template = $(tabTemplate);
                        $(template).attr("ng-controller", ngController);
                        if (emit) {
                            var emitAux = emit;
                        }

                        //adiciona dentro do "nx-tab-pane" o conteúdo html do template
                        element = "<nx-tab-pane nx-class='nx-tab-pane-principal' id='" + tabPane + "'  >" + $(template)[0].outerHTML + "</nx-tab-pane>";

                    } else {
                        //Se não tiver o atributo "ng-controller", apenas adiciona o tab-template" passado
                        element = "<nx-tab-pane id='" + tabPane + "'  >" + tabTemplate + "</nx-tab-pane>";

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
                    scope.$apply();

                }
//$timeout(function() {
//                    $timeout(function() {
//                        $timeout(function() {
//                            $timeout(function() {
//                                if (emit) {
//                                    scope.$emit(emit);
//                                }
//                            });
//                        });
//                    });
//                });


            });

        }
    };
});


/*
 * Limita o campo ao número de caractere passado no atributo "limit-to"
 */
app.directive("nxLimitTo", [function () {
    return {
        restrict: "A",
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {
            var limit = parseInt(attrs.nxLimitTo);

            angular.element(elem).on("keydown", function (event) {
                /*
                 *
                 * "keyCode" é o código da tecla pressionada:
                 * 8 = backspace
                 * 46 = delete
                 * 9 = tab
                 * Se a tecla pressionada for diferente dessas 3, é verificado se o length do texto excede o limite
                 */
                if (event.keyCode !== 8 && event.keyCode !== 46 && event.keyCode !== 9) {

                    var textoSelecionado = "";
                    var selectionStart = event.currentTarget.selectionStart;
                    var selectionEnd = event.currentTarget.selectionEnd;
                    if (selectionStart < selectionEnd) {
                        textoSelecionado = this.value.substr(selectionStart, selectionEnd);
                    }


                    //Verifica o limite
                    if (this.value.length === limit) {

                        if (textoSelecionado.length === 0) {
                            /*
                             * Todos inputs da tela estão organizados em um array.
                             * O que é feito aqui, é recuperar a posição que o atual INPUT está nesse ARRAY
                             * e verificar se existe um INPUT após ele.
                             *
                             * Se existir, é colocado o "foco" neste INPUT subsequente e selecionado o seu texto(caso exista), de modo que,
                             * se ao digitar em um INPUT que já tenha algum texto, o valor digitado não será adicionado ao texto existente,
                             * o que acontecerá é que todo o texto existente será substituído pelo valor digitado.
                             *
                             */

                            //Recupera a sua posição no array de iputs da tela
                            //var index = $('input').index(this);

                            //Recupera todos os button,input e textarea.
                            var fields = $(this).parents('form:eq(0),body').find('button,input,textarea,select');
                            //Recupera a sua posição no array de iputs da tela
                            var index = fields.index(this);
                            //Seta o focus no próximo eleemnto
                            if (index > -1 && (index + 1) < fields.length) {
                                fields.eq(index + 1).focus();
                                fields.eq(index + 1).select();
                            } else {
                                //Se não existir um próximo elemtno, é retornado FALSE, impedindo que seja adicionado outro caracter que exceda o limite
                                return false;
                            }
                            //Verifica se existe um INPUT subsequente
//                                if ($($('input')[index + 1]).length) {
//
//                                    //Coloca o foco nesse INPUT
//                                    $($('input')[index + 1]).focus();
//
//                                    //Seleciona o seu texto caso exista
//                                    $($('input')[index + 1]).select();
//
//
//                                }else {
//                                    //Se não existir um próximo INPUT, é retornado FALSE, impedindo que seja adicionado outro caracter que exceda o limite
//                                    return false;
//                                }
                        }
                    }

                }
            });

        }
    };
}]);


/*
 *
 * Valida o campo hora e minuto do componente "nx-hora", toda vez que tiver um evento 'keydown'(pressionar uma tecla).
 *  
 *
 */
app.directive('nxValidaHoras', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            angular.element(elem).on("keydown keyup", function (event) {

                if (this.value) {
                    var length = this.value.length;
                    var atributos = attrs;
                    var hora;
                    var minuto;
                    var modelHora;
                    var modelMinuto;


                    /*
                     * Apenas irá fazer a validação se o length do campo que está sendo digitado for igual a 2,
                     * indicando que o limite máximo para o campo hora ou minuto foi atingido
                     */
                    if (length === 2) {

                        /*
                         * Identifica qual campo está sendo digitado, se é o de hora ou o de minuto
                         */
                        if (attrs.campoHora !== undefined) {

                            hora = this;
                            modelHora = $(hora).attr("ng-model");
                            //Encontra o campo minuto correspondente ao campo hora
                            minuto = $(this).closest('[nx-hora]').find('[campo-minuto]');
                            modelMinuto = $(minuto).attr("ng-model");

                        } else if (attrs.campoMinuto !== undefined) {

                            minuto = this;
                            modelMinuto = $(minuto).attr("ng-model");
                            //Encontra o campo hora correspondente ao campo minuto
                            hora = $(this).closest('[nx-hora]').find('[campo-hora]');
                            modelHora = $(hora).attr("ng-model");

                        }


                        if (parseInt(minuto.value) < 0) {

                            // Get the model
                            var model = $parse(modelMinuto);

                            // Assigns a value to it
                            model.assign(scope, 0);

                            // Apply it to the scope
                            scope.$apply();

                        } else if (parseInt(minuto.value) > 59) {
                            // Get the model
                            var model = $parse(modelMinuto);

                            // Assigns a value to it
                            model.assign(scope, 59);

                            // Apply it to the scope
                            scope.$apply();
                        }

                        if (parseInt(hora.value) < 0) {
                            // Get the model
                            var model = $parse(modelHora);

                            // Assigns a value to it
                            model.assign(scope, 0);

                            // Apply it to the scope
                            scope.$apply();
                        }
                        else if (parseInt(hora.value) === 24
                            && (minuto.value === 0
                            || minuto.value === null
                            || minuto.value === undefined
                            || minuto.value === "")) {
                            // Get the model
                            var model = $parse(modelMinuto);

                            // Assigns a value to it
                            model.assign(scope, 0);

                            // Apply it to the scope
                            scope.$apply();
                        }
                        else if (parseInt(hora.value) > 23) {
                            // Get the model
                            var model = $parse(modelHora);

                            // Assigns a value to it
                            model.assign(scope, 23);

                            // Apply it to the scope
                            scope.$apply();
                        }

                    }
                }

            });
        }
    };
});

/*
 * Diretiva responsável por chamar uma função no controller toda vez que o conteúdo de um INPUT for apagado
 */

app.directive('onClear', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            //Recupera o nome do "ng-model"
            var model = $(elem).attr("ng-model");
            //Recupera a função
            var functionOnClear = attrs.onClear;

            //Observa se houve alteração no model e se o mesmo está vazio
            scope.$watch(model, function (newValue, oldValue) {
                if (newValue !== oldValue && (newValue === undefined || newValue === "" || newValue === null)) {
                    //Substitui os parenteses da função, caso sejam colocados
                    functionOnClear = functionOnClear.replace("()", "");

                    //Chama a função do controller
                    scope[functionOnClear]();
                }

            });

        }
    };
});


/*
 * 
 * Configura popover
 * 
 */
app.directive('popover', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            $(elem).attr("tabindex", "0");
            $(elem).attr("role", "button");
            $(elem).attr("data-toggle", "popover");
            $(elem).attr("data-trigger", "hover");
            $(elem).popover();
        }
    };
});


app.directive('tableHeaderFixed', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            if (scope.$last) {


                var setWidth = function () {
                    // $(tableThead).removeClass('table-fixed');
                    // $(tableTbody).removeClass('table-fixed');

                    var tableThead = $(elem).closest('.container-table-header-fixed').find('.td-header').find('table');
                    var divScroll = $(elem).closest('.container-table-header-fixed').find('.tbody-scroll');
                    var tableTbody = $(elem).closest('.container-table-header-fixed').find('.td-body').find('table');

                    var ultimoTh = $(tableThead).find('thead tr th').last();
                    var ultimoTd = $(tableTbody).find('tbody tr td').last();

                    if ($(divScroll)[0].scrollHeight > $(divScroll)[0].clientHeight) {


                        if (!$(ultimoTh).attr('width-fixed')) {


                            var width = parseInt($(ultimoTh)[0].style.width.replace('px', '')) + 9;
                            $(ultimoTh).css('width', width + 'px');
                            $(ultimoTh).attr('width-fixed', 'true');
                        }

                    }


                };
                setWidth();

            }

        }
    };
});


app.directive('openTabMenu', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                //recupera o conteúdo do atributo aba
                var aba = attrs.openTabMenu;
                if (aba.length > 0) {
                    if (elem.hasClass('hideObjFlex')) {
                        $('#objFlexId').height(0);
                        $('#titulo-objFlex').hide();
                    }
                    if (elem.hasClass('showObjFlex')) {
                        var height = $(window).height();
                        $('#objFlexId').height(height - 65);
                        $('#titulo-objFlex').show();

                    }


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
                    /*
                     * O menu que está dentro do "#painel-metro" é o da aba HOME.
                     * O menu que que está dentro apenas do ".tab-container" é o menu que irá aparecer nas demais abas,
                     * ao clicar no botão com ícone de seta. Esse menu será ocultado quando estiver na aba HOME.                   *
                     * 
                     */

                    if ($('#painel-metro').find('#menu-metro').is(':visible')) {
                        $('.tab-container').find('#menu-metro').first().hide();
                        $('.tab-container').find('#btn-menu-metro').first().hide();

                    } else {
                        $('.tab-container').find('#menu-metro').first().show();
                        $('.tab-container').find('#btn-menu-metro').first().show();

                    }

                    /*
                     * Garante que seja fechado os dois menus quando os memsos estiverem com position fixed.
                     * Ou seja, quando forem acessados pelo botão com ícone de seta
                     */
                    var menu = $('#painel-container').children('#menu-metro');
                    var btn = $('#painel-container').children('#btn-menu-metro');
                    if ($(menu).css("margin-left") === "0px" && $(menu).css("position") === "fixed") {
                        $(menu).css({"margin-left": '-=260'});
                        $(btn).css({"margin-left": '-=260'});
                        $(btn).find('i').removeClass('glyphicon-chevron-left').addClass('glyphicon-chevron-right');
                    }

                    menu = $("#abasHome").closest('.tab-container').children('#menu-metro').first();
                    btn = $("#abasHome").closest('.tab-container').children('#btn-menu-metro').first();
                    if ($(menu).css("margin-left") === "0px" && $(menu).css("position") === "fixed") {
                        $(menu).css({"margin-left": '-=260'});
                        $(btn).css({"margin-left": '-=260'});
                        $(btn).find('i').removeClass('glyphicon-chevron-left').addClass('glyphicon-chevron-right');
                    }
                }
            });

        }
    };
});


app.directive('configuraAba', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            $(elem).find('a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            });
        }
    };
});


app.directive('dateHtml5', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                if (newValue !== undefined && newValue.indexOf("-") >= 0) {
                    var dataArrayNewValue = newValue.split('-');
                    var dia = dataArrayNewValue[2];
                    var mes = dataArrayNewValue[1];
                    var ano = dataArrayNewValue[0];
                    var dataNewValue = dia + "/" + mes + "/" + ano;
                    ngModelCtrl.$setViewValue(dataNewValue);
                }

            });
        }
    };
});


/*
 * Diretiva para o botão(seta) que abre o menu lateral (menu utilizado no plataforma)
 * Essa diretiva verifica qual dos dois menus está ativo e o abre .
 * 
 *
 * O menu que está dentro do "#painel-metro" é o da aba HOME.
 * O menu que que está dentro apenas do ".tab-container" é o menu que irá aparecer nas demais abas,
 * ao clicar no botão com ícone de seta. Esse menu será ocultado quando estiver na aba HOME.                   *

 */
app.directive('btnMenuMetro', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function (e) {
                var menu;
                if ($('#painel-metro').find('#menu-metro').is(':visible')) {
                    menu = $(elem).closest('#painel-container').children('#menu-metro');
                } else {
                    menu = $(elem).closest('.tab-container').children('#menu-metro').first();

                }

                if ($(menu).css("margin-left") === "0px") {
                    $(menu).animate({"margin-left": '-=260'});
                    $(elem).animate({"margin-left": '-=260'});
                    $(elem).find('i').removeClass('glyphicon-chevron-left').addClass('glyphicon-chevron-right');

                }
                else {
                    $(menu).animate({"margin-left": '+=260'});
                    $(elem).animate({"margin-left": '+=260'});
                    $(elem).find('i').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');
                }
            });
        }
    };
});

