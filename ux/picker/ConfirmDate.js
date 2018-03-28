Ext.define('Ext.ux.picker.ConfirmDate', {  
    extend: 'Ext.picker.Date',//继承于 Ext.picker.Date  
    alias: 'widget.confirmdatepicker',//添加xtype dateptimeicker  
    okText:'确定',//确认按钮文字描述  
    okTip:'确定',//确认按钮提示内容  
  
    renderTpl: [
		'<div id="{id}-innerEl" role="grid">',
            '<div role="presentation" class="{baseCls}-header">',
                 // the href attribute is required for the :hover selector to work in IE6/7/quirks
                '<a id="{id}-prevEl" class="{baseCls}-prev {baseCls}-arrow" href="#" role="button" title="{prevText}" hidefocus="on" unselectable="on" draggable="false" ></a>',
                '<div class="{baseCls}-month" id="{id}-middleBtnEl">{%this.renderMonthBtn(values, out)%}</div>',
                 // the href attribute is required for the :hover selector to work in IE6/7/quirks
                '<a id="{id}-nextEl" class="{baseCls}-next {baseCls}-arrow" href="#" role="button" title="{nextText}" hidefocus="on" unselectable="on" draggable="false" ></a>',
            '</div>',
            '<table id="{id}-eventEl" class="{baseCls}-inner" cellspacing="0" role="grid">',
                '<thead role="presentation"><tr role="row">',
                    '<tpl for="dayNames">',
                        '<th role="columnheader" class="{parent.baseCls}-column-header" title="{.}">',
                            '<div class="{parent.baseCls}-column-header-inner">{.:this.firstInitial}</div>',
                        '</th>',
                    '</tpl>',
                '</tr></thead>',
                '<tbody role="presentation"><tr role="row">',
                    '<tpl for="days">',
                        '{#:this.isEndOfWeek}',
                        '<td role="gridcell" id="{[Ext.id()]}">',
                            // the href attribute is required for the :hover selector to work in IE6/7/quirks
                            '<a role="button" hidefocus="on" class="{parent.baseCls}-date" href="#"></a>',
                        '</td>',
                    '</tpl>',
                '</tr></tbody>',
            '</table>',
            '<tpl if="showToday">',
                '<div id="{id}-footerEl" role="presentation" class="{baseCls}-footer">{%this.renderOkBtn(values, out)%}{%this.renderTodayBtn(values, out)%}</div>',
            '</tpl>',
        '</div>',
        {  
            firstInitial: function(value) {  
                return Ext.picker.Date.prototype.getDayInitial(value);  
            },  
            isEndOfWeek: function(value) {  
                // convert from 1 based index to 0 based  
                // by decrementing value once.  
                value--;  
                var end = value % 7 === 0 && value !== 0;  
                return end ? '</tr><tr role="row">' : '';  
            },  
            renderTodayBtn: function(values, out) {  
                Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);  
            },  
            renderMonthBtn: function(values, out) {  
                Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);  
            },  
  
            renderOkBtn: function(values, out) {  
                Ext.DomHelper.generateMarkup(values.$comp.okBtn.getRenderTree(), out);  
            }  
        }  
    ],

	initComponent : function() {
		var me = this,
			clearTime = Ext.Date.clearTime;
		me.callParent();

        me.value = me.value ? clearTime(me.value, true) : clearTime(new Date());
		
	},
  
    beforeRender: function () {  
        var me = this;
  
        me.okBtn = new Ext.button.Button({  
            ownerCt: me,  
            ownerLayout: me.getComponentLayout(),  
            text: me.okText,  
            tooltip: me.okTip,  
            tooltipType:'title',  
            handler:me.okHandler,//确认按钮的事件委托  
            scope: me  
        });  
        me.callParent();  
    },
	
	finishRenderChildren: function () {  
        var me = this;  
        //组件渲染完成后，需要调用子元素的finishRender，从而获得事件绑定
		if (me.showToday) {
			me.okBtn.finishRender();
		}		
        me.callParent();  
    }, 
	
    /** 
     * 确认 按钮触发的调用 
     */  
    okHandler : function(){  
        var me = this,  
            btn = me.okBtn;  
  
        if(btn && !btn.disabled){  
            me.setValue(this.getValue());  
            me.fireEvent('select', me, me.value);  
            me.onSelect();  
        }  
        return me;  
    },  
  
    // @private  
    // @inheritdoc  
    beforeDestroy : function() {  
        var me = this;  
  
        if (me.rendered) {  
            //销毁组件时，也需要销毁自定义的控件  
            Ext.destroy(
                me.okBtn  
            );  
        }  
        me.callParent();  
    }  
});