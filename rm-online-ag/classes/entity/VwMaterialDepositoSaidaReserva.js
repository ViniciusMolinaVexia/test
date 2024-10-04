function VwMaterialDepositoSaidaReserva(obj) {
    this.id= null;
    this.materialDepositoSaidaReserva= null;
    this.rmMaterialStatus= null;
    this.pessoa= null;

    if (obj) {
        this.id= obj.id;
        this.materialDepositoSaidaReserva= obj.materialDepositoSaidaReserva;
        this.rmMaterialStatus= obj.rmMaterialStatus;
        this.pessoa= obj.pessoa;
    }

    this.equals = function (obj) {
        if (!this.materialDepositoSaidaReserva.id || !obj.materialDepositoSaidaReserva.id) {
            return false;
        } else {
            return this.materialDepositoSaidaReserva.id === obj.materialDepositoSaidaReserva.id;
        }
    };

    return this;
}

