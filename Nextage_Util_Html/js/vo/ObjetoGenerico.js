function ObjetoGenerico(entidadeId) {
    this.getObjetoGenerico = function (obj) {
        var newObjetoGenerico = {};
        for (var i in obj) {
            newObjetoGenerico[i] = obj[i];
        }
        newObjetoGenerico.equals = this.equals;
        return newObjetoGenerico;
    };
    this.equals = function (obj) {
        if (obj[entidadeId] === this[entidadeId]) {
            return true;
        }
        return false;
    };
} 