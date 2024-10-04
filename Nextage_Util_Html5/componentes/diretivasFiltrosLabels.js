/* 
 * NextAge License
 * Copyright 2014 - Nextage
 * 
 */
app.filter("hour", function () {
    return function (input) {
        var result = "";
        input = input || "";
        var tempo = input.split(":");
        if (tempo.length >= 2) {
            for (var i = 0; i < 2; i++) {
                if (tempo[i]) {
                    if (tempo[i].length === 1) {
                        tempo[i] = 0 + tempo[i];
                    }
                    if (i === 0) {
                        result = tempo[0] + ":";
                    }
                    if (i === 1) {
                        result = result + tempo[0];
                    }
                }
            }
        }
        return result;
    };
});