/* 
 *  Nextage License 
 *  Copyright 2015 - Nextage 
 */
function CampoDataVo() {
    /**
     * @author Nextage
     * @param {campoDataVo} campoDataVo
     * @description Popula Filtro do sistema.
     */
    this.getCampoDataVo = function (campoDataVo) {
        var newMmo = {
            campo: campoDataVo.campo,
            dataInicio: campoDataVo.dataInicio,
            stDataInicio: campoDataVo.stDataInicio,
            dataFim: campoDataVo.dataFim,
            stDataFim: campoDataVo.stDataFim,
            dataNull: campoDataVo.dataNull,
            dataNotNull: campoDataVo.dataNotNull,
            equals: this.equals
        };
        return newMmo;
    };
    /**
     * @author Nextage
     * @description Cria novo Objeto de Filtro
     */
    this.getNovoCampoDataVo = function () {
        var newMmo = {
            campo: null,
            dataInicio: null,
            stDataInicio: null,
            dataFim: null,
            stDataFim: null,
            dataNull: null,
            dataNotNull: null,
            equals: this.equals
        };
        return newMmo;
    };
}