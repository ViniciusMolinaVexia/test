app.directive('manutLogInterface', function () {
	return {
	templateUrl: 'view/logInterface/manutLogInterface.html', 
	restrict: 'E', 
	transclude: true, 
	scope: false 
	}; 
});
app.directive('filtroLogInterface', function () { 
	return { 
	templateUrl: 'view/logInterface/filtroLogInterface.html', 
	restrict: 'E', 
	transclude: true, 
	scope: false 
	}; 
});
app.directive('listaLogInterface', function () { 
	return { 
	templateUrl: 'view/logInterface/listaLogInterface.html', 
	restrict: 'E', 
	transclude: true, 
	scope: false 
	}; 
});

app.directive('detalhesLogInterface', function ($compile) {
	return {
		templateUrl: 'view/logInterface/detalhesLog.html',
		restrict: 'E',
		transclude: true,
		link: function (scope, elem, attrs) {
			scope.numObj = attrs.id;
			scope.lista1 = scope['objetoPrincipalDetail'];
			scope.lista2 = null;
			scope.lista3 = null;
			scope.lista4 = null;
			scope.lista5 = null;

			scope.getLista1 = function () {
				scope.lista1 = scope['objetoPrincipalDetail'];
				return scope.lista1;
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

			scope.closeModal = function (nivel) {
				$("#telaLogInterface #modalDetailLog"+nivel).modal('hide');
			}

			scope.openModalDetalhes = function (nivel,listaSubItens) {
				if(nivel == 2) {
					scope.lista2 = listaSubItens;
				}
				if(nivel == 3) {
					scope.lista3 = listaSubItens;
				}
				if(nivel == 4) {
					scope.lista4 = listaSubItens;
				}
				if(nivel == 5) {
					scope.lista5 = listaSubItens;
				}
				$("#telaLogInterface #modalDetailLog"+nivel).modal('show');
			}

		}

	};
});