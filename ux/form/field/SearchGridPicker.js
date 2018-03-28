Ext.define('Ext.ux.form.field.SearchGridPicker', {
    extend: 'Ext.form.field.Picker',

    triggerCls: Ext.baseCSSPrefix + 'form-search-trigger',
    editable: true,
    config: {
        /**
        * @cfg {Ext.grid.Panel} or component contained panel
        * A grid
        */
        comp: null,
        /**
        * @cfg {displayField} 
        * the name refill to raw 
        */
        dispayField: '',
        /**
        * @cfg {Number} maxPickerHeight
        * The maximum height of the grid dropdown. Defaults to 300.
        */
        maxPickerHeight: 300,

        /**
        * @cfg {Number} minPickerHeight
        * The minimum height of the grid dropdown. Defaults to 100.
        */
        minPickerHeight: 100,

        /**
        * @cfg {Boolean} matchFieldWidth
        * Check gridpanel's width whether to match picker's width
        */
        matchFieldWidth: false
    },
    grid: null,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);

        Ext.override(me, {
            onTriggerClick: function () {
                var me = this;
                if (!me.readOnly && !me.disabled) {
                    if (me.isExpanded) {
                        me.loadGrid();
                    } else {
                        me.expand();
                    }
                   // me.inputEl.focus();
                }
            }
        });
    },

    /**
	* Creates and returns the grid panel to be used as this field's picker.
	*/
    createPicker: function () {
        var me = this;
        me.comp.shrinkWrapDock = 2;
        me.comp.floating = true;
        me.comp.minHeight = me.minPickerHeight;
        me.comp.maxHeight = me.maxPickerHeight;
        me.comp.manageHeight = false;
        me.comp.shadow = false;
        me.comp.doLayout();

        var picker = me.comp;
        if (picker.getXType() == 'grid') {
            me.grid = me.comp;
        }
        else {
            me.grid = me.comp.down('grid');
        }
        me.grid.on('itemdblclick', me.onItemDblClick, me);

        var view = me.grid.getView();
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
        var style = this.grid.getView().getEl().dom.style;

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
    **/
    onPickerKeypress: function (e, el) {
        var key = e.getKey();

        if (key === e.ENTER || (key === e.TAB && this.selectOnTab)) {
            this.selectItem(this.grid.getSelectionModel().getSelection()[0]);
        }
    },

    /**
    * Changes the selection to a given record and closes the picker
    * @private
    * @param {Ext.data.Model} record
    */
    selectItem: function (record) {
        var me = this;
        if (me.displayField != '') {
            me.setRawValue(record.get(me.displayField));
        }
        me.collapse();
        me.inputEl.focus();
    },

    /**
    * Runs when the picker is expanded.  Selects the appropriate grid record based on the value of the input element,
    * and focuses the picker so that keyboard navigation will work.
    * @private
    */
    onExpand: function () {

        var me = this;
        //var picker = me.picker;
        me.loadGrid();

        Ext.defer(function () {
            me.grid.getView().focus();
        }, 1);
    },

    loadGrid: function () {
        var me = this;
        var grid = me.grid;
        var params = me.getRawValue();
        //var paramsObj = {};

        if (grid.resetStore) {
            grid.resetStore(params);
        }
    }

});