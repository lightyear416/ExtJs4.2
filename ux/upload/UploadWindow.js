/**
* @class Ext.ux.upload.UploadWindow
* @author lightyear(liuyu) (lightyear416@gmail.com)
*
*/
Ext.define('Ext.ux.upload.UploadWindow', {
    extend: 'Ext.ux.window.CloseQueryWindow',
    title: '上传',
    fileInfo: null,
    config: {
        vtype: null,
        width: 500,
        height: 300,
        uploadUrl: '',
        uploadNameName: '',
        uploadFileName: '',
        parentComponent: null
    },
    buttonAlign: 'center',
    //layout: 'fit',
    layout: 'anchor',
    initComponent: function () {
        var me = this;
        var fileNameField = Ext.create('Ext.form.field.Text', {
            fieldLabel: '上传名称',
            emptyText: '不包括后缀的文件名称（空则默认所选文件名称）',
            //flex: 1,
            labelWidth: 70,
            name: me.uploadNameName
        });
        var fileNameTip = Ext.create('Ext.ux.tip.HoldQuickTip', {
            surveilField: fileNameField
        });
        var fileField = Ext.create('Ext.form.field.File', {
            fieldLabel: '上传文件',
            emptyText: '点击右边的按钮选择文件',
            //flex: 1,
            vtype: me.vtype,
            labelWidth: 70,
            name: me.uploadFileName,
            columnWidth: 0.9,
            buttonText: '&ensp;选择 ',
            buttonConfig: {
                iconCls: 'upload-icon fa fa-upload icon-white'
            }
        });
        var fileTip = Ext.create('Ext.ux.tip.HoldQuickTip', {
            surveilField: fileField,
            columnWidth: 0.08
        });

        me.items = [{
            itemId: 'file-form',
            xtype: 'form',
            url: me.uploadUrl,
            //layout: 'anchor',
            anchor: '100%',
            layout: 'hbox',
            margin: '10 10 10 10',
            defaults: {
                type: 'container',
                flex: 1,
                layout: 'column'
            },
            defaultType: 'container',
            items: [
                //{
                //    itemId: 'file-name-container',
                //    items: [fileNameField, fileNameTip]
                //},
                {
                    itemId: 'file-container',
                    items: [fileField, fileTip]
                }
            ]
        }];

        me.buttons = [{
            text: '上传',
            iconCls: 'fa fa-cloud-upload icon-white',
            handler: function () {
                me.completeUpload(me.down('form').getForm());
            }
        }, {
            text: '重置',
            iconCls: 'fa fa-refresh icon-white',
            handler: function () {
                me.down('form').getForm().reset();
            }
        }, {
            text: '退出',
            iconCls: 'fa fa-sign-out icon-white',
            handler: function () {
                me.close();
            }
        }];

        me.callParent(arguments);
    },

    completeUpload: function (form) {
        var me = this;
        if (form.isValid()) {
            form.submit({
                url: me.uploadUrl,
                success: function (form, action) { 
                    Ext.TopTip.msg('操作提示', '上传成功');
                    console.log(action.result)
                    me.fileInfo = action.result.item;
                    me.parentRefresh();
                    me.directClose()
                },
                failure: function (form, action) {
                    console.log(action)
                    Ext.Msg.alert('上传失败', Ext.create('CRSI.data.err', {
                        errList:action.result.error
                    }).msg);
                }
            });
        }
    },

    parentRefresh: function () {
        var me = this,
            component = me.parentComponent;
        if (component == null) {
            return false;
        }
        if (component.isXType('grid')) {
            me.gridRefresh(component);
        }
        else {
            return false;
        }
    },

    gridRefresh: function (grid) {
        var me = this;
        //这里要根据返回的信息me.fileInfo组成rec insert到store中
        var rec = Ext.create('Ext.ux.upload.GridModel', {
            realname: me.fileInfo.realname,
            filename: me.fileInfo.filename,
            filesize: me.fileInfo.filesize,
            //filesrc:Ext.create('CRSI.data.url').FileServer + me.fileInfo.filesrc,
            filesrc: me.fileInfo.filesrc,
            //filesmallsrc:Ext.String.insert(me.fileInfo.filesrc, '_small', me.fileInfo.filesrc.lastIndexOf('.')),
            //filesmallsrc: Ext.create('CRSI.data.url').FileServer+Ext.String.insert(me.fileInfo.filesrc, '_small', me.fileInfo.filesrc.lastIndexOf('.')),
            contenttype: me.fileInfo.contenttype,
            filewidth: me.fileInfo.filewidth,
            fileheight: me.fileInfo.fileheight,
            code: me.fileInfo.code,
            attachid:me.fileInfo.attachid
        });
        
        grid.getStore().insert(0, rec);
    }
});