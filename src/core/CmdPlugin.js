/**
 * Created by SmallAiTT on 2015/4/27.
 */
var path = require("path2");
var clazz = require("clazz");
var strUtils = require("str-utils");

var Plugin = clazz.extends({
    name : null,
    cmdConfig : null,
    pluginConfig: null,
    optionConfig:null,
    exec : function(cmdName, valueArr, option, onEnd){
        var value, opt;
        try{
            value = this.getValue(valueArr);
            opt = this.getOption(option);
        }catch(e){
            return onEnd(e);
        }
        this.run(value, opt, onEnd);
    },
    getValue : function(valueArr){
        var cmdJs = require("../../index");
        var pc = this.pluginConfig[this.name];
        var cfg = pc.value;
        if(!cfg){
            if(valueArr.length > 0) throw cmdJs.getMsg("err.pluginValue", this.name);
            return null;
        }
        var type = cfg.type;
        var l = valueArr.length;
        if(type == "none" && l > 0) throw cmdJs.getMsg("err.pluginValue", this.name);
        if(
            (l != 1 && (type == "*" || type == "string" || type == "number"))
            || (l != 0 && type == "none")
            || (type == "array" && cfg.length != null && cfg.length != l)
        ){
            throw cmdJs.getMsg("err.pluginValueCount", this.name);
        }
        var value;
        switch (type){
            case "*":
                if(l == 1){
                    var v = value = valueArr[0];
                    if(v && v.match(strUtils.NUM_EXP)){
                        if(v.indexOf(".") >= 0) value = parseFloat(v);
                        else value = parseInt(v);
                    }
                }
                break;
            case "string":
                if(l == 1){
                    value = valueArr[0];
                }
                break;
            case "number":
                if(l == 1){
                    var v = valueArr[0];
                    if(v && v.match(strUtils.NUM_EXP)){
                        if(v.indexOf(".") >= 0) value = parseFloat(v);
                        else value = parseInt(v);
                    }else{
                        throw cmdJs.getMsg("err.optionType", this.name, key, type);
                    }
                }
                break;
            case "array":
                value = valueArr;
                break;
        }
        return value;
    },
    getOption : function(option){
        var cmdJs = require("../../index");
        var opt = {};
        var pc = this.pluginConfig[this.name];
        var oc = pc.option || {};
        for (var key in option) {
            var valueArr = option[key] || [];
            var cfg = oc[key];
            if(!cfg){
                throw cmdJs.getMsg("err.optionNotFound", this.name, key);
            }
            var ref = cfg.ref;
            if(ref){
                ref = ref.toLowerCase();
                cfg = this.optionConfig[ref];
                if(!cfg){
                    throw cmdJs.getMsg("err.optionNotFound", this.name, key + "->globalOption." + ref);
                }
            }
            var type = cfg.type || "*";
            var l = valueArr.length;
            if(
                (l != 1 && (type == "*" || type == "string" || type == "number"))
                || (l != 0 && type == "none")
                || (type == "array" && cfg.length != null && cfg.length != l)
            ){
                throw cmdJs.getMsg("err.optionCount", this.name, key);
            }
            switch (type){
                case "*":
                    if(l == 1){
                        var v = opt[key] = valueArr[0];
                        if(v && v.match(strUtils.NUM_EXP)){
                            if(v.indexOf(".") >= 0) opt[key] = parseFloat(v);
                            else opt[key] = parseInt(v);
                        }
                    }
                    break;
                case "string":
                    if(l == 1){
                        opt[key] = valueArr[0];
                    }
                    break;
                case "number":
                    if(l == 1){
                        var v = valueArr[0];
                        if(v && v.match(strUtils.NUM_EXP)){
                            if(v.indexOf(".") >= 0) opt[key] = parseFloat(v);
                            else opt[key] = parseInt(v);
                        }else{
                            throw cmdJs.getMsg("err.optionType", this.name, key, type);
                        }
                    }
                    break;
                case "array":
                    opt[key] = valueArr;
                    break;
                case "none":
                    opt[key] = true;
                    break;
            }
        }

        for (var key in oc) {
            var cfg = oc[key];
            if(!cfg) continue;
            if(opt[key] == null){
                var ref = cfg.ref;
                if(ref){
                    ref = ref.toLowerCase();
                    cfg = this.optionConfig[ref];
                    if(!cfg){
                        throw cmdJs.getMsg("err.optionNotFound", this.name, key + "->globalOption." + ref);
                    }
                }
                var defaultValue = cfg["default"];
                var required = cfg["required"];
                if(required && defaultValue == null){
                    throw cmdJs.getMsg("err.optionRequired", this.name, key);
                }
                opt[key] = defaultValue;
            }
        }
        return opt;
    },

    run : function(value, option, onEnd){
        //TODO 具体的实现
    }
});

var exports = module.exports = Plugin;