/* 
 *  Nextage License
 *  Copyright 2014 - Nextage
 */
function MsgConfig() {

    /**
     * @author Darlei Leindecker Pereira Santos
     * @data   16/06/2015
     * @param {MsgConfig} msgConfig
     * @description pupula objeto sistema, seta o metodo equals
     */
    this.getMsgConfig = function (msgConfig) {
        var newMsgConfig = {
            id: msgConfig.id,
            delay: msgConfig.delay,
            loading: msgConfig.loading,
            equals: this.equals
        };
        return newMsgConfig;
    };

    /**
     * @author Darlei Leindecker Pereira Santos
     * @data   16/06/2015
     * @description cria um novo objeto
     */
    this.getNovo = function () {
        var newMsgConfig = {
            id: null,
            delay: null,
            loading: null,
            equals: this.equals
        };
        return newMsgConfig;
    };

    /**
     *
     * @author Darlei Leindecker Pereira Santos
     * @data   16/06/2015
     * @description Implementação de método equals,
     * utilizado posteriormente para comparações entre objetos.
     * @param {MsgConfig} msgConfig
     */
    this.equals = function (msgConfig) {
        return (msgConfig.id === this.id);
    };

}



