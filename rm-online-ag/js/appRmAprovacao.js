'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('Rma', [
    'ngRoute',
    'Rma.services',
    'Rma.controllers',
    'ui.bootstrap',
    'ui.utils'
]);

app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/aprovacaoRma', {templateUrl: 'view/rmAprovacao/newhtml.html', controller: 'RmAprovacaoController'});
        $routeProvider.otherwise({redirectTo: '/home'});
    }]);

/**
 *  Define interceptador das requisições do sistema.
 *  @author Marlos M. Novo
 *  @param $q
 *  @param $rootScope
 **/
app.factory('requestInterceptor', function ($q, $rootScope) {
    $rootScope.pendingRequests = 0;
    return {
        'request': function (config) {
            $rootScope.pendingRequests++;
            return config || $q.when(config);
        },
        'requestError': function (rejection) {
            $rootScope.pendingRequests--;
            return $q.reject(rejection);
        },
        'response': function (response) {
            $rootScope.pendingRequests--;
            return response || $q.when(response);
        },
        'responseError': function (rejection) {
            $rootScope.pendingRequests--;
            return $q.reject(rejection);
        }
    };
});

/**
 * Instancia váriavel utilizada para mapear / adicionar os Services e controles.
 * */
var services = angular.module('Rma.services', ['ngResource']);

app.$inject = ['$scope'];
