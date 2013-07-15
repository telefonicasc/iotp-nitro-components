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
        value:[
            {name:'opt1', label: 'option', value:0},
            {name:'opt2', label: 'option', value:0},
            {name:'opt3', label: 'option', value:0}
        ]
    });

    $('#btn1').on('click', function(){
        $ele1.trigger('valueChange', {value:{'opt2':'testtest', 'opt1':1}});
    });


});});