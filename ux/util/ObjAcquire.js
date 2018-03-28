/**
* @class Ext.ux.util.ObjAcquire
* @author lightyear(liuyu) (lightyear416@gmail.com)
* 
* If you need to acquire param value of name in url, you can use getUrlParam
*
* Usage:
*
* Add Ext.Require
*   'Ext.ux.util.ObjAcquire',
 * ]);
 * 
*/
Ext.define("Ext.ux.util.ObjAcquire", {

    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
});