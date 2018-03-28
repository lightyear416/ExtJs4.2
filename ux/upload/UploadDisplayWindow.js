/**
* @class Ext.ux.upload.UploadDisplayWindow
* @author lightyear(liuyu) (lightyear416@gmail.com)
*
*/
Ext.define('Ext.ux.upload.UploadDisplayWindow', {
    extend: 'Ext.window.Window',
    title: '文件信息展示',
    config: {
        rec: null
    },
    buttonAlign: 'center',
    layout: 'fit',
    initComponent: function () {
        var me = this;
        var fileNameField = Ext.create('Ext.form.field.Display', {
            fieldLabel: '文件名称',
            flex: 4,
            labelWidth: 70,
            value: me.rec.get('filename'),
            name: 'filename'
        });

        var fileSizeField = Ext.create('Ext.form.field.Display', {
            fieldLabel: '文件大小',
            emptyText: '点击右边的按钮选择文件',
            flex: 1,
            vtype: me.vtype,
            labelWidth: 70,
            value: Ext.util.Format.fileSize(me.rec.get('filesize')),
            name: 'filesize'
        });

        var filePhoto = Ext.create('Ext.Img', {
            src:me.rec.get('filesrc'),
            width:200,
            height:200
        });

        me.items = [{
            itemId: 'file-form',
            xtype: 'form',
            layout: 'anchor',
            defaults: {
                anchor: '95%',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                margin: '10 10 10 10'
            },
            defaultType: 'container',
            items: [{
                itemId: 'file-info-container',
                items: [fileNameField, fileSizeField]
            }, {
                itemId: 'file-photo-container',
                layout: {
                    type:'hbox',
                    align:'center'
                },
                items: [filePhoto]
            }]
        }];

        me.buttons = [{
            text: '退出',
            iconCls: 'fa fa-sign-out icon-white',
            handler: function () {
                me.close();
            }
        }];

        me.callParent(arguments);
    }

});