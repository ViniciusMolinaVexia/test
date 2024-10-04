//============================== MENU ===============================
/*
 * Diretivas definida para setar Data com hora 12:00.
 * [Leonardo Faix Pordeus]
 * [09/10/2014]
 */
app.directive('diretivaDatepickerData', ['$parse', function ($parse) {
    var directive = {
        restrict: 'A',
        require: ['ngModel'],
        link: link
    };
    return directive;

    function link(scope, element, attr, ctrls) {
        var ngModelController = ctrls[0];

        /**
         * Chamado após selecionar a data no datepicker
         */
        ngModelController.$parsers.push(function (viewValue) {
            // Ajusta hora para 12:00
            if (viewValue) {
                viewValue.setHours(12);
                viewValue.setMinutes(0);
                return viewValue;
            } else {
                return null;
            }
        });


        /**
         * Chamado ao setar o valor no componente.
         */
        ngModelController.$formatters.push(function (modelValue) {
            if (!modelValue) {
                return undefined;
            }
            //Aplica o UTC local.
            var dt = new Date(modelValue);
            // Ajusta hora novamente para 12:00
            dt.setHours(12);
            dt.setMinutes(0);
            if (modelValue.toString().substring(8, 10) != dt.getDate()) {
                dt.setDate(dt.getDate() + 1);
            }
            return dt;
        });
    }
}]);