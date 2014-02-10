requirejs.config({
    baseUrl: '../../'
});

define(
[
    'components/container',
    'components/jquery_plugins'
],
function() {
    var $ele = $('#demo-a');
    $ele.m2mcontainer( {
        scroll:{
            options: {}
        },
        items: [{
            html: 'Hello'
        }, {
            tag: 'span',
            html: 'bye'
        }]
    });
});