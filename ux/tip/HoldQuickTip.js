/**
* @class Ext.ux.tip.HoldQuickTip
* @author lightyear(liuyu) (lightyear416@gmail.com)
*
* Usage:
*
* 1 - Add Ext.Require
*   'Ext.ux.tip.HoldQuickTip',
* ]);
* 
* 2 - Need the form.field 
* If you want change style of show of tip
* you can declare the field and this tip in the same container	 
* 
* 3 - surveil!
* var field = Ext.create('Ext.form.field.Text');
* var tip = Ext.create('Ext.ux.tip.HoldQuickTip',{
*           surveilField:field
*           });
* var c = Ext.create('Ext.container.Container',{
*         items:[field,tip]
*         });
*/

Ext.define('Ext.ux.tip.HoldQuickTip', {
    alias: 'widget.holdquicktip',
    extend: 'Ext.Component',
    requires: ['Ext.form.field.*', 'Ext.XTemplate', 'Ext.tip.*'],

    config: {
        width: 0,
        validText: '',
        invalidText: '',
        invalidCls: Ext.baseCSSPrefix + 'form-invalid-icon',
        validCls: Ext.baseCSSPrefix + 'dd-drop-icon',
        baseCls: 'form-error-state',
        surveilField: null
    },

    tipTpl: Ext.create('Ext.XTemplate', '<ul class="' + Ext.plainListCls + '"><tpl for="."><li><span class="field-name">{name}</span>: <span class="error">{error}</span></li></tpl></ul>'),

    initComponent: function () {
        var me = this;
        me.callParent(arguments);

        me.surveilField.msgTarget = 'none';
        //me.surveilField.invalidCls = '';


        me.on('afterrender', function () {
            me.mon(me.surveilField, {
                scope: me,
                errorchange: me.onErrorChange,
                validitychange: me.onValidityChange
            });

            me.mon(me.surveilField.getEl(), {
                scope: me,
                click: me.onMouseOver
            });

            me.mon(me.getEl(), {
                scope: me,
                mouseover: me.onMouseOver
            });

            me.mon(me.surveilField, {
                scope: me,
                destroy: me.onDestory
            });

            me.mon(me.getTip(), {
                scope: me,
                show: me.onShow,
                hide: me.onHide
            });
        });
    },

    getTip: function () {
        var tip = this.tip;
        if (!tip) {
            tip = this.tip = Ext.widget('tooltip', {
                target: this.el,
                title: '规范提示:',
                minWidth: 200,
                autoHide: false,
                anchor: 'left',
                mouseOffset: [-6, -5],
                closable: true,
                constrainPosition: true,
                cls: 'errors-tip'
            });
            //tip.show();
        }
        return tip;
    },

    setErrors: function (errors) {
        var me = this,
			tip = me.getTip();
        errors = Ext.Array.from(errors);
        // Update CSS class and tooltip content
        if (errors.length) {
            me.addCls(me.invalidCls);
            me.removeCls(me.validCls);
            me.update(me.invalidText);
            me.setMargin('4 0 0 5');
            tip.setDisabled(false);
            tip.update(me.tipTpl.apply(errors));
            tip.show();
        } else {
            me.addCls(me.validCls);
            me.removeCls(me.invalidCls);
            me.update(me.validText);
            me.setMargin('4 0 0 5');
            tip.setDisabled(true);
            tip.hide();
        }
    },

    updateErrors: function (field) {
        var me = this, errors;
        if (field.hasBeenDirty || field.isDirty()) {
            errors = [];
            Ext.Array.forEach(field.getErrors(), function (error) {
                errors.push({ name: field.getFieldLabel(), error: error });
            });
        }
        me.setErrors(errors);
        field.hasBeenDirty = true;
    },

    onErrorChange: function (field, error) {
        this.updateErrors(field);
    },

    onValidityChange: function (field, isValid) {
        this.updateErrors(field);
    },

    onMouseOver: function () {
        this.updateErrors(this.surveilField);
    },

    onDestory: function (field) {
        this.tip.close();
    },

    onShow: function () {
        this.setWidth(25);
    },

    onHide: function () {
        this.setWidth(0);
    }
});