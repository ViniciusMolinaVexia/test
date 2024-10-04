function FiltroPrevisaoPendenciaRecebimento() {

    this.getNovoFiltroPrevisaoPendenciaRecebimento = function () {
        var filtro = {
            paginacaoVo: new PaginacaoVo().getNovoPaginacaoVo(),
            numeroRm: null,
            requisitante: null,
            material: null,
            materialChave: null,
            deposito: null,
            idsDeposito: null,
            diasPrevistos: null,
            tipoPendencia: "",
            dataPrevisaoChegadaInicio: null,
            dataPrevisaoChegadaFim: null,
            stDataPrevisaoChegadaInicio: null,
            stDataPrevisaoChegadaFim: null,
            eapMultiEmpresa: null
        };
        return filtro;
    };

    this.getFiltroPrevisaoPendenciaRecebimento = function (obj) {
        var filtro = {
            paginacaoVo: obj.paginacaoVo,
            numeroRm: obj.numeroRm,
            requisitante: obj.requisitante,
            material: obj.material,
            materialChave: obj.materialChave,
            deposito: obj.deposito,
            idsDeposito: obj.idsDeposito,
            diasPrevistos: obj.diasPrevistos,
            tipoPendencia: obj.tipoPendencia,
            dataPrevisaoChegadaInicio: obj.dataPrevisaoChegadaInicio,
            dataPrevisaoChegadaFim: obj.dataPrevisaoChegadaFim,
            stDataPrevisaoChegadaInicio: obj.stDataPrevisaoChegadaInicio,
            stDataPrevisaoChegadaFim: obj.stDataPrevisaoChegadaFim,
            eapMultiEmpresa: obj.eapMultiEmpresa
        };
        return filtro;
    };
}