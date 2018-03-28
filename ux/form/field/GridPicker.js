/**
 * @author lightyear(liuyu) (lightyear416@gmail.com)
 * A Picker field that contains a grid panel on its popup, enabling selection of Grid.
 */
Ext.define('Ext.ux.form.field.GridPicker', {
    extend: 'Ext.form.field.Picker',

    uses: [
        'Ext.grid.Panel'
    ],

    triggerCls: Ext.baseCSSPrefix + 'form-arrow-trigger',
    store: null,
    editable: false,

    config: {
        /**
        * @cfg {Ext.grid.Panel} gridpanel
        * A grid
        */
        grid: null,

        /**
        * @cfg {String} displayField
        * The field inside the model that will be used as the rec's display.
        */
        displayField: [],

        /**
        * @cfg {String} valueField
        * The field inside the model that will be used as the node's text.
        * Defaults to the default value of {@link Ext.form.field.comboBox}'s `valueField` configuration.
        */
        valueField: null,

        /**
        * @cfg {Boolean} selectOnTab
        * Whether the Tab key should select the currently highlighted item. Defaults to `true`.
         
        selectOnTab: true,
        */

        /**
        * @cfg {Number} maxPickerHeight
        * The maximum height of the tree dropdown. Defaults to 300.
        */
        maxPickerHeight: 300,

        /**
        * @cfg {Number} minPickerHeight
        * The minimum height of the tree dropdown. Defaults to 100.
        */
        minPickerHeight: 100,

        /**
        * @cfg {Boolean} matchFieldWidth
        * Check gridpanel's width whether to match picker's width
        */
        matchFieldWidth: false
    },

    initComponent: function () {
        var me = this;
        me.store = me.grid.getStore();

        me.callParent(arguments);

        me.addEvents(
        /**
        * @event select
        * Fires when a grid record is selected
        * @param {Ext.ux.form.GridPicker} picker        This grid picker
        * @param {Ext.data.Model} record           The selected record
        */
            'select'
        );

        me.mon(me.store, {
            scope: me,
            load: me.onLoad,
            update: me.onUpdate
        });
    },

    /**
    * Creates and returns the grid panel to be used as this field's picker.
    */
    createPicker: function () {
        var me = this;
        me.grid.shrinkWrapDock = 2;
        me.grid.floating = true;
        me.grid.minHeight = me.minPickerHeight;
        me.grid.maxHeight = me.maxPickerHeight;
        me.grid.manageHeight = false;
        me.grid.shadow = false;
        me.grid.doLayout();

        var picker = me.grid;
        picker.on('itemdblclick', me.onItemDblClick, me);

        var view = picker.getView();
        //view.getEl().on('keypress', me.onPickerKeypress, me);

        if (Ext.isIE9 && Ext.isStrict) {
            // In IE9 strict mode, the grid view grows by the height of the horizontal scroll bar when the items are highlighted or unhighlighted.
            // Also when items are collapsed or expanded the height of the view is off. Forcing a repaint fixes the problem.
            view.on({
                scope: me,
                highlightitem: me.repaintPickerView,
                unhighlightitem: me.repaintPickerView,
                afteritemexpand: me.repaintPickerView,
                afteritemcollapse: me.repaintPickerView
            });
        }
        return picker;
    },

    /**
    * repaints the grid view
    */
    repaintPickerView: function () {
        var style = this.picker.getView().getEl().dom.style;

        // can't use Element.repaint because it contains a setTimeout, which results in a flicker effect
        style.display = style.display;
    },

    /**
    * Aligns the picker to the input element
    */
    alignPicker: function () {
        var me = this,
            picker;

        if (me.isExpanded) {
            picker = me.getPicker();
            if (me.matchFieldWidth) {
                // Auto the height (it will be constrained by max height)
                picker.setWidth(me.bodyEl.getWidth());
            }
            if (picker.isFloating()) {
                me.doAlign();
            }
        }
    },

    /**
    * Handles a dblclick even on a grid record
    * @private
    * @param {Ext.grid.View} view
    * @param {Ext.data.Model} record
    * @param {HTMLElement} node
    * @param {Number} rowIndex
    * @param {Ext.EventObject} e
    */
    onItemDblClick: function (view, record, node, rowIndex, e) {
        this.selectItem(record);
    },

    /**
    * Handles a keypress event on the picker element
    * @private
    * @param {Ext.EventObject} e
    * @param {HTMLElement} el
     
    onPickerKeypress: function(e, el) {
    var key = e.getKey();

    if(key === e.ENTER || (key === e.TAB && this.selectOnTab)) {
    this.selectItem(this.picker.getSelectionModel().getSelection()[0]);
    }
    },
    */

    /**
    * Changes the selection to a given record and closes the picker
    * @private
    * @param {Ext.data.Model} record
    */
    selectItem: function (record) {
        var me = this;
        me.setValue(record.get(me.valueField));
        me.picker.hide();
        me.inputEl.focus();
        me.fireEvent('select', me, record)

    },

    /**
    * Runs when the picker is expanded.  Selects the appropriate grid record based on the value of the input element,
    * and focuses the picker so that keyboard navigation will work.
    * @private
    */
    onExpand: function () {
        var me = this,
            picker = me.picker,
            store = picker.store,
            value = me.value,
            rec;


        if (value) {
            rec = store.fineRecord(me.valueField, value);
        }

        if (rec) {
            picker.getSelectionModel().select(rec);
        }

        Ext.defer(function () {
            picker.getView().focus();
        }, 1);
    },

    /**
    * Sets the specified value into the field
    * @param {Mixed} value
    * @return {Ext.ux.form.GridPicker} this
    **/
    setValue: function (value, allStore) {
        var me = this;
        me.value = value;

        if (me.store.loading) {
            return me;
        }

        if (allStore != null) {
            allStore.load(function (records, operation, success) {
                me.completeSetValue(value, allStore);
            });
        }
        else {
            me.completeSetValue(value, me.store);
        }

    },

    completeSetValue: function (value, store) {
        var me = this,
		      rec = store.fineRecord(me.valueField, value),
              showField = '';
        if (rec) {
            Ext.Array.each(me.displayField, function (name, index, countriesItSelf) {
                showField += rec.get(name) + '-';
            });
            if (showField.length != 0) {
                showField = showField.substring(0, showField.length - 1);
            }
        }
        me.setRawValue(showField);

        return me;
    },

    /**
    * Returns the current data value of the field (the idProperty of the record)
    * @return {Number}
    */
    getValue: function () {
        return this.value;
    },

    /**
    * Handles the store's load event.
    * @private
    */
    onLoad: function () {
        var value = this.value;

        if (value) {
            this.setValue(value);
        }
    },

    onUpdate: function (store, rec, type, modifiedFieldNames) {
        if (this.displayField.length != 1) {
            return rec;
        }
        var display = this.displayField[0],
			value = this.valueField;

        if (type === 'edit' && modifiedFieldNames && Ext.Array.contains(modifiedFieldNames, display) && this.value === rec.get(value)) {
            this.setRawValue(rec.get(display));
        }
    }

});

