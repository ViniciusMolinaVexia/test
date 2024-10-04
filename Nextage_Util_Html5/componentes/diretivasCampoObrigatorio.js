app.directive("obrigatorio", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attr, ngModel) {
            element.bind("blur", function () {
                if (!$(element).closest('div').children('ul').is(":visible")) {
                    if (ngModel.$viewValue === "") {
                        if ($(element).hasClass('required')) {
                            $(element).addClass('campo-obrigatorio');
                        }
                        ngModel.$setViewValue('');
                        ngModel.$render();
                        return '';
                    } else {
                        if ($(element).hasClass('campo-obrigatorio')) {
                            $(element).removeClass('campo-obrigatorio');
                        }
                    }
                }
            });
        }
    };
});
