/**
* @class Ext.ux.ClkTipPanel
* @author lightyear(liuyu) (lightyear416@gmail.com)
*
*/

Ext.define('Ext.ux.ClickComponent', {
    extend: 'Ext.Component',
    initComponent: function () {
        this.callParent();
        this.addEvents("click");
    },
    onRender: function (ct, position) {
        this.callParent(arguments);
        ct.on("click", this.onClick, this);
    },
    onClick: function (e) {
        this.fireEvent("click", e);
    }
});