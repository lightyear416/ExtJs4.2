/**
 * @class Ext.ux.grid.PagingGrid
 * @author lightyear(liuyu) (lightyear416@gmail.com)
 *
 *  htmlContents:Ext.create('Ext.ux.grid.HTMLGridModel')
 *
 */
Ext.define('Ext.ux.grid.PagingGrid', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.ux.toolbar.PageSizePlugin',
        'Ext.ux.toolbar.ProgressBarPager',
        'Ext.toolbar.*',
        'Ext.button.*'
    ],
    uses: ['Ext.ux.Printer'],

    config: {
        pageSize: 20,
        htmlContents: null,
        isLastFooter: false,
        hiddenPrinter: true,
        hiddenExporter: true,
        /*
         * @property selfPage
		 * @type Ext.data.Store
		 * if print all data,set the printStore;
		 * (defaults to null)
         */
        printStore: null
    },

    maxPagePrintSize: 30,

    initComponent: function () {
        var me = this;
        if (me.store) {
            this.bbar = Ext.create('Ext.toolbar.Paging', {
                pageSize: me.pageSize,
                store: me.store,
                enableOverflow: true,
                listeners: {
                    'overflowchange': function (lhc, hc, iA) {
                        if (hc == null || hc == 'undefined' || hc == '') { return; }
                        else if (hc == 0) { alert(hc); }
                        else {
                            this.getEl().child('a').setStyle('margin', '0px 8px 0px 0px');
                        }
                    }
                },
                displayInfo: true,
                items: ['-', {
                    xtype: 'button',
                    text:'打印',
                    //iconCls: 'btn-printer',
                    iconCls: 'fa fa-print icon-blue',
                    hidden: me.hiddenPrinter,
                    tooltip: '打印',
                    menu: [{
                        text: '打印本页',
                        //iconCls: 'btn-excel-single'
                        iconCls: 'fa fa-angle-right icon-blue',
                        handler: function () {
                            Ext.create('Ext.ux.Printer', {
                                ctype:'grid'
                            }).Grid(me);
                        }
                    }, {
                        text: '打印所有页',
                        //iconCls: 'btn-excel-multi'
                        iconCls: 'fa fa-angle-double-right icon-blue',
                        handler: function () {
                            Ext.create('Ext.ux.Printer', {
                                ctype:'grid',
                                printStore: me.printStore,
                                selfPage: false
                            }).Grid(me);
                        }
                    }]
                }, {
                    xtype: 'button',
                    text: '导出Excel',
                    //iconCls: 'btn-excel-exporter',
                    iconCls: 'fa fa-file-excel-o icon-blue',
                    hidden: me.hiddenExporter,
                    tooltip: '导出到' + '<font style="color:red">Excel</font>',
                    menu: [{
                        text: '导出本页',
                        //iconCls: 'btn-excel-single'
                        iconCls: 'fa fa-angle-right icon-blue',
                    }, {
                        text: '导出所有页',
                        //iconCls: 'btn-excel-multi'
                        iconCls: 'fa fa-angle-double-right icon-blue',
                    }]
                }],
                plugins: [Ext.create('Ext.ux.toolbar.ProgressBarPager', {}), Ext.create('Ext.ux.toolbar.PageSizePlugin')]
            });
        }
        me.callParent(arguments);
    }
});