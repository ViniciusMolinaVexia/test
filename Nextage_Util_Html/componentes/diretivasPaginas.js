/*
 * Nas diretivas onde se utiliza o replace: true,
 * é substituido o elemento da diretiva pelo elemento do templateUrl,
 * assim os atributos contidos na elemento da diretiva são adicionado ao elemento do templateUrl
 *
 * OBS: Comentários que estão dentro da página templateUrl com "replace: true" devem estar dentro do
 * elemento e não antes ou após, caso contrário é exibido um erro.
 *
 */

app.directive('nxModalConfirmacaoExclusao', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxModalConfirmacaoExclusao.html',
        restrict: 'E',
        replace: true,
        link: function (scope, elem, attr) {
            /**
             * @author Luan L domingues
             * @param {$event} e Evento disparado pelo Moda.Hide
             *
             * Captura o evento qu o Modal.hide() dispara. remove os
             * div.modal-backdrop.in pois o mesmos não são removidos pelo
             * Modal.hide() ficando uma tela preta e intocavel.
             */
            $(elem).on('hide.bs.modal', function (e) {
                if (e) {
                    $("div.modal-backdrop.in").not("div.modal-backdrop.fade.in").remove();
                }
            });
        }
    };
});

app.directive('cabecalho', function () {
    return {
        templateUrl: '../geral/view/cabecalho/cabecalho.html',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: false
    };
});

app.directive('cabecalhoSistemas', function () {
    return {
        templateUrl: '../geral/view/cabecalho/cabecalho-sistemas.html',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: false
    };
});

app.directive('nxModalConfirmacaoExclusaoLogica', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxModalConfirmacaoExclusaoLogica.html',
        restrict: 'E',
        replace: true,
        link: function (scope, elem, attr) {

            /**
             * @author Luan L domingues
             * @param {$event} e Evento disparado pelo Moda.Hide
             *
             * Captura o evento qu o Modal.hide() dispara. remove os
             * div.modal-backdrop.in pois o mesmos não são removidos pelo
             * Modal.hide() ficando uma tela preta e intocavel.
             */
            $(elem).on('hide.bs.modal', function (e) {
                if (e) {
                    $("div.modal-backdrop.in").not("div.modal-backdrop.fade.in").remove();
                }
            });
        }
    };
});

app.directive('nxBtnSalvar', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxBtnSalvar.html',
        restrict: 'E',
        replace: true
    };
});

app.directive('nxBtnNovo', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxBtnNovo.html',
        restrict: 'E',
        replace: true,
        scope: false,
        link: function (scope, elem, attr) {
            elem.bind("click", function () {
                Util.limpaValidacaoDoFormulario($(elem[0]).closest("nx-tela-padrao")[0].id);
            });
        }
    };
});

app.directive('nxBtnExcluir', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxBtnExcluir.html',
        restrict: 'E',
        replace: true
    };
});

app.directive('nxBtnLimpar', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxBtnLimpar.html',
        restrict: 'E',
        replace: true
    };
});

app.directive('nxBtnListar', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxBtnListar.html',
        restrict: 'E',
        replace: true
    };
});

app.directive('nxBtnGerarExcel', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxBtnGerarExcel.html',
        restrict: 'E',
        replace: true
    };
});

app.directive('nxBtnDownload', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxBtnDownload.html',
        restrict: 'E',
        replace: true,
        scope: {
            downloadLabel: '@'
        }
    };
});

app.directive('nxBtnFechar', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxBtnFechar.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('nxBtnFiltro', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxBtnFiltro.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('nxBtn2', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxBtn2.html',
        restrict: 'E',
        replace: true,
        scope: true,
        link: function (scope, elem, attr) {
            var icone = attr.icone;
            var label = attr.label;
            scope.cor = attr.cor ? attr.cor : 'default';

            if (icone === undefined || icone === null || icone === "") {
                icone = 'glyphicon glyphicon-ok';
            }
            $(elem).find("i").addClass(icone);

            if (label) {
                $(elem).find("span").text(label);
            }

            //criado apra fazer a label do botão ir para baixo com um array
            var labels = attr.labels;

            if (labels) {
                if (labels.indexOf(";") > -1) {
                    scope.labels = labels.split(";");
                } else {
                    scope.labels = [];
                    scope.labels[0] = labels;
                }
            }
        }
    };
});

app.directive('nxBtn', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxBtn.html',
        restrict: 'E',
        replace: true,
        scope: {
            label: '@',
            icone: '@',
            funcao: '&'
        },
        link: function (scope, elem, attr) {
            /*
             * O "elem" é o elemento A, que está na página nxBtn.
             */
            //Pega os atributos
            var ngShow = attr.ngShow;
            var ngDisabled = attr.ngDisabled;
            var ngIf = attr.ngIf;
            var icone = scope.icone;
            var title = attr.title;
            if (icone === undefined || icone === null || icone === "") {
                icone = 'glyphicon glyphicon-ok';
            }
            //adiciona os atributos
            $(elem[0].children[0]).addClass(icone);
            if (ngShow) {
                $(elem[0]).attr('ng-show', ngShow);
            }
            if (ngDisabled) {
                $(elem[0]).attr('ng-disabled', ngDisabled);
            }
            if (ngIf) {
                $(elem[0]).attr('ng-if', ngIf);
            }
            if (title) {
                $(elem[0]).attr('title', title);
            }

        }
    };
});

app.directive('nxAlert', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxAlert.html',
        restrict: 'E',
        replace: true
    };
});

/*
 *
 * DIRETIVA RESPOSNÁVEL POR SEPARAR OS FORM-GROUPS EM COLUNAS
 *
 * Essa diretiva é para todos os elemento que possuem a CLASSE "form-group"
 */

app.directive('formGroup', function ($timeout) {
    return {
        restrict: 'C',
        scope: true,
        link: function (scope, elem, attr) {

            /*
             * Apenas irá separar as colunas se tiverem como pai o elemento <nx-float-group>
             */
            if ($(elem).closest('.nx-float-group').length) {
                $timeout(function () {

                    var nxFloatGroup = $(elem).closest('.nx-float-group');
                    var cols;
                    if ($(nxFloatGroup).attr('cols')) {
                        cols = parseInt($(nxFloatGroup).attr('cols'));
                    } else {
                        //Se não tiver o atributo 'cols', por padrão é definido como 3 colunas
                        cols = 3;
                    }

                    //Recupera apenas os filhos de primeiro nível com classe '.form-group'
                    var $formGroups = $(nxFloatGroup).children('.form-group');
                    /*
                     * Para descobrir qual classe deva ser usada,
                     * é dividido 12 pelo número de colunas (arredondando qdo o resultado for número quebrado)                  *
                     */
                    var colMd = Math.round(12 / cols);

                    var numCols = parseInt(cols);

                    //Se for TRUE faz o wrap com uma div com classe 'row'
                    var wrap = true;

                    $formGroups.each(function (index) {
                        //É adicionado em cada '.form-group', a classe 'col-md-*' calculada
                        $(this).addClass('col-md-' + colMd);

                        if (index === numCols) {
                            numCols = numCols + cols;
                            wrap = true;
                        }

                        if (wrap) {
                            $formGroups.slice(index, numCols).wrapAll("<div class='row'></div>");

                            wrap = false;
                        }

                    });
                });
            }
        }
    };
});

app.directive('nxFloatGroup', function ($timeout) {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxFloatGroup.html',
        restrict: 'E',
        transclude: true,
        scope: true,
        replace: true,
        /*
         * O CÓDIGO ABAIXO,PARA SEPARAR OS FORM-GROUPS EM COLUNAS,
         * FOI COLOCADO NA DIRETIVA formGroup.
         *
         * O CÓDIGO NÃO FOI EXCLUÍDO POR PRECAUÇÃO, ATÉ TER CERTEZA QUE A DIRETIVA formGroup
         * RESOLVA O PROBLEMA ENCONTRADO QUANDO OS FORMULÁRIOS POSSUEM NG-IF
         *
         */
        link: function (scope, elem, attr) {
            /*  $timeout(function() {
             var cols;
             if (attr.cols) {
             cols = parseInt(attr.cols);
             } else {
             //Se não tiver o atributo 'cols', por padrão é definido como 3 colunas
             cols = 3;
             }

             //Recupera apenas os filhos de primeiro nível com classe '.form-group'
             var $formGroups = $(elem).children('.form-group');
             /*
             * Para descobrir qual classe deva ser usada,
             * é dividido 12 pelo número de colunas (arredondando qdo o resultado for número quebrado)                  *
             */
            /*  var colMd = Math.round(12 / cols);
             var numCols = parseInt(cols);

             //Se for TRUE faz o wrap com uma div com classe 'row'
             var wrap = true;

             $formGroups.each(function(index) {
             //É adicionado em cada '.form-group', a classe 'col-md-*' calculada
             $(this).addClass('col-md-' + colMd);

             if (index === numCols) {
             numCols = numCols + cols;
             wrap = true;
             }

             if (wrap) {
             $formGroups.slice(index, numCols).wrapAll("<div class='row'></div>");

             wrap = false;
             }

             });

             });*/
        }
    };
});

app.directive('nxFiltro', function ($timeout, $rootScope, $compile) {

    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxFiltro.html',
        restrict: 'E',
        transclude: true,
        scope: false,
        link: function (scope, elem, attrs) {

            //adiciona a função no botão Listar
            //caso não se passe o atributo o mesmo sera o listar
            var nxListar = $(elem).find("nx-btn-listar");
            var funcListar = attrs.funcaoBuscar ? attrs.funcaoBuscar : "listar";
            $(nxListar).attr('ng-click', funcListar + "()");
            $compile(nxListar, elem)(scope);

            //adiciona a função no botão Limpar
            //caso não se passe o atributo o mesmo sera o limparFiltro
            var nxLimpar = $(elem).find("nx-btn-limpar");
            var funcLimpar = attrs.funcaoLimpar ? attrs.funcaoLimpar : "limparFiltro";
            $(nxLimpar).attr('ng-click', funcLimpar + "()");
            $compile(nxLimpar, elem)(scope);

            $timeout(function () {
                /*
                 * Recupera todos os filhos do FORM com classe 'form-group'.
                 * Ao utilizar a função 'children()', somente os filhos de primeiro nível serão recuperados,
                 * evitando assim que DIVs internas com essa classe sejam afetadas.
                 * Estrutura:
                 *  <form>
                 *      <div class="form-group">
                 *      </div>
                 *  </form>
                 */
                var $formGroups = $(elem).find('form').children('.form-group');

                //Verifica se possui filhos
                var possuiChildrenFormGroup = $formGroups.length;

                /*
                 * Se não possuir, siginifica que os filhos de primeiro nível do FORM não são 'form-group'.
                 * Logo, os elementos com classe 'form-group' estão dentro dessa estrutura:
                 *  <form>
                 *      <div class="row">
                 *           <div class="col-md-12">
                 *              <div class="form-group">
                 *              </div>
                 *           </div>
                 *      </div>
                 *  </form>
                 *
                 *  Por isso, caso o número de filhos for igual a 0, esses elementos devem ser buscados da forma abaixo:
                 */
                if (possuiChildrenFormGroup === 0) {
                    $formGroups = $(elem).find('form').children('.row').first().children('.col-md-12').children('.form-group');
                }

                /*
                 * Verifica quantos filhos possui e divide por 2 (arredondando pra cima),
                 * definindo assim, o número de elementos que terão por coluna(col-md-6)
                 */
                var numInputs = $formGroups.length;
                var numInputsPorColuna = Math.round(numInputs / 2);

                var row = "<div class='row'></div>";
                var col6_1 = "<div class='col-md-6 filtro-col'></div>";
                var col6_2 = "<div class='col-md-6 filtro-col'></div>";
                var col12 = "<div class='col-md-12 filtro-col'></div>";

                //Adiciona as DIVs 'col-md-6' ou 'col-md-12' como pai, baseado na divisão feita acima
                if (numInputs === 1) {
                    $formGroups.slice(0, numInputsPorColuna).wrapAll(col12);
                } else {
                    $formGroups.slice(0, numInputsPorColuna).wrapAll(col6_1);
                    $formGroups.slice(numInputsPorColuna, numInputs).wrapAll(col6_2);
                }

                //Adiciona a div com class 'row' como pai dos col-md's
                $(elem).find('.filtro-col').wrapAll(row);

                /*
                 * Para saber se o width das colunas precisa ser fixado,
                 * é verificado, quando o state for alterado para 'STATE_FILTRO', tornando o filtro visível,
                 * se algum elemento 'estourou' o width do filtro, caso positivo, é fixado a coluna adicionando a classe 'filtro-col-width',
                 * que fixa o width em 350px;
                 */
                scope.$watch('state', function (newValue, oldValue) {
                    if (newValue === 'STATE_FILTRO') {
                        if ($(elem).find('.popup-filtro')[0].offsetWidth < $(elem).find('.popup-filtro')[0].scrollWidth) {
                            $(elem).find('.filtro-col').addClass('filtro-col-width');
                        } else {
                            var $filtroCol = $(elem).find('.filtro-col');
                            $filtroCol.each(function (index) {
                                if ($(this)[0].offsetWidth < $(this)[0].scrollWidth) {
                                    $(elem).find('.filtro-col').addClass('filtro-col-width');

                                }

                            });
                        }
                    }
                });
            });
        }
    };
});

app.directive('nxTelaPadrao', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxTelaPadrao.html',
        restrict: 'A',
        transclude: true,
        scope: true
    };
});

app.directive('nxLoading', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxLoading.html',
        restrict: 'E'
    };
});

app.directive('nxManut', function ($compile, $timeout) {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxManut.html',
        restrict: 'E',
        transclude: true,
        scope: true,
        link: function (scope, elem, attr) {
            var id = attr.id;
            if (id) {
                $(elem[0]).attr("id", id);
            }
            scope.$watch('state', function (newValue, oldValue) {
                if (newValue === 'STATE_MANUT') {
                    if ($(window).scrollTop() > 0) {
                        Util.irParaOTopo();
                    } else {
                        $timeout(function () {
                            var nxManut = $(elem);
                            var offset = nxManut.offset();
                            $(elem).find('.popup-backdrop').css('top', offset.top + 3);

                        });
                    }
                }
            });
        }
    };
});

app.directive('nxManutInterno', function ($compile) {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxManutInterno.html',
        restrict: 'E',
        transclude: true,
        scope: true,
        replace: true,
        link: function (scope, elem, attr) {
            var id = attr.id;
            if (id) {
                $(elem[0]).attr("id", id);
            }
        }
    };
});

app.directive('nxLista', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxLista.html',
        restrict: 'E',
        transclude: true
    };
});

/**
 * Utilzar o nxPaginacao ao invés do nxListaPaginacao
 * pois ele não permite multiplas listas paginadas em uma mesma view.
 */
app.directive('nxListaPaginacao', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxListaPaginacao.html',
        restrict: 'E',
        transclude: true,
        scope: true,
        link: function (scope, elem, attr) {
            /*
             * O "elem" é o elemento div Principal, que está na página nxListaPaginacao.
             */
            //Pega os atributos
            var paginaAnterior = attr.paginaAnterior;
            var paginaSucessiva = attr.paginaSucessiva;
            var paginaEspecifica = attr.paginaEspecifica;
            var montaPaginacao = attr.montaPaginacao;
            var numPaginas = attr.numPaginas;
            var paginaAtual = attr.paginaAtual;
            //verifica se a pagina é a principal
            var principal = false;
            if (attr.principal === true || attr.principal === "true") {
                principal = true;
            }
            if (principal) {
                $(elem[0]).addClass("row");
            }

            //topo pagina
            scope.topoPagina = function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 500);
                return false;
            };

            //validações dos metodos
            //pagina anterior
            scope.paginaAnterior = scope[paginaAnterior];
            //pagina sucessiva
            scope.paginaSucessiva = scope[paginaSucessiva];
            //pagina especifica
            scope.paginaEspecifica = scope[paginaEspecifica];
            //monta paginacao
            if (montaPaginacao) {
                scope.montaPaginacao = scope[montaPaginacao];
            } else {
                scope.montaPaginacao = function () {
                    var listaPaginas = [];
                    try {
                        //Controla quais paginas irão aparecer na tela
                        var posIni = 0;
                        var posFin = scope.paginas.length;
                        //Joga as paginas em uma lista aux
                        if (posFin <= 5) {
                            posIni = 0;
                            posFin = scope.paginas.length;
                        } else {
                            if (scope.paginaAtiva <= 3) {
                                posIni = 0;
                                posFin = 5;
                            } else if (scope.paginaAtiva > scope.paginas.length - 3) {
                                posIni = scope.paginas.length - 5;
                                posFin = scope.paginas.length;
                            } else {
                                posIni = scope.paginaAtiva - 3;
                                posFin = scope.paginaAtiva + 2;
                            }
                        }
                        //Joga as paginas em uma lista aux
                        for (var i = posIni; i < posFin; i++) {
                            listaPaginas.push(scope.paginas[i]);
                        }
                    } catch (e) {
                    }
                    return listaPaginas;
                };
            }
            //Ultima Pagina
            if (numPaginas) {
                scope.numPaginas = scope[numPaginas];
            }
            //paginaAtual
            if (paginaAtual) {
                scope.paginaAtual = scope[paginaAtual];
            }
        }
    };
});

/**
 * @author Marlon B. Santana
 * @date 27/02/2015
 *
 * Utilizar o nxPaginacao ao invés do nxListaPaginacao
 * pois ele não permite multiplas listas paginadas em uma mesma view.
 *
 * Como utilizar o nxPaginacao?
 *
 * <nx-paginacao
 *      num-paginas="variavel que contem o total de paginas da lista"
 *      pagina-atual="variavel que contem a pagina que está sendo exibida no momento"
 *      listar-pagina="metodo que troca a pagina e realiza a chamada do controller java"
 * >
 *      LISTA
 * </nx-paginacao>
 *
 * Pode ser encontrado um exemplo na tela de entrega de documentos do modulo de subcontratados
 */
app.directive('nxPaginacao', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxPaginacao.html',
        restrict: 'E',
        transclude: true,
        scope: {
            numPaginas: '=',
            paginaAtual: '=',
            listarPagina: '=',
            qtdePaginas: '='
        },
        link: function (scope) {
            //Método responsavel por gerar um arraylist para ser usado no
            //ngRepeat ao criar os botoes para cada pagina
            scope.montaPaginacao = function () {
                var paginacao = [];
                var paginas = 2;

                if (scope.qtdePaginas) {
                    paginas = scope.qtdePaginas;
                }

                //faz os limites a serem exibidos exibidos
                var paginaInicial = scope.paginaAtual - paginas;
                var paginaFinal = scope.paginaAtual + paginas;

                var totalPaginas = ((paginas * 2) + 1);

                if (paginaInicial < 1)
                    paginaInicial = 1;

                if (paginaFinal > scope.numPaginas)
                    paginaFinal = scope.numPaginas;

                for (var i = paginaInicial; i <= paginaFinal; i++) {
                    paginacao.push(i);
                }
                return paginacao;
            };

            //topo pagina
            scope.topoPagina = function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 500);
                return false;
            };
        }
    };
});

app.directive('nxTitulo', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxTitulo.html',
        restrict: 'E',
        scope: {
            titulo: '@'
        }
    };
});

app.directive('nxModal', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxModal.html',
        restrict: 'E',
        scope: true,
        link: function (scope, elem, attr) {
            scope.id = attr.id;
            var mensagem = attr.mensagem;
            scope.isLabel = false;
            if (mensagem.indexOf("label_") > -1
                || mensagem.indexOf("msg_") > -1) {
                scope.isLabel = true;
            }
            scope.mensagem = mensagem;
            var funcao = attr.funcao;
            if (funcao.indexOf("()")) {
                funcao = funcao.split("(")[0];
            }
            scope.funcao = scope[funcao];
            scope.tamanho = attr['tamanho'];
            if (!scope.tamanho) {
                scope.tamanho = 'sm';
            }
            /**
             * @author Luan L domingues
             * @param {$event} e Evento disparado pelo Moda.Hide
             *
             * Captura o evento qu o Modal.hide() dispara. remove os
             * div.modal-backdrop.in pois o mesmos não são removidos pelo
             * Modal.hide() ficando uma tela preta e intocavel.
             */
            $(elem).on('hide.bs.modal', function (e) {
                if (e) {
                    $("div.modal-backdrop.in").not("div.modal-backdrop.fade.in").remove();
                }
            });
        }
    };
});

/**
 *  Diretiva que inclui os botões padrão (Filro, salvar, novo excluir) na tela
 *  desejada.
 *
 *  @param {$compile} $compile Usado para recompilar os botoes do nxBotoesPadrao
 **/
app.directive('nxBotoesPadrao', function ($compile) {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxBotoesPadrao.html',
        restrict: 'E',
        transclude: true,
        link: function (scope, elem, att) {
            //adiciona a função no botão Listar
            //caso não se passe o atributo o mesmo sera o listar
            var nxListar = $(elem).find("nx-btn-listar");
            var funcListar = att.funcaoBuscar ? att.funcaoBuscar : "listar";
            $(nxListar).attr('ng-click', funcListar + "()");
            $compile(nxListar, elem)(scope);

            //adiciona a função no botão Limpar
            //caso não se passe o atributo o mesmo sera o limparFiltro
            var nxLimpar = $(elem).find("nx-btn-limpar");
            var funcLimpar = att.funcaoLimpar ? att.funcaoLimpar : "limparFiltro";
            $(nxLimpar).attr('ng-click', funcLimpar + "()");
            $compile(nxLimpar, elem)(scope);

            //adiciona a função no botão Novo
            //caso não se passe o atributo o mesmo sera o novo
//            var nxNovo = $(elem).find("nx-btn-novo");
//            var funcNovo = att.funcaoNovo ? att.funcaoNovo : "novo";
//            $(nxNovo).attr('ng-click', funcNovo + "()");
//            $compile(nxNovo, elem)(scope);

            //adiciona a função no botão Fechar
            //caso não se passe o atributo o não terá função definida
            var nxFechar = $(elem).find("nx-btn-fechar");
            var funcFechar = att.funcaoFechar;
            if (funcFechar) {
                $(nxFechar).attr('ng-click', funcFechar + "()");
                $compile(nxFechar, elem)(scope);
            }


        }
    };
});

/**
 *<pre>
 *<b>author:</b> Marlos M. Novo
 *<b>date:  </b> 08/12/2014
 *</pre>
 *
 * <p>Diretiva a ser incluida para definir os botões que deverão ser desabilitados
 *    do template da diretiva <code>nxBotoesPadrao</code>.
 *    Os botões a serem desabilitados devem ser passados separados por ';'.
 *
 * Exemplo:
 *   <nx-botoes-padrao btns-padrao-disable="nx-btn-filtro;nx-btn-salvar">
 *   </nx-botoes-padrao>
 *
 *   @see nxBotoesPadrao
 **/
app.directive('btnsPadraoDisable', function () {
    return {
        link: function (scope, element, attributes) {

            //Recupera botões a serem desabilitados.
            var arrayBtnsDisable = attributes.btnsPadraoDisable ? attributes.btnsPadraoDisable.split(";") : {};

            //Itera sobre os botões informado colocando-os como escondidos.
            for (var btn in arrayBtnsDisable) {
                //Procura o botão dentro de element (nxBotoesPadrao).
                if (!!btn && btn !== "indexOfObject") {
                    var btnDisable = $(element).find(arrayBtnsDisable[btn]);
                    if (btnDisable) {
                        btnDisable.remove();
                    }
                }
            }
        }
    };
});

/*
 * Essa DIV está dentro da diretiva nxManut.
 * Dentro dela estão os botões do formulário de manutenção,
 * quando ela é exibida é verificado se é necessário remover um ou mais botões
 */
app.directive('btnsTelaManut', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            /*
             * O atributo btns-padrao-disable onde informa os botões a serem removidos,
             * não está direto na DIV btnsTelaManut, está na diretiva de manutenção da tela,
             * então, é encontrado o pai mais próximo da DIV btnsTelaManut com o atributo btns-padrao-disable
             */
            var elementoManut = $(elem).closest('[btns-padrao-disable]');

            //Verifica se o elemento com esse atributo existe
            if ($(elementoManut).length) {
                //Recupera o valor do atributo, ou seja, os botões que deverão ser removidos seprados por ';'
                var btnsDisable = $(elementoManut).attr('btns-padrao-disable');

                //Recupera cada botão a serem desabilitados.
                var arrayBtnsDisable = btnsDisable ? btnsDisable.split(";") : {};

                //Itera sobre os botões informado colocando-os como escondidos.
                for (var btn in arrayBtnsDisable) {
                    //Procura o botão com o atributo [btn] dentro de element (btnsTelaManut).
                    if (!!btn && btn !== "indexOfObject") {
                        var btnDisable = $(elem).find('[' + arrayBtnsDisable[btn] + ']');
                        if (btnDisable) {
                            btnDisable.remove();
                        }
                    }
                }
            }
        }
    };
});

/*
 * ABAS
 *
 */
app.directive('nxTab', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxTab.html',
        restrict: 'E',
        replace: true,
        transclude: true
    };
});

app.directive('nxTabItem', function ($compile, $timeout) {
    var a;
    var li;

    var tabPane;
    var idTabPane;
    var itemValue;
    var active;
    var btnClose;
    var ngController;
    var tabTemplate;
    var abaInterna;
    var idAbaInterna;
    var showContent = true;
    var tipoAbaAtual = "";
    //var abaAtiva = null;

    var isAbaAtiva = false;
    var abasAtivas = [];
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxTabItem.html',
        restrict: 'E',
        replace: true,
        scope: true,
        link: function (scope, elem, attr) {

            /*
             * O "elem" é a LI que está na página nxTabItem.
             * Como o "replace:true" substitui a  diretiva "nx-tab-item" pelo elemento contido na página nxTabItem.html,
             * ele transfere os atributos da diretiva para o elemento pai do elemento, no caso o LI,
             * porém é necessário que esse atributos estejam no INPUT dentro dessa LI, por isso foi remivido os atributos da DIV
             * e adicionados no INPUT.
             *
             */

            //Recupera a tag A dentro do LI
            a = $(elem).find('a');
            li = $(elem[0]);
            //Pega os atributos
            tabPane = attr.tabPane;
            itemValue = attr.itemValue;
            active = attr.active;
            btnClose = attr.btnClose;
            abaInterna = attr.abaInterna;

            if (tipoAbaAtual === abaInterna) {
                abasAtivas = [];
                tipoAbaAtual = "principal";
            }

            //Guarda a aba que deverá ser exibida os seus atributos (aba ativa)
            if (active === "true") {
                // abaAtiva = li;
                abasAtivas.push(li);
            }
            //Se for uma aba interna, adiciona no "tab-content" da aba, a classe "tab-content-aba-interna"
            if (abaInterna !== undefined) {
                //recupera o id da aba interna
                idAbaInterna = $(elem).closest('ul').attr('id');
                //adiciona a classe
                $('#' + idAbaInterna).closest('.tab-container').find('.tab-content').addClass("tab-content-aba-interna");
            }
            //adiciona os atributos do LI na tag A
            $(a).attr('tab-pane', tabPane.replace(/\#/g, ''));
            $(a).text("{{" + itemValue + "}}");

            /*
             * Apenas funcionou utlizando esse exemplo com $timeout.
             * Após criada todas as abas, cada uma delas passa por esse função
             */

            $timeout(function () {
                $timeout(function () {

                    idTabPane = $(elem).attr('tab-pane');
                    ngController = $(elem).attr('controller');
                    tabTemplate = $(elem).attr('tab-template');
                    btnClose = $(elem).attr('btn-close');

                    //Se o atributo btn-close, o "x" pra fechar a aba, estiver "false", oculta o elemento "i" que é o "x"
                    if (btnClose === "false") {
                        $(elem).find('i').hide();
                    }

                    /*
                     * Se for as abas principais(menu), apenas construirá o conteúdo da aba se o mesmo já não estiver visível e
                     * se tiver alguma aba como ativa, neste caso, para saber disso,
                     * é comparado o atributo "tab-pane" da abaAtiva com o atributo "tab-pane" da aba atual(elem).
                     *
                     * Se for abas internas, o conteúdo de todas as abas sempre serão construídos,
                     * apenas NÃO será construído se o mesmo já estiver visível
                     */

                    var carregaAba = function () {
                        if ((abaInterna !== undefined || isAbaAtiva) && !$('#' + idTabPane).length) {
                            var nxTabPane;
                            var hideActiveTab;
                            var hideFlexTab;
                            if (showContent) {
                                hideActiveTab = "";
                                hideFlexTab = "";
                            } else {
                                if (idTabPane === "pageFlex") {
                                    hideFlexTab = "hideFlexTab";
                                    hideActiveTab = "";
                                } else {
                                    hideActiveTab = "hideTab";
                                    hideFlexTab = "";
                                }
                            }

                            /*
                             * Se for aba interna, o tab-pane terá a classe "nx-tab-pane-interno", caso contrário,
                             * indica que é a aba principal, a do menu, então adiciona a classe "nx-tab-pane-principal"
                             */
                            var classeNxTabPane;
                            if (abaInterna !== undefined) {
                                classeNxTabPane = "nx-tab-pane-interno";
                            } else {
                                classeNxTabPane = "nx-tab-pane-principal";
                            }

                            //verifica se existe o atributo "ng-controller"
                            if (ngController) {
                                //recupera o template que está no atributo "tab-template" e adiciona o "ng-controller"
                                var template = $(tabTemplate);
                                $(template).attr("ng-controller", ngController);

                                //adiciona dentro do "nx-tab-pane" o conteúdo html do template
                                //aqui que adiciona o nome da classe, através do atributo "nx-class"
                                nxTabPane = "<nx-tab-pane nx-class='" + hideFlexTab + " " + hideActiveTab + " " + classeNxTabPane + "' id='" + idTabPane + "' >" + $(template)[0].outerHTML + "</nx-tab-pane>";

                            } else {
                                //Se não tiver o atributo "ng-controller", apenas adiciona o tab-template" passado
                                nxTabPane = "<nx-tab-pane nx-class='" + hideFlexTab + " " + hideActiveTab + " " + classeNxTabPane + "' id='" + idTabPane + "'  >" + tabTemplate + "</nx-tab-pane>";
                            }
                            /*
                             * recupera o elemento pai com a classe '.tab-container' mais próximo de #abasHome",
                             * encontra o seu primeiro elemento com classe ".tab-content" e adiciona o "nx-tab-pane" compilado
                             *
                             * Obs:
                             * Teve que ser utilizado o "first" para pegar o primeiro elemento com classe '.tab-container',
                             * porque se tiver uma ou mais abas internas não será possível identificar em qual adicionar.
                             *
                             */
                            if (abaInterna !== undefined) {
                                $('#' + idAbaInterna).closest('.tab-container').find('.tab-content').first().append($compile(nxTabPane)(scope));
                            } else {
                                $('#abasHome').closest('.tab-container').find('.tab-content').first().append($compile(nxTabPane)(scope));
                            }
                        }

                        /*
                         * Se tiver alguma aba como ativa, o seu contéudo é exibido
                         */
                        if (isAbaAtiva) {
                            //exibe a aba que foi clicada no menu
                            $(elem).show();
                            $(elem).css("display", "inline-block");
                            //adiciona a classe "active"
                            if (showContent) {
                                $(elem).addClass('active');

                                if (!$('#' + idTabPane).is(':visible')) {
                                    $('#' + idTabPane).show();
                                }
                            }
                        }
                    };
                    for (var i = 0; i < abasAtivas.length; i++) {
                        if (i === 0) {
                            showContent = true;
                        } else {
                            showContent = false;
                        }
                        var abaAtiva = abasAtivas[i];
                        if ($(abaAtiva).attr('tab-pane') === $(elem).attr('tab-pane')) {
                            isAbaAtiva = true;
                        } else {
                            isAbaAtiva = false;
                        }
                        carregaAba();
                    }
                }, 0);
            }, 0);

            //compila os elementos "li" e "a"
            return $compile(a, li)(scope);
        }
    };
});

app.directive('nxTabContent', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxTabContent.html',
        restrict: 'E',
        replace: true,
        transclude: true
    };
});

app.directive('nxTabPane', function ($compile) {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxTabPane.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        link: function (scope, elem, attr) {
            $(elem[0]).find('.container-fluid').removeAttr("ng-transclude");

            //Verifica se existe o atributo "nx-class" e adiciona o mesmo no "tab-pane"
            if (attr.nxClass) {
                $(elem[0]).addClass(attr.nxClass);
            }

            return $compile($(elem[0]))(scope);
        }
    };
});

app.directive('nxTableTheadFixedContainer', function ($compile) {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxTableTheadFixedContainer.html',
        restrict: 'E',
        transclude: true,
        scope: true,
        replace: true,
        link: function (scope, elem, attr) {
            // $(elem).closest('.table-responsive').addClass('container-table-header-fixed');
        }
    };
});

app.directive('nxTableTheadFixedBody', function ($compile) {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxTableTheadFixedBody.html',
        restrict: 'E',
        transclude: true,
        scope: true,
        replace: true,
        link: function (scope, elem, attr) {

            $(elem).find('table').addClass(attr.class);
            $(elem).removeClass(attr.class);
        }
    };
});

app.directive('nxTableTheadFixedHeader', function ($compile) {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxTableTheadFixedHeader.html',
        restrict: 'E',
        transclude: true,
        scope: true,
        replace: true,
        link: function (scope, elem, attr) {

            $(elem).find('table').addClass(attr.class);
            $(elem).removeClass(attr.class);
        }
    };
});

/**
 * @author Marlon B. Santana
 * @date 09/07/2015
 *
 * Como utilizar o nxArquivo?
 *
 * <nx-arquivo
 *     nome="nome do arquivo a ser exibido"
 *     nx-click="ação a ser executada quando é clicado sobre o icone do arquivo"
 *     descricao="descrição que é exibida ao passar o mouse sobre o icone do arquivo">
 *        <div>Pode ser inserido qualquer html dentro do nxArquivo.
 *             Esse html será exibido logo abaixo do icone em uma box separada</div>
 * </nx-arquivo>
 *
 * Pode ser encontrado um exemplo na tela de MP na aba documentos do modulo pessoa
 *
 * @param {$compile} $compile Utilizado para recompilar o "elem a" após
 * transferir o "nxClick" para o "ngClick"
 */
app.directive('nxArquivo', function ($compile) {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxArquivo.html',
        restrict: 'E',
        transclude: true,
        link: function (scope, elem, attrs) {
            var fileType = undefined;
            var fileName = undefined;

            if (attrs.nome) {
                //Caso seja passado um label para a diretiva, troca pelo texto
                //correspondente
                if (attrs.nome.search(/label_/) > -1) {
                    fileName = scope.ResourceBundle[attrs.nome];
                }
                //Se não utiliza o valor passado
                else {
                    fileName = attrs.nome;
                }
                //Tenta buscar a extensão do arquivo
                if (fileName.split('.').length > 1) {
                    fileType = fileName.split('.')[fileName.split('.').length - 1];
                }
            }

            if (!attrs.imagem && fileType && fileType.search(/(jpg|png|bmp|gif)/) === 0) {
                scope.imagem = '../Nextage_Util_Html5/images/files/imagem_64x64.png';
            }
            //Caso não tenha sido passado uma imagem como parametro, mas o
            //arquivo possua uma extensão conhecida
            else if (!attrs.imagem && fileType && fileType.search(/(pdf|xls|xlsx|xml|txt)/) === 0) {
                scope.imagem = '../Nextage_Util_Html5/images/files/' + fileType + '_64x64.png';
            }
            //Caso não tenha sido passado uma imagem como parametro e o arquivo
            //não possua uma extensão, Utiliza uma imagem default
            else {
                scope.imagem = '../Nextage_Util_Html5/images/files/blank_64x64.png';
            }

            //Se a extensão do arquivo for encontrada, remove do label
            if (fileType && fileName) {
                scope.label = fileName.replace('.' + fileType, '');
            }
            //Se não usa o nome como label
            else {
                scope.label = fileName;
            }

            //Procura pela descrição, caso não encontre exibe o nome do arquivo
            //no mouse over
            if (attrs.descricao) {
                scope.title = attrs.descricao;
            } else {
                scope.title = scope.label;
            }

            //Se a div do transclude estiver vazia, remove para não ficar
            //ocupando espaço
            if (elem.find('div[ng-transclude]').children().length === 0) {
                elem.find('div[ng-transclude]').remove();
            }

            //caso tenha sido passado uma action para o "nxClick" transfere a
            //action para o "ngClick" do "elem a" e o recompila
            if (attrs.nxClick) {
                var link = elem.find('div.nx-arquivo > a');
                link.attr('ng-click', attrs.nxClick);

                return $compile(link, elem)(scope);
            }
        }
    };
});

app.directive('nxPopUp', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/paginas/nxPopUp.html',
        restrict: 'E',
        transclude: true,
        scope: {
            titulo: '@'
        },
        link: function (scope, elem, attrs) {
            scope.id = attrs.id;
            //scope.titulo = attrs.titulo;
            /**
             * @author Luan L domingues
             * @param {$event} e Evento disparado pelo Moda.Hide
             *
             * Captura o evento qu o Modal.hide() dispara. remove os
             * div.modal-backdrop.in pois o mesmos não são removidos pelo
             * Modal.hide() ficando uma tela preta e intocavel.
             */
            $(elem).on('hide.bs.modal', function (e) {
                if (e) {
                    $("div.modal-backdrop.in").not("div.modal-backdrop.fade.in").remove();
                }
            });
        }
    };
});