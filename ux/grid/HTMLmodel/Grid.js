/**
 * @class Ext.ux.grid.HTMLGridModel
 * @author lightyear(liuyu) (lightyear416@gmail.com)
 */
Ext.define('Ext.ux.grid.HTMLmodel.Grid', {
    config:{
        tableStyle: [],
        tableHeader: [],
        tableBrower: [],
        tableColumns: [],
        tableFooter: [],
        defaultCss: '',
        printPageSize: 20,
        justLastFooter: true
    },
    constructor: function (config) {
        var me = this;
        //Ext.apply(me, config);
        me.initConfig(config);
    },
    getTableStyle: function () {
        return this.tableStyle;
    },
    getTableHeader: function () {
        return this.tableHeader;
    },
    getTableBrower: function () {
        return this.tableBrower;
    },
    getTableColumns: function () {
        return this.tableColumns;
    },
    getTableFooter: function () {
        return this.tableFooter;
    },
    getDefaultCss: function () {
        return this.defaultCss;
    },
    getPrintPageSize: function () {
        return this.printPageSize;
    },
    setPrintPageSize: function (num) {
        this.printPageSize = num;
    },
    getJustLastFooter: function () {
        return this.justLastFooter;
    },
    setJustLastFooter: function (bool) {
        this.justLastFooter = bool;
    }
});