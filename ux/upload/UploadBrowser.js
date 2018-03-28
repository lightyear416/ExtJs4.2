/**
* @class Ext.ux.upload.UploadBrowser
* @author lightyear(liuyu) (lightyear416@gmail.com)
*
*/

Ext.define('Ext.ux.upload.UploadBrowser', {
    extend: 'Ext.panel.Panel',
    config: {
        grid: null
    },
    layout: 'border',
    bodyStyle: {
        background: '#fff'
    },
    initComponent: function () {
        var me = this;

        me.grid.setWidth(300);
        me.grid.setMargin('0 5 0 0');
        
        var imgPanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            layout: 'fit',
            margin: '0 0 0 0',
            title: '文件展示',
            frame:true
        });

        me.items = [me.grid, imgPanel];

        me.callParent(arguments);

        me.grid.on({
            selectionchange: function (sm, selections) {
                imgPanel.removeAll();
                if (selections.length) {
                    imgPanel.add(Ext.create('Ext.ux.IFrame', {
                        src: 'Js/ExtJs/ux/upload/photoshow.htm?filesrc=' + selections[0].get('filesrc') + '&width=' + selections[0].get('filewidth') + '&height=' + selections[0].get('fileheight')
                    }));
                }
            }
        });
    }
});