function workflowServ($scope, loading, ResourceBundle, WorkflowService, Combo, ConfigService, $http, $rootScope, $timeout) {
	
	$scope.tituloModal = '';
	$scope.idWork = 0;
	$scope.centros = CarregaComboCentros(Combo);
	//$scope.areas = CarregaComboAreas(Combo);
	$scope.aprovadoresAreas = [];
	$scope.aprovadoresGerenteAreas = [];
	$scope.aprovadoresCustos = [];
	$scope.aprovadoresEmergenciais = [];
	$scope.escolherArea=false;
	$scope.escolherGerenteArea=false;
	$scope.escolherCusto=false;
	
	//Funcao para limpar campos apos a acao de salvar ou novo
	$scope.limparCampos = function (){
		$scope.centroSelecionado = {};
		$scope.areaSelecionado = {};
		$scope.idWork=0;
		$scope.escolherArea=false;
		$scope.escolherGerenteArea = false;
		$scope.escolherCusto = false;
		for(var a=0;a<$scope.aprovadoresAreas.length;a++){
			$scope.aprovadoresAreas[a].selected = false;
		}
		for(var a=0;a<$scope.aprovadoresGerenteAreas.length;a++){
			$scope.aprovadoresGerenteAreas[a].selected=false;
		}
		for(var a=0;a<$scope.aprovadoresCustos.length;a++){
			$scope.aprovadoresCustos[a].selected=false;
		}
		for(var a=0;a<$scope.aprovadoresEmergenciais.length;a++){
			$scope.aprovadoresEmergenciais[a].selected=false;
		}
	}
	
	//Botao Novo
	$scope.novoWorkflow = function (){
		$scope.limparCampos();
		$scope.abrirModal();
	}
	
	//Icone editar 
	$scope.editarWorkflow = function (workflow){
		$scope.limparCampos();
		$scope.areaSelecionado = workflow.area;
		$scope.centroSelecionado = workflow.centro
		
		if(workflow.workflowAreas){
			$scope.escolherArea = true;
			for(var a=0;a<$scope.aprovadoresAreas.length;a++){
				for(var b=0;b<workflow.workflowAreas.length;b++){
					if($scope.aprovadoresAreas[a].usuarioId == workflow.workflowAreas[b].usuario.usuarioId){
						$scope.aprovadoresAreas[a].selected = true;
					}
				}
			}
		}
		
		if(workflow.workflowGerenteAreas){
			$scope.escolherGerenteArea = true;
			for(var a=0;a<$scope.aprovadoresGerenteAreas.length;a++){
				for(var b=0;b<workflow.workflowGerenteAreas.length;b++){
					if($scope.aprovadoresGerenteAreas[a].usuarioId == workflow.workflowGerenteAreas[b].usuario.usuarioId){
						$scope.aprovadoresGerenteAreas[a].selected = true;
					}
				}
			}
		}
		
		if(workflow.workflowCustos){
			$scope.escolherCusto = true;
			for(var a=0;a<$scope.aprovadoresCustos.length;a++){
				for(var b=0;b<workflow.workflowCustos.length;b++){
					if($scope.aprovadoresCustos[a].usuarioId == workflow.workflowCustos[b].usuario.usuarioId){
						$scope.aprovadoresCustos[a].selected = true;
					}
				}
			}
		}
		
		if(workflow.workflowEmergenciais){
			for(var a=0;a<$scope.aprovadoresEmergenciais.length;a++){
				for(var b=0;b<workflow.workflowEmergenciais.length;b++){
					if($scope.aprovadoresEmergenciais[a].usuarioId == workflow.workflowEmergenciais[b].usuario.usuarioId){
						$scope.aprovadoresEmergenciais[a].selected = true;
					}
				}
			}
		}
		
		$scope.idWork = workflow.workflowId;
		$scope.abrirModal();
	}
	
	$scope.abrirModal = function (){
		$("#telaWorkflow #modalWorkflow").modal('show');
		if($scope.idWork==0){
			$scope.tituloModal = $scope.ResourceBundle['label_cadastrar'];
		}else{
			$scope.tituloModal = $scope.ResourceBundle['label_editar'];
		}
	}
	
	$scope.atualizarAreas = function (centroSelecionado){
		//$scope.centroSelecionado = centroSelecionado;
    	//Combo.listarAreas($scope.centroSelecionado.centroId,$scope.areasCarregadas,$scope.erroServidor);
		
		CarregaComboAreas(Combo, centroSelecionado.idioma).then(function(listaFiltrada) {
			$scope.listaAreas = listaFiltrada; // Atribui a lista filtrada ao escoposs
		}).catch(function(error) {
			console.error('Erro ao carregar áreas:', error);
		});

	}

	function CarregaComboAreas(Combo, idioma) {
        return new Promise((resolve, reject) => {
            Combo.listarAreas(function(result) {
                // Filtra a lista com base no idioma fornecido
                const listaFiltrada = result.filter(function(area) {
                    return area.idioma === idioma; // Filtra por idioma
                });
                resolve(listaFiltrada); // Resolve a Promise com a lista filtrada
            });
        });
    }
	
	$scope.marcarArea = function (areaSelecionado){
		$scope.areaSelecionado = areaSelecionado;
	}
	
	$scope.marcarGerenteArea = function (gerenteAreaSelecionado){
		$scope.gerenteAreaSelecionado = gerenteAreaSelecionado;
	}
	
	$scope.salvarWorkflow = function (){
		if (Util.validaCamposDoFormulario("#telaWorkflow #formWorkflow") === 0) {
			var workflow = {};
			workflow.centro = $scope.centroSelecionado;
			workflow.area = $scope.areaSelecionado;
			
			var workflowAreas = [];
			for(var a=0;a<$scope.aprovadoresAreas.length;a++){
				if($scope.aprovadoresAreas[a].selected){
					var workflowArea = {};
					workflowArea.usuario = $scope.aprovadoresAreas[a];
					workflowAreas.push(workflowArea);
				}
			}
			
			var workflowGerenteAreas = [];
			for(var a=0;a<$scope.aprovadoresGerenteAreas.length;a++){
				if($scope.aprovadoresGerenteAreas[a].selected){
					var workflowGerenteArea = {};
					workflowGerenteArea.usuario = $scope.aprovadoresGerenteAreas[a];
					workflowGerenteAreas.push(workflowGerenteArea);
				}
			}
			
			var workflowCustos = [];
			for(var a=0;a<$scope.aprovadoresCustos.length;a++){
				if($scope.aprovadoresCustos[a].selected){
					var workflowCusto = {};
					workflowCusto.usuario = $scope.aprovadoresCustos[a];
					workflowCustos.push(workflowCusto);
				}
			}
			
			var workflowEmergenciais = [];
			for(var a=0;a<$scope.aprovadoresEmergenciais.length;a++){
				if($scope.aprovadoresEmergenciais[a].selected){
					var workflowEmergencial = {};
					workflowEmergencial.usuario = $scope.aprovadoresEmergenciais[a];
					workflowEmergenciais.push(workflowEmergencial);
				}
			}
			
			if($scope.idWork!=0){
				workflow.workflowId=$scope.idWork;
			}
			workflow.workflowAreas = workflowAreas; 
			workflow.workflowGerenteAreas = workflowGerenteAreas; 
			workflow.workflowCustos = workflowCustos;
			workflow.workflowEmergenciais = workflowEmergenciais;
			if(($scope.validarEmergencial(workflowEmergenciais)) && ($scope.validarGerenteArea(workflowGerenteAreas))){
				WorkflowService.salvar(workflow, $scope.workflowSalvo, $scope.erroServidor);
			}else{
				$("#telaWorkflow #comboAtivo").addClass("campo-obrigatorio");
	            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
	            Util.msgShowHide("#telaWorkflow #msg");
			}
		}else{
            $("#telaWorkflow #comboAtivo").addClass("campo-obrigatorio");
            $scope.alerts = Util.formataAlert(null, $scope.ResourceBundle, ALERT_CAMPOS_OBRIGATORIOS);
            Util.msgShowHide("#telaWorkflow #msg");
		}
	}
	
	$scope.validarEmergencial = function (workflowEmergenciais){
		if(!workflowEmergenciais || workflowEmergenciais.length == 0){
			return false;
		}
		return true;
	}

	$scope.validarGerenteArea = function (workflowGerenteAreas){
		if(!workflowGerenteAreas || workflowGerenteAreas.length == 0){
			return false;
		}
		return true;
	}
	
	$scope.workflowSalvo = function (data){
		$scope.limparCampos();
		$scope.alerts = Util.formataAlert("success", $scope.ResourceBundle[data.msg], NEW_ALERT);
        Util.msgShowHide("#telaWorkflow #msg");
		$("#telaWorkflow #modalWorkflow").modal('hide');
		WorkflowService.listarWorkflows('', $scope.carregarWorkflows, $scope.erroServidor);
	}
	
	$scope.carregarWorkflows = function(data){
		$scope.works = data;
	}
	
	$scope.erroServidor = function (data){
		console.log(data);
	}
	
	$scope.aprovadoresAreasCarregados = function (data){
		$scope.aprovadoresAreas = data;
	}
	
	$scope.aprovadoresGerenteAreasCarregados = function (data){
		$scope.aprovadoresGerenteAreas = data;
	}
	
	$scope.aprovadoresCustosCarregados = function (data){
		$scope.aprovadoresCustos = data;
	}

	$scope.aprovadoresEmergenciaisCarregados = function (data){
		$scope.aprovadoresEmergenciais = data;
	}
	
	$scope.excluirWorkflow = function(workflow){
		WorkflowService.excluir(workflow, $scope.excluido, $scope.erroServidor);
	}
	
	$scope.excluido = function (data) {
		$scope.alerts = Util.formataAlert("success", $scope.ResourceBundle['msg_registro_exclusao_sucesso'], NEW_ALERT);
        Util.msgShowHide("#telaWorkflow #msg");
		WorkflowService.listarWorkflows('', $scope.carregarWorkflows, $scope.erroServidor);
	}
	
	WorkflowService.listarWorkflows('', $scope.carregarWorkflows, $scope.erroServidor);
	Combo.listarAprovadoresAreas('',$scope.aprovadoresAreasCarregados,$scope.erroServidor);
	Combo.listarAprovadoresGerenteAreas('',$scope.aprovadoresGerenteAreasCarregados,$scope.erroServidor);
	Combo.listarAprovadoresCustos('',$scope.aprovadoresCustosCarregados,$scope.erroServidor);
	Combo.listarAprovadoresEmergenciais('',$scope.aprovadoresEmergenciaisCarregados,$scope.erroServidor);
}