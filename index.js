/**
 * Created by SmallAiTT on 2015/4/29.
 */

var path = exports.path2 = require("./src/node_modules/path2");
var fs = exports.fs2 = require("./src/node_modules/fs2");
var clazz = exports.clazz = require("./src/node_modules/clazz");
var logger = exports.logger = require("./src/node_modules/logger");
var strUtils = exports.strUtils = require("./src/node_modules/str-utils");

var argvParser = exports.argvParser = require("./src/core/argvParser");
var CmdPlugin = exports.CmdPlugin = require("./src/core/CmdPlugin");

var optionConfig = exports.optionConfig = require("./config/option");
var pluginConfig = exports.pluginConfig = require("./config/plugin");
var cmdConfig = exports.cmdConfig = require("./config/config");
var msgConfig = exports.msgConfig = require("./config/msg");
var pluginNameMap = exports.pluginNameMap = {};

exports.cmdName = "cmdjs";//命令的名称


process.on('uncaughtException', function(err){
    console.log("异常：");
    console.error(err);
});

/**
 * 将key转换为小写。
 * @param option
 * @param num
 * @returns {*}
 */
function changeKeyToLowerCase(option, num){
    if(num == 0) return option;
    if(option == null) return option;
    var type = typeof option;
    if(type == "string" || type == "number" || type == "boolean" || option instanceof Array) return option;
    num--;
    for (var key in option) {
        var value = option[key];
        delete option[key];
        option[key.toLowerCase()] = changeKeyToLowerCase(value, num);
    }
    return option;
}

changeKeyToLowerCase(optionConfig, 1);
changeKeyToLowerCase(pluginConfig, 2);
changeKeyToLowerCase(cmdConfig, 2);

/**
 * 赋值属性。
 * @param old
 * @returns {*}
 */
function copyProp(old){
    if(!old) return old;
    var type = typeof old;
    if(type == "string" || type == "number" || type == "boolean") return old;
    if(old instanceof Array){
        var result = [];
        for (var i = 0, l_i = old.length; i < l_i; i++) {
            result[i] = copyProp(old[i]);
        }
    }else{
        var result = {};
        for (var key in old) {
            result[key] = copyProp(old[key]);
        }
    }
    return result;
}
/**
 * 添加cmdJs配置。
 * @param configPath
 */
exports.getCmdConfig = function(configPath, isToGlobal){
    var result = cmdConfig;
    if(!isToGlobal){
        result = copyProp(cmdConfig);
    }
    if(fs.existsSync(configPath)){
        try{
            var content = fs.readFileSync(configPath).toString();
            content = JSON.parse(content);
            for (var key in content) {
                var opt = content[key];
                var type = typeof opt;
                if(type == "string" || type == "number" || type == "boolean" || opt instanceof Array || opt === null){
                    result[key] = opt;
                }else{
                    var oldOpt = result[key];
                    if(!oldOpt){
                        oldOpt = result[key] = {};
                    }
                    for (var key2 in opt) {
                        oldOpt[key2] = opt[key2];
                    }
                }
            }
        }catch(e){
        }
    }
    result = changeKeyToLowerCase(result, 2);
    return result;
};

/**
 * 添加option配置。
 * @param configPath
 */
exports.addOptionConfig = function(configPath){
    if(fs.existsSync(configPath)){
        var content = fs.readFileSync(configPath).toString();
        content = JSON.parse(content);
        for (var key in content) {
            var opt = content[key];
            var oldOpt = optionConfig[key];
            if(!oldOpt){
                oldOpt = optionConfig[key] = {};
            }
            for (var key2 in opt) {
                oldOpt[key2] = opt[key2];
            }
        }
        changeKeyToLowerCase(optionConfig, 1);
    }
};

/**
 * 添加plugin配置。
 * @param configPath
 */
exports.addPluginConfig = function(configPath){
    if(fs.existsSync(configPath)){
        var content = fs.readFileSync(configPath).toString();
        content = JSON.parse(content);
        for (var key in content) {
            var opt = content[key];
            var oldOpt = pluginConfig[key];
            if(!oldOpt){
                oldOpt = pluginConfig[key] = {};
            }
            for (var key2 in opt) {
                oldOpt[key2] = opt[key2];
            }
        }
        changeKeyToLowerCase(pluginConfig, 2);
    }
};

/**
 * 添加option配置。
 * @param configPath
 */
exports.addMsgConfig = function(configPath){
    if(fs.existsSync(configPath)){
        try{
            var content = fs.readFileSync(configPath).toString();
            content = JSON.parse(content);
            for (var key in content) {
                msgConfig[key] = content[key];
            }
        }catch(e){

        }
    }
};

/**
 * 根据消息码获取消息。
 * @param code
 * @param args
 * @returns {*}
 */
exports.getMsg = function(code, args){
    var msg = code;
    var tempMsg = msgConfig[code];
    if(tempMsg) {
        var arr = Array.prototype.slice.call(arguments, 1);
        arr.splice(0, 0, tempMsg);
        msg = strUtils.format.apply(strUtils, arr);
    }
    msg = msg.replace(/\\033/g, "\033");
    return msg;
};

/**
 * 初始化cmdjs。
 * @param cmdJsOption
 */
exports.init = function(cmdJsOption){
    var configDir = cmdJsOption.configDir;
    if(configDir) {
        exports.addPluginConfig(path.join(configDir, "plugin.json"));
        exports.addOptionConfig(path.join(configDir, "option.json"));
        exports.addMsgConfig(path.join(configDir, "msg.json"));
    }

    exports.addPluginByDir(path.join(__dirname, "plugin"));
    if(cmdJsOption.pluginDir) exports.addPluginByDir(cmdJsOption.pluginDir);
    return exports;
};

/**
 * 通过路径添加一个插件。
 * @param filePath
 */
exports.addPluginByPath = function(filePath){
    if(path.isExtname(filePath, ".js")){
        pluginNameMap[path.basename(filePath, ".js").toLowerCase()] = filePath;
    }
};
/**
 * 通过目录批量添加插件。
 * @param dir
 */
exports.addPluginByDir = function(dir){
    var files = fs.readdirSync(dir);
    for (var i = 0, l_i = files.length; i < l_i; i++) {
        exports.addPluginByPath(path.join(dir, files[i]));
    }
};

/**
 * 通过名字获取到插件。
 * @param name
 * @returns {*}
 */
exports.getPlugin = function(name){
    try{
        name = name.toLowerCase();
        var pluginPath = pluginNameMap[name];
        if(!pluginPath) return null;
        var plugin = require(pluginPath)(exports.CmdPlugin, exports);
        plugin.name = name;
        return plugin;
    }catch(e){
        console.trace(e);
        return null;
    }
};

/**
 * 执行一个插件。
 * @param plugin
 * @param valueArr
 * @param option
 * @param onEnd
 * @returns {*}
 */
exports.execPlugin = function(cmdName, plugin, valueArr, option, onEnd){
    var cmdConfig = exports.getCmdConfig(path.join(process.cwd(), "." + cmdName));
    var pluginName = plugin.name;
    if(typeof plugin == "string"){
        pluginName = plugin;
        plugin = exports.getPlugin(plugin);
    }
    if(!plugin) return onEnd(exports.getMsg("err.pluginNotFound", pluginName));
    plugin.cmdConfig = cmdConfig;
    plugin.pluginConfig = pluginConfig;
    plugin.optionConfig = optionConfig;
    plugin.exec(cmdName, valueArr, option, onEnd);
};

/**
 * 执行cmd。
 */
exports.bin = function(){
    //加载用户自定义配置
    var arr = process.argv.slice(1);
    var cmdName = exports.cmdName = arr.shift();//命令的名称
    exports.getCmdConfig(path.join(process.cwd(), "." + cmdName), true);
    var pluginName = arr.shift();//插件的名称
    var valueArr = [];
    var option = {};
    if(!pluginName){
        pluginName = "helper";
    }else{
        valueArr = argvParser.getValueArr(arr);
        option = argvParser.getOption(arr);
    }
    pluginName = pluginName.toLowerCase();
    exports.execPlugin(cmdName, pluginName, valueArr, option, function(err){
        if(err) {
            console.log(err);
        }
        else if(pluginName != "helper") {
            console.log(exports.getMsg("info.cmdSuccessfully", pluginName));
        }
    });
};
/**
 * 为helper提供日志输出。
 * @param pluginName
 * @param optionName
 * @param desc
 */
exports.log4Helper = function(pluginName, optionName, desc){
    var result = "";
    if(optionName != null && optionName != "") optionName = "-" + optionName;
    else optionName = "";
    var arr = desc.split("\n");
    for (var i = 0, l_i = arr.length; i < l_i; i++) {
        result += strUtils.format("\033[1;36;1m%s", strUtils.joinBlank(pluginName, 12));
        pluginName = "";
        result += strUtils.format("\033[1;32;1m%s", strUtils.joinBlank(optionName, 16));
        optionName = "";
        result += strUtils.format("\033[0m%s", arr[i]);
        if(i < l_i - 1) result += "\n";
    }
    result = result.replace(/\\033/g, "\033");
    console.log(result);
};