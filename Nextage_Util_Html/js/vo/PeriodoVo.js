/* 
 *  Nextage License
 *  Copyright 2014 - Nextage
 */
function PeriodoVo() {

    /**
     * @author Bruno Fernandes
     * @param {periodoVo} periodoVo
     * @description popula objeto periodoVo
     */
    this.getPeriodoVo = function (periodoVo) {
        var newPeriodoVo = {
            de: periodoVo.de,
            ate: periodoVo.ate
        };
        return newPeriodoVo;
    };

    /**
     * @author Bruno Fernandes
     * @description cria um novo objeto
     */
    this.getNovoPeriodoVo = function () {
        var newAtestadoMedico = {
            de: null,
            ate: null
        };
        return newAtestadoMedico;
    };

}