/*
 * Nas diretivas onde se utiliza o replace: true,
 * é substituido o elemento da diretiva pelo elemento do templateUrl,
 * assim os atributos contidos na elemento da diretiva são adicionado ao elemento do templateUrl
 *
 * OBS: Comentários que estão dentro da página templateUrl com "replace: true" devem estar dentro do
 * elemento e não antes ou após, caso contrário é exibido um erro.
 *
 */


app.directive('nxCombo', function ($compile) {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/inputs/nxCombo.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        link: function (scope, elem, attr) {
            var required = attr.required;
            var ngRequired = attr.ngRequired;
            if (typeof required !== typeof undefined && (required !== false && required !== "false")) {
                var nivelRequiredInterno = attr.nivelRequiredInterno;
                if (nivelRequiredInterno) {
                    $(elem).addClass('required-interno' + nivelRequiredInterno);
                } else {
                    $(elem).addClass('required');
                }
            }

            if (ngRequired && ngRequired !== 'false') {
                $(elem).addClass('required');
            }

            if (ngRequired) {
                $(elem[0]).removeAttr('ng-required');
            }

            if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
                //Fica observando quando o attr.NgModel for alterado
                //indicando que o conteudo foi mudado
                //faz sim que o primeiro valor no IE seje selecionado cerretamente
                scope.$watch(attr.ngModel, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (elem) {
                            if (!elem[0].selectedOptions) {
                                elem[0].selectedOptions = newValue;
                            } else {
                                if (elem[0].selectedOptions !== newValue) {
                                    elem[0].selectedOptions = newValue;
                                }
                            }
                        }
                    }
                });
            }
        }
    };
});
app.directive('nxAutoComplete', function ($compile) {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/inputs/nxAutoComplete.html',
        restrict: 'E',
        replace: true,
        scope: true,
        link: function (scope, elem, attr) {
            /*
             * O "elem" é a DIV com classe "input-group", que está na página nxAutoCOmplete.
             * Como o "replace:true" substitui a  diretiva "nx-auto-complete" pelo elemento contido na página nxAutoCOmplete.html,
             * ele transfere os atributos da diretiva para o elemento pai do elemento, no caso a DIV (input-group),
             * porém é necessário que esse atributos estejam no INPUT dentro dessa DIV, por isso foi remivido os atributos da DIV
             * e adicionados no INPUT.
             *
             */

            //Recupera o INPUT dentro da DIV
            var input = $(elem).find('input');
//
            //Pega os atributos
            var ngModel = attr.ngModel;
            var id = attr.id;
            var placeholder = attr.placeholder;
            var typeahead = attr.typeahead;
            var typeaheadOnSelect = attr.typeaheadOnSelect;
            var ngDisabled = attr.ngDisabled;
            var ngRequired = attr.ngRequired;
            //var noRequired = attr.noRequired;
            var required = attr.required;
            var onClear = attr.eventOnClear;
            var empty = attr.empty;
            var nomeDinamico = attr.nomeDinamico;
            if (nomeDinamico) {
                id += nomeDinamico;
            }

            var typeaheadInputFormatter = attr.typeaheadInputFormatter;
            if (typeof required !== typeof undefined && (required !== false && required !== "false")) {
                var nivelRequiredInterno = attr.nivelRequiredInterno;
                if (nivelRequiredInterno) {
                    $(input).addClass('required-interno' + nivelRequiredInterno);
                } else {
                    $(input).addClass('required');
                }

            }
            //adiciona os atributos da DIV no INPUT
            $(input).attr('ng-model', ngModel);
            $(input).attr('id', id);
            if (!navigator.userAgent.match(/msie/i) && !navigator.userAgent.match(/trident/i)) {
                if (placeholder) {
                    $(input).attr('placeholder', placeholder);
                }
            }
            if (empty !== false && empty !== "false") {
                $(input).attr('typeahead-empty', "");
                typeahead = typeahead.replace("$viewValue", "($viewValue === '[$]' ? '': $viewValue)");
            }

            $(input).attr('typeahead', typeahead);
            $(input).attr('on-clear', onClear);
            if (ngDisabled) {
                $(input).attr('ng-disabled', ngDisabled);
            }
            if (ngRequired && ngRequired !== 'false') {
                $(input).addClass('required');
            }
            if (typeaheadOnSelect) {
                $(input).attr('typeahead-on-select', typeaheadOnSelect);
            }
            if (typeaheadInputFormatter) {
                $(input).removeAttr('typeahead-input-formatter');
                $(input).attr('typeahead-input-formatter', typeaheadInputFormatter);
            }
            /*remove os atributos da DIV que foram passados pela diretiva e remove também os atributos criado automaticamente,
             * no momento que foi 'transferido' os atributos.
             * Esses atributos criados automaticamente são referentes ao auto-complete
             */
            $(elem[0]).removeAttr('ng-model');
            $(elem[0]).removeAttr('id');
            $(elem[0]).removeAttr('typeahead');
            $(elem[0]).removeAttr('typeahead-on-select');
            $(elem[0]).removeAttr('placeholder');
            $(elem[0]).removeAttr('aria-autocomplete');
            $(elem[0]).removeAttr('aria-expanded');
            $(elem[0]).removeAttr('aria-owns');
            $(elem[0]).removeAttr('on-clear');
            $(elem[0]).removeClass('ng-pristine ng-valid ng-scope');
            if (ngDisabled) {
                $(elem[0]).removeAttr('ng-disabled');
            }
            if (ngRequired) {
                $(elem[0]).removeAttr('ng-required');
            }
            if (typeaheadInputFormatter) {
                $(elem[0]).removeAttr('typeahead-input-formatter');
            }
            /*
             * Compila novamente a DIV e o INPUT, para as mudanças terem efeito
             * Obs:
             * Deve ter o 'return'
             */
            return $compile(input, elem[0])(scope);
        }
    };
});
app.directive('nxDateField', function ($compile) {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/inputs/nxDateField.html',
        restrict: 'E',
        replace: true,
        scope: true,
        link: function (scope, elem, attr) {
            /*
             * O "elem" é a DIV com classe "input-group", que está na página nxDateField.
             * Como o "replace:true" substitui a  diretiva "nx-date-field" pelo elemento contido na página nxDateField.html,
             * ele transfere os atributos da diretiva para o elemento pai do elemento, no caso a DIV (input-group),
             * porém é necessário que esse atributos estejam no INPUT dentro dessa DIV, por isso foi remivido os atributos da DIV
             * e adicionados no INPUT.
             *
             */

            //Recupera o INPUT dentro da DIV
            var input = $(elem).find('input');
            //Pega os atributos
            var ngModel = attr.ngModel;
            var ngChange = attr.ngChange;
            var id = attr.id;
            var nomeDinamico = attr.nomeDinamico;
            var required = attr.required;
            var ngDisabled = attr.ngDisabled;
            var ngRequired = attr.ngRequired;
            var placeholder = attr.placeholder;
            var change = attr.change;
            var readonly = attr.readonly;
            //adiciona os atributos da DIV no INPUT
            if (nomeDinamico) {
                id = id + nomeDinamico;
            }
            $(input).attr('ng-model', ngModel);
            $(input).attr('ng-change', ngChange);
            $(input).attr('id', id);
            $(input).attr('placeholder', placeholder);
            /*
             * remove os atributos da DIV que foram passados pela diretiva
             */
            $(elem[0]).removeAttr('ng-model');
            $(elem[0]).removeAttr('ng-change');
            $(elem[0]).removeAttr('id');
            $(elem[0]).removeAttr('placeholder');
            $(elem[0]).removeAttr('required');
            $(elem[0]).removeClass('ng-pristine ng-valid ng-scope');
            if (readonly) {
                $(input).attr("readonly", "readonly");
            }

            //verifica se o elemento é obrigatótrio (se tem o attr 'required'), se for, adiciona a classe 'required' no input
            if (typeof required !== typeof undefined && required !== false) {
                var nivelRequiredInterno = attr.nivelRequiredInterno;
                if (nivelRequiredInterno) {
                    $(input).addClass('required-interno' + nivelRequiredInterno);
                } else {
                    $(input).addClass('required');
                }
            }

            if (ngRequired && ngRequired !== 'false') {
                $(input).addClass('required');
            }

            //verifica se o elemento é obrigatótrio (se tem o attr 'required'), se for, adiciona a classe 'required' no input
            if (typeof change !== typeof undefined && change !== false) {
                $(input).attr('ng-change', change);
            }

            //verifica se o elemento será desabilitado, se for, adiciona 'true' no attr 'ng-disabled' do input e remove o attr da DIV
            if (ngDisabled) {
                $(input).attr('ng-disabled', ngDisabled);
                $(elem[0]).removeAttr('ng-disabled');
            }

            if (ngRequired) {
                $(elem[0]).removeAttr('ng-required');
            }

            /*
             * Adciona o 'datepicker' no INPUT através do seu ID
             */
            $("#" + id).datepicker({
                closeText: scope.ResourceBundle['label_fechar'],
                prevText: scope.ResourceBundle['label_anterior'],
                nextText: scope.ResourceBundle['label_proximo'],
                currentText: scope.ResourceBundle['label_hoje'],
                monthNames: [
                    scope.ResourceBundle['label_janeiro'],
                    scope.ResourceBundle['label_fevereiro'],
                    scope.ResourceBundle['label_marco'],
                    scope.ResourceBundle['label_abril'],
                    scope.ResourceBundle['label_maio'],
                    scope.ResourceBundle['label_junho'],
                    scope.ResourceBundle['label_julho'],
                    scope.ResourceBundle['label_agosto'],
                    scope.ResourceBundle['label_setembro'],
                    scope.ResourceBundle['label_outubro'],
                    scope.ResourceBundle['label_novembro'],
                    scope.ResourceBundle['label_dezembro']
                ],
                monthNamesShort: [
                    scope.ResourceBundle['label_jan'],
                    scope.ResourceBundle['label_fev'],
                    scope.ResourceBundle['label_mar'],
                    scope.ResourceBundle['label_abr'],
                    scope.ResourceBundle['label_mai'],
                    scope.ResourceBundle['label_juno'],
                    scope.ResourceBundle['label_julo'],
                    scope.ResourceBundle['label_ago'],
                    scope.ResourceBundle['label_set'],
                    scope.ResourceBundle['label_out'],
                    scope.ResourceBundle['label_nov'],
                    scope.ResourceBundle['label_dez']
                ],
                dayNames: [
                    scope.ResourceBundle['label_domingo'],
                    scope.ResourceBundle['label_segunda_feira'],
                    scope.ResourceBundle['label_terca_feira'],
                    scope.ResourceBundle['label_quarta_feira'],
                    scope.ResourceBundle['label_quinta_feira'],
                    scope.ResourceBundle['label_sexta_feira'],
                    scope.ResourceBundle['label_sabado']
                ],
                dayNamesShort: [
                    scope.ResourceBundle['label_domingo'],
                    scope.ResourceBundle['label_segunda_feira'],
                    scope.ResourceBundle['label_terca_feira'],
                    scope.ResourceBundle['label_quarta_feira'],
                    scope.ResourceBundle['label_quinta_feira'],
                    scope.ResourceBundle['label_sexta_feira'],
                    scope.ResourceBundle['label_sabado']
                ],
                dayNamesMin: [
                    scope.ResourceBundle['label_dom'],
                    scope.ResourceBundle['label_seg'],
                    scope.ResourceBundle['label_ter'],
                    scope.ResourceBundle['label_qua'],
                    scope.ResourceBundle['label_qui'],
                    scope.ResourceBundle['label_sex'],
                    scope.ResourceBundle['label_sab']
                ],
                weekHeader: scope.ResourceBundle['label_cabecalho_semana'],
                dateFormat: scope.ResourceBundle['format_date_datepicker'],
                firstDay: 0,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: ''
            });
            $("#" + id).mask('00/00/0000');
            /*
             * Compila novamente a DIV e o INPUT, para as mudanças terem efeito
             * Obs:
             * Deve ter o 'return'
             */
            return $compile(input, elem[0])(scope);
        }
    };
});
/*
 * Componente para horas
 */

app.directive('nxHora', function ($compile) {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/inputs/nxHora.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        link: function (scope, elem, attr) {

            var nxModelHora = attr.nxModelHora;
            var nxModelMinuto = attr.nxModelMinuto;
            var strRequired = "";
            var idComponenteHora = "";
            var idComponenteMinuto = "";
            //Substitui aspas simples por aspas duplas, para não haver problemas quando concatenar
            var nxDisable = attr.nxDisable.replace(/\'/g, '\"');
            var nxBlur = attr.nxBlur;
            var validaHoras = "";
            var limitTo = "";
            if (attr.validaHoras === undefined || attr.validaHoras === "true" || attr.validaHoras === "") {
                validaHoras = "nx-valida-horas";
            }

            if (attr.limitTo !== undefined && attr.limitTo !== "") {
                if (attr.limitTo !== 2) {
                    validaHoras = "";
                }
                limitTo = "nx-limit-to = '" + attr.limitTo + "' ";
            } else {
                limitTo = "nx-limit-to = '2' ";
            }

            if (typeof attr.required !== typeof undefined && (attr.required !== false && attr.required !== "false")) {
                var nivelRequiredInterno = attr.nivelRequiredInterno;
                if (nivelRequiredInterno) {
                    strRequired = 'required-interno' + nivelRequiredInterno;
                } else {
                    strRequired = 'required';
                }
            }

            if (attr.id !== undefined && attr.id.length > 0) {
                idComponenteHora = "id=\"" + attr.id + "Hora\" ";
                idComponenteMinuto = "id=\"" + attr.id + "Minuto\" ";
            }

            var inputHora = "<input " + idComponenteHora + validaHoras + " campo-hora type='text' " + limitTo + " class='campo-horas-2-digitos " + strRequired + "' somente-numero ng-model='" + nxModelHora + "' ng-disabled='" + nxDisable + "' ng-blur='" + nxBlur + "' />";
            var inputMinuto = "<input " + idComponenteMinuto + validaHoras + " campo-minuto type='text' " + limitTo + " class='campo-horas-2-digitos " + strRequired + "' somente-numero ng-model='" + nxModelMinuto + "' ng-disabled='" + nxDisable + "' ng-blur='" + nxBlur + "' />";
            //Adiciona no componente nxHoras os dois INPUTS compilados
            $(elem).append($compile($(inputHora))(scope));
            $(elem).append(" : ");
            $(elem).append($compile($(inputMinuto))(scope));
            return $compile($(elem))(scope);
        }
    };
});
/*
 * Componente para horas
 */

app.directive('nxNumero', function ($parse, $timeout, $compile) {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/inputs/nxNumero.html',
        restrict: 'E',
        require: "ngModel",
        link: function (scope, elem, attr, ngModel) {

            //Recupera o INPUT dentro da DIV
            var input = $(elem).find('input');
            //Pega os atributos
            var model = attr.ngModel;
            var disabled = attr.disabled;
            var ngBlur = attr.ngBlur;
            var ngChange = attr.ngChange;
            var nomeDinamico = attr.nomeDinamico;
            var id = attr.id;
            //O if para verificar o nome dinamico deve estar sempre abaixo do Id do input
            //[Marlos]
            if (nomeDinamico) {
                id += nomeDinamico;
            }

            var required = attr.required;
            var ngDisabled = attr.ngDisabled;
            var somenteNumero = attr.somenteNumero;
            var mDec = attr.mDec;

            //adiciona os atributos da DIV no INPUT
            $(input).attr('ng-model', model);
            $(input).attr('id', id);
            $(input).attr('disabled', disabled);
            $(elem).removeAttr('id');
            $(input).attr('ng-model', model);
            if (ngBlur !== undefined) {
                $(input).attr('ng-blur', ngBlur);
            }
            if (ngChange !== undefined) {
                $(input).attr('ng-change', ngChange);
            }

            //verifica se o elemento é obrigatótrio (se tem o attr 'required'), se for, adiciona a classe 'required' no input
            if (typeof required !== typeof undefined && (required !== false && required !== "false")) {
                var nivelRequiredInterno = attr.nivelRequiredInterno;
                if (nivelRequiredInterno) {
                    $(input).addClass('required-interno' + nivelRequiredInterno);
                    $(elem).removeClass('required-interno' + nivelRequiredInterno);
                } else {
                    $(input).addClass('required');
                    $(elem).removeClass('required');
                }
            }

            //valida o atributo ngDisabled
            if (ngDisabled) {
                $(input).attr('ng-disabled', ngDisabled);
            }

            //Se existir esse atributo, adiciona o atriubuto "somente-numero" no input
            if (somenteNumero !== undefined) {
                $(input).attr('somente-numero', "");
                var maxChar = attr.maxChar;
                if (maxChar !== undefined) {
                    $(input).attr('max-char', maxChar);
                }
                var preffix = attr.preffix;
                if (preffix) {
                    $(elem).find("span").text(preffix);
                } else {
                    $(elem).find("div").removeClass('input-group');
                    $(elem).find("span").remove();
                }
                $compile(input, elem[0])(scope);
            } else {
                /*
                 * Para moeda e números com casas decimais é utilizado a biblioteca do JQuery "autoNumeric".
                 * Portanto, deve-se utilizar os atributos correspondentes.
                 *
                 * scope.ResourceBundle['format_thousandsSeparator'] = data-a-sep
                 * scope.ResourceBundle['format_decimalSeparator'] = data-a-dec
                 * min (passando um valor mínimo) = data-v-min
                 *
                 */
                var min = attr.min;
                if (min) {
                    $(input).attr('data-v-min', min);
                } else {
                    var allowNegative = attr.allowNegative;
                    if (!allowNegative || (allowNegative === "S" || allowNegative === "true" || allowNegative === true)) {
                        $(input).attr('data-v-min', "-999999999999999.99");
                    }
                }

                var thousandsSeparator = scope.ResourceBundle['format_thousandsSeparator'];
                if (thousandsSeparator) {
                    $(input).attr('data-a-sep', thousandsSeparator);
                } else {
                    $(input).attr('data-a-sep', ".");
                }

                var decimalSeparator = scope.ResourceBundle['format_decimalSeparator'];
                if (decimalSeparator) {
                    $(input).attr('data-a-dec', decimalSeparator);
                } else {
                    $(input).attr('data-a-dec', ",");
                }

                //Se não tiver o atributo preffix, remove o span, onde ficaria o prefixo (R$)
                var preffix = attr.preffix;
                if (preffix) {
                    $(elem).find("span").text(preffix);
                } else {
                    $(elem).find("div").removeClass('input-group');
                    $(elem).find("span").remove();
                }

                if (mDec) {
                    $(input).attr('data-m-dec', mDec);
                }

                //Adiciona o atributo "formata-numero-on-blur" que é responsável por observar qualquer mudanaça que ocorra no MODEL.
                $(input).attr("formata-numero", "");
                $compile(input, elem[0])(scope);
                //Adiciona a função do JQeury responsável pela máscara
                $(input).autoNumeric('init');
            }

            if (attr.allowNegative && (attr.allowNegative === "N" || attr.allowNegative === "false" || attr.allowNegative === false)) {
                scope.$watch(attr.ngModel, function (newValue, oldValue) {
                    var splitArray = String(newValue).split("");
                    if (splitArray[0] === '-') {
                        newValue = newValue.replace("-", "");
                        ngModel.$setViewValue(newValue);
                        ngModel.$render();
                    }
                });
            }
        }
    };
});
/*
 * Essa diretiva fica "observando" se há alguma mudança NG-MODEL
 *
 * De modo que, quando haja, o separador decimal do ng-model é formatado apenas com ".", para asim poder ser salvo no banco (double).
 * E o valor da VIEW é mantido conforme digitado e formatado pela biblioteca autoNumeric do JQuery,
 *
 * Caso o ng-model for alterado no controller, o valor do ng-model permanecerá igual mas o valor da VIEW é formatado seguindo o padrão de separação,
 * no caso do Brasil, o "." será o separador de milhar e a "," o separador decimal
 *
 *
 *
 */
app.directive('formataNumero', function ($parse, $timeout, $compile) {
    return {
        restrict: 'A',
        require: "ngModel",
        link: function (scope, elem, attr, ngModel) {

            $timeout(function () {
                $timeout(function () {
                    //Recupera o nome do "ng-model"
                    var model = $(elem).attr("ng-model");
                    var thousandsSeparator = scope.ResourceBundle['format_thousandsSeparator'];
                    if (!thousandsSeparator) {
                        thousandsSeparator = ".";
                    }

                    var decimalSeparator = scope.ResourceBundle['format_decimalSeparator'];
                    if (!decimalSeparator) {
                        decimalSeparator = ",";
                    }

                    // A função $watch é chamada toda vez que o valor do ng-model for alterado
                    scope.$watch(model, function (val) {
                        if (val !== undefined && val !== null) {
                            //Recupera o novo valor
                            var currentValue = val.toString();
                            var valorModel = "";
                            /*
                             * Esse IF é responsável por verificar se o valor do ng-model está no formato adequado para ser salvo no banco,
                             * ou seja, sem separador de milhar e com o "." como separador decimal (double)
                             * Se tiver "," siginifica que não está no formato correto
                             */
                            if (currentValue.indexOf(decimalSeparator) >= 0) {

                                if (currentValue.indexOf(thousandsSeparator) >= 0) {
                                    valorModel = StringUtil.replaceAll(currentValue, thousandsSeparator, "");
                                    valorModel = StringUtil.replace(valorModel, decimalSeparator, thousandsSeparator);
                                } else {
                                    valorModel = currentValue.replace(decimalSeparator, thousandsSeparator);
                                }

                                //Atualiza o ng-model
                                ngModel.$setViewValue(valorModel);
                                ngModel.$render();
                                //Mantem o valor da VIEW como digitado
                                $(elem)[0].value = currentValue;
                            }


                            /*
                             * Esse IF é responsável por verificar se o valor da VIEW
                             * está com o "." como separador de milhar e com a "," como separador decimal
                             * Se NÃO tiver "," siginifica que não está no formato correto
                             */
                            if ($(elem)[0].value.indexOf(decimalSeparator) < 0) {

                                if ($(elem)[0].value !== undefined && $(elem)[0].value !== "") {

                                    //Faz o split do valor
                                    var value = $(elem)[0].value.split(thousandsSeparator);
                                    //Pega o valor da primeira posição
                                    var valorInteiro = value[0];
                                    var mask = "";
                                    var substringAtual = "";
                                    // Se a quantidade de digitos for maior que 3, significa que será necessário adicionar o "." para separar
                                    if (valorInteiro.length > 3) {

                                        /*
                                         * Faz um FOR de trás pra frente, verificando número por número
                                         */
                                        for (var i = valorInteiro.length - 1; i >= 0; i--) {

                                            /*
                                             * A partir do número atual, verifica se existe um terceiro valor anterior a ele
                                             * Ex: 1234567
                                             * no primeiro loop estará no número 7, então, o terceiro valor será o 5.
                                             * portanto, a primeira separação ficará "567"
                                             *
                                             */
                                            if (valorInteiro[i - 2] >= 0) {
                                                /*
                                                 * Concatena os valores
                                                 *
                                                 * No caso do exemplo acima, com 1234567,
                                                 * O substring pegará o valor que está na posição "i-2" que será o número 5 até "i+1" que irá até o 7                                        *
                                                 *
                                                 */
                                                if (mask === "") {
                                                    mask = valorInteiro.substring(i - 2, i + 1);
                                                } else {
                                                    mask = valorInteiro.substring(i - 2, i + 1) + thousandsSeparator + mask;
                                                }

                                                /*
                                                 * Aqui será recuperado todo valor que, de acordo com o exemplo, corresponde de 5 até 7
                                                 *
                                                 * No próximo loop será do 3 até 7
                                                 *
                                                 */
                                                substringAtual = valorInteiro.substring(i - 2, valorInteiro.length);
                                                /*
                                                 * A variavel valorInteiro contem o nosso valor inicial 1234567.
                                                 * e a variavel substringAtual contem o valor 567.
                                                 *
                                                 * Ao fazer o replace do valor 567 por vazio em 1234567,
                                                 * poderemos saber se será necessário mais uma separação por "." se caso o tamanho da string for maior que 3
                                                 *
                                                 */

                                                if (valorInteiro.replace(substringAtual, "").length >= 3) {

                                                    /*
                                                     * Aqui é alterado o valor de "i", de modo que no loop, ele pule os 3 valores concatenados,
                                                     * seguindo o exemplo 1234567, que está na posição 6 do array que corresponde ao número 7,
                                                     * o nosso valor concatenado foi 567, a alteração do "i" será para posição 4 do array que corresponde ao número 5,
                                                     * mas como no FOR será feio "i--", a nova posição do array será 3 que corresponderá ao valor 4.
                                                     * Fazendo que no próximo loop os 3 próximos valores sejam 234, que ao ser concatenado com o já existente,
                                                     * ficará 234.567 e o "i" começará na posição 0 que será o valor 1
                                                     */

                                                    i = i - 2;
                                                } else {
                                                    /*
                                                     * Seguindo o exemplo 1234567, cairá aqui quando já estiver sido concatenado 234.567, restando apenas o valor 1.
                                                     * Portanto o "i" estará na posição 1 que será o valor 2.
                                                     * por isso é subistituido a substring atual, que neste momento será 234567 por vazio em 1234567,
                                                     * restando apenas o valor 1.
                                                     * O valor do seu length, que resultará no tamanho 1, será setado no "i"
                                                     * com isso, ao fazer o "i--" no FOR será recuperado o valor na posição 0 que será o 1
                                                     *
                                                     */
                                                    i = valorInteiro.replace(substringAtual, "").length;
                                                }

                                            } else {
                                                /*
                                                 * Seguindo o exemplo 1234567, cairá nesse ELSE, quando apenas restar o valor 1,
                                                 * concatenando assim, o 1 com o restante da mascara, resultando em 1.234.567
                                                 *
                                                 */

                                                if (mask === "") {
                                                    mask = valorInteiro.substring(i - 2, i + 1);
                                                } else {

                                                    /*
                                                     * Este IF é usado para verificar se o resultado do substring é realmente um número.
                                                     * pois pode ser undefined ou "-" se estiver usando valores negativos.
                                                     * neste caso evita que o valor com máscara fique com um "." no início.
                                                     * Ex:
                                                     * ".123.456" ou "-.123.456"
                                                     *
                                                     */
                                                    if ($.isNumeric(valorInteiro.substring(i - 2, i + 1))) {
                                                        mask = valorInteiro.substring(i - 2, i + 1) + thousandsSeparator + mask;
                                                    } else {
                                                        mask = valorInteiro.substring(i - 2, i + 1) + mask;
                                                    }
                                                }
                                                break;
                                            }
                                        }
                                    } else {
                                        /*
                                         * Cairá nesse ELSE quando o length for menor ou igual a 3.
                                         * Indicando que o número apenas precise do separdor decimal.
                                         * Ex: 1,23 ; 12,34 ; 123,45
                                         *
                                         */
                                        mask = value[0];
                                    }
                                    //Seta na VIEW o valor com máscara 1.234.567 concatenado com o seu valor decimal

                                    if (value[1] !== undefined) {
                                        $(elem)[0].value = mask + decimalSeparator + value[1];
                                    } else {
                                        $(elem)[0].value = mask + decimalSeparator + "00";
                                    }
                                }
                            }
                        }
                    });
                }, 0);
            }, 0);
        }
    };
});
app.directive('nxTelefone', function ($compile) {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/inputs/nxTelefone.html',
        restrict: 'E',
        replace: true,
        link: function (scope, elem, attr) {
            var input = $(elem).find('input');
            var textArea = $(elem).find('textarea');
            var ngModel = attr.ngModel;
            var ngDisabled = attr.ngDisabled;
            var required = attr.required;
            var id = attr.id;
            var nomeDinamico = attr.nomeDinamico;
            //caso for um campo dinamico sera adicionado o noe dinamico pois sem ele apresenta erro
            if (nomeDinamico) {
                id = id + nomeDinamico;
            }
            if (ngModel !== undefined) {
                $(input).attr('ng-model', ngModel);
                $(textArea).attr('ng-model', ngModel);
            }
            if (ngDisabled !== undefined) {
                $(input).attr('ng-disabled', ngDisabled);
                $(textArea).attr('ng-disabled', ngDisabled);
            }
            if (typeof required !== typeof undefined && (required !== false && required !== "false")) {
                var nivelRequiredInterno = attr.nivelRequiredInterno;
                if (nivelRequiredInterno) {
                    $(input).addClass('required-interno' + nivelRequiredInterno);
                    $(textArea).addClass('required-interno' + nivelRequiredInterno);
                } else {
                    $(input).addClass('required');
                    $(textArea).addClass('required');
                }

            }
            $(input).attr('id', id);
            $(textArea).attr('id', id);
            $(elem[0]).removeAttr('ng-model');
            $(elem[0]).removeAttr('id');
            $(elem[0]).removeAttr('placeholder');
            $(elem[0]).removeAttr('required');
            $(elem[0]).removeClass('ng-pristine ng-valid ng-scope');
            var obj = null;
            var nomeModel = ngModel;
            if (nomeModel.indexOf("[")) {
                nomeModel = nomeModel.split("[")[0];
                if (attr.entidade) {
                    nomeModel = nomeModel + "." + attr.entidade;
                }
            }
            if (nomeModel.indexOf(".")) {
                nomeModel = nomeModel.split(".");
                if (nomeModel && nomeModel.length > 1) {
                    obj = scope[nomeModel[0]];
                    for (var i = 1; i < nomeModel.length; i++) {
                        if (obj[nomeModel[i]] !== undefined) {
                            obj = obj[nomeModel[i]];
                        } else {
                            obj = null;
                            break;
                        }
                    }
                }
            } else {
                obj = scope[nomeModel];
            }
            if (obj && obj.length > 12) {
                $(elem)[0].removeChild($(elem)[0].childNodes[1]);
                return $compile(textArea, elem[0])(scope);
            } else {
                obj = "";
                $(elem)[0].removeChild($(elem)[0].childNodes[3]);
                $(input).mask("(99)9999-99999");
                return $compile(input, elem[0])(scope);
            }
        }
    };
});
app.directive('nxEmail', function () {
    var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    return {
        require: 'ngModel',
        restrict: '',
        link: function (scope, elm) {
            elm.on("keyup", function () {
                var isMatchRegex = EMAIL_REGEXP.test(elm.val());
                if (isMatchRegex && elm.hasClass('campo-obrigatorio') || elm.val() === '') {
                    elm.removeClass('campo-obrigatorio');
                } else if (isMatchRegex === false && !elm.hasClass('campo-obrigatorio')) {
                    elm.addClass('campo-obrigatorio');
                }
            });
        }
    };
});