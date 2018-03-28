/**
* @class Ext.ux.container.ClickPanel
* @author lightyear(liuyu) (lightyear416@gmail.com)
*
*/

Ext.define('Ext.ux.container.ClickPanel', {
    alias: 'widget.clickpanel',
    extend: 'Ext.panel.Panel',
    initComponent: function () {
        this.callParent();
        this.addEvents("click");
    },
    onRender: function (ct, position) {
        this.callParent(arguments);
        this.body.on("click", this.onClick, this);
    },
    onClick: function (e) {
        this.fireEvent("click", e);
    }
});