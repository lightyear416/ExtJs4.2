/**
 * @class Ext.ux.tree.TreeFilterTrigger
 * @author 刘渝
 * @contact  372289475@qq.com
 *
 *  Usage:
 *      Ext.define('MyTreePanel',{
 *          extend:'Ext.tree.Panel',
 *          mixins:['Ext.ux.tree.TreeFilter'],
 *          initComponent:function(){
 *                this.tbar = [
 *                      Ext.create('Ext.ux.tree.TreeFilterTrigger')
 *                ];
 *          }  
 *      });
 *
 *
 */

Ext.define('Ext.ux.form.filter.Tree', {
    extend: 'Ext.form.field.Trigger',
    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    //trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
    emptyText: '快速检索',
    config: {
        treePanel: null
    },
    cls:'icon-search',
    onTrigger1Click: function () {
        //this.reset();
        this.setValue(null);
    },
    //onTrigger2Click: function () { },
    initComponent: function () {
        var me = this;
        me.on({
            'change': me.withChange
        });
        me.callParent(arguments);
    },
    setTreePanel: function (tree) {
        me.treePanel = tree;
    },
    withChange: function (t, nv, ov) {
        var me = this;
        if (nv == null || nv == 'undefined') {
            return false;
        }
        else if (nv == '') {
            me.treePanel.clearFilter();
        }
        else {
            //alert(nv);
            me.treePanel.filterByText(nv);
        }
    }
});