requirejs.config({
    baseUrl: '../../'
});
define(
[
    'components/widget_battery'
],
function() { requirejs(['components/jquery_plugins'], function() {
    var $ele = $('#battery');
    $ele.m2mbatteryWidget({height:80, uom:'W'});

    $('#action1').on('click', function(){
        $ele.trigger('drawBattery', ['full', 55]);
    });
    $('#action2').on('click', function(){
       $ele.trigger('drawBattery-voltage', 100);
    });
    $('#action3').on('click', function(){
        $ele.trigger('drawBattery-level', 'empty');
    });
    $('#action4').on('click', function(){
        $ele.trigger('valueChange', {value:{voltage:35, charge:'low'}});
    });
    $('#action5').on('click', function(){
        $ele.trigger('refresh');
    });
});});
