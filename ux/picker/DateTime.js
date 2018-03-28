Ext.define('Ext.ux.picker.DateTime', {
      extend: 'Ext.ux.picker.ConfirmDate',
      alias: 'widget.datetimepicker',
      todayText: '现在',
      timeLabel: '时间',
      requires: ['Ext.ux.form.field.TimeGroup'],
	  
	  childEls: [
        'innerEl', 'eventEl', 'prevEl', 'nextEl', 'middleBtnEl', 'legEl', 'footerEl','inputEl', 'labelEl'
	  ],
	  
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
			'<tpl>',
			'<div id="{id}-legEl" role="presentation">{%this.renderTimeGroupField(values,out)%}</div>',
			'</tpl>',
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
            },

			renderTimeGroupField: function(values, out) {  
                Ext.DomHelper.generateMarkup(values.$comp.timefield.getRenderTree(), out);  
            },
        }  
    ],
	  
      initComponent: function() {
          // keep time part for value
		  var me = this;
          var value = me.value || new Date();
          me.callParent();
          me.value = value;
      },
	  
	  beforeRender: function () {
		  var me = this;
		  if(!me.timefield) {
            me.timefield = Ext.create('Ext.ux.form.field.TimeGroup', {
				fieldLabel: me.timeLabel,
				labelWidth: 30,
				value: Ext.Date.format(me.value, 'H:i:s'),
				listeners:{
					scope:me,
					change:me.timeChange,
					afterrender:me.onAfterRender
				}
			});
          }
		  
		  me.callParent();
	  },
	  
	  
	  finishRenderChildren: function () {  
			var me = this;  
			//组件渲染完成后，需要调用子元素的finishRender，从而获得事件绑定
			if (me.showToday) {
				me.timefield.finishRender();
			}		
			me.callParent();
			//var table = Ext.get(Ext.DomQuery.selectNode('table', me.el.dom));
			//alert(table.id);
	  },
	  
      onRender: function(container, position) {
          var me = this;
          me.callParent(arguments);
		  
		  /*
          var table = Ext.get(Ext.DomQuery.selectNode('table', me.el.dom));
          var tfEl = Ext.core.DomHelper.insertAfter(table, {
                tag: 'div',
                style: 'border:0px;',
                children: [{
                      tag: 'div',
                      cls: 'x-datepicker-footer ux-timefield'
                  }]
            }, true);
          me.timefield.render(me.el.child('div div.ux-timefield'));
          var p = me.getEl().parent('div.x-layer');
          if(p) {
              p.setStyle("height", p.getHeight() + 31);
          }
		  */
      },
	  
	  onAfterRender:function(){
		var me = this;
		  //alert(me.getEl().setAttribute('id','1234'));
		  var C424 = [me.timefield, me.timefield.hoursSpinner, me.timefield.minutesSpinner, me.timefield.secondsSpinner];
		  for(var i = 0; i < C424.length; i++) {
			  document.getElementById(C424[i].id).setAttribute('id',C424[i].id+'-legEl');
          }  
		  
	  },
	  
      // listener 时间域修改, timefield change
      timeChange: function(tf, time, rawtime) {
          // if(!this.todayKeyListener) { // before render
          this.value = this.fillDateTime(this.value);
          // } else {
          // this.setValue(this.value);
          // }
      },
      // @private
      fillDateTime: function(value) {
          if(this.timefield) {
              var rawtime = this.timefield.getRawValue();
              value.setHours(rawtime.h);
              value.setMinutes(rawtime.m);
              value.setSeconds(rawtime.s);
          }
          return value;
      },
      // @private
      changeTimeFiledValue: function(value) {
          this.timefield.un('change', this.timeChange, this);
          this.timefield.setValue(this.value);
          this.timefield.on('change', this.timeChange, this);
      },
      /* TODO 时间值与输入框绑定, 考虑: 创建this.timeValue 将日期和时间分开保存. */
      // overwrite
      setValue: function(value) {
          this.value = value;
          this.changeTimeFiledValue(value);
          return this.update(this.value);
      },
      // overwrite
      getValue: function() {
          return this.fillDateTime(this.value);
      },
      // overwrite : fill time before setValue
      handleDateClick: function(e, t) {
		  
          var me = this,
              handler = me.handler;
          e.stopEvent();
          if(!me.disabled && t.dateValue && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)) {
              me.doCancelFocus = me.focusOnSelect === false;
              me.setValue(this.fillDateTime(new Date(t.dateValue))); // overwrite: fill time before setValue
              delete me.doCancelFocus;
              me.fireEvent('select', me, me.value);
              if(handler) {
                  handler.call(me.scope || me, me, me.value);
              }
              me.onSelect();
          }
      },
	  
	  beforeDestroy : function() {  
			var me = this;  
	  
			if (me.rendered) {  
				//销毁组件时，也需要销毁自定义的控件  
				Ext.destroy(
					me.timefield  
				);  
			}  
			me.callParent();  
	  },
	  
	  // overwrite:reserve time
	  onOkClick: function(picker,value){
	    //alert(this.value);
		var me = this;
		
		var hour = me.value.getHours(),
		    min  = me.value.getMinutes(),
			sec  = me.value.getSeconds();
		
        var month = value[0],
            year = value[1],
            date = new Date(year, month, me.getActive().getDate(), hour, min, sec);

        if (date.getMonth() !== month) {
            // 'fix' the JS rolling date conversion if needed
            date = Ext.Date.getLastDateOfMonth(new Date(year, month, 1, hour, min, sec));
        }
        me.setValue(date);
        me.hideMonthPicker();
	  },
	  
      // overwrite : fill time before setValue
      selectToday: function() {
          var me = this,
              btn = me.todayBtn,
              handler = me.handler;
          if(btn && !btn.disabled) {
              // me.setValue(Ext.Date.clearTime(new Date())); //src
              me.setValue(new Date());// overwrite: fill time before setValue
              me.fireEvent('select', me, me.value);
              if(handler) {
                  handler.call(me.scope || me, me, me.value);
              }
              me.onSelect();
          }
          return me;
      },
	  
	  // overwrite: highlight selected day
	  selectedUpdate: function(date){
			//alert(date.getTime());
			var me        = this,
				t         = date.getTime(),
				cells     = me.cells,
				cls       = me.selectedCls,
				cellItems = cells.elements,
				c,
				cLen      = cellItems.length,
				cell;

			cells.removeCls(cls);
			
			var hour = date.getHours(),
				min  = date.getMinutes(),
				sec  = date.getSeconds();
			
			for (c = 0; c < cLen; c++) {
				cell = Ext.fly(cellItems[c]);
				
				if (cell.dom.firstChild.dateValue == t-1000*(sec+60*min+3600*hour)) {
					me.fireEvent('highlightitem', me, cell);
					cell.addCls(cls);

					if(me.isVisible() && !me.doCancelFocus){
						Ext.fly(cell.dom.firstChild).focus(50);
					}

					break;
				}
			}
		}
  });