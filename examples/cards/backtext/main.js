requirejs.config({
    baseUrl: '../../../'
});

define(
[
    'components/card/back/text'
],
function() { requirejs(['components/jquery_plugins'], function() {
    var $ele1 = $('.example1');
    $ele1.m2mCardBackText({label:'test', value:'hello', name:'test'});
    $ele1.on('valueChange', function(e, o){
        console.log('.example1', 'valueChange', o.value);
    });

    $('#btn1').on('click', function(){
        $ele1.trigger('valueChange', {value:'testtest'})
    });

    var $ele2 = $('.example2');
    var opt2 = {
        inputs : [
            {label:'testA', value:'hello', name:'a'},
            {label:'testB', value:'hello', name:'b'}
        ]
    }
    $ele2.m2mCardBackText(opt2);
    $ele2.on('valueChange', function(e, o){
        console.log('.example2', 'valueChange', o.value);
    });
    $('#btn2').on('click', function(){
        $ele2.trigger('valueChange', {value:{a:'a', b:'b'}});
    });

});});