/**
* @class Ext.ux.toolbar.OverflowToolbar
* @author lightyear(liuyu) (lightyear416@gmail.com)
*
*/
Ext.define("Ext.ux.toolbar.OverflowToolbar", {
    alias: 'widget.overflowtoolbar',
    extend: 'Ext.toolbar.Toolbar',
    enableOverflow: true,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);

        me.on('overflowchange', function (lhc, hc, iA) {
            if (hc == null || hc == 'undefined' || hc == '') { return; }
            else if (hc == 0) { alert(hc); }
            else {
                this.getEl().child('a').setStyle('margin', '0px 8px 0px 0px');
            }
        });
    }
});