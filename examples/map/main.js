requirejs.config({
    baseUrl: '../../'
});
define(
[
    'components/dashboard/map',
    'libs/mapbox-1.3.1'

],
function() { requirejs(['components/jquery_plugins'], function() {
    var positions = [
        { 'cssClass' : 'red' , 'latitude' : 50.452519 , 'longitude' : 7.489134},
        { 'cssClass' : 'red' , 'latitude' : 50.456729 , 'longitude' : 7.495},
        { 'cssClass' : 'red' , 'latitude' : 50.456729 , 'longitude' : 7.489134},
        { 'cssClass' : 'red' , 'latitude' : 50.48 , 'longitude' : 7.49}
    ];
    var $ele = $('#map');
    $ele.m2mDashboardMap();
    $ele.trigger('valueChange', {value:positions});
    //L.mapbox.map($ele[0], 'keithtid.map-w594ylml');

});});
