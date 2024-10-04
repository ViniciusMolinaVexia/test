/*
 *  Nextage License
 *  Copyright 2015 - Nextage
 */
function FiltroRmAprovacao() {

    /**
     * @author Nextage
     * @description Cria novo Objeto de Filtro
     */
    this.getNovo = function () {
        var newRmAprovacao = {
            idRmAprovacao: null,
            idRmAprovacaoCriptografada: null,
            numeroRma: null,
            solicitante: null,
            cadastrante: null,
            status: "P",
            paginacaoVo: null
        };
        return newRmAprovacao;
    };
}