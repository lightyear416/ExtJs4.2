/**
 * @class Ext.ux.grid.HTMLTableModel
 * @author lightyear(liuyu) (lightyear416@gmail.com)
 */
Ext.define("Ext.ux.grid.HTMLModel.Table", {
    tableStyle: [],
    tableContent: [],
    defaultCss: '',
    getTableStyle: function () {
        return this.tableStyle;
    },
    getTableContent: function () {
        return this.tableContent;
    },
    getDefaultCss: function () {
        return this.defaultCss;
    }
});