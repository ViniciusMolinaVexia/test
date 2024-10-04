/**
 * Configuração dos métodos que serão requisitados pela View, onde serão responsáveis
 * por controlar iteração entre a View e os Serviços (Persistência, consulta, exclusão, etc)
 *
 * @author Leonardo Faix Pordeus
 *
 * @param $scope Escopo de váriaveis do Controller / View
 * @param $http Protocolo para comunicação entre o FrontEnd e o BackEnd
 * */
angular.module('Rma.controllers', [])
        .controller('RmAprovacaoController', rmAprovacaoServ);