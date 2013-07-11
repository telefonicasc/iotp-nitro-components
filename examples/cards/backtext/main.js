requirejs.config({
    baseUrl: '../../../'
});

define(
[
    'components/card/back/text',
],
function() { requirejs(['components/jquery_plugins'], function() {
    var $ele1 = $('.cardtext');
    $ele1.m2mCardBackText({label:'test', value:'hello'});
    $ele1.on('valueChange', function(value){
            console.log(value);
        });

});});