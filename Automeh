
 
/**
 * ADVANCE EVENT :
 * AutoWoot
 ** Method :
 ** copy/paste the entire script into the Firefox Console
 */
var autoW = false;
function autowoot(){
    if(autoW){
        $("#meh").click();
    }
}
function startAutoWoot(){
    autoW = true;
    autowoot();
    API.on(API.ADVANCE, autowoot);
}
function stopAutoWoot(){
    autoW = false;
}
startAutoWoot();
