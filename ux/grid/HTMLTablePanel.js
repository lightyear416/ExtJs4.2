/**
 * @class Ext.ux.grid.HTMLTablePanel
 * @author lightyear(liuyu) (lightyear416@gmail.com)
 *
 * htmlContents:Ext.create('Ext.ux.grid.HTMLmodel.Table')
 *
 */
Ext.define('Ext.ux.grid.HTMLTablePanel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.data.*',
        'Ext.Template',
        'Ext.toolbar.*',
        'Ext.button.*'
    ],
    uses:'Ext.ux.Printer',

    config: {
        store: null,
        autoLoadHTML: false,
        htmlContents: null,
        tbarItemId: "tbarId"
    },
    HTMLTableId: 'lightyearhtmltable',
    orgHTMLStyle: '',
    orgHTMLContent: '',
    html: '',
    bodyHTMLTableId: '',


    initComponent: function () {
        var me = this;
        me.orgHTMLContent = me.htmlContents.getTableContent();
        me.orgHTMLStyle = me.htmlContents.getTableStyle();

        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            itemId: me.tbarItemId,
            items: [{
                xtype: 'button',
                text: '打印',
                iconCls: 'btn-printer',
                handler: function () {
                    Ext.create('Ext.ux.Printer', {
                        ctype: 'table',
                        component:me
                    }).Print();
                }
            }, {
                xtype: 'button',
                text: '导出',
                iconCls: 'btn-excel-single',
                handler: function () {

                }
            }]
        });

        me.html = "<div id=" + me.HTMLTableId + "></div>";
        me.callParent(arguments);

        me.on('afterrender', function () {
            me.bodyHTMLTableId = Ext.get(me.HTMLTableId).parent().id;
            Ext.get(me.HTMLTableId).remove();
            if (me.autoLoadHTML === true) {
                me.loadHTML();
            }
        });
    },

    setStore: function (sto) {
        this.store = sto;
    },

    setHTMLStyle: function (sty) {
        this.orgHTMLStyle = sty;
    },

    setHTMLContent: function (con) {
        this.orgHTMLContent = con;
    },

    getStore: function () {
        return this.store;
    },

    setStoreUrl: function (url) {
        this.store.proxy.url = url;
    },

    loadHTML: function () {
        var me = this;
        me.store.load({
            scope: this,
            callback: function (records, operation, success) {
                var styles = Ext.create('Ext.Template', me.orgHTMLStyle).apply();
                var contents = Ext.create('Ext.Template', me.orgHTMLContent).apply(records[0].data);
                var temp = new Ext.Template(styles + contents);
                temp.compile();
                temp.overwrite(Ext.get(me.bodyHTMLTableId));
            }
        });
    }

});