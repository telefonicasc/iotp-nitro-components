requirejs.config({
    baseUrl: '../../../'
});

define(
[
    'components/card/action/send_email',
],
function() { requirejs(['components/jquery_plugins'], function() {
    var cardConfig = {
        cssClass : 'm2m-card-action m2m-card-send-email action-card',
        component : 'SendEmail',
        tokens : ['device_latitude', 'device_longitude', 'measure.value', 'device.asset.name'],
        header : 'send_email',
        cssClass : 'm2m-card-time m2m-card-interval'
    };

    $('#card').m2mSendEmail(cardConfig);


});});