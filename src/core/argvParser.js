/**
 * Created by SmallAiTT on 2015/4/27.
 */
var path = require("path");

/**
 * 获得直接跟踪指定命令后面成参数。
 * 例如：yourCmd create a b c -out ./
 * 则获取的结果为 ["a", "b", "c"]。
 * @param arr
 * @returns {Array}
 */
exports.getValueArr = function(arr){
    var valueArr = [];
    for(var i = 0; i < arr.length; ){
        if(arr[i].indexOf("-") == 0){
            break;
        }else{
            var str = arr.shift();
            valueArr.push(str);
        }
    }
    return valueArr;
};

/**
 * 获得命令参数。
 * 例如：-out ./
 * 那么获得的结果为 "./"。
 * @param optionStrArr
 * @param option
 * @returns {*}
 */
exports.getOption = function(optionStrArr, option){
    option = option || {};
    if(optionStrArr.length == 0) return option;
    var key = optionStrArr.shift().substring(1);
    option[key.toLocaleLowerCase()] = exports.getValueArr(optionStrArr);
    return exports.getOption(optionStrArr, option);
};