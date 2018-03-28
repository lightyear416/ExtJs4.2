/**
* @class Ext.ux.Printer.Grid(grid)
* @class Ext.ux.Printer.Table(panel)
* @author lightyear(liuyu) (lightyear416@gmail.com)
*
* Usage:
*
* 1 - Add Ext.Require
*   'Ext.ux.Printer',
 * ]);
 * 
 * 2 - Declare the Grid 
 * var grid = Ext.create('Ext.grid.Panel', {
 *   columns: //some column model,
 *   store   : //some store,
 *   htmlContents: Ext.create('Ext.ux.grid.HTMLGridModel')
 * });
 *          or
 * 2 - Declare the Panel 
 * var panel = Ext.create('Ext.ux.grid.HTMLTable', {
 *   store: //data orginate,	 
 *   htmlContents: Ext.create('Ext.ux.grid.HTMLTableModel')
 * });
 * 
 * 3 - Print!
 * Ext.ux.Printer.Grid(grid);
 * Ext.ux.Printer.Table(panel);
*/
Ext.define("Ext.ux.printer.HTML", {
    requires: [
		'Ext.XTemplate',
		'Ext.Template'
	],
    //singleton: true,

    config: {
		ctype:'grid',
		component: null,
		printStore: null,
		printPageSize: 0,
		justLastFooter: null,
		/**
		* @property selfPage
		* @type Boolean
		* True to read data of just grid.store , False to read data of grid.printStore
		* (defaults to true)
		*/
		selfPage: true,
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
        showHiddenColumn: false
    },
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
	],

    constructor: function (config) {
        this.initConfig(config);
    },
   
    completePrint: function (htmlMarkup, data, title) {
        if (this.ctype == 'table') {
            var html = Ext.create('Ext.Template', htmlMarkup).apply(data);
        }
        else if (this.ctype == 'grid') {
            var html = Ext.create('Ext.XTemplate', htmlMarkup).apply(data);
        }
        var win = window.open('', title);
        win.document.write(html);
        win.document.close();
        if (this.printAutomatically) {
            if (navigator.appName == 'Microsoft Internet Explorer' || navigator.userAgent.indexOf('Edge')!= -1) {
                win.focus();
                win.print();
                win.close();
            } else {
                win.addEventListener('load', function () {
                    win.focus();
                    win.print();
                    win.close();
                })
            } 
        }
    },

    Print: function () {
		if (this.ctype == 'table') {
            this.Table(this.component);
        }
        else if (this.ctype == 'grid') {
            this.Grid(this.component);
        }
        else {
            Ext.Msg.alert('提示', '功能尚未开通');
        }
    },

    getTableData: function (store) {
        var data = [];
        data = store.getRange()[0].data;

        return data;
    },

    getTableHTML: function (htmlContents, title) {
        var HTMLStyle = htmlContents.getTableStyle(),
			    HTMLContent = htmlContents.getTableContent(),
                defaultCss = htmlContents.getDefaultCss();
        var tableStyle, tableContent;

        tableStyle = Ext.create('Ext.Template', HTMLStyle).html;
        tableContent = Ext.create('Ext.Template', HTMLContent).html;

        var htmlMarkup = [
				'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
				'<html>',
				  '<head>',
				    '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />',
					'<link href="' + defaultCss + '" rel="stylesheet" type="text/css" media="screen,print" />',
					tableStyle,
				    '<title>' + title + '</title>',
				  '</head>',
				  '<body>',
				    tableContent,
				  '</body>',
				'</html>'
			];

        return htmlMarkup;
    },

    Table: function (panel) {
        var data = this.getTableData(panel.store);
        var htmlMarkup = this.getTableHTML(panel.htmlContents,panel.title);

        this.completePrint(htmlMarkup, data, 'printhtmltable');
    },
	
	getGridColumns:function(gcolumns){
		var columns;
		if (this.showHiddenColumn == false) {
            var orgcolumns = gcolumns;
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
            columns = gcolumns;
        }
		return columns;
	},
	
	writeGridAllData:function(grid,columns){
	    var me = this,
              allData = [];
		if(me.selfPage){
		    allData = me.getGridAllData(grid.store, columns);
		    me.renderPageGrid(grid, allData, columns);
		}
		else{
		    me.printStore.load({
				scope:me,
				callback:function(records, operation, success){
				    allData = me.getGridAllData(me.printStore, columns);
				    me.renderPageGrid(grid, allData, columns);
				}
			});
		}	
	},
	
	getGridAllData:function(store,columns){
		var data = [];
		store.data.each(function (item, row) {
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
                         convertedData[key] = "<div class='cell-standard-style'>" + convertedData[key] + "</div>";
                        //convertedData[key] =  convertedData[key];
                    }
                }, this);
            }
            data.push(convertedData);
        });
		return data;
	},
	
	getGridHTML: function(htmlContents,columns,lastPage,title){
		var HTMLStyle = htmlContents.getTableStyle(),
            HTMLHeader = htmlContents.getTableHeader(),
            HTMLBrower = htmlContents.getTableBrower(),
            HTMLColumns = htmlContents.getTableColumns(),
            HTMLFooter = htmlContents.getTableFooter(),
            defaultCss = htmlContents.getDefaultCss();
        var tableStyle, tableHeader, tableBrower, tableColumns, tableFooter;

        //tableStyle = Ext.create('Ext.Template', HTMLStyle);
        //tableHeader = Ext.create('Ext.Template', HTMLHeader);
        //tableBrower = Ext.create('Ext.Template', HTMLBrower);
        tableStyle = Ext.create('Ext.Template', HTMLStyle).html;
        tableHeader = Ext.create('Ext.Template', HTMLHeader).html;
        tableBrower = Ext.create('Ext.Template', HTMLBrower).html;
        if (HTMLColumns.toString() === "") {
            tableColumns = Ext.create('Ext.XTemplate', this.columnsTpl).apply(columns);
        }
        else {
            tableColumns = Ext.create('Ext.Template', HTMLColumns).html;
        }
		if((!this.justLastFooter) || lastPage){
			tableFooter = Ext.create('Ext.Template', HTMLFooter).html;
		}
		else{
			tableFooter = '<br>';
		}
	     var body = Ext.create('Ext.XTemplate', this.bodyTpl).apply(columns);

        var htmlMarkup = [
			'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
			'<html>',
				'<head>',
				'<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />',
				'<link href="' + defaultCss + '" rel="stylesheet" type="text/css" media="screen,print" />',
				tableStyle,
				'<title>' + title + '</title>',
				'</head>',
				'<body">',
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
		return htmlMarkup;
	},
	
	renderPageGrid: function (grid, allData, columns) {
	    var chunck = [];
	    for (var i = 0, len = allData.length; i < len; i += this.printPageSize) {
	        chunck.push(allData.slice(i, i + this.printPageSize));
	    }
	    var pageNum = chunck.length,
			isLastPage = false
	    htmlMarkup = [];
	    for (var j = 0; j < pageNum; j++) {
	        if (j == pageNum - 1) {
	            isLastPage = true;
	        }
	        //htmlMarkup = this.getGridHTML(grid.htmlContents, columns, isLastPage, grid.title);
	        htmlMarkup = this.getGridHTML(grid.htmlContents, columns, isLastPage, grid.title);
	        this.completePrint(htmlMarkup, chunck[j], 'printhtmlgrid');
	    }
	},

	Grid: function (grid) {
		if(this.justLastFooter == null){
			this.justLastFooter = grid.htmlContents.getJustLastFooter();
		}
		if(this.printPageSize == 0){
			this.printPageSize = grid.htmlContents.getPrintPageSize();
		}
		
		var columns = this.getGridColumns(grid.columns);
        this.writeGridAllData(grid,columns);

    }

});