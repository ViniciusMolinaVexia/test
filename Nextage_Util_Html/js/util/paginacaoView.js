/* 
 * NextAge License
 * Copyright 2015 - Nextage
 * 
 */

Paginacao = {
    /**
     * Monta paginação somente em view
     * @author Luan l Domingues
     * @param {type} scope - scope do controller
     * @param {type} nomeLista - noma da lista a ser exibida em view
     * @param {type} listaCompleta - lista com todos os itens listados
     * @param {type} pagina - numero da pagina que irá paginar
     * @param {type} nomeId - nome da propriedade id, caso não tenha um identificador a lista da errp
     * @param {type} loading - loading para fazer o busy
     * @returns {undefined}
     */
    montaPaginacao: function (scope, nomeLista, listaCompleta, pagina, nomeId, loading) {
        if (loading) {
            loading.loading();
        }
        scope[nomeLista] = [];
        if (pagina !== scope.paginaAtiva) {
            var indexIni = (pagina - 1) * scope.pageSize;
            var indexFim = indexIni + scope.pageSize;
            for (var i = indexIni; i < indexFim; i++) {
                if (listaCompleta[i]) {
                    if (!listaCompleta[i][nomeId]) {
                        listaCompleta[i][nomeId] = i;
                    }
                    scope[nomeLista].push(listaCompleta[i]);
                }
            }
        }
        scope.paginaAtiva = pagina;
        if (loading) {
            loading.ready();
        }
    }

};
