'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('Rma', [
    'ngRoute',
    'Rma.services',
    'Rma.controllers',
    'ui.bootstrap',
    'ui.utils',
    'multi-select'
]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/index', { templateUrl: 'index.html', controller: 'LoginController' });
    $routeProvider.when('/home', { templateUrl: 'view/home/home.html', controller: 'LoginController' });
    $routeProvider.otherwise({ redirectTo: '/home' });
}]);

/**
 *  Define interceptador das requisições do sistema.
 *  @author Marlos M. Novo
 *  @param $q
 *  @param $rootScope
 **/
app.factory('requestInterceptor', function($q, $rootScope) {
    $rootScope.pendingRequests = 0;
    return {
        'request': function(config) {
            $rootScope.pendingRequests++;
            return config || $q.when(config);
        },
        'requestError': function(rejection) {
            $rootScope.pendingRequests--;
            return $q.reject(rejection);
        },
        'response': function(response) {
            $rootScope.pendingRequests--;
            return response || $q.when(response);
        },
        'responseError': function(rejection) {
            $rootScope.pendingRequests--;
            $rootScope.$broadcast({ 401: ACESSO_EXPIRADO }[rejection.status], rejection);
            return $q.reject(rejection);
        }
    };
});

/**
 * Intercepta todas as requisições
 */
app.config(function($httpProvider) {
    $httpProvider.interceptors.push('requestInterceptor');
});

/**
 * Instancia váriavel utilizada para mapear / adicionar os Services e controles.
 * */
var services = angular.module('Rma.services', ['ngResource']);

//Local
//var api = 'http://127.0.0.1:8084/rmaweb/v1';
//var api = 'http://localhost:8084/vexiadeveloperteam-rmonline-ag-api-v1-8e5c0ec296d7/v1';
//QA
var api = 'http://10.1.1.153:8080/rmaweb/v1';
//PRD
//var api = 'http://10.1.1.157:8080/rmaweb/v1';

app.$inject = ['$scope'];