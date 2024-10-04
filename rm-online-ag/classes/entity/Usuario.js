/*
 *  Nextage License
 *  Copyright 2014 - Nextage
 */
function Usuario() {

    /**
     * @author Marlos M. Novo
     * @param {usuario} usuario
     * @description pupula objeto sistema, seta o metodo equals
     */
    this.getUsuario = function (usuario) {
        var newUsuario = {
            usuarioId: usuario.usuarioId,
            login: usuario.login,
            nome: usuario.nome,
            senha: usuario.senha,
            pessoaId: usuario.pessoaId,
            pessoa: usuario.pessoa,
            comprador: usuario.comprador,
            areaId: usuario.areaId,
            ativo: usuario.ativo,
            roles: usuario.roles,
            tipoRequisicoes: usuario.tipoRequisicoes,
            eapMultiEmpresas: usuario.eapMultiEmpresas,
            flAdmin: usuario.flAdmin,
            equals: this.equals
        };
        return newUsuario;
    };

    /**
     * @author Marlos M. Novo
     * @description cria um novo objeto
     */
    this.getNovoUsuario = function () {
        var newUsuario = {
            usuarioId: 0,
            login: "",
            nome: "",
            senha: "",
            pessoaId: "",
            pessoa:null,
            comprador:null,
            areaId: "",
            ativo:"",
            roles: [],
            tipoRequisicoes: [],
            eapMultiEmpresas:[],
            flAdmin: 'N',
            equals: this.equals
        };
        return newUsuario;
    };

    /**
     *
     *@author: Marlos M. Novo
     *@description Implementação de método equals, utilizado posteriormente
     *       para comparações entre objetos.
     * @param {usuario}
     */
    this.equals = function (usuario) {
        if (usuario.usuarioId === this.usuarioId) {
            return true;
        }

        return false;
    };

}

