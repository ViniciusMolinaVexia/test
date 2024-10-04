/*
 *  Nextage License
 *
  * Copyright 2014 - Nextage
 */
function HierarquiaComprador() {

    this.getHierarquiaComprador = function (data) {
        var newHierarquiaComprador = {
            comprador: data.comprador,
            compradorVez: data.compradorVez,
            hierarquia: data.hierarquia,
            hierarquiaCompradorId: data.hierarquiaCompradorId,
            equals: this.equals
        };
        return newHierarquiaComprador;
    };

    /**
     *
     *@author: Marlos M. Novo
     *@description Implementação de método equals, utilizado posteriormente
     *       para comparações entre objetos.
     * @param {usuario}
     */
    this.equals = function (data) {
        if (data.hierarquiaCompradorId === this.hierarquiaCompradorId) {
            return true;
        }

        return false;
    };

}

