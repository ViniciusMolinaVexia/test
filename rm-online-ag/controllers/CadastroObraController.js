function cadastroObraServ($scope, loading, CadastroObraService, ResourceBundle, ConfigService, $http, $rootScope, $timeout) {
	
	$scope.centros = [];
	$scope.areas = [];
	$scope.prioridades = [];
	
	$scope.retornoListar = function (data) {
		$scope.centros = data;
	}
	
	$scope.retornoErro = function (){ 
		
	}
	
	$scope.editarCentro = function (centro){
		CadastroObraService.getPrioridadesCentro(centro, $scope.montarPrioridade, $scope.retornoErro);
		$scope.areas = centro.areas;
		$scope.abrirModal(centro.descricao);
	}
	
	$scope.montarPrioridade = function (data){
		$scope.prioridades = data;
	}
	
	$scope.abrirModal = function (obra){
		$("#telaCadastroObra #modalCadastroObra").modal('show');
		$scope.tituloModal = $scope.ResourceBundle['label_centro'] + " " + obra;
	}
	
	$scope.salvar = function (){
		console.log($scope.prioridades);
		var dia = 0;
		for(var i=0;i<$scope.prioridades.length;i++){
			if($scope.prioridades[i].codigo == 'MAQ_PARADA'){
				$scope.prioridades[i].confDiasIniPrioridade = 1;
				$scope.prioridades[i].confDiasFimPrioridade = $scope.prioridades[i].confDiasPrevEntrega;
				dia = $scope.prioridades[i].confDiasPrevEntrega;
			}
		}
		
		for(var i=0;i<$scope.prioridades.length;i++){
			if($scope.prioridades[i].codigo == 'URGENTE'){
				$scope.prioridades[i].confDiasIniPrioridade = dia+1;
				$scope.prioridades[i].confDiasFimPrioridade = $scope.prioridades[i].confDiasPrevEntrega+dia;
				dia = $scope.prioridades[i].confDiasFimPrioridade;
			}
		}
		
		for(var i=0;i<$scope.prioridades.length;i++){
			if($scope.prioridades[i].codigo == 'NORMAL'){
				$scope.prioridades[i].confDiasIniPrioridade = dia+1;
				$scope.prioridades[i].confDiasFimPrioridade = 999999;
			}
		}
		
		CadastroObraService.salvarPrioridades($scope.prioridades, $scope.retornoSalvar, $scope.retornoErro);
	}
	
	$scope.retornoSalvar = function (data){
		$("#telaCadastroObra #modalCadastroObra").modal('hide');
		$scope.alerts = Util.formataAlert("success", $scope.ResourceBundle['msg_registro_salvo_sucesso'], NEW_ALERT);
        Util.msgShowHide("#telaCadastroObra #msg");
	}
	
	CadastroObraService.listar('',$scope.retornoListar, $scope.retornoErro);
	
}