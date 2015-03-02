/**
 * Created by Bird on 27.02.15.
 */
var ulogintoken;


var TACTRIS = (function(_t) {

    $(document).ready(function() {

        _t.viewer = (function() {

            var viewer = {};
            viewer.showLogin = function() {
                $('#start .inside').html(' Привет! Для начала трогни одну из кнопочек<div id="uLogin" data-ulogin="display=buttons;fields=first_name,last_name;providers=vkontakte,facebook;redirect_uri=http%3A%2F%2Fbirdlab.ru%2Ftactris%2Fhtml5;callback=login"><div class="loginbutton"><img src="vk.png" data-uloginbutton="vkontakte"/></div><div class="loginbutton"><img src="facebook.png" data-uloginbutton="facebook"/></div></div>');
            }
            viewer.showError = function(data) {
                $('#start .inside').html('<h1>Огорчение!</h1><p>Сервер временно не доступен. Приходите позже. Все наладится )</p><small>' + data + '</small>');
            }
            viewer.showGreating = function(data) {
                $('#start .inside').html('<h1>Привет, ' + data.name + '!</h1>');
            }
            viewer.showProgress = function(message) {

                $('#start .inside').html(message);
            }

            return viewer;
        }());

        _t.client = (function() {
            var socket = io();

            socket.on('connect', function(data) {
                _t.viewer.showLogin(data);
            });
            socket.on('connect_error', function(data) {
                console.log(data);
                _t.viewer.showError(data);
            });


            var client = {};


            client.login = function(token) {
                _t.viewer.showProgress('Авторизуем...');
                socket.emit('login', {t: token}, function(data) {
                    console.log(data);
                });
            };

            return client;
        }());

    });

    return _t;

}(TACTRIS || {}));

function login(token){
    TACTRIS.client.login(token);
}