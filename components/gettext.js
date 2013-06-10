define(
[],
function(){

    var fnFull = function(str){
        return str;
    };

    var gettext = function(){
        var fn = (Kermit && Kermit.gettext) || fnFull;
        return fn.apply(window, arguments);
    };

    return gettext;
});
