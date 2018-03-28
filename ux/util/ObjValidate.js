/**
* @class Ext.ux.util.ObjValidate
* @author lightyear(liuyu) (lightyear416@gmail.com)
* 
* If you need to check some str whether is part of strs, you can use  isInStrings
* If you need to check bankno whether obey Luhn
*
* Usage:
*
* Add Ext.Require
*   'Ext.ux.util.ObjValidate',
 * ]);
 * 
*/
Ext.define("Ext.ux.util.ObjValidate", {
    //check gstr whether in ostr
    isInStrings: function (gstr, ostr, opera) {
        var arr1 = gstr;
        var arr2 = ostr.split(opera);

        for (var i = 0; i < arr2.length; i++) {
            if (arr1 == arr2[i])
                return true;
        }

        return false;
    },
    //check bankno whether obey Luhn
    isLuhn: function (bankno) {
        if (bankno.length < 16 || bankno.length > 19) {
            //The length must between 16 to 19;
            return false;
        }
        var num = /^\d*$/;  //all digit
        if (!num.exec(bankno)) {
            return false;
        }
        //initial 6 numbers
        var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
        if (strBin.indexOf(bankno.substring(0, 2)) == -1) {
            //false for initial 6 numbers
            return false;
        }
        var lastNum = bankno.substr(bankno.length - 1, 1); //acquire last number（compare to luhn）

        var first15Num = bankno.substr(0, bankno.length - 1); //front 15 or 18 numbers
        var newArr = new Array();
        for (var i = first15Num.length - 1; i > -1; i--) {    //save front 15 or 18 numbers to array by des order
            newArr.push(first15Num.substr(i, 1));
        }
        var arrJiShu = new Array();  //odd position number*2 <9
        var arrJiShu2 = new Array(); //odd position number*2 >9

        var arrOuShu = new Array();  //even position array
        for (var j = 0; j < newArr.length; j++) {
            if ((j + 1) % 2 == 1) {//odd position
                if (parseInt(newArr[j]) * 2 < 9)
                    arrJiShu.push(parseInt(newArr[j]) * 2);
                else
                    arrJiShu2.push(parseInt(newArr[j]) * 2);
            }
            else //even postition
                arrOuShu.push(newArr[j]);
        }

        var jishu_child1 = new Array(); //single digit in array after split odd position number*2 <9
        var jishu_child2 = new Array(); //ten digit in array after split odd position number*2 >9
        for (var h = 0; h < arrJiShu2.length; h++) {
            jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
            jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        }

        var sumJiShu = 0; //sum of array of odd position number*2 <9
        var sumOuShu = 0; //sum of array of even position numbers
        var sumJiShuChild1 = 0; //sum of single digit in array after split odd position number*2 <9
        var sumJiShuChild2 = 0; //sum of ten digit in array after split odd position number*2 >9
        var sumTotal = 0;
        for (var m = 0; m < arrJiShu.length; m++) {
            sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        }

        for (var n = 0; n < arrOuShu.length; n++) {
            sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        }

        for (var p = 0; p < jishu_child1.length; p++) {
            sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
            sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        }
        //compute summary
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

        //compute value of luhn
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        var luhn = 10 - k;

        if (lastNum == luhn) {
            return true;
        }
        else {
            return false;
        } 
    }
});