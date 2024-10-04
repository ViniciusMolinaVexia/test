app.factory('httpInterceptor', Factory);

Factory.$inject = ['$q', 'loading'];

function Factory($q, loading) {


    var service = {
        request: request,
        response: response,
        responseError: responseError
    };
    return service;

    function request(config) {
        if (config.method === 'POST') {
            if (!urlsSemLoading(config.url)) {
                loading.loading();
            }
            try {
                config.headers.usuario = UtilUsuario.getUsuarioSessaoJSONRequest();
            } catch (e) {
                console.log(e);
            }
        }
        return config || $q.when(config);
    }

    function response(response) {
        if (response.config &&
            response.config.method === 'POST'
            && !urlsSemLoading(response.config.url)) {
            loading.ready();
        }
        return response || $q.when(response);
    }

    function responseError(response) {
        loading.ready();
        console.log("error");
        return $q.reject(response);
    }

    function urlsSemLoading(url) {
        if (!!url) {
            if (url.toLowerCase().indexOf("combo") > -1
                || url.toLowerCase().indexOf("autocomplete") > -1) {
                return true;
            }
        }
        return false;
    }

} // end

app.config(provider);

provider.$inject = ["$httpProvider"];
function provider($httpProvider) {

    var locale = window.localStorage.getItem("LANGUAGE");
    if (!locale) {
        locale = window.localStorage.getItem("LOCALE");
        if (!locale) {
            locale = "pt_BR";
            window.localStorage.setItem("LANGUAGE", JSON.stringify(locale));
        } else {
            locale = JSON.parse(locale);
        }
    } else {
        locale = JSON.parse(locale);
    }

    $httpProvider.defaults.headers.common = {Accept: "application/json, text/plain, */*"};

    if (!$httpProvider.defaults.headers.post) {
        $httpProvider.defaults.headers.post = {};
    }
    $httpProvider.defaults.headers.post.locale = locale;

    $httpProvider.interceptors.push('httpInterceptor');
}