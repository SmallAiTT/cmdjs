/**
 * Created by SmallAiTT on 2015/4/27.
 */
var Plugin;
module.exports = function(CmdPlugin, cmdJs){
    if(!Plugin){
        Plugin = CmdPlugin.extends({
            run : function(value, option, onEnd){
                var index = value.indexOf("helper");
                if(index >= 0) value.splice(index, 1);

                var pluginConfig = this.pluginConfig;

                if(value.length > 0){
                    for (var i = 0, l_i = value.length; i < l_i; i++) {
                        this.log(value[i]);
                    }
                }else{
                    for (var key in pluginConfig) {
                        this.log(key);
                    }
                }
                onEnd();
            },

            log : function(pluginName){
                pluginName = pluginName.toLowerCase();
                var optionConfig = this.optionConfig;
                var pluginConfig = this.pluginConfig;
                var pc = pluginConfig[pluginName];
                if(cmdJs.pluginNameMap[pluginName]){
                    var desc = pc.desc || cmdJs.getMsg("info.noPluginDesc");
                    cmdJs.log4Helper(pluginName, null, desc);
                    var optCfg = pc.option;
                    if(optCfg){
                        console.log();
                        for (var optionName in optCfg) {
                            var cfg = optCfg[optionName];
                            if(!cfg) continue;
                            var ref = cfg.ref;
                            if(ref){
                                ref = ref.toLowerCase();
                                cfg = optionConfig[ref];
                            }
                            desc = cfg.desc || cmdJs.getMsg("info.noOptionDesc");

                            cmdJs.log4Helper("", optionName, desc);
                            console.log();
                        }
                    }
                    console.log("----------------------------\n");
                }
            }

        });
    }

    return new Plugin();
};
