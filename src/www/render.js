/**
 * Created by Bird on 27.02.15.
 */

var TACTRIS = (function (_t) {
    _t.viewer={};
    _t.viewer.showLogin = function() {
        $('#start .inside').html(' Привет! Для начала трогни одну из кнопочек<div id="uLogin" data-ulogin="display=buttons;fields=first_name,last_name;providers=vkontakte,facebook;redirect_uri=http%3A%2F%2Fbirdlab.ru%2Ftactris%2Fhtml5;callback=socialcallback"><div class="loginbutton"><img src="vk.png" data-uloginbutton="vkontakte"/></div><div class="loginbutton"><img src="facebook.png" data-uloginbutton="facebook"/></div></div>');
    }
    _t.viewer.showCriticalError = function(data) {
        $('#start .inside').html('<h1>Огорчение!</h1><p>Сервер временно не доступен. Приходите позже. Все наладится )</p><small>'+data+'</small>');
    }
    _t.viewer.showLogin();
    return _t;

}(TACTRIS || {}));


