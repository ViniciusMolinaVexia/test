
UtilUsuario = {
    /**
     * Salva usuário na sessão utilizado criptografia da chave e usuário
     * Luan - 23/12/2014
     * @param data
     * @param chave
     * @param $http
     * */
    saveUsuarioSessao: function saveUsuarioSessao(data, chave, $http) {
        if (data) {

//            var roles = [];
//            //verifica as roles do sistema conforme o prefixo da mesma e monta uma lista de string
//            //ex TR_
//            for (var i = 0; i < data.roles.length; i++) {
//                if (data.roles[i].nome.substring(0, 3).toUpperCase() === PREFIXO_ROLE || data.roles[i].nome.toUpperCase() === NEXTAGE.toUpperCase()) {
//                    roles.push(data.roles[i]);
//                }
//            }
//            data.roles = roles;
            var userStr = JSON.stringify(data);
            var chaveUserCrip = Criptografia.criptografarBase64(USER + chave);
            var userCrip = Criptografia.criptografarBase64(userStr);
            if($http){
                $http.defaults.headers.common['Authorization'] = 'Basic ' + userCrip;
            }
            Sessao.gravaObjNaSessao(userCrip, chaveUserCrip);
        }
    },
    /**
     * Retorna usuário salvo na sessão
     * luan - 23/12/2014
     * @param chave
     * */
    getUsuarioSessao: function getUsuarioSessao(chave) {
        var user = null;
        var chaveUserCrip = Criptografia.criptografarBase64(USER + chave);
        var userCrip = Sessao.getObjDaSessao(chaveUserCrip);
        if (userCrip !== null) {
            //Decodifica
            var userStr = Criptografia.descriptografarBase64(userCrip);
            //Criano um novo usuário
            user = JSON.parse(userStr);
        }
        return user;
    }, /**
     * Retorna usuário salvo na sessão no formato Json
     * luan - 12/02/2015
     * @param chave
     * */
    getUsuarioSessaoJSON: function getUsuarioSessaoJSON(chave) {
        var chaveUserCrip = Criptografia.criptografarBase64(USER + chave);
        var userCrip = Sessao.getObjDaSessao(chaveUserCrip);
        if (userCrip !== null) {
            //Decodifica
            var decode = Criptografia.descriptografarBase64(userCrip);
            //Realizado o replace do &, pois ao passar no html, o & entendesse
            //como inicio para um novo parametro, ocorrendo problemas com o login flex.
            decode = StringUtil.replaceAll(decode, "&", "");
            return decode;
        }
        return "";
    },
    removerUsuarioDaSessao: function removerUsuarioDaSessao(chave, $http) {
        var chaveUserCrip = Criptografia.criptografarBase64(USER + chave);
        Sessao.excluiObjDaSessao(chaveUserCrip);
        if($http){
            $http.defaults.headers.common['Authorization'] = undefined;
        }
    },
    /**
     * @author luan l domingues
     * @data   5/10/2014
     * Função para verificar as roles do usuário para habilitar o acesso aos menus
     * @param role
     * @param chave
     */
    verificaRole: function verificaRole(chave, role) {
        var usuarioLogado = UtilUsuario.getUsuarioSessao(chave);

        for (var i = 0; i < usuarioLogado.roles.length; i++) {
            if (usuarioLogado.roles[i].nome.toUpperCase() === role.toUpperCase()) {
                return true;
            }
        }
        return false;
    },
    /**
     * Salva usuário na sessão utilizado criptografia da chave e usuário
     * Marlos Morbis Novo - 25/08/2015
     * @param data
     * @param chave
     * */
    saveUsuarioLocalStorage: function saveUsuarioLocalStorage(data, chave) {
        if (data) {
            var userStr = JSON.stringify(data);
            var dt = new Date();
            var chaveUserCrip = Criptografia.criptografarBase64(USER + chave);
            var userCrip = Criptografia.criptografarBase64(userStr);

            LocalStorage.gravaObjNoLS(userCrip, chaveUserCrip);
        }
    },
    getUsuarioLocalStorageJSON: function getUsuarioLocalStorageJSON(chave) {
        var chaveUserCrip = Criptografia.criptografarBase64(USER + chave);
        var userCrip = LocalStorage.getObjDoLS(chaveUserCrip);
        if (userCrip !== null) {
            //Decodifica
            var decode = Criptografia.descriptografarBase64(userCrip);
            //Realizado o replace do &, pois ao passar no html, o & entendesse
            //como inicio para um novo parametro, ocorrendo problemas com o login flex.
            decode = StringUtil.replaceAll(decode, "&", "");
            return decode;
        }
        return "";
    }

};

