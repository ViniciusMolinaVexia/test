function rastreabilidadeServ($scope, RastreabilidadeService, loading, ResourceBundle, ConfigService, $http, $rootScope, $timeout) {

	$scope.numeroRm='';
	$scope.lista = [];
	
	$scope.procurar = function() {
		loading.loading();
		RastreabilidadeService.listar($scope.numeroRm, $scope.ok, $scope.nok);
	};
	
	$scope.ok = function(data){
		$scope.lista = data;
		loading.ready();
	}
	
	$scope.nok = function(data){
		$scope.alerts = Util.formataAlert(data, $scope.ResourceBundle, ALERT_ERRO_COMUNICACAO_SERVIDOR);
        loading.ready();
	}
	
}