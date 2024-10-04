/*LOGIN*/
services.factory('LoginService', function($http, $resource, $log) {
    return $resource(api + '/LoginController/', {}, {
        login: { method: 'POST', isArray: false, url: api + '/LoginController/login/' },
        recuperarSenha: { method: 'POST', isArray: false, url: api + '/LoginController/validaUsuario/' },
        listaEapMultiEmpresa: { method: 'POST', isArray: true, url: api + '/LoginController/listaEapMultiEmpresa/' }
    });
});

/* PERFIL */
services.factory('PerfilService', function($resource) {
    return $resource('PerfilService', {}, {
        salvar: { method: 'POST', isArray: false, url: api + '/PerfilController/salvar/' },
        listarPerfis: { method: 'POST', isArray: true, url: api + '/PerfilController/listarPerfis/' },
        listarRoles: { method: 'POST', isArray: true, url: api + '/PerfilController/listarRoles/' },
        excluir: { method: 'POST', isArray: false, url: api + '/PerfilController/excluir/' }
    });
});

/* WORKFLOW */
services.factory('WorkflowService', function($resource) {
    return $resource('WorkflowService', {}, {
        salvar: { method: 'POST', isArray: false, url: api + '/WorkflowController/salvar/' },
        listarWorkflows: { method: 'POST', isArray: true, url: api + '/WorkflowController/listarWorkflows/' },
        excluir: { method: 'POST', isArray: false, url: api + '/WorkflowController/excluir/' }
    });
});

/* Cadastro Obra */
services.factory('CadastroObraService', function($resource) {
    return $resource('CadastroObraService', {}, {
        salvar: { method: 'POST', isArray: false, url: api + '/WorkflowController/salvar/' },
        listar: { method: 'POST', isArray: true, url: api + '/CadastroObraController/listar/' },
        excluir: { method: 'POST', isArray: false, url: api + '/WorkflowController/excluir/' },
        getPrioridadesCentro: { method: 'POST', isArray: true, url: api + '/CadastroObraController/getPrioridadesCentro/' },
        salvarPrioridades: { method: 'POST', isArray: false, url: api + '/CadastroObraController/salvarPrioridades/' }
    });
});

services.factory('RastreabilidadeService', function($resource) {
    return $resource('RastreabilidadeService', {}, {
        listar: { method: 'POST', isArray: true, url: api + '/RastreabilidadeController/listarRastreabilidade/' }
    });
});

/*Configuração*/
services.factory('ConfigService', function($http, $resource, $log) {
    return $resource('../rhwebService/ConfiguracaoController/', {}, {
        getConfiguracao: { method: 'POST', isArray: false, url: api + '/ConfiguracaoController/getConfiguracao/' },
        alteraConfiguracaoProjeto: { method: 'POST', isArray: false, url: api + '/ConfiguracaoController/alteraConfiguracaoProjeto/' }
    });
});

//ALTERAR PROJETO - RH CORPORATIVO
services.factory('ProjetoService', function($http, $resource, $log) {
    return $resource('Projeto', {}, {
        alterarProjeto: { method: 'POST', isArray: false, url: '../../rhwebService/ProjetoController/alterarProjeto/' }
    });
});

//CADASTRO DE RMA
services.factory('RmaService', function($resource) {
    return $resource('RmaService', {}, {
        listarConsultaRma: { method: 'POST', isArray: false, url: api + '/CadastroRma/listarConsultaRma/' },
        salvar: { method: 'POST', isArray: false, url: api + '/CadastroRma/salvar/' },
        mandarAprovar: { method: 'POST', isArray: false, url: api + '/CadastroRma/mandarAprovar/' },
        listarRm: { method: 'POST', isArray: false, url: api + '/CadastroRma/listarRm/' },
        listarRmById: { method: 'POST', isArray: false, url: api + '/CadastroRma/listarRmById/' },
        verificarDepositos: { method: 'POST', isArray: false, url: api + '/CadastroRma/verificarDepositos/' },
        verificarDepositosEstoque: { method: 'POST', isArray: false, url: api + '/CadastroRma/verificarDepositosEstoque/' },
        listarStatusRmMaterial: { method: 'POST', isArray: true, url: api + '/CadastroRma/listarStatusRmMaterial/' },
        listarInformacoesMaterial: { method: 'POST', isArray: true, url: api + '/CadastroRma/listarInformacoesMaterial/' },
        consultaInformacoesMaterialSap: { method: 'POST', isArray: false, url: api + '/CadastroRma/consultaInformacoesMaterialSap/' },
        listarMateriaisSimilares: { method: 'POST', isArray: false, url: api + '/CadastroRma/listarMateriaisSimilares/' },
        consultaMateriaisSimilaresSap: {
            method: 'POST',
            isArray: false,
            url: api + '/CadastroRma/consultaMateriaisSimilaresSap/'
        },
        cancelarRequisicao: { method: 'POST', isArray: false, url: api + '/CadastroRma/cancelarRequisicao/' },
        redigirJustificativa: { method: 'POST', isArray: false, url: api + '/CadastroRma/redigirJustificativa/' },
        cadastrarMaterial: { method: 'POST', isArray: false, url: api + '/CadastroRma/cadastrarMaterial/' },
        verificaReprovador: { method: 'POST', isArray: false, url: api + '/CadastroRma/verificaReprovador/' },
        atribuirComprador: { method: 'POST', isArray: false, url: api + '/CadastroRma/atribuirComprador/' },
        listarAprovadores: { method: 'POST', isArray: true, url: api + '/CadastroRma/listarAprovadores/' },
        alterarAprovador: { method: 'POST', isArray: false, url: api + '/CadastroRma/alterarAprovador/' },
        enviarEmailSuprimentos: { method: 'POST', isArray: false, url: api + '/CadastroRma/enviarEmailSuprimentos/' },
        geraExcel: { method: 'POST', isArray: false, url: api + '/CadastroRma/geraExcel/' },
        alterarQuantidade: { method: 'POST', isArray: false, url: api + '/CadastroRma/alterarQuantidade/' },
        alterarPrioridade: { method: 'POST', isArray: false, url: api + '/CadastroRma/alterarPrioridade/' },
        verificaQtdsMatDepositos: { method: 'POST', isArray: false, url: api + '/CadastroRma/verificaQtdsMatDepositos/' },
        cancelarMaterial: { method: 'POST', isArray: false, url: api + '/CadastroRma/cancelarMaterial' },
        listarRetiradasNaoPresenciais: { method: 'POST', isArray: true, url: api + '/CadastroRma/listarRetiradasNaoPresenciais' },
        confirmarRetiradaNaoPresencial: { method: 'POST', isArray: false, url: api + '/CadastroRma/confirmarRetiradaNaoPresencial' },
        verificaPrioridade: { method: 'POST', isArray: false, url: api + '/CadastroRma/verificaPrioridade' },
        validarAprovacaoCoordenador: { method: 'POST', isArray: false, url: api + '/CadastroRma/validarAprovacaoCoordenador' },
        salvarRequisicaoRetiradaEstEstoquista: {
            method: 'POST',
            isArray: false,
            url: api + '/CadastroRma/salvarRequisicaoRetiradaEstEstoquista'
        },
        alterarColetor: { method: 'POST', isArray: false, url: api + '/CadastroRma/alterarColetor' },
        listarCentrosDoUsuario: { method: 'POST', isArray: true, url: api + '/ComboController/listarCentrosDoUsuario/' },
        listarDepositosDoCentro: { method: 'POST', isArray: true, url: api + '/ComboController/listarDepositosDoCentro/' },
        listarAprovadoresArea: { method: 'POST', isArray: true, url: api + '/CadastroRma/listarAprovadoresArea/' },
        listarAprovadoresCusto: { method: 'POST', isArray: true, url: api + '/CadastroRma/listarAprovadoresCusto/' },
        listarAprovadoresEmergencial: { method: 'POST', isArray: true, url: api + '/CadastroRma/listarAprovadoresEmergencial/' },
        listarCompradores: { method: 'GET', isArray: true, url: api + '/CadastroRma/comprador/lista'}
    });
});

//CADASTRO DE RMA SERVICO -HM

services.factory('RmaServicoService', function($resource) {
    return $resource('RmaServicoService', {}, {
        listarConsultaRma: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/listarConsultaRma/' },
        listarConsultaRmaServico: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/listarConsultaRmaServico/' },
        salvar: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/salvar/' },
        mandarAprovar: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/mandarAprovar/' },
        listarRm: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/listarRm/' },
        listarStatusServico: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/listarStatusServico/' },
        listarRmById: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/listarRmById/' },
        verificarDepositos: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/verificarDepositos/' },
        verificarDepositosEstoque: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/verificarDepositosEstoque/' },
        listarStatusRmMaterial: { method: 'POST', isArray: true, url: api + '/CadastroRmaServico/listarStatusRmServico/' },
        listarInformacoesMaterial: { method: 'POST', isArray: true, url: api + '/CadastroRmaServico/listarInformacoesMaterial/' },
        consultaInformacoesMaterialSap: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/consultaInformacoesMaterialSap/' },
        listarMateriaisSimilares: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/listarMateriaisSimilares/' },
        consultaMateriaisSimilaresSap: {
            method: 'POST',
            isArray: false,
            url: api + '/CadastroRmaServico/consultaMateriaisSimilaresSap/'
        },
        cancelarRequisicao: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/cancelarRequisicao/' },
        redigirJustificativa: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/redigirJustificativa/' },
        cadastrarMaterial: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/cadastrarMaterial/' },
        verificaReprovador: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/verificaReprovador/' },
        atribuirComprador: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/atribuirComprador/' },
        listarAprovadores: { method: 'POST', isArray: true, url: api + '/CadastroRmaServico/listarAprovadores/' },
        alterarAprovador: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/alterarAprovador/' },
        enviarEmailSuprimentos: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/enviarEmailSuprimentos/' },
        geraExcel: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/geraExcel/' },
        alterarQuantidade: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/alterarQuantidade/' },
        alterarPrioridade: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/alterarPrioridade/' },
        verificaQtdsMatDepositos: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/verificaQtdsMatDepositos/' },
        cancelarMaterial: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/cancelarServico' },
        listarRetiradasNaoPresenciais: { method: 'POST', isArray: true, url: api + '/CadastroRmaServico/listarRetiradasNaoPresenciais' },
        confirmarRetiradaNaoPresencial: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/confirmarRetiradaNaoPresencial' },
        verificaPrioridade: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/verificaPrioridade' },
        validarAprovacaoCoordenador: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/validarAprovacaoCoordenador' },
        salvarRequisicaoRetiradaEstEstoquista: {
            method: 'POST',
            isArray: false,
            url: api + '/CadastroRmaServico/salvarRequisicaoRetiradaEstEstoquista'
        },
        alterarColetor: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/alterarColetor' },
        listarCentrosDoUsuario: { method: 'POST', isArray: true, url: api + '/ComboController/listarCentrosDoUsuario/' },
        listarDepositosDoCentro: { method: 'POST', isArray: true, url: api + '/ComboController/listarDepositosDoCentro/' },
        listarAprovadoresArea: { method: 'POST', isArray: true, url: api + '/CadastroRmaServico/listarAprovadoresArea/' },
        listarAprovadoresCusto: { method: 'POST', isArray: true, url: api + '/CadastroRmaServico/listarAprovadoresCusto/' },
        listarAprovadoresEmergencial: { method: 'POST', isArray: true, url: api + '/CadastroRmaServico/listarAprovadoresEmergencial/' },
        alteraStatusEnvSap: { method: 'POST', isArray: false, url: api + '/CadastroRmaServico/alteraStatusEnvSap/' }
    });
});


//Rm Aprovacao
services.factory('rmAprovacaoService', function($resource) {
    return $resource('rmAprovacaoService', {}, {
        selectUniqueRmAprovador: { method: 'POST', isArray: false, url: api + '/RmAprovacaoController/selectUniqueRmAprovador/' },
        listar: { method: 'POST', isArray: false, url: api + '/RmAprovacaoController/listar/' },
        aprovarReprovar: { method: 'POST', isArray: false, url: api + '/RmAprovacaoController/aprovarReprovar/' },
        aprovarReprovarServico: { method: 'POST', isArray: false, url: api + '/RmAprovacaoController/aprovarReprovarServico/' },
        voltarCustos: { method: 'POST', isArray: false, url: api + '/RmAprovacaoController/voltarCustos/' },
        atribuirEquipeCusto: { method: 'POST', isArray: false, url: api + '/RmAprovacaoController/atribuirEquipeCusto/' },
        salvar: { method: 'POST', isArray: false, url: api + '/RmAprovacaoController/salvar/' },
        encaminharEstoquista: { method: 'POST', isArray: false, url: api + '/RmAprovacaoController/encaminharEstoquista/' },
        verificarDepositosEstoque: { method: 'POST', isArray: false, url: api + '/RmAprovacaoController/verificarDepositosEstoque/' }
    });
});

//Previsao Pendencia Recebimento
services.factory('rmPrevisaoPendenciaRecebimentoService', function($resource) {
    return $resource('rmPrevisaoPendenciaRecebimentoService', {}, {
        listar: { method: 'POST', isArray: false, url: api + '/PrevisaoPendenciaRecebimento/listar/' },
        gerarXLS: { method: 'POST', isArray: false, url: api + '/PrevisaoPendenciaRecebimento/gerarXLS/' }
    });
});

//Painel estoquista
services.factory('PainelEstoquistaService', function($resource) {
    return $resource('PainelEstoquistaService', {}, {
        listar: { method: 'POST', isArray: false, url: api + '/PainelEstoquista/listar/' },
        listarDepositosDisponiveis: { method: 'POST', isArray: true, url: api + '/PainelEstoquista/listarDepositosDisponiveis/' },
        selectById: { method: 'POST', isArray: false, url: api + '/PainelEstoquista/selectById/' },
        salvarAceite: { method: 'POST', isArray: false, url: api + '/PainelEstoquista/salvarAceite/' },
        salvarRecusar: { method: 'POST', isArray: false, url: api + '/PainelEstoquista/salvarRecusar/' },
        solicitarTransferenciaMaterial: { method: 'POST', isArray: false, url: api + '/PainelEstoquista/solicitarTransferenciaMaterial/' },
        getMaterialDeposito: { method: 'POST', isArray: false, url: api + '/PainelEstoquista/getMaterialDeposito/' },
        getQuantidadeRecebimentos: { method: 'POST', isArray: false, url: api + '/PainelEstoquista/getQuantidadeRecebimentos/' },
        getQuantidadeRetirada: { method: 'POST', isArray: false, url: api + '/PainelEstoquista/getQuantidadeRetirada/' },
        receberMaterial: { method: 'POST', isArray: false, url: api + '/PainelEstoquista/receberMaterial/' },
        salvarRecebimentoMat: { method: 'POST', isArray: false, url: api + '/PainelEstoquista/salvarRecebimentoMat/' },
        salvarTransferencia: { method: 'POST', isArray: false, url: api + '/PainelEstoquista/salvarTransferencia/' },
        salvarRetiroMaterial: { method: 'POST', isArray: false, url: api + '/PainelEstoquista/salvarRetiroMaterial/' },
        getUltimoStatusTransferenciaRmMaterial: { method: 'POST', isArray: false, url: api + '/PainelEstoquista/getUltimoStatusTransferenciaRmMaterial/' },
        verificaEquipamentoEpi: { method: 'POST', isArray: false, url: api + '/PainelEstoquista/verificaEquipamentoEpi/' },
        alterarMaterial: { method: 'POST', isArray: false, url: api + '/PainelEstoquista/alterarMaterial/' },
        verificaMaterialIndisponivel: { method: 'POST', isArray: false, url: api + '/PainelEstoquista/verificaMaterialIndisponivel/' },
        listaMaterialDepositoSaida: { method: 'POST', isArray: true, url: api + '/PainelEstoquista/listaMaterialDepositoSaida/' }
    });
});

services.factory('PainelRequisicaoMateriaisService', function($resource) {
    return $resource('PainelRequisicaoMateriaisService', {}, {
        listar: { method: 'POST', isArray: false, url: api + '/PainelRequisicaoMateriais/listar/' },
        enviarSAP: { method: 'POST', isArray: false, url: api + '/PainelRequisicaoMateriais/enviarSAP/' },
        enviarReservaSAP: { method: 'POST', isArray: false, url: api + '/PainelRequisicaoMateriais/enviarReservaSAP/' },
        salvarRequisicao: { method: 'POST', isArray: false, url: api + '/PainelRequisicaoMateriais/salvarRequisicao/' },
        salvarBaixa: { method: 'POST', isArray: false, url: api + '/PainelRequisicaoMateriais/salvarBaixa/' },
        reprovar: { method: 'POST', isArray: false, url: api + '/PainelRequisicaoMateriais/reprovar/' }
    });
});

//painel requisicao servico - HM
services.factory('PainelRequisicaoServicosService', function($resource) {
    return $resource('PainelRequisicaoServicosService', {}, {
        listar: { method: 'POST', isArray: false, url: api + '/PainelRequisicaoMateriais/listar/' },
        enviarSAP: { method: 'POST', isArray: false, url: api + '/PainelRequisicaoMateriais/enviarSAP/' },
        enviarReservaSAP: { method: 'POST', isArray: false, url: api + '/PainelRequisicaoMateriais/enviarReservaSAP/' },
        salvarRequisicao: { method: 'POST', isArray: false, url: api + '/PainelRequisicaoMateriais/salvarRequisicao/' },
        reprovar: { method: 'POST', isArray: false, url: api + '/PainelRequisicaoMateriais/reprovar/' }
    });
});

//Materiais sem Codigo sap
services.factory('MateriaisSemCodigoSapService', function($resource) {
    return $resource('MateriaisSemCodigoSapService', {}, {
        listar: { method: 'POST', isArray: false, url: api + '/MateriaisSemCodigoSap/listar/' },
        selectById: { method: 'POST', isArray: false, url: api + '/MateriaisSemCodigoSap/selectById/' },
        alterarCodigoSap: { method: 'POST', isArray: false, url: api + '/MateriaisSemCodigoSap/alterarCodigoSap/' },
        realizarDePara: { method: 'POST', isArray: false, url: api + '/MateriaisSemCodigoSap/realizarDePara/' }
    });
});

//Documento Responsabilidade Pendentes
services.factory('DocumentoResponsabilidadePendService', function($resource) {
    return $resource('DocumentoResponsabilidadePendService', {}, {
        listarRmMaterialCampo: {
            method: 'POST',
            isArray: false,
            url: api + '/DocumentoResponsabilidadePend/listarRmMaterialCampo/'
        },
        gerarDocumento: {
            method: 'POST',
            isArray: false,
            url: api + '/DocumentoResponsabilidadePend/gerarDocumento/'
        }
    });
});

//Documento Responsabilidade Indisponivel Recusados
services.factory('DocumentoResponsabilidadeIndisRecService', function($resource) {
    return $resource('DocumentoResponsabilidadeIndisRecService', {}, {
        listarRmMaterialCampo: {
            method: 'POST',
            isArray: false,
            url: api + '/DocumentoResponsabilidadeIndisRec/listarRmMaterialCampo/'
        },
        gerarDocumento: {
            method: 'POST',
            isArray: false,
            url: api + '/DocumentoResponsabilidadeIndisRec/gerarDocumento/'
        }
    });
});


//Administrador
services.factory('AdministradorService', function($resource) {
    return $resource('AdministradorService', {}, {
        listar: { method: 'POST', isArray: false, url: api + '/Administrador/listar/' },
        selectById: { method: 'POST', isArray: false, url: api + '/Administrador/selectById/' },
        salvar: { method: 'POST', isArray: false, url: api + '/Administrador/salvar/' },
        desativarRegistro: {
            method: 'POST',
            isArray: false,
            url: api + '/Administrador/desativarRegistro/'
        },
        reenviarParaSap: { method: 'POST', isArray: false, url: api + '/Administrador/reenviarParaSap/' }
    });
});

//Comprador
services.factory('CompradorService', function($resource) {
    return $resource('CompradorService', {}, {
        listar: { method: 'POST', isArray: false, url: api + '/Comprador/listar/' },
        enviarParaSap: { method: 'POST', isArray: false, url: api + '/Comprador/enviarParaSap/' },
        geraExcel: { method: 'POST', isArray: false, url: api + '/Comprador/geraExcel/' },
        salvarDataPrevisaoEntrega: { method: 'POST', isArray: false, url: api + '/Comprador/salvarDataPrevisaoEntrega/' },
        salvarAtribuirComprado: { method: 'POST', isArray: false, url: api + '/Comprador/salvarAtribuirComprado/' },
        alterarMaterial: { method: 'POST', isArray: false, url: api + '/Comprador/alterarMaterial/' },
        alterarColetor: { method: 'POST', isArray: false, url: api + '/Comprador/alterarColetor/' },
        detalharRm: { method: 'POST', isArray: false, url: api + '/Comprador/detalharRm/' },
        finalizarIsServico: { method: 'POST', isArray: false, url: api + '/Comprador/finalizarIsServico/' },
        gerarDocumento: { method: 'POST', isArray: false, url: api + '/Comprador/gerarDocumento' },
        concluirComprador: { method: 'POST', isArray: false, url: api + '/Comprador/concluirComprador' },
        adicionarMaterialCodigo: { method: 'POST', isArray: false, url: api + '/Comprador/adicionarMaterialCodigo/' }
    });
});

//Anexo
services.factory('AnexoService', function($resource) {
    return $resource('AnexoService', {}, {
        listar: { method: 'POST', isArray: true, url: api + '/Anexo/listar/' },
        salvar: { method: 'POST', isArray: false, url: api + '/Anexo/salvar/' },
        carregarAnexo: { method: 'POST', isArray: false, url: api + '/Anexo/carregarAnexo/' },
        excluirAnexo: { method: 'POST', isArray: false, url: api + '/Anexo/excluirAnexo/' }
    });
});

//Anexo Servicos
services.factory('AnexoServicoService', function($resource) {
    return $resource('AnexoServicoService', {}, {
        listar: { method: 'POST', isArray: true, url: api + '/AnexoServico/listar/' },
        salvar: { method: 'POST', isArray: false, url: api + '/AnexoServico/salvar/' },
        carregarAnexo: { method: 'POST', isArray: false, url: api + '/AnexoServico/carregarAnexo/' },
        excluirAnexo: { method: 'POST', isArray: false, url: api + '/AnexoServico/excluirAnexo/' }
    });
});

//Gestão RMA
services.factory('gestaoRmaService', function($resource) {
    return $resource('gestaoRmaService', {}, {
        listar: { method: 'POST', isArray: false, url: api + '/GestaoRma/listar/' },
        geraExcel: { method: 'POST', isArray: false, url: api + '/GestaoRma/geraExcel/' }
    });
});

//Relatório Estoque Inconsistência
services.factory('rmRelatorioEstoqueInconsistenciaService', function($resource) {
    return $resource('rmRelatorioEstoqueInconsistenciaService', {}, {
        listar: { method: 'POST', isArray: true, url: api + '/RelatorioEstoqueInconsistencia/listar/' },
        listarSistemasEntradaSaida: {
            method: 'POST',
            isArray: true,
            url: api + '/RelatorioEstoqueInconsistencia/listarSistemasEntradaSaida/'
        },
        listarEstoqueRma: { method: 'POST', isArray: true, url: api + '/RelatorioEstoqueInconsistencia/listarEstoqueRma/' },
        listarCpQtdePatrimoniados: {
            method: 'POST',
            isArray: false,
            url: api + '/RelatorioEstoqueInconsistencia/listarCpQtdePatrimoniados/'
        },
        listarDepositoAlteracao: { method: 'POST', isArray: true, url: api + '/RelatorioEstoqueInconsistencia/listarDepositoAlteracao/' },
        gerarXLS: { method: 'POST', isArray: false, url: api + '/RelatorioEstoqueInconsistencia/gerarXLS/' },
        alterarQuantidade: { method: 'POST', isArray: false, url: api + '/RelatorioEstoqueInconsistencia/alterarQuantidade/' },
        listarMatAndDep: {
            method: 'POST',
            isArray: false,
            url: api + '/RelatorioEstoqueInconsistencia/listarMatAndDep/'
        },
        listarCpAndRma: {
            method: 'POST',
            isArray: false,
            url: api + '/RelatorioEstoqueInconsistencia/listarCpAndRma/'
        },
        salvarEntradaSaidaEstoque: {
            method: 'POST',
            isArray: false,
            url: api + '/RelatorioEstoqueInconsistencia/salvarEntradaSaidaEstoque'
        },
        saidaEstoque: { method: 'POST', isArray: false, url: api + '/RelatorioEstoqueInconsistencia/saidaEstoque' }
    });
});

//Hierarquia Comprador
services.factory('hierarquiaCompradorService', function($resource) {
    return $resource('hierarquiaCompradorService', {}, {
        listar: { method: 'POST', isArray: false, url: api + '/HierarquiaCompradorController/listar/' },
        salvar: { method: 'POST', isArray: false, url: api + '/HierarquiaCompradorController/salvar/' },
        excluir: { method: 'POST', isArray: false, url: api + '/HierarquiaCompradorController/excluir/' },
        selectById: { method: 'POST', isArray: false, url: api + '/HierarquiaCompradorController/selectById/' }
    });
});


services.factory('UsuarioService', function($http, $resource, $log) {
    return $resource('UsuarioService', {}, {
        listar: { method: 'POST', isArray: false, url: api + '/UsuarioController/listar/' },
        salvar: { method: 'POST', isArray: false, url: api + '/UsuarioController/salvar/' },
        excluir: { method: 'POST', isArray: false, url: api + '/UsuarioController/excluir/' },
        selectById: { method: 'POST', isArray: false, url: api + '/UsuarioController/selectById/' },
        listaUsuarioTipoRequisicaoToUsuario: { method: 'POST', isArray: true, url: api + '/UsuarioController/listaUsuarioTipoRequisicaoToUsuario/' },
        listaUsuarioCentroCustoToUsuario: { method: 'POST', isArray: true, url: api + '/UsuarioController/listaUsuarioCentroCustoToUsuario/' },
        listaUsuarioEapMultiEmpresaToUsuario: { method: 'POST', isArray: true, url: api + '/UsuarioController/listaUsuarioEapMultiEmpresaToUsuario/' },
        listaUsuarioPerfil: { method: 'POST', isArray: true, url: api + '/PerfilController/listarPerfis/' },
        salvarSenha: { method: 'POST', isArray: false, url: api + '/UsuarioController/salvarSenha/' },
        salvarTipoAtuacao: { method: 'POST', isArray: false, url: api + '/UsuarioController/salvarTipoAtuacao/' },
        listaTipoAtuacaoByPessoaId: { method: 'POST', isArray: true, url: api + '/UsuarioController/listaTipoAtuacaoByPessoaId/' },
        sincronizar: { method: 'POST', isArray: false, url: api + '/UsuarioController/sincronizar/' }
    });
});
//LOGINTERFACE
services.factory('logInterfaceService', function($http, $resource, $log) {
    return $resource('LogInterface', {}, {
        listar: { method: 'POST', isArray: false, url: api + '/LogInterface/listar/' },
        detalharJson: { method: 'POST', isArray: true, url: api + '/LogInterface/detalharJson/' }
    });
});


services.factory('Combo', function($http, $resource, $log) {
    return $resource('ComboController/', {}, {
        listarGerentesCustos: { method: 'POST', isArray: true, url: api + '/ComboController/listarGerentesCustos/' },
        listarPrioridades: { method: 'POST', isArray: true, url: api + '/ComboController/listarPrioridades/' },
        listarTipoRequisicao: { method: 'POST', isArray: true, url: api + '/ComboController/listarTipoRequisicao/' },
        listarEapMultiEmpresa: {
            method: 'POST',
            isArray: true,
            url: api + '/ComboController/listarEapMultiEmpresa/'
        },
        listarTodasEapMultiEmpresa: {
            method: 'POST',
            isArray: true,
            url: api + '/ComboController/listarTodasEapMultiEmpresa/'
        },
        listarDepositos: { method: 'POST', isArray: true, url: api + '/ComboController/listarDepositos/' },
        listarDepositosTemporarios: { method: 'POST', isArray: true, url: api + '/ComboController/listarDepositosTemporarios/' },
        listarGerentesObra: { method: 'POST', isArray: true, url: api + '/ComboController/listarGerentesObra/' },
        listarUnidadeMedida: { method: 'POST', isArray: true, url: api + '/ComboController/listarUnidadeMedida/' },
        listarStatus: { method: 'POST', isArray: true, url: api + '/ComboController/listarStatus/' },
        listarComprador: { method: 'POST', isArray: true, url: api + '/ComboController/listarComprador/' },
        listarEquipeCustos: { method: 'POST', isArray: true, url: api + '/ComboController/listarEquipeCustos/' },
        listarCoordenadores: { method: 'POST', isArray: true, url: api + '/ComboController/listarCoordenadores/' },
        listarLiderCustos: { method: 'POST', isArray: true, url: api + '/ComboController/listarLiderCustos/' },
        listarCentros: { method: 'POST', isArray: true, url: api + '/ComboController/listarCentrosDoUsuario/' },
        listarAreas: { method: 'POST', isArray: true, url: api + '/ComboController/listarAreas/' },
        listarAprovadoresAreas: { method: 'POST', isArray: true, url: api + '/ComboController/listarAprovadoresAreas/' },
        listarAprovadoresGerenteAreas: { method: 'POST', isArray: true, url: api + '/ComboController/listarAprovadoresGerenteAreas/' },
        listarAprovadoresCustos: { method: 'POST', isArray: true, url: api + '/ComboController/listarAprovadoresCustos/' },
        listarAprovadoresEmergenciais: { method: 'POST', isArray: true, url: api + '/ComboController/listarAprovadoresEmergenciais/' },
        listarAprovadoresRm: { method: 'POST', isArray: true, url: api + '/ComboController/listarAprovadoresRm/' },
        listarPerfis: { method: 'POST', isArray: true, url: api + '/PerfilController/listarPerfis/' },
        listarCodigoSap: { method: 'POST', isArray: true, url: api + '/ComboController/listarCodigoSap/' }
    });
});





// NOVA ARQUITETURA
// RM -> MATERIAL -> STATUS
services.factory('ObterAprovadoresRmMaterialService', function($http, $resource, $log) {
    return $resource('ObterAprovadoresRmMaterialService', {}, {
        obter: { method: 'POST', isArray: true, url: api + '/rm/material/status/obter' },
        todos: { method: 'POST', isArray: false, url: api + '/rm/material/status/aprovadores/todos' }
    });
});


// NOVA ARQUITETURA
// RM -> SERVICO -> STATUS
services.factory('ObterAprovadoresRmServicoService', function($http, $resource, $log) {
    return $resource('ObterAprovadoresRmServicoService', {}, {
        obter: { method: 'POST', isArray: true, url: api + '/rm/servico/status/obter' },
        todos: { method: 'POST', isArray: false, url: api + '/rm/servico/status/aprovadores/todos' }
    });
});

services.factory('ObterSaldoRmMaterialService', function($http, $resource, $log) {
    return $resource('ObterSaldoRmMaterialService', {}, {
        obterSaldoRmMaterial: { method: 'POST', isArray: true, url: api + '/rm/material/saldo/obter' }
    });
});



services.factory('BuscarEstoqueMaterialService', function($resource) {
    return $resource('BuscarEstoqueMaterialService', {}, {
        consultaMateriaisSimilaresSap: { method: 'POST', isArray: false, url: api + '/estoqueMaterial/consultaMateriaisSimilaresSap' },
        validarEstoqueMaterial: { method: 'POST', isArray: false, url: api + '/estoqueMaterial/validarEstoqueMaterial' }
    });
});