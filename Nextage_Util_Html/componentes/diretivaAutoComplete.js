app.directive("typeahead", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attr, ngModel) {
            var chaveVazia = '[$]';
            element.bind("blur", function () {
                setTimeout(function () {
                    if (!$(element).closest('div').children('ul').is(":visible")) {
                        if (!angular.isObject(ngModel.$modelValue)
                            || ngModel.$viewValue === chaveVazia) {
                            if ($(element).hasClass('required')) {
                                $(element).addClass('campo-obrigatorio');
                            }
                            ngModel.$setViewValue(null);
                            ngModel.$render();
                            return null;
                        }
                    }
                }, 200);
            });
        }
    };
});
app.directive("typeaheadEmpty", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attr, ngModel) {
            var chaveVazia = '[$]';
            //assim que o ngModel vem udado dispara o evento
            ngModel.$parsers.unshift(function (inputValue) {
                if (element && element[0] && element[0].disabled) {
                    return false;
                }
                /*if (!inputValue) {
                 setTimeout(function () {
                 if (!ngModel.$viewValue && $(element).is(":focus")) {
                 ngModel.$setViewValue(chaveVazia);
                 ngModel.$render();
                 }
                 }, 100);
                 } else {
                 var value = (inputValue ? inputValue : chaveVazia); // replace empty string with secretEmptyKey to bypass typeahead-min-length check
                 ngModel.$viewValue = value; // this $viewValue must match the inputValue pass to typehead directive
                 return value;
                 }
                 manter comentado*/
                if (inputValue !== null) {
                    var value = (inputValue ? inputValue : chaveVazia); // replace empty string with secretEmptyKey to bypass typeahead-min-length check
                    ngModel.$viewValue = value; // this $viewValue must match the inputValue pass to typehead directive
                    return value;
                }
            });
            //Dispara apos o evento acima para fazer o parse em view para setar o '' caso seje vazio
            ngModel.$parsers.push(function (inputValue) {
                if (element && element[0] && element[0].disabled) {
                    return null;
                }
                return inputValue === chaveVazia ? '' : inputValue; // set the secretEmptyKey back to empty string
            });
            scope.focusAuto = function (e) {
                if (element && element[0] && element[0].disabled) {
                    return false;
                }
                if (!ngModel.$viewValue || ngModel.$viewValue === chaveVazia) {
                    ngModel.$setViewValue(chaveVazia);
                }
                if (e && e.target
                    && e.target.parentNode
                    && e.target.parentNode.parentNode
                    && e.target.parentNode.parentNode.children
                    && e.target.parentNode.parentNode.children.length > 0
                    && e.target.parentNode.parentNode.children[0]) {
                    e.target.parentNode.parentNode.children[0].focus();
                }
            };

        }
    };
});
app.filter('typeaheadHighlight', function () {
    function escapeRegexp(querryEntered) {
        var querryEscaped = querryEntered.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        //arruma os caracteres especiais para serem exibidos em view
        querryEscaped = querryEscaped.replace(/a/g, "(a|\u00e1|\u00e0|\u00e2|\u00e3|\u00e4)");
        querryEscaped = querryEscaped.replace(/A/g, "(A|\u00c1|\u00c0|\u00c2|\u00c3|\u00c4)");
        querryEscaped = querryEscaped.replace(/e/g, "(e|\u00e9|\u00e8|\u00ea|\u00ea)");
        querryEscaped = querryEscaped.replace(/E/g, "(e|\u00c9|\u00c8|\u00ca|\u00cb)");
        querryEscaped = querryEscaped.replace(/i/g, "(i|\u00ed|\u00ec|\u00ee|\u00ef)");
        querryEscaped = querryEscaped.replace(/I/g, "(I|\u00cd|\u00cc|\u00ce|\u00cf)");
        querryEscaped = querryEscaped.replace(/o/g, "(o|\u00f3|\u00f2|\u00f4|\u00f5|\u00f6)");
        querryEscaped = querryEscaped.replace(/O/g, "(O|\u00d3|\u00d2|\u00d4|\u00d5|\u00d6)");
        querryEscaped = querryEscaped.replace(/u/g, "(u|\u00fa|\u00f9|\u00fb|\u00fc)");
        querryEscaped = querryEscaped.replace(/U/g, "(U|\u00da|\u00d9|\u00db)");
        querryEscaped = querryEscaped.replace(/c/g, "(c|\u00e7)");
        querryEscaped = querryEscaped.replace(/C/g, "(C|\u00c7)");
        querryEscaped = querryEscaped.replace(/n/g, "(n|\u00f1)");
        querryEscaped = querryEscaped.replace(/N/g, "(N|\u00d1)");
        querryEscaped = querryEscaped.replace(/&/g, "(\u0026)");
        querryEscaped = querryEscaped.replace(/'/g, "(\u0027)");
        //return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/ig, "\\$1");
        return querryEscaped;
    }

    return function (matchItem, query) {
        var aux = "";
        query = (query === "[$]" ? "" : query);
        if (matchItem) {
            //verifica as palavras chave de separação
            if (matchItem.indexOf("<br>") === -1
                && matchItem.indexOf("*:*") === -1
                && matchItem.indexOf("*espaco*") === -1) {
                aux = query ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem;
            } else {
                //valida antes o BR que da um enter em tela
                if (matchItem.indexOf("<br>") > -1) {
                    //separa a string por <br>
                    var arrayMatchItem = matchItem.split("<br>");
                    //percorre a lista
                    for (var i = 0; i < arrayMatchItem.length; i++) {
                        //valida see tiver espaco
                        if (arrayMatchItem[i].indexOf("*espaco*") > -1) {
                            var arrayEspacada = arrayMatchItem[i].split("*espaco*");
                            for (var j = 0; j < arrayEspacada.length; j++) {
                                if (arrayEspacada[j].indexOf("*:*") > -1) {
                                    var anotherMatchItem = arrayEspacada[j].split("*:*");
                                    anotherMatchItem[1] = query ? anotherMatchItem[1].replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : anotherMatchItem[1];
                                    arrayEspacada[j] = anotherMatchItem.join(":");
                                } else {
                                    arrayEspacada[j] = query ? arrayMatchItem[j].replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : arrayMatchItem[j];
                                }
                            }
                            arrayMatchItem[i] = arrayEspacada.join("&nbsp;&nbsp;");
                        } else {
                            //caso nao tenha espaco valida ainda se tem *:*
                            if (arrayMatchItem[i].indexOf("*:*") > -1) {
                                var anotherMatchItem = arrayMatchItem[i].split("*:*");
                                anotherMatchItem[1] = query ? anotherMatchItem[1].replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : anotherMatchItem[1];
                                arrayMatchItem[i] = anotherMatchItem.join(":");
                            } else {
                                arrayMatchItem[i] = query ? arrayMatchItem[i].replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : arrayMatchItem[i];
                            }
                        }
                    }
                    aux = arrayMatchItem.join("<br>");
                    //valida se possui a palavra chave espaco que vai ser substituida para dar espçao em tela entre as labels
                } else if (matchItem.indexOf("*espaco*") > -1) {
                    var arrayEspacada = arrayMatchItem[i].split("*espaco*");
                    for (var j = 0; j < arrayEspacada.length; j++) {
                        if (arrayEspacada[j].indexOf("*:*") > -1) {
                            var anotherMatchItem = arrayEspacada[j].split("*:");
                            anotherMatchItem[1] = query ? anotherMatchItem[1].replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : anotherMatchItem[1];
                            arrayEspacada[j] = anotherMatchItem.join(":");
                        } else {
                            arrayEspacada[j] = query ? arrayMatchItem[j].replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : arrayMatchItem[j];
                        }
                    }
                    aux = arrayEspacada.join("&nbsp;&nbsp;");
                    //valida os dois pontos que separam as labels do valor
                } else if (matchItem.indexOf("*:*") > -1) {
                    var arrayMatchItem = matchItem.split("*:*");
                    arrayMatchItem[1] = query ? arrayMatchItem[1].replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : arrayMatchItem[1];
                    aux = arrayMatchItem.join(":");
                }
            }
        }
        return aux;
    };
});