function Deposito(obj) {
    this.depositoId = null;
    this.nome = null;
    this.observacao = null;
    this.endereco = null;
    this.telefone = null;
    this.responsavel = null;
    this.quantidade = 0;

    if (obj) {
        this.depositoId = obj.depositoId;
        this.nome = obj.nome;
        this.observacao = obj.observacao;
        this.endereco = obj.endereco;
        this.telefone = obj.telefone;
        this.responsavel = obj.responsavel;
        this.quantidade = obj.quantidade;
    }

    this.equals = function (obj) {
        if (!this.depositoId || !obj.depositoId) {
            return false;
        } else {
            return this.depositoId === obj.depositoId;
        }
    };

    return this;
}