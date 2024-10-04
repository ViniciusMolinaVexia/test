function CadastroUsuarioVo() {

    /**
     * @author Henrique Marques
     * @param {CadastroUsuarioVo} CadastroUsuarioVo
     * @description pupula objeto sistema, seta o metodo equals
     */
    this.getUsuario = function (cadastroUsuario) {
        var newUsuario = {
            usuario: cadastroUsuario.usuario,
            tipoRequisicoes: cadastroUsuario.tipoRequisicoes,
            pessoa: cadastroUsuario.pessoa,
            area: cadastroUsuario.area,
            eapMultiEmpresas: cadastroUsuario.eapMultiEmpresas,
            equals: this.equals
        };
        return newUsuario;
    };

    /**
     * @author Henrique Marques
     * @description cria um novo objeto
     */
    this.getNovoUsuario = function () {
        var newUsuario = {
            usuario: [],
            tipoRequisicoes: [],
            pessoa: [],
            area: [],
            eapMultiEmpresas:[],
            flAdmin: 'N',
            equals: this.equals
        };
        return newUsuario;
    };

    /**
     *
     *@author: Henrique Marques
     *@description Implementação de método equals, utilizado posteriormente
     *       para comparações entre objetos.
     * @param {cadastroUsuario}
     */
    this.equals = function (cadastroUsuario) {
        console.log(cadastroUsuario);
        console.log(this);
        if (cadastroUsuario.usuarioId === this.usuario.usuarioId) {
            return true;
        }

        return false;
    };

}

