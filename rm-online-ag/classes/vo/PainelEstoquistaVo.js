function PainelEstoquistaVo(obj) {
    this.materialAnterior= null;
    this.materialAtual= null;

    if (obj) {
        this.materialAnterior = new RmMaterial(obj.materialDepositoSaidaReserva.rmMaterial);
        this.materialAtual = new RmMaterial(obj.materialDepositoSaidaReserva.rmMaterial);
    }

    return this;
}