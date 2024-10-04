
UtilConfiguracao = {
    /**
     * @author luan l domingues
     * @data   14/10/2014
     * @description Salva Configuracao na sessão utilizado criptografia da chave
     * @param {Object} data
     * @param {String} chave
     * @returns {undefined}
     */
    saveConfiguracaoSessao: function saveConfiguracaoSessao(data, chave) {
        if (data) {
            data.logomarca = undefined;
            data.validacao = undefined;
            data.enviaAdmSapUrl = undefined;
            var ConfiStr = JSON.stringify(data);
            var chaveConfiCrip = Criptografia.criptografarBase64(CONFI + chave);
            var confiCrip = Criptografia.criptografarBase64(ConfiStr);
            Sessao.gravaObjNaSessao(confiCrip, chaveConfiCrip);
        }
    },
    /**
     * @author luan l domingues
     * @data   14/10/2014
     * @description pega a Configuracao da sessao
     * @param {String} chave
     * @returns {Configuracao}
     */
    getConfiguracaoSessao: function getConfiguracaoSessao(chave) {
        var confi = null;
        var chaveConfiCrip = Criptografia.criptografarBase64(CONFI + chave);
        var confiCrip = Sessao.getObjDaSessao(chaveConfiCrip);
        if (confiCrip !== null) {
            //Decodifica
            var confiStr = Criptografia.descriptografarBase64(confiCrip);
            //Criano um novo Configuracao
            confi = JSON.parse(confiStr);
        }
        return confi;
    },
    /**
     * @author luan l domingues
     * @data   14/10/2014
     * @description pega a Configuracao da sessao como se ela fosse um JSON
     * @param {String} chave
     * @returns {JSON Config}
     */
    getConfiguracaoSessaoJSON: function getConfiguracaoSessaoJSON(chave) {
        var confi = null;
        var chaveConfiCrip = Criptografia.criptografarBase64(CONFI + chave);
        var confiCrip = Sessao.getObjDaSessao(chaveConfiCrip);
        if (confiCrip !== null) {
            //Decodifica
            var decode = Criptografia.descriptografarBase64(confiCrip);
            //Realizado o replace do &, pois ao passar no html, o & entendesse
            //como inicio para um novo parametro, ocorrendo problemas com o login flex.
            decode = StringUtil.replaceAll(decode, "&", "");
            return decode;
        }
        return "";
    },
    /**
     * @author luan l domingues
     * @data   14/10/2014
     * @description  Função para verificar as Funcionalidades Habilitadas da Configuracao
     * @param {String} funcio
     * @param {String} chave
     * @returns {Boolean}
     */
    verificaFuncionalidade: function verificaFuncionalidade(funcio, chave) {
        var configuracao = UtilConfiguracao.getConfiguracaoSessao(chave);
        var funcionalidades = [];
        if (configuracao.funcionalidadesHabilitadas) {
            funcionalidades = configuracao.funcionalidadesHabilitadas.split(";");
            for (var i = 0; i < funcionalidades.length; i++) {
                if (funcionalidades[i].toUpperCase() === funcio.toUpperCase()) {
                    return true;
                }
                else {
                    if (i === configuracao.funcionalidadesHabilitadas.length) {
                        return false;
                    }
                }
            }
        }
        return false;
    }
};