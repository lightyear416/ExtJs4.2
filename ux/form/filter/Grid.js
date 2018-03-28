/**
 * @class Ext.ux.grid.GridFilterTrigger
 * @author 刘渝
 * @contact  372289475@qq.com
 *
 *
 *
 */

Ext.define('Ext.ux.form.filter.Grid', {
    extend: 'Ext.form.field.Trigger',
    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    //trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',
    config: {
        gridPanel: null,
        emptyText: '',
        valueField: [],
        displayField: []
    },
    tempValue: '',
    cls: 'icon-search',
    onTrigger1Click: function () {
        this.setValue('');
    },
    //onTrigger2Click: function () { },
    initComponent: function () {
        var me = this;
        if (me.gridPanel == null || me.valueField.length == 0 || me.displayField.length == 0 || me.valueField.length != me.displayField.length) {
            return false;
        }

        var tempEmptyText = '';
        if (me.emptyText == '') {
            Ext.Array.each(me.displayField, function (name, index, countriesItSelf) {
                tempEmptyText += '(' + name + ')';
            });
            me.emptyText = tempEmptyText + '本页搜索';
        }

        Ext.Array.each(me.valueField, function (name, index, countriesItSelf) {
            //me.tempValue += 'rec.get("' + name + '")==nv';
            me.tempValue += 'new RegExp(nv).test(rec.get("' + name + '"))';
            if (index != me.valueField.length-1) {
                me.tempValue += '||';
            }
        });

        me.callParent(arguments);
        me.on({
            'change': me.WithChange
        });
    },

    WithChange: function (trigger, nv, ov) {
        var me = this;
        if (nv == null || nv == 'undefined') {

        }
        else if (nv == '') {
            me.gridPanel.getStore().clearFilter();
        }
        else {
            me.gridPanel.getStore().filterBy(function (rec) {
                //console.log(nv);
                console.log(me.tempValue)
                return eval(me.tempValue);
            });
        }
     
    }
});