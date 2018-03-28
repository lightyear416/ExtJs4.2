Ext.define('Ext.ux.tree.StaticTreePanel', {
    extend: 'Ext.tree.Panel',
    mixins: ['Ext.ux.util.TreeFilter'],
    config: {
        contentStore: null
    },
    treeContent: '',
    contextMenu: null,
    refreshAction: null,
    filterTrigger: null,
    isStaticTreePanel: true,
    initComponent: function () {
        var me = this;

        me.refreshAction = Ext.create('Ext.Action', {
            tooltip: '刷新',
            iconCls: 'fa fa-repeat icon-blue',
            handler: function () {
                me.refreshTree();
            }
        });
        me.filterTrigger = Ext.create('Ext.ux.form.filter.Tree', {
            treePanel: me
        });
        me.tbar = Ext.create('Ext.ux.toolbar.OverflowToolbar', {
            itemId: 'tree-toolbar',
            items: [
                me.refreshAction,
                '->',
                me.filterTrigger
            ]
        });

        me.contextMenu = Ext.create('Ext.menu.Menu', {
            items: [me.refreshAction]
        });

        me.on({
            scope: me,
            //'itemcontextmenu': me.onItemContextMenu
        });

        me.mon(me.contentStore, {
            scope: me,
            'load': me.onLoad
        });
        me.refreshTree();
        me.callParent(arguments);

    },


    getContentStore: function () {
        return this.contentStore;
    },

    getContextMenu: function () {
        return this.contextMenu;
    },

    onItemContextMenu: function (view, record, item, index, event) {
        event.preventDefault();
        event.stopEvent();
        this.contextMenu.add(this.refreshAction);
        this.contextMenu.showAt(event.getXY());
    },

    onLoad: function (store, records, successful, eOpts) {

        this.treeContent = (records && records[0]) ? records[0].data : {};
        //this.treeContent.text = this.rootName;
        this.treeContent.text = (records && records[0]) && records[0].raw.text
        this.getStore().setRootNode(this.treeContent);  
        
        this.getView().refresh();
    },

    refreshTree: function () {
        var me = this;
        me.filterTrigger.setValue('');
        me.contentStore.load();
    }
});