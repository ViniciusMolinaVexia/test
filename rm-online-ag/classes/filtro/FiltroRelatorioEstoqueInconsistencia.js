function FiltroRelatorioEstoqueInconsistencia() {

    this.getNovoFiltroRelatorioEstoqueInconsistencia = function () {
        var filtro = {
            paginacaoVo: new PaginacaoVo().getNovoPaginacaoVo(),
            material: null,
            materialChave: null,
            deposito: null,
            sistema: "",
            materialDepositoId: null,
            quantidade: null,
            inclusao: null,
            retirada: null,
            quantidadeDiferenca: null,
            inconsistencia: null,
            quantidadeCp: null,
            justificativaAlteracaoQuantidade: null,
            valor: null,
            checkRma: null,
            checkCp: null,
            novoMaterialDeposito: null,
            codDeposito: null,
            prefixoEquipamento: null,
            patrimonio: null,
            patrimoniado: null,
            quantidadeEstoqueCpPatrimoniadoSelecionado: null,
            quantidadeEstoqueCpSelecionado: null,
            quantidadeEstoqueRmaSelecionado: null,
        };
        return filtro;
    };

    this.getFiltroRelatorioEstoqueInconsistencia = function (obj) {
        var filtro = {
            paginacaoVo: obj.paginacaoVo,
            material: obj.material,
            materialChave: obj.materialChave,
            deposito: obj.deposito,
            sistema: obj.sistema,
            materialDepositoId: obj.materialDepositoId,
            quantidade: obj.quantidade,
            inclusao: obj.inclusao,
            retirada: obj.retirada,
            quantidadeDiferenca: obj.quantidadeDiferenca,
            inconsistencia: obj.inconsistencia,
            quantidadeCp: obj.quantidadeCp,
            justificativaAlteracaoQuantidade: obj.justificativaAlteracaoQuantidade,
            valor: obj.valor,
            checkRma: obj.checkRma,
            checkCp: obj.checkCp,
            novoMaterialDeposito: obj.novoMaterialDeposito,
            codDeposito: obj.codDeposito,
            prefixoEquipamento: obj.prefixoEquipamento,
            patrimonio: obj.patrimonio,
            patrimoniado: obj.patrimoniado,
            quantidadeEstoqueCpPatrimoniadoSelecionado: obj.quantidadeEstoqueCpPatrimoniadoSelecionado,
            quantidadeEstoqueCpSelecionado: obj.quantidadeEstoqueCpSelecionado,
            quantidadeEstoqueRmaSelecionado: obj.quantidadeEstoqueRmaSelecionado
        };
        return filtro;
    };
}