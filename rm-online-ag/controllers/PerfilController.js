/**
 * 
 * @param $scope
 * @param LoginService
 * @param loading
 * @param ResourceBundle
 * @param ConfigService
 * @param $http
 * @param $rootScope
 * @param $timeout
 * @returns
 */
function perfilServ($scope, loading, PerfilService, ResourceBundle, ConfigService, $http, $rootScope, $timeout) {
	$scope.ResourceBundle = CarregaResourceBundle($scope, ResourceBundle);
	$scope.nomePerfil = '';
	$scope.idPerfil = 0;
	$scope.perfis;
	$scope.roles;
	$scope.tituloModal='';
	
	$scope.novo = function (){
		$scope.nomePerfil = '';
		$scope.idPerfil = 0;
		$scope.abrirModal();
		$scope.carregarRoles();
	}
	
	$scope.abrirModal = function (){
		$("#telaCadastroPerfil #modalCadastroPerfil").modal('show');
		if($scope.idPerfil==0){
			$scope.tituloModal = $scope.ResourceBundle['label_cadastrar_perfil'];
		}else{
			$scope.tituloModal = $scope.ResourceBundle['label_editar_perfil'];
		}
	}
	
	$scope.salvarPerfil = function () {
		var novoPerfil = '{';
		if($scope.idPerfil>0){
			novoPerfil += '"perfilId":'+$scope.idPerfil+',';
		}
		novoPerfil += '"nome":"'+$scope.nomePerfil+'",';
		novoPerfil += '"roles": [ ';
		for(var i=0;i<$scope.roles.length;i++){
			if($scope.roles[i].checked){
				novoPerfil += JSON.stringify($scope.roles[i])+',';
			}
		}
		novoPerfil = novoPerfil.substring(0,novoPerfil.length-1);
		novoPerfil += ']}';
		PerfilService.salvar(novoPerfil, $scope.perfilCadastrado, $scope.erroSalvar);
	};
	
	$scope.editarPerfil = function (perfil) {
		$scope.nomePerfil = perfil.nome;
		$scope.idPerfil = perfil.perfilId;
		for(var i=0;i<$scope.roles.length;i++){
			$scope.roles[i].checked = false;
			for(var a=0;a<perfil.roles.length;a++){
				if(perfil.roles[a].roleId == $scope.roles[i].roleId){
					$scope.roles[i].checked = true;
				}
			}
		}
		$scope.abrirModal();
	}
	
	$scope.excluirPerfil = function (perfil){
		PerfilService.excluir(JSON.stringify(perfil), $scope.perfilExcluido, $scope.erroExcluir);
	}
	
	$scope.perfilExcluido = function (data){
		$scope.alerts = Util.formataAlert("success", $scope.ResourceBundle['msg_registro_exclusao_sucesso'], NEW_ALERT);
        Util.msgShowHide("#telaCadastroPerfil #msg");
		$scope.carregarPerfis();
	}
	
	$scope.limparFormulario = function (){
		$scope.nomePerfil='';
		$scope.idPerfil=0;
		for(var i=0;i<$scope.roles.length;i++){
			$scope.roles[i].checked = false;
		}
	}
	
	$scope.carregarPerfis = function () {
		loading.loading();
		PerfilService.listarPerfis('', $scope.perfisCarregados, $scope.erroCarregarPerfis);
	}
	
	$scope.carregarRoles = function () {
		PerfilService.listarRoles('', $scope.rolesCarregados, $scope.erroCarregarRegras);
	}
	
	$scope.rolesCarregados = function (data){
		$scope.roles = data;
	}
	
	$scope.perfisCarregados = function (data){
		$scope.perfis = data;
		loading.ready();
	}
	
	$scope.perfilCadastrado = function (data){
        $scope.alerts = Util.formataAlert("success", $scope.ResourceBundle['msg_registro_salvo_sucesso'], NEW_ALERT);
        Util.msgShowHide("#telaCadastroPerfil #msg");
        
		$scope.limparFormulario();
		$scope.carregarPerfis();
		loading.ready();
		$("#telaCadastroPerfil #modalCadastroPerfil").modal('hide');
	}
	
	$scope.erroSalvar = function (data){
		$scope.alerts = Util.formataAlert("danger", 'Erro ao salvar perfil', NEW_ALERT);
        Util.msgShowHide('#telaCadastroPerfil #msg');
        $scope.erro();
	}
	
	$scope.erroExcluir = function (data){
		$scope.alerts = Util.formataAlert("danger", 'Erro ao excluir perfil', NEW_ALERT);
        Util.msgShowHide('#telaCadastroPerfil #msg');
        $scope.erro();
	}
	
	$scope.erroCarregarRoles = function (data){
		$scope.alerts = Util.formataAlert("danger", 'Erro ao carregar as permissões', NEW_ALERT);
        Util.msgShowHide('#telaCadastroPerfil #msg');
        $scope.erro();
	}
	
	$scope.erroCarregarPerfis = function (data){
		$scope.alerts = Util.formataAlert("danger", 'Erro ao carregar os perfis', NEW_ALERT);
        Util.msgShowHide('#telaCadastroPerfil #msg');
        $scope.erro();
	}
	
	$scope.erro = function (){
		$scope.limparFormulario();
		$scope.carregarPerfis();
		loading.ready();
		$("#telaCadastroPerfil #modalCadastroPerfil").modal('hide');
	}
	
	$scope.carregarPerfis();
	$scope.carregarRoles();
	
}