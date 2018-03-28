/**
* @class Ext.ux.printer.HTMLGridPrinter
* @author lightyear(liuyu) (lightyear416@gmail.com)
*
* Usage:
*
* 1 - Add Ext.Require
*   'Ext.ux.printer.HTMLGridPrinter',
 * ]);
 * 
 * 2 - Declare the Grid 
 * var grid = Ext.create('Ext.grid.Panel', {
 *   columns: //some column model,
 *   store   : //some store,
 *   htmlContents: Ext.create('Ext.ux.grid.HTMLGridModel')
 * });
 * 
 * 3 - Print!
 * Ext.ux.printer.HTMLGridPrinter.print(grid);
 * 
*/
Ext.define("Ext.ux.printer.HTMLGridPrinter", {
    requires: [
		'Ext.XTemplate',
		'Ext.Template'
	],
    statics: {
        print: function (grid) {
            var columns, data = [];
            //ready column of grid show data
            if (this.showHiddenColumn == false) {
                var orgcolumns = grid.columns;
                columns = new Array();
                var j = 0;
                for (var i = 0; i < orgcolumns.length; i++) {
                    if (orgcolumns[i].hidden == true) {
                        continue;
                    }
                    else {
                        columns[j] = orgcolumns[i];
                        j++;
                    }
                }
            }
            else {
                columns = grid.columns;
            }
            //ready store data
            grid.store.data.each(function (item, row) {
                var convertedData = [];
                var meta = new Object({ "tdCls": "", "item": "", "style": "", "tdAttr": "" });
                //apply renderers from column model
                for (var key in item.data) {
                    var value = item.data[key];

                    Ext.each(columns, function (column, col) {
                        if (column.dataIndex == key) {
                            try {
                                convertedData[key] = column.renderer ? column.renderer.call(grid, value, meta, item, row, col, grid.store, grid.view) : value;
                            } catch (e) {
                                convertedData[key] = value;
                            }
                            convertedData[key] = "<div class='cell-standard-style'>" + convertedData[key] + "<//div>";
                        }
                    }, this);
                }
                data.push(convertedData);
            });

            //if HTMLheader has been set, we use HTMLheader
            var htmlContents = grid.htmlContents;
            var HTMLStyle = htmlContents.getTableStyle(),
                HTMLHeader = htmlContents.getTableHeader(),
                HTMLBrower = htmlContents.getTableBrower(),
                HTMLColumns = htmlContents.getTableColumns(),
                HTMLFooter = htmlContents.getTableFooter();
            var tableStyle, tableHeader,tableBrower, tableColumns, tableFooter;

            tableStyle = Ext.create('Ext.Template', HTMLStyle).html;
            tableHeader = Ext.create('Ext.Template', HTMLHeader).html;
            tableBrower = Ext.create('Ext.Template', HTMLBrower).html;
            if (HTMLColumns.toString() === "") {
                tableColumns = Ext.create('Ext.XTemplate', this.columnsTpl).apply(columns);
            }
            else {
                tableColumns = Ext.create('Ext.Template', HTMLColumns).html;
            }
            tableFooter = Ext.create('Ext.Template', HTMLFooter).html;

            var htmlMarkup = [
				'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
				'<html>',
				  '<head>',
				    '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />',
					'<link href="' + this.defaultStyle + '" rel="stylesheet" type="text/css" media="screen,print" />',
					tableStyle,
				    '<title>' + grid.title + '</title>',
				  '</head>',
				  '<body>',
				    '<table>',
				      tableHeader,
                      tableBrower,
                      tableColumns,
				      '<tpl for=".">',
				        body,
				      '</tpl>',
					  tableFooter,
				    '</table>',
				  '</body>',
				'</html>'
			];

            var html = Ext.create('Ext.XTemplate', htmlMarkup).apply(data);
            var win = window.open('', 'printhtmlgrid');
            win.document.write(html);
            if (this.printAutomatically) {
                win.print();
                win.close();
            }
        },

        /**
        * @property defaultStyle
        * @type string
        */
        defaultStyle: '',

        /**
        * @property printAutomatically
        * @type Boolean
        * True to open the print dialog automatically and close the window after printing. False to simply open the print version
        * of the grid (defaults to true)
        */
        printAutomatically: true,

        /**
        * @property showHiddenColumn
        * @type Boolean
        * True to print column whose property hidden is true.(defaults to false)
        */
        showHiddenColumn: false,

        /**
        * @property headerTpl
        * @type {Object/Array} values
        * The markup used to create the headings row. By default this just uses <th> elements, override to provide your own
        */
        columnsTpl: [
			'<tr>',
				'<tpl for=".">',
					'<th>{text}</th>',
				'</tpl>',
			'</tr>'
		],

        /**
        * @property bodyTpl
        * @type {Object/Array} values
        * The XTemplate used to create each row. This is used inside the 'print' function to build another XTemplate, to which the data
        * are then applied (see the escaped dataIndex attribute here - this ends up as "{dataIndex}")
        */
        bodyTpl: [
			'<tr>',
				'<tpl for=".">',
					'<td>\{{dataIndex}\}</td>',
				'</tpl>',
			'</tr>'
		]
    }
});