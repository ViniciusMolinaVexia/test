app.directive('pageCadastroRma', function() {
    return {
        templateUrl: 'view/cadastroRma/CadastroRma.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

//HM
app.directive('pageCadastroRmaServico', function() {
    return {
        templateUrl: 'view/cadastroRmaServico/CadastroRmaServico.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('pageMenu', function() {
    return {
        templateUrl: 'view/menu/Menu.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('pageRmAprovacao', function() {
    return {
        templateUrl: 'view/rmAprovacao/RmAprovacao.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('pagePainelEstoquista', function() {
    return {
        templateUrl: 'view/painelEstoquista/PainelEstoquista.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('pageMateriaisSemCodigoSap', function() {
    return {
        templateUrl: 'view/materiaisSemCodigoSap/MateriaisSemCodigoSap.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('pageRelatorioDesempenhoFornecedor', function() {
    return {
        templateUrl: 'view/relatorios/relatorioDesempenhoFornecedor/RelatorioDesempenhoFornecedor.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('pagePrevisaoPendenciaRecebimento', function() {
    return {
        templateUrl: 'view/relatorios/previsaoPendenciaRecebimento/PrevisaoPendenciaRecebimento.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('pageAdministrador', function() {
    return {
        templateUrl: 'view/administrador/Administrador.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('pageComprador', function() {
    return {
        templateUrl: 'view/comprador/Comprador.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('pageDocumentoResponsabilidade', function() {
    return {
        templateUrl: 'view/documentoResponsabilidade/abasDocumentoResponsabilidade.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('pageGestaoRma', function() {
    return {
        templateUrl: 'view/relatorios/gestaoRma/GestaoRma.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('pageRelatorioEstoqueInconsistencia', function() {
    return {
        templateUrl: 'view/relatorios/relatorioEstoqueInconsistencia/RelatorioEstoqueInconsistencia.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('pageHierarquiaComprador', function() {
    return {
        templateUrl: 'view/hierarquiaComprador/HierarquiaComprador.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('pageUsuario', function() {
    return {
        templateUrl: 'view/usuario/Usuario.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});
app.directive('pageLogInterface', function() {
    return {
        templateUrl: 'view/logInterface/LogInterface.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('pagePerfil', function() {
    return {
        templateUrl: 'view/perfil/Perfil.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('pageCadastroObra', function() {
    return {
        templateUrl: 'view/cadastroObra/CadastroObra.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('pagePainelRequisicaoMateriais', function() {
    return {
        templateUrl: 'view/painelRequisicaoMateriais/PainelRequisicaoMateriais.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

//HM
/*app.directive('pagePainelRequisicaoServicos', function() {
    return {
        templateUrl: 'view/painelRequisicaoServicos/PainelRequisicaoServicos.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});*/

app.directive('pageRastreabilidade', function() {
    return {
        templateUrl: 'view/rastreabilidade/Rastreabilidade.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});

app.directive('pageWorkflow', function() {
    return {
        templateUrl: 'view/workflow/Workflow.html',
        restrict: 'E',
        transclude: true,
        scope: false
    };
});