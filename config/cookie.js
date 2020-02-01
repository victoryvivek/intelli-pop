const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM();


exports.setCookie =function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    dom.window.document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

exports.getCookie= function (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(dom.window.document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

exports.deleteCookie =function (cname) {
    var d = new Date();
    cvalue=false;
    // d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    dom.window.document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
