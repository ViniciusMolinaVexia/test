/**
 Fim Static
 -------------------------------------------------------------------
 */
Sessao = {
    /**
     Persist o objeto recebido por parametro na sessionStorage
     * @param {type} object
     * @param {type} id
     * @returns {undefined}
     */
    gravaObjNaSessao: function (object, id) {
        window.sessionStorage.setItem(id, JSON.stringify(object));
    },
    /**
     Recupera da Session o Objeto com o Id recebido por parametro
     * @param {type} id
     * @returns {Object}
     */
    getObjDaSessao: function (id) {
        var obj = window.sessionStorage.getItem(id);
        if (obj) {
            return JSON.parse(obj);
        } else {
            return null;
        }
    },
    /**
     Exclui da Session o objeto com o id recebido por Parametro

     *
     * @param {type} id
     * @returns {undefined}
     */
    excluiObjDaSessao: function (id) {
        window.sessionStorage.removeItem(id);
    },
    /**
     Invalida a session.
     */
    excluiSessao: function () {
        window.sessionStorage.clear();
    }

};

