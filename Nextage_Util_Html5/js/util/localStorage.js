LocalStorage = {
    //Funções utilizadas para inserir no storage de Ocorrencias(Perda, Facilitador, Vitimas e etc...)

    // inicializa storage index
    initStorage: function (storage) {
        if (!storage.index) {
            window.localStorage.setItem(storage.nome + ":index", storage.index = 1);
        }
    },
    // coloca o index da storage como 1
    // usado bno metodo excluir todos
    storeIndex: function (storage) {
        window.localStorage.setItem(storage.nome + ":index", storage.index = 1);
    },
    //Adiciona um item no storage passado por parametro e incrementa o seu index
    storeAdd: function (object, storage, propriedadeId) {
        if (!propriedadeId) {
            object.id = storage.index;
        }
        window.localStorage.setItem(storage.nome + ":index", ++storage.index);
        if (propriedadeId) {
            window.localStorage.setItem(storage.nome + ":" + object[propriedadeId], JSON.stringify(object));
        } else {
            window.localStorage.setItem(storage.nome + ":" + object.id, JSON.stringify(object));
        }
    },
    //Edita um item do storage passado por parametro
    storeEdit: function (object, storage, propriedadeId) {
        if (propriedadeId) {
            window.localStorage.setItem(storage.nome + ":" + object[propriedadeId], JSON.stringify(object));
        } else {
            window.localStorage.setItem(storage.nome + ":" + object.id, JSON.stringify(object));
        }
    },
    //Remove um item do storage passado por parametro
    storeRemove: function (object, storage, propriedadeId) {
        if (propriedadeId) {
            window.localStorage.removeItem(storage.nome + ":" + object[propriedadeId]);
        } else {
            window.localStorage.removeItem(storage.nome + ":" + object.id);
        }
    },
    //Retorna um item do storage passado por parametro
    getItemId: function (id, storage) {
        return window.localStorage.getItem(storage.nome + ":" + id);
    },
    //Retorna todos os items do storage passado por parametro
    allStorage: function (storage) {
        var array = [];
        var key;
        for (var i = 0; i < window.localStorage.length - 1; i++) {
            key = window.localStorage.key(i);
            if (key.indexOf(storage.nome + ":") != -1) {
                if (key !== storage.nome + ":index") {
                    array.push(JSON.parse(window.localStorage.getItem(key)));
                }
            }
        }
        return array;
    },
    //Retorna todos os items do storage passado por parametro funcio na em todos os navegadores
    //criado para o Internet Explorer pois ele pega o index tambem
    allStorageIe: function (storage) {
        var array = [];
        var key;
        for (var i = 0; i < window.localStorage.length; i++) {
            key = window.localStorage.key(i);
            if (key.indexOf(storage.nome + ":") !== -1 && key !== (storage.nome + ":index")) {
                array.push(JSON.parse(window.localStorage.getItem(key)));
            }
        }
        return array;
    },
    //Retorna o id do item a ser criado, de acordo com o index do storage passado.
    getNewId: function (storage) {
        return storage.index;
    },
    //Retorna o index do storage, função utilizada nas variaveis do storage no Util.js
    getIndexStorage: function (storage) {
        return window.localStorage.getItem(storage + ":index");
    },
    /**
     Persist o objeto recebido por parametro no localStorage
     */
    gravaObjNoLS: function (object, id) {
        window.localStorage.setItem(id, JSON.stringify(object));
    },
    /**
     Recupera do localStorage o Objeto com o Id recebido por parametro
     */
    getObjDoLS: function (id) {
        var obj = window.localStorage.getItem(id);
        if (obj && typeof obj != 'undefined') {
            return JSON.parse(obj);
        } else {
            return null;
        }
    },
    /**
     Exclui do localStorage o objeto com o id recebido por Parametro
     */
    excluiObjDoLS: function (id) {
        window.localStorage.removeItem(id);
    },
    /**
     Marcelo Ferri
     *
     Remove os registros do Local Storage que começam com o mesmo texto recebido por parametro.
     */
    removeStartsWith: function (startsWith) {
        Object.keys(window.localStorage)
            .forEach(function (key) {
                if (key.substring(0, startsWith.length) == startsWith) {
                    window.localStorage.removeItem(key);
                }
            });
    }
};