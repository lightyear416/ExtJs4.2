/**
*  @author:lightyear(liuyu)
*  @email: lightyear416@gmail.com
*  Query when you close window
*/
Ext.define('Ext.ux.window.CloseQueryWindow', {
    extend: 'Ext.window.Window',

    initComponent: function () {
        var me = this;
        me.callParent();
    },

    directClose: function () {
        var me = this;
        me.doClose();
    },

    close: function () {
        var me = this;

        if (me.fireEvent('beforeclose', me) !== false) {
            Ext.MessageBox.show({
                title: '退出询问',
                msg: '你确定放弃当前操作吗?',
                buttons: Ext.MessageBox.YESNO,

                fn: function (btn) {
                    if (btn == 'yes') {
                        me.doClose();
                    }
                },
                icon: Ext.MessageBox.QUESTION
            });
        }
    }

});