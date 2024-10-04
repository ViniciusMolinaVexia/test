/* 
 *  Nextage License
 *  Copyright 2014 - Nextage
 */
function NxOrder() {

    /**
     * @author Darlei Leindecker P. Santos
     * @param {nxOrder} nxOrder
     * @description pupula objeto sistema, seta o metodo equals
     */
    this.getNxOrder = function (nxOrder) {

        var newNxOrder = {
            propriedade: nxOrder.propriedade,
            ordem: nxOrder.ordem

        };
        return newNxOrder;
    };

    /**
     * @author Darlei Leindecker P. Santos
     * @description cria um novo objeto
     */
    this.getNovoNxOrder = function () {
        var newNxOrder = {
            propriedade: "",
            ordem: ""

        };
        return newNxOrder;
    };


}