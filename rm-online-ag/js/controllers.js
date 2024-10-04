/**
 * Configuração dos métodos que serão requisitados pela View, onde serão responsáveis
 * por controlar iteração entre a View e os Serviços (Persistência, consulta, exclusão, etc)
 *
 * @author Marlos Morbis Novo
 *
 * @param $scope Escopo de váriaveis do Controller / View
 * @param $http Protocolo para comunicação entre o FrontEnd e o BackEnd
 * */
angular.module('Rma.controllers', [])
    .controller('LoginController', LoginServ)
    .controller('ResourceBundleController', ResourceBundleController)
    .controller('CadastroRmaController', cadastroRmaServ)
	.controller('CadastroRmaServicoController', cadastroRmaServicoServ)
    .controller('RmAprovacaoController', rmAprovacaoServ)
    .controller('PainelEstoquistaController', painelEstoquistaServ)
    .controller('MateriaisSemCodigoSapController', materiaisSemCodigoSapServ)
    .controller('RelatorioDesempenhoFornecedorController', relatorioDesempenhoFornecedorServ)
    .controller('PrevisaoPendenciaRecebimentoController', previsaoPendenciaRecebimentoServ)
    .controller('GestaoRmaController', gestaoRmaServ)
    .controller('AdministradorController', administradorServ)
    .controller('CompradorController', compradorServ)
    .controller('DocumentoResponsabilidadePendController', documentoResponsabilidadePendServ)
    .controller('DocumentoResponsabilidadeIndisRecController', documentoResponsabilidadeIndisRecServ)
    .controller('RelatorioEstoqueInconsistenciaController', relatorioEstoqueInconsistenciaServ)
    .controller('HierarquiaCompradorController', hierarquiaCompradorServ)
    .controller('UsuarioController', usuarioController)
    .controller('LogInterfaceController', logInterfaceServ)
    .controller('PerfilController', perfilServ)
    .controller('PainelRequisicaoMateriaisController', painelRequisicaoMateriaisServ)
    .controller('RastreabilidadeController', rastreabilidadeServ)
    .controller('WorkflowController', workflowServ)
    .controller('CadastroObraController', cadastroObraServ)
;