'use strict';

app.factory('AutoComplete', function($http) {
    this.CarregaAutoCompletePessoas = function(par) {
        return $http.post(api + '/AutoComplete/listarPessoas', par).then(function(res) {
            return res.data;
        });
    };

    this.CarregaAutoCompleteMateriais = function(par) {
        return $http.post(api + '/AutoComplete/listarMateriais', par).then(function(res) {
            return res.data;
        });
    };

    this.CarregaAutoCompleteMateriaisCadastroRma = function(par) {
        return $http.post(api + '/AutoComplete/listarMateriaisCadastroRma', par).then(function(res) {
            return res.data;
        });
    };

    this.CarregaAutoCompleteMateriaisExistentes = function(par) {
        return $http.post(api + '/AutoComplete/listarMateriaisExistentes', par).then(function(res) {
            return res.data;
        });
    };

    this.CarregaAutoCompleteGerenteAreaEncarregado = function(par) {
        return $http.post(api + '/AutoComplete/listarGerenteAreaEncarregado', par).then(function(res) {
            return res.data;
        });
    };

    this.CarregaAutoCompleteCoordenadores = function(par) {
        return $http.post(api + '/AutoComplete/listarCoordenadores', par).then(function(res) {
            return res.data;
        });
    };

    this.CarregaAutoCompleteResponsavelRetiradaEstoque = function(par) {
        return $http.post(api + '/AutoComplete/listarResponsavelRetiradaEstoque', par).then(function(res) {
            return res.data;
        });
    };

    this.CarregaAutoCompleteUsuario = function(par) {
        return $http.post(api + '/AutoComplete/listarUsuarios', par).then(function(res) {
            return res.data;
        });
    };

    this.CarregaAutoCompleteSetor = function(par) {
        return $http.post(api + '/AutoComplete/listarSetor', par).then(function(res) {
            return res.data;
        });
    };

    this.CarregaAutoCompleteSubarea = function(par) {
        return $http.post(api + '/AutoComplete/listarSubarea', par).then(function(res) {
            return res.data;
        });
    };

    this.CarregaAutoCompletePrefixoEquipamento = function(par) {
        return $http.post(api + '/PainelEstoquista/autoCompletePrefixoEquipamento/', par).then(function(res) {
            return res.data;
        });
    };

    this.CarregaAutoCompleteServicosCodigoSap = function(par) {
        return $http.post(api + '/AutoComplete/listarServicosCodigoSap/', par).then(function(res) {
            return res.data;
        });
    };

    this.CarregaAutoCompleteServicosSapExistentes = function(par) {
        return $http.post(api + '/AutoComplete/listarServicosSapExistentes', par).then(function(res) {
            return res.data;
        });
    };

    return this;
});