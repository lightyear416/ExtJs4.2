/*
 * author 程羽
 * @usage:
 *  new Ext.ux.util.StringFormat().format('xxx{id}/{name}',{id:'a',name:'b'});
 *  new Ext.ux.util.StringFormat().format('xxx{0}/{1}',['a','b']);
 *  new Ext.ux.util.StringFormat().format('xxx{0}/{1}','a','b');
 * @params String
 * @params String/Object/Array
 * @params String....
 * @return [string] 'xxxa/b'
 */
Ext.define('Ext.ux.util.StringFormat', {
    format: function (format) {
        var formatRe = /\{([0-9a-zA-Z]+)\}/g,
            args = Ext.Array.toArray(arguments, 1),
            args1 = (args.length === 1) ? args[0] :args,
            isString ;
        isString = Object.prototype.toString.call(args1) === '[object String]';
        args1 = isString ? [args1] : args1 ? args1 : {};
        //now args1 is arr or obj
        return format.replace(formatRe, function (m, name) {
            return args1[name] || '';
        });
    }

});