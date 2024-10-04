app.directive('closeFiltroOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {

                //Só vai fechar o filtro se a msg não estiver visível
                if (!$('#msg').is(":visible")) {
                    scope.limpaValidacaoDoFormulario();
                    //"clica" no botão com class 'navbar-toggle' para fechar;
                    $(this).closest('.navbar-nx').find(".navbar-toggle").click();

                }

            });
        }
    };
});

app.directive('limparValidacaoFiltroDropdown', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                scope.limpaValidacaoDoFormulario();

            });
        }
    };
});


app.directive('btnFiltroDropdown', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function () {
                scope.limpaValidacaoDoFormulario();

                if (!$(this).closest('.navbar-nx-filtro').find('.navbar-collapse').hasClass('in')) {
                    $(this).closest('.navbar-nx-filtro').removeClass('nx-popup-hide');
                    $(this).closest('.navbar-nx-filtro').addClass('nx-popup-sm');

                } else {

                    $(this).closest('.navbar-nx-filtro').switchClass("nx-popup-sm", "nx-popup-hide", 500);


                }

            });
        }
    };
});