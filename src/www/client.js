/**
 * Created by Bird on 27.02.15.
 */
$(document).ready(function() {
    var tactris = {
        Client: function() {
        }
    };
    tactris.Client.prototype.socket = io();

    tactris.Client.prototype.socket.on('connect', function(data) {
        console.log('connection ok');
    });
});



socialcallback = function(token) {
    $.getJSON("//ulogin.ru/token.php?host=" + encodeURIComponent(location.toString()) + "&token=" + token + "&callback=?",
        function(data) {
            data = $.parseJSON(data.toString());
            if (!data.error) {
                console.log(data);
            }
        });
}