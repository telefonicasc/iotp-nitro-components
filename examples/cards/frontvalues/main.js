requirejs.config({
    baseUrl: '../../../'
});

define(
[
    'components/card/front/values',
    'components/card/card',
    'components/card/back/text',
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

    var cardConfig = {
        header : 'Interval',
        cssClass : 'm2m-card-time m2m-card-interval',
        front : {
            items: [{
                component: 'CardFrontValues',
                value:[
                    {label:'Repeat',name:'repeat', value:'99'},
                    {label:'Interval', name:'interval', value:'99'}
                ]
            }]
        },
        back : {
            items: [{
                component: 'CardBackText',
                inputs:[
                    {label: 'repeat', name:'repeat'},
                    {label: 'interval', name:'interval'}
                ]
            }]
        },
        timeCard : true
    };

    $('#card').m2mCard(cardConfig);


});});