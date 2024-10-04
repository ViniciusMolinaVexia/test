app.directive('nxFoto', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/foto/nxFoto.html',
        restrict: 'E',
        transclude: false,
        replace: true,
        scope: true,
        link: function (scope, elem, attr) {
            scope.model = attr.ngModel;
            scope.tela = attr.tela;
        }
    };
});

app.directive('nxCamera', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/foto/nxCamera.html',
        restrict: 'E',
        transclude: false,
        replace: true,
        scope: true,
        link: function (scope, elem, attr) {
            var tela = attr.tela;
            var objeto = attr.ngModel;
            //esta variavel está ligada ao scope do controle da tela
            //deixar assim
            var scopeController = scope.$parent.$parent;
            var isArray = false;
            if (objeto && objeto.indexOf(".") > -1) {
                objeto = objeto.split(".");
                isArray = true;
            }
            //valida o ngModel
            //serve pois pode ser que não seje diretamente ligado na tela mas com o nxFoto
            //assim ele ira retroceder para achar o objeto onde deseja depositar o valor
            if (isArray) {
                var achou = false;
                do {
                    if (!scopeController[objeto[0]]) {
                        scopeController = scopeController.$parent;
                    } else {
                        achou = true;
                    }
                } while (achou === false);
            } else {
                do {
                    if (!scopeController[objeto]) {
                        scopeController = scopeController.$parent;
                    } else {
                        achou = true;
                    }
                } while (achou === false);
            }
            // variaveis
            // Opções contém as informações de configuração para o calço
            // Nos permite especificar a largura e altura do vídeo
            // Output estamos trabalhando com, a localização do swf fallback,
            // Eventos que são acionados onCapture e onSave (para o retorno)
            // E assim por diante.
            // manter do jeito que estão
            // 
            var options = {};
            options = {
                video: true,
                extern: null,
                append: true,
                width: 320,
                height: 240,
                widthFlex: 216,
                heightFlex: 200,
                mode: "callback",
                swfFile: "../Nextage_Util_Html5/componentes/foto/dist/fallback/jscam.swf",
                quality: 90,
                context: "",
                onCapture: function () {
                    window.webcam.save();
                },
                onSave: function (data) {
                    var col = data.split(";"),
                        img = image,
                        tmp = null,
                        w = this.width,
                        h = this.height;
                    for (var i = 0; i < w; i++) {
                        tmp = parseInt(col[i], 10);
                        img.data[pos + 0] = (tmp >> 16) & 0xff;
                        img.data[pos + 1] = (tmp >> 8) & 0xff;
                        img.data[pos + 2] = tmp & 0xff;
                        img.data[pos + 3] = 0xff;
                        pos += 4;
                    }
                    if (pos >= 4 * w * h) {
                        canvas.width = options.widthFlex + 100;
                        canvas.height = options.heightFlex + 100;
                        ctx.putImageData(img, 0, 0);
                        pos = 0;
                    }
                }
            };
            var idCanvas = "";
            var idUploded = "";
            if (tela) {
                idCanvas = "#" + tela + " #canvas";
                options.el = "#" + tela + " #webcam";
                idUploded = "#" + tela + " #uploadedFoto";
                options.tela = tela;
            } else {
                idCanvas = "#canvas";
                options.el = "#webcam";
                idUploded = "#uploadedFoto";
            }
            var pos = 0;
            var cam = null;
            var filter_on = false;
            var filter_id = 0;
            var canvas = $(idCanvas)[0];
            var ctx = canvas.getContext("2d");
            var img = new Image();
            ctx.clearRect(0, 0, options.width, options.height);
            var image = ctx.getImageData(0, 0, options.width, options.height);
            window.webcam = options;
            // Initialize getUserMedia with options
            window.getUserMedia(options, success, deviceError);
            function success(stream) {
                if (options.context === 'webrtc') {
                    var video = options.videoEl;
                    if ((typeof MediaStream !== "undefined" && MediaStream !== null) && stream instanceof MediaStream) {
                        if (video.mozSrcObject !== undefined) {
                            video.mozSrcObject = stream;
                        } else {
                            video.src = stream;
                        }
                        return video.play();
                    } else {
                        var vendorURL = window.URL || window.webkitURL;
                        video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
                    }
                    video.onerror = function () {
                        stream.stop();
                        streamError();
                    };
                } else {
                    // flash context
                }
            }

            function deviceError(error) {
                alert(scopeController.ResourceBundle["msg_sem_cameras_disponiveis"]);
            }

            scope.getSnapshot = function () {
                // If the current context is WebRTC/getUserMedia (something
                // passed back from the shim to avoid doing further feature
                // detection), we handle getting video/images for our canvas 
                // from our HTML5 <video> element.
                var entrou = false;
                if (options.context === 'webrtc') {
                    var video = document.getElementsByTagName('video')[0];
                    canvas.width = video.videoWidth;
                    canvas.height = 560;
                    canvas.getContext('2d').drawImage(video, 0, 0);
                    entrou = true;
                    // Otherwise, if the context is Flash, we ask the shim to
                    // directly call window.webcam, where our shim is located
                    // and ask it to capture for us.
                } else if (options.context === 'flash') {
                    window.webcam.capture();
                    changeFilter();
                    entrou = true;
                }
                else {
                }
                if (entrou) {
                    var jpegUrl = canvas.toDataURL('image/jpeg', 0.2);
                    if ($(idUploded)[0]) {
                        $(idUploded).attr('src', jpegUrl);
                    }
                    jpegUrl = jpegUrl.replace("data:image/jpeg;base64,", "");
                    if (objeto) {
                        if (isArray) {
                            if (objeto.length === 2) {
                                scopeController[objeto[0]][objeto[1]] = jpegUrl;
                            } else if (objeto.length === 3) {
                                scopeController[objeto[0]][objeto[1]][objeto[2]] = jpegUrl;
                            } else if (objeto.length === 4) {
                                scopeController[objeto[0]][objeto[1]][objeto[2]][objeto[3]] = jpegUrl;
                            } else if (objeto.length === 5) {
                                scopeController[objeto[0]][objeto[1]][objeto[2]][objeto[3]][objeto[4]] = jpegUrl;
                            }
                        } else {
                            scopeController[objeto] = jpegUrl;
                        }
                    }
                }
            };
            function changeFilter() {
                if (this.filter_on) {
                    this.filter_id = (this.filter_id + 1) & 7;
                }
            }

            scope.limparFoto = function () {
                var idCanvas = "";
                var idUploded = "";
                if (scope.tela) {
                    idCanvas = "#" + scope.tela + " #canvas";
                    idUploded = "#" + scope.tela + " #uploadedFoto";
                } else {
                    idCanvas = "#canvas";
                    idUploded = "#uploadedFoto";
                }
                if ($(idUploded)[0]) {
                    $(idUploded).attr('src', "");
                }
                if ($(idCanvas)[0]) {
                    var canvas = $(idCanvas)[0];
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                }
                if (objeto) {
                    if (isArray) {
                        if (objeto.length === 2) {
                            scopeController[objeto[0]][objeto[1]] = "";
                        } else if (objeto.length === 3) {
                            scopeController[objeto[0]][objeto[1]][objeto[2]] = "";
                        } else if (objeto.length === 4) {
                            scopeController[objeto[0]][objeto[1]][objeto[2]][objeto[3]] = "";
                        } else if (objeto.length === 5) {
                            scopeController[objeto[0]][objeto[1]][objeto[2]][objeto[3]][objeto[4]] = "";
                        }
                    } else {
                        scopeController[objeto] = "";
                    }
                }
            };
        }
    };
});

app.directive('nxUpload', function () {
    return {
        templateUrl: '../Nextage_Util_Html5/componentes/foto/nxUpload.html',
        restrict: 'E',
        transclude: false,
        replace: true,
        scope: true,
        link: function (scope, elem, attr) {
            var tela = attr.tela;
            var id = "";
            var idUploded = "";
            var idCanvas = "";
            var objeto = attr.ngModel;
            //esta variavel está ligada ao scope do controle da tela
            //deixar assim
            var scopeController = scope.$parent.$parent;
            var isArray = false;
            if (objeto && objeto.indexOf(".") > -1) {
                objeto = objeto.split(".");
                isArray = true;
            }
            //valida o ngModel
            //serve pois pode ser que não seje diretamente ligado na tela mas com o nxFoto
            //assim ele ira retroceder para achar o objeto onde deseja depositar o valor
            if (isArray) {
                var achou = false;
                do {
                    if (!scopeController[objeto[0]]) {
                        scopeController = scopeController.$parent;
                    } else {
                        achou = true;
                    }
                } while (achou === false);
            } else {
                do {
                    if (!scopeController[objeto]) {
                        scopeController = scopeController.$parent;
                    } else {
                        achou = true;
                    }
                } while (achou === false);
            }
            if (tela) {
                id = "#" + tela + " #uploadfoto";
                idUploded = "#" + tela + " #uploadedFoto";
                idCanvas = "#" + tela + " #canvas";
            } else {
                id = "#uploadfoto";
                idUploded = "#uploadedFoto";
                idCanvas = "#canvas";
            }
            function readURL(input) {

                if (input.files && input.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        var img = new Image;
                        img.src = e.target.result;
                        img.height = 200;
                        img.width = 216;
                        var jpegUrl = img.src.split(",")[1];
                        $(idUploded).attr('src', img.src);
                        if ($(idCanvas)[0]) {
                            var canvas = $(idCanvas)[0];
                            canvas.width = img.naturalWidth;
                            canvas.height = img.naturalHeight;
                            canvas.getContext('2d').drawImage(img, 0, 0);
                        }
                        if (objeto) {
                            if (isArray) {
                                if (objeto.length === 2) {
                                    scopeController[objeto[0]][objeto[1]] = jpegUrl;
                                } else if (objeto.length === 3) {
                                    scopeController[objeto[0]][objeto[1]][objeto[2]] = jpegUrl;
                                } else if (objeto.length === 4) {
                                    scopeController[objeto[0]][objeto[1]][objeto[2]][objeto[3]] = jpegUrl;
                                } else if (objeto.length === 5) {
                                    scopeController[objeto[0]][objeto[1]][objeto[2]][objeto[3]][objeto[4]] = jpegUrl;
                                }
                            } else {
                                scopeController[objeto] = jpegUrl;
                            }
                        }
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            }

            $(id).change(function () {
                readURL(this);
            });

            scope.limparFoto = function () {
                var idCanvas = "";
                var idUploded = "";
                if (scope.tela) {
                    idCanvas = "#" + scope.tela + " #canvas";
                    idUploded = "#" + scope.tela + " #uploadedFoto";
                } else {
                    idCanvas = "#canvas";
                    idUploded = "#uploadedFoto";
                }
                if ($(idUploded)[0]) {
                    $(idUploded).attr('src', "");
                }
                if ($(idCanvas)[0]) {
                    var canvas = $(idCanvas)[0];
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                }
                if (objeto) {
                    if (isArray) {
                        if (objeto.length === 2) {
                            scopeController[objeto[0]][objeto[1]] = "";
                        } else if (objeto.length === 3) {
                            scopeController[objeto[0]][objeto[1]][objeto[2]] = "";
                        } else if (objeto.length === 4) {
                            scopeController[objeto[0]][objeto[1]][objeto[2]][objeto[3]] = "";
                        } else if (objeto.length === 5) {
                            scopeController[objeto[0]][objeto[1]][objeto[2]][objeto[3]][objeto[4]] = "";
                        }
                    } else {
                        scopeController[objeto] = "";
                    }
                }
            };
        }
    };
});
//get user media
/*global navigator, document */
(function (window, document) {
    "use strict";

    window.getUserMedia = function (options, successCallback, errorCallback) {

        // Options are required
        if (options !== undefined) {

            // getUserMedia() feature detection
            navigator.getUserMedia_ = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

            if (!!navigator.getUserMedia_) {


                // constructing a getUserMedia config-object and 
                // an string (we will try both)
                var option_object = {};
                var option_string = '';
                var getUserMediaOptions, container, temp, video, ow, oh;

                option_object.video = true;
                option_string = 'video';

                container = $(options.el)[0];
                temp = document.createElement('video');

                // Fix for ratio
                ow = parseInt(container.offsetWidth, 10);
                oh = parseInt(container.offsetHeight, 10);

                if (options.width < ow && options.height < oh) {
                    options.width = ow;
                    options.height = oh;
                }

                // configure the interim video
                temp.width = options.widthFlex;
                temp.height = options.heightFlex;
                temp.autoplay = true;
                container.appendChild(temp);

                // referenced for use in your applications
                options.videoEl = temp;
                options.context = 'webrtc';

                try {
                    navigator.getUserMedia_(option_object, successCallback, errorCallback);
                } catch (e) {
                    try {
                        navigator.getUserMedia_(option_string, successCallback, errorCallback);
                    } catch (e2) {
                        return undefined;
                    }
                }
            } else {

                // Act as a plain getUserMedia shield if no fallback is required
                if (options.noFallback === undefined || options.noFallback === false) {

                    // Fallback to flash
                    var source, el, cam;

                    source = '<object id="XwebcamXobjectX" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" type="application/x-shockwave-flash" data="' + options.swfFile
                        + '" width="' + options.widthFlex
                        + '" height="' + options.heightFlex
                        + '"><param name="movie" value="' + options.swfFile
                        + '" /><param name="FlashVars" value="mode=' + options.mode
                        + '&amp;quality=' + options.quality + '" /><param name="allowScriptAccess" value="always" /></object>';
                    el = $(options.el)[0];
                    el.innerHTML = source;


                    (function register(run) {

                        if (options.tela) {
                            cam = $('#' + options.tela + ' #XwebcamXobjectX')[0];
                        } else {
                            cam = $('#XwebcamXobjectX')[0];
                        }


                        if (cam.capture !== undefined) {

                            // Simple callback methods are not allowed 
                            options.capture = function (x) {
                                try {
                                    return cam.capture(x);
                                } catch (e) {
                                }
                            };
                            options.save = function (x) {
                                try {
                                    return cam.save(x);
                                } catch (e) {

                                }
                            };
                            options.setCamera = function (x) {
                                try {
                                    return cam.setCamera(x);
                                } catch (e) {
                                }
                            };
                            options.getCameraList = function () {
                                try {
                                    return cam.getCameraList();
                                } catch (e) {
                                }
                            };

                            // options.onLoad();
                            options.context = 'flash';
                            options.onLoad = successCallback;

                        } else if (run === 0) {
                            // options.debug("error", "Flash movie not yet registered!");
                            errorCallback();
                        } else {
                            // Flash interface not ready yet 
                            window.setTimeout(register, 1000 * (6 - run), run - 1);
                        }
                    }(5));

                }

            }
        }
    };

}(this, document));
