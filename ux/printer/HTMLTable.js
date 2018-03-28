/**
* @class Ext.ux.printer.HTMLTablePrinter
* @author lightyear(liuyu) (lightyear416@gmail.com)
*
* Usage:
*
* 1 - Add Ext.Require
*   'Ext.ux.printer.HTMLTablePrinter',
 * ]);
 * 
 * 2 - Declare the Panel 
 * var panel = Ext.create('Ext.ux.grid.HTMLTable', {
 *   store: //data orginate,	 
 *   htmlContents: Ext.create('Ext.ux.grid.HTMLTableModel')
 * });
 * 
 * 3 - Print!
 * Ext.ux.printer.HTMLTablePrinter.print(panel);
 * 
*/
Ext.define("Ext.ux.printer.HTMLTable",{
	requires:'Ext.Template',
	statics: {
		print:function(panel){
			var data = [];
			data = grid.store.getRange()[0].data;
			
			var htmlContents = panel.htmlContents;
			var HTMLStyle = htmlContents.getTableStyle(),
			    HTMLContent = htmlContents.getTableContent();
			var tableStyle,tableContent;
			
			tableStyle = Ext.create('Ext.Template',HTMLStyle);
			tableContent = Ext.create('Ext.Template',HTMLContent);
			
			var htmlMarkup = [
				'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
				'<html>',
				  '<head>',
				    '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />',
					'<link href="' + this.defaultStyle + '" rel="stylesheet" type="text/css" media="screen,print" />',
					tableStyle,
				    '<title>' + panel.title + '</title>',
				  '</head>',
				  '<body>',
				    tableContent,
				  '</body>',
				'</html>'
			];
			
			var html = Ext.create('Ext.Template', htmlMarkup).apply(data);
			var win = window.open('', 'printhtmltable');
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
        printAutomatically: true
	}
});