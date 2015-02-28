/**
 * Created by Bird on 27.02.15.
 */
var ulogintoken;


var TACTRIS = (function(_t) {

    $(document).ready(function() {

        _t.client = (function() {
            var client = {};
            client.uilogintoken = 'asdfasdf';
            client.socket = io();
            client.socket.on('connect', function(data) {
                console.log('connection ok');
            });
            client.socket.on('connect_error', function(data) {
                console.log(data);
                _t.viewer.showCriticalError(data);
            });
            client.login = function(token) {
                console.log('sending' + token);
                tactris.client.socket.emit('login', {t: token}, function(data) {
                    console.log(data);
                });
            };

            return client;
        }());


    });
    return _t;

}(TACTRIS || {}));


socialcallback = function(token) {
    tactris.client.login(token);
    $.getJSON("//ulogin.ru/token.php?host=" + encodeURIComponent(location.toString()) + "&token=" + token + "&callback=?",
        function(data) {
            console.log(data);

        });
}