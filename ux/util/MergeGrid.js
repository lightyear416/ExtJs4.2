Ext.define('Ext.ux.util.MergeGrid', {
    config: {
        /**
        * 合并Grid的数据列
        * @param grid {Ext.Grid.Panel} 需要合并的Grid
        * @param colIndexArray {Array} 需要合并列的Index(序号)数组；从0开始计数，序号也包含。
        * @param isAllSome {Boolean} 是否2个tr的colIndexArray必须完成一样才能进行合并。true：完成一样；false：不完全一样
        * usage:
        * afterrender: function (g) {
                me.store.load({
                    callback: function () {
                        Ext.create('Ext.ux.util.MergeGrid', {
                            grid: g,
                            colIndexArray: [1],
                            isAllSome: true
                        })
                    }
                });
            },
        */
        grid: null,
        colIndexArray: [],
        isAllSome: true
    },
    constructor: function (config) {
        this.initConfig(config);
        this.merge();
    },
    merge: function () {
        var me = this;
        me.isAllSome = me.isAllSome == undefined ? true : me.isAllSome; // 默认为true

        var gridView = null;
        // 1.是否含有数据
        if (me.grid.getView().id == null || me.grid.getView().id == 'undefined') {
            //考虑locked的情况
            gridView = document.getElementById(me.grid.getView().normalView.id + '-body');
        }
        else { 
            gridView = document.getElementById(me.grid.getView().getId() + '-body');
        }
        if (gridView == null) {
            return;
        }

        // 2.获取Grid的所有tr
        var trArray = [];
        if (me.grid.layout.type == 'table') { // 若是table部署方式，获取的tr方式如下
            trArray = gridView.childNodes;
        } else {
            trArray = gridView.getElementsByTagName('tr');
        }

        // 3.进行合并操作
        // 3.1 全部列合并：只有相邻tr所指定的td都相同才会进行合并
        if (me.isAllSome) {
            var lastTr = trArray[0]; // 指向第一行
            // 1)遍历grid的tr，从第二个数据行开始
            for (var i = 1, trLength = trArray.length; i < trLength; i++) {
                var thisTr = trArray[i];
                var isPass = true; // 是否验证通过
                // 2)遍历需要合并的列<对应 4)>
                for (var j = 0, colArrayLength = me.colIndexArray.length; j < colArrayLength; j++) {
                    var colIndex = me.colIndexArray[j];
                    // 3)比较2个td的列是否匹配，若不匹配，就把last指向当前列
                    if (lastTr.childNodes[colIndex].innerText != thisTr.childNodes[colIndex].innerText) {
                        lastTr = thisTr;
                        isPass = false;
                        break;
                    }
                }
                // 4)若colIndexArray验证通过，就把当前行合并到'合并行'
                if (isPass) {
                    for (var j = 0, colArrayLength = me.colIndexArray.length; j < colArrayLength; j++) {
                        var colIndex = me.colIndexArray[j];
                        // 5)设置合并行的td rowspan属性
                        if (lastTr.childNodes[colIndex].hasAttribute('rowspan')) {
                            var rowspan = lastTr.childNodes[colIndex].getAttribute('rowspan') - 0;
                            rowspan++;
                            lastTr.childNodes[colIndex].setAttribute('rowspan', rowspan);
                        } else {
                            lastTr.childNodes[colIndex].setAttribute('rowspan', '2');
                        }
                        // lastTr.childNodes[colIndex].style['text-align'] = 'center';; // 水平居中
                        lastTr.childNodes[colIndex].style['vertical-align'] = 'middle'; ; // 纵向居中
                        thisTr.childNodes[colIndex].style.display = 'none';
                    }
                }
            }
        }
        // 3.2 逐个列合并：每个列在前面列合并的前提下可分别合并
        else {
            // 1)遍历列的序号数组
            for (var i = 0, colArrayLength = me.colIndexArray.length; i < colArrayLength; i++) {
                var colIndex = me.colIndexArray[i];
                var lastTr = trArray[0]; // 合并tr，默认为第一行数据
                // 2)遍历grid的tr，从第二个数据行开始
                for (var j = 1, trLength = trArray.length; j < trLength; j++) {
                    var thisTr = trArray[j];
                    // 3)2个tr的td内容一样
                    if (lastTr.childNodes[colIndex].innerText == thisTr.childNodes[colIndex].innerText) {
                        // 4)若前面的td未合并，后面的td都不进行合并操作
                        if (i > 0 && thisTr.childNodes[me.colIndexArray[i - 1]].style.display != 'none') {
                            lastTr = thisTr;
                            continue;
                        } else {
                            // 5)符合条件合并td
                            if (lastTr.childNodes[colIndex].hasAttribute('rowspan')) {
                                var rowspan = lastTr.childNodes[colIndex].getAttribute('rowspan') - 0;
                                rowspan++;
                                lastTr.childNodes[colIndex].setAttribute('rowspan', rowspan);
                            } else {
                                lastTr.childNodes[colIndex].setAttribute('rowspan', '2');
                            }
                            // lastTr.childNodes[colIndex].style['text-align'] = 'center';; // 水平居中
                            lastTr.childNodes[colIndex].style['vertical-align'] = 'middle'; ; // 纵向居中
                            thisTr.childNodes[colIndex].style.display = 'none'; // 当前行隐藏
                        }
                    } else {
                        // 5)2个tr的td内容不一样
                        lastTr = thisTr;
                    }
                }
            }
        }
    }
});