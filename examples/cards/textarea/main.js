requirejs.config({
    baseUrl: '../../../'
});

define(
[
    'components/card/front/text',
    'components/card/card',
    'components/card/back/textarea'
],
function() { requirejs(['components/jquery_plugins'], function() {
    var cardConfig = {
        header : 'Card with textarea',
        //cssClass : 'm2m-card-time m2m-card-interval',
        front: {
                items: [{
                    component: 'CardFrontText'
                }]
            },
            back : {
                items: [{
                    component: 'CardBackTextarea',
                    label: 'value'
                }]
            },
        timeCard : true,
        validator: function(value){
            console.log(value);
        }
    };

    $('#card').m2mCard(cardConfig);
    $('#btn1').on('click', function(){
        $('.card').trigger('valueChange', {value:3});
    });
    $('#flip').on('click', function(){
        $('.card').trigger('flipped').toggleClass('flip');;
    });


});});