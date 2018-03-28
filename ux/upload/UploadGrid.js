/**
* @class Ext.ux.upload.UploadGrid
* @author lightyear(liuyu) (lightyear416@gmail.com)
*  you can set store for upload( the data is local), if not, store will set needing url for brewser.
*   
*/
Ext.define('Ext.ux.upload.GridModel', {
    extend: 'Ext.data.Model',
    fields: [
		{ name: 'realname', type: 'string' },
		{ name: 'filename', type: 'string' },
		{ name: 'filesize', type: 'int' },
        //{ name: 'filesmallsrc', type: 'string' },
        { name: 'filesrc', type: 'string' },
        { name: 'filewidth', type: 'int' },
        { name: 'fileheight', type: 'int' },
        { name: 'attachid', type: 'int' },
        { name: 'code', type: 'string' },
        { name: 'contenttype',type:'string'}
	]
});

Ext.define('Ext.ux.upload.UploadGrid', {
    extend: 'Ext.grid.Panel',
    config: {
        storeUrl: '',
        readMode: false,
        vtype: null,
        uploadIconCls: '',
        detailIconCls: '',
        delIconCls: '',
        uploadUrl: '',
        uploadNameName: '',
        uploadFileName: ''
    },
    //hideHeaders: true,
    title:'文件',
    initComponent: function () {
        var me = this;
        //配置columns，使用readMode来隐藏不需要的项
        if (me.columns == null) {
            me.columns = [
                { text: '真实名称', dataIndex: 'realname', width: 80, hidden: true },
                { text: '文件名称', dataIndex: 'filename', flex: 1 },
                { text: '格式', dataIndex: 'contenttype', width: 60, hidden: me.readMode },
                { text: '文件大小', dataIndex: 'filesize', width: 80, hidden: me.readMode, renderer: Ext.util.Format.fileSize },
                { text: '文件宽度', dataIndex: 'filewidth', width: 80, hidden: true },
                { text: '文件高度', dataIndex: 'fileheight', width: 80, hidden: true },
                { text: '关联id', dataIndex: 'attachid', width: 30, hidden: true },
                { text: '图code', dataIndex: 'code', width: 30, hidden: true },
                { text: '文件图样', dataIndex: 'filesrc', flex: 1, align: 'center',
                    renderer: function (data, cell, record, rowIndex, columnIndex, store) {
                        return "<img height='50px' width='50px' src=" + Ext.String.insert(data, '_small', data.lastIndexOf('.')) + ">";
                    }
                }
            ];
        }

        if (me.store == null) {
            me.store = Ext.create('Ext.data.Store', {
                model: 'Ext.ux.upload.GridModel',
                proxy: {
                    type: 'ajax',
                    url: me.storeUrl,
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                },
                autoLoad: !me.readMode
            });
        }

        if (me.readMode == false) {

            var uploadAction = Ext.create('Ext.Action', {
                text: '上传文件',
                iconCls: me.uploadIconCls,
                handler: function () {
                    Ext.create('Ext.ux.upload.UploadWindow', {
                        width: 500,
                        height: 300,
                        uploadUrl: me.uploadUrl,
                        uploadNameName: me.uploadNameName,
                        uploadFileName: me.uploadFileName,
                        parentComponent: me,
                        vtype: me.vtype
                    }).show();
                }
            });

            var detailAction = Ext.create('Ext.Action', {
                text: '详情',
                disabled: true,
                iconCls: me.detailIconCls,
                handler: function () {
                    me.detailFile();
                }
            });

            var delAction = Ext.create('Ext.Action', {
                text: '删除',
                disabled: true,
                iconCls: me.delIconCls,
                handler: function () {
                    me.delFile();
                }
            });

            me.tbar = [uploadAction, detailAction, delAction];

            var contextMenu = Ext.create('Ext.menu.Menu', {
                items: [detailAction, delAction]
            });

            me.viewConfig = {
                stripeRows: true,
                listeners: {
                    'itemcontextmenu': function (view, rec, node, index, e) {
                        e.stopEvent();
                        me.getSelectionModel().select(rec);
                        contextMenu.showAt(e.getXY());
                        return false;
                    }
                }
            };

            me.getSelectionModel().on({
                selectionchange: function (sm, selections) {
                    if (selections.length) {
                        detailAction.enable();
                        delAction.enable();
                    } else {
                        detailAction.disable();
                        delAction.disable();
                    }
                }
            });
        }

        me.callParent(arguments);
    },

    delFile: function () {
        var me = this,
              rec = this.getSelectionModel().getSelection()[0];

        var win = Ext.Msg.show({
            title: '确认删除',
            msg: '确认删除文件《' + rec.get('filename') + '》吗？',
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.Msg.QUESTION,
            fn: function (btn) {
                if (btn == 'ok') {
                    me.completeDel(rec);
                    win.close();
                }
            }
        });

    },

    detailFile: function () {
        var me = this,
              rec = this.getSelectionModel().getSelection()[0];

        Ext.create('Ext.ux.upload.UploadDisplayWindow', {
            rec: rec,
            width: 260,
            height: 260
        }).show();
    },

    completeDel: function (rec) {
        //本地删除图片
        this.store.remove(rec);
    }

});