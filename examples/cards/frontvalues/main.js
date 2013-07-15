requirejs.config({
    baseUrl: '../../../'
});

define(
[
    'components/card/front/values'
],
function() { requirejs(['components/jquery_plugins'], function() {
    var $ele1 = $('.example1');
    $ele1.m2mCardFrontValues({
        value:{
            'opt1':1,
            'opt2':'A',
            'opt3': [1,3,5]
        }
    });

    $('#btn1').on('click', function(){
        $ele1.trigger('valueChange', {value:{'test':'testtest'}});
    });


});});