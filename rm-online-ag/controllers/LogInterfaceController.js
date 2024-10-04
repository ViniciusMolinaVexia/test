/**
* Configuração dos métodos que serão requisitados pela View, onde serão responsáveis
* por controlar iteração entre a View e os Serviços (Persistência, Consultas, Exclusões, etc)
* 
* @author Nextage
* 
* @param $scope Escopo de váriaveis do Controller / View
* @param $http Protocolo para comunicação entre o FrontEnd e o BackEnd
* @param $rootScope* @param $location
* @param logInterfaceService 
* @param loading 
* @param ResourceBundle 
* @param Combo 
* @param AutoComplete 
* @returns {logInterfaceServ} 
*/
function logInterfaceServ($scope, $rootScope, $http, $location, logInterfaceService, loading, ResourceBundle, Combo, AutoComplete) { 

	$scope.state = STATE_LISTA;
 
	$scope.numPaginas = 0;
 	$scope.paginaAtiva = 1;
 
	//Carrega Labels do ResouceBundle e seta na variavel ResourceBundle do scope.
	$scope.ResourceBundle = CarregaResourceBundle($scope, ResourceBundle);

	if (!$scope.filtro) { 
		$scope.filtro = new FiltroLogInterface().getNovoFiltroLogInterface(); 
	} 

	if (!$scope.listaLogInterface) { 
		$scope.listaLogInterface = []; 
	}
	if (!$scope.objSelecionado) { 
		$scope.objSelecionado = new LogInterface().getNovoLogInterface(); 
	}; 

	/*
	* Método para limpar a tela.
	*/
	$scope.limparFiltro = function () { 
		$scope.filtro = new FiltroLogInterface().getNovoFiltroLogInterface(); 
		$scope.listaLogInterface= []; 
		$scope.limpaValidacaoDoFormulario(); 
		$scope.numPaginas = 0;
		$scope.paginaAtiva = 1;
	}; 


	/*
	* Novo objeto manutenção
	*/
	$scope.novo = function () { 
		Util.irParaOTopo();
		$scope.objSelecionado = new LogInterface().getNovoLogInterface(); 
	}; 


	/*
	* Consultas dos Combos e Autocompletes
	*/
	
	/*
	* Método para realizar a chamada para a lista dos objetos.
	*/
	$scope.listar = function () { 
		loading.loading(); 
		$scope.filtro.paginacaoVo = new PaginacaoVo().getNovoPaginacaoVo(); 
		logInterfaceService.listar($scope.filtro, retornoListar, trataErroServidor); 
	}; 

	/**
	* Metodo para realizar a chamada da paginação para proxima pagina
	* @param pagina	*/
	$scope.irParaPaginaEspecifica = function(pagina) {
		if (pagina !== $scope.paginaAtiva) {
			$scope.filtro.paginacaoVo.pagina = pagina;
			loading.loading();
			logInterfaceService.listar($scope.filtro, retornoListar, trataErroServidor); 
		} 
	}; 

	/**
	* Trata retorno do método listar.
	* @param paginacaoVo	*/
	function retornoListar(paginacaoVo) { 
		if(paginacaoVo && paginacaoVo.itensConsulta && paginacaoVo.itensConsulta.length > 0) { 
			$scope.filtro.paginacaoVo = paginacaoVo; 
			$scope.paginaAtiva = paginacaoVo.pagina; 
			$scope.numPaginas = Math.ceil($scope.filtro.paginacaoVo.qtdeRegistros / $scope.filtro.paginacaoVo.limiteConsulta); 
			$scope.listaLogInterface = paginacaoVo.itensConsulta; 
		} else { 
			$scope.paginaAtiva = 1;
			$scope.numPaginas = 0;
			$scope.listaLogInterface = []; 
		}
		$scope.state = STATE_LISTA; 
		loading.ready(); 
	} 
	//===========================================
	//DETALHAR JSON
	/*
	 * Método para realizar a chamada para a lista dos objetos.
	 */
	$scope.detalharJson = function (obj) {
		loading.loading();
		$scope.logSelecionado = obj;
		$scope.listaDetalhes = [];
		logInterfaceService.detalharJson($scope.logSelecionado, retornoDetalharJson, trataErroServidor);
		$("#telaLogInterface #modalDetalhesPrincipal").modal('show');
	};
	/**
	 * Trata retorno do método listar.
	 * @param paginacaoVo	*/
	function retornoDetalharJson(listaParam) {
		loading.ready();
		$scope.listaDetalhes = listaParam;

	}

	$scope.showModalDetalhes = function (listaSubItens) {
		$scope.objetoPrincipalDetail = listaSubItens;
		$("#telaLogInterface #modalDetailLog1").modal('show');
	};

	// abaixo se encontram as funcionalidaes do sistema 
	/** 
	* Trata erro de comunicação com o servidor. 
	* 
	* @param data Objeto com detalhes do erro. 
	*/ 
	function trataErroServidor(data) { 
		$scope.alerts = Util.formataAlert(data,$scope.ResourceBundle,ALERT_ERRO_COMUNICACAO_SERVIDOR); 
		 Util.msgShowHide('#telaLogInterface #msg'); 
		loading.ready(); 
	} 
 
	/** 
	* Trata botão para fechar Alerta. 
	* @param index 
	*/ 
	$scope.closeAlert = function(index) { 
		$scope.alerts.splice(index, 1); 
	}; 
 
	$(document).ready(function() { 
		$("[data-toggle=tooltip]").tooltip({placement: 'right'}); 
	}); 
 
	$scope.limpaValidacaoDoFormulario = function() { 
		Util.limpaValidacaoDoFormulario('formManutencao'); 
	}; 
 
	$scope.affix = function() { 
		Util.affix(); 
	};


}