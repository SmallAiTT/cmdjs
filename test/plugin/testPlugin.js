/**
 * Created by SmallAiTT on 2015/4/27.
 */
var Plugin;
module.exports = function(CmdPlugin, cmdJs){
    if(!Plugin){
        Plugin = CmdPlugin.extends({
            run : function(value, option, onEnd){
                console.log("testPlugin--value--->", value);
                console.log("testPlugin--option--->");
                console.log(option);
                onEnd();
            }

        });
    }

    return new Plugin();
};
