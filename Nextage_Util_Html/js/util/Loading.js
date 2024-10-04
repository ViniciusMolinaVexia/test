/**
 *<pre>
 *<b>author:</b> Marlos M. Novo
 *<b>date:  </b> 16/04/2014
 *</pre>
 *
 * <p>Classe responsável por criar a Factory de Loading (Processando) das telas
 * ao fazer uma requisição ao servidor.
 *
 * Exemplo de uso:
 *  Antes da chamada ao servidor inserir <code>loading.loading()</code> que inicia o Processando.
 *  Depois no retorno do processar do Servidor inserir <code>loading.ready()</code> que para o Processando.
 */
app.factory('loading', ['$rootScope', function ($rootScope) {
    var timer;
    return {
        loading: function () {
            clearTimeout(timer);
            $rootScope.status = 'loading';
            if (!$rootScope.$$phase)
                $rootScope.$apply();
        },
        ready: function (delay) {
            function ready() {
                $rootScope.status = 'ready';
                if (!$rootScope.$$phase)
                    $rootScope.$apply();
            }

            clearTimeout(timer);

            delay = delay == null ? 500 : false;

            if (delay) {
                timer = setTimeout(ready, delay);
            }
            else {
                ready();
            }
        },
        loadingUnique: function (scope) {
            clearTimeout(timer);
            $rootScope[scope] = 'loading';
            if (!$rootScope.$$phase)
                $rootScope.$apply();
        },
        readyUnique: function (delay, scope) {
            function ready(scope) {
                $rootScope[scope] = 'ready';
                if (!$rootScope.$$phase)
                    $rootScope.$apply();
            }

            clearTimeout(timer);

            delay = delay == null ? 500 : false;

            if (delay) {
                timer = setTimeout(ready, delay);
            }
            else {
                ready(scope);
            }
        }
    }
}]);