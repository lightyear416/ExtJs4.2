/**
* @class Ext.ux.util.ObjConvert
* @author lightyear(liuyu) (lightyear416@gmail.com)
* 
* If you need to sumbit batch data to back, you can use Rec2JSON
*
* Usage:
*
* Add Ext.Require
*   'Ext.ux.util.ObjConvert',
 * ]);
 * 
*/
Ext.define("Ext.ux.util.ObjConvert", {
    requires: 'Ext.JSON.encode',
    
    Rec2JSON: function (recs) {
        if (recs == null) {
            return null;
        }
        var length = recs.length;
        if (length === 0) {
            return "[]";
        }
        else {
            var jstring = "[";
            Ext.Array.each(recs, function (name, index, countriesItSelf) {
                jstring = jstring + Ext.JSON.encode(recs[index].data);
                if (index != length - 1) {
                    jstring = jstring + ",";
                }
            });
            jstring = jstring + "]";
            return jstring;
        }
    }
});