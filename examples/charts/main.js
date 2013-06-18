

requirejs.config({
    baseUrl: '../../'
});

define(
    [
    'components/dashboard/dashboard',
    'components/mapViewer',
    'components/chart/chart_container',
    'components/chart/bar_chart',
    'components/chart/area_chart',
    'components/chart/radar_chart',
    'components/chart/range_selection_chart'
    ],
    
    function() {

        requirejs(['components/jquery_plugins'], function() {
        
        $('.dashboard').m2mdashboard({
            mainContent: [{
                component: 'chartContainer',
                rangeField: 'selectedRange',
                valueField: 'totalRegistered',
                className: 'chart',
                marginRight: 45,
                marginBottom: 8,
                grid: true,
                axisy: true,
                charts: [{
                    type: 'areaChart',
                    tooltip: true,
                    model: 'totalRegistered',
                    //rangeField: 'selectedRange',
                    cssClass: 'cyan'
                }]
            }],
            overviewPanel: {},
            data: function(callback) {
//                var d = '{"totalRegistered": ['
//                    +'{"date": 1356994800000,"value": 25},'
//                    +'{"date": 1357081200000,"value": 32},'
//                    +'{"date": 1357167600000,"value": 39},'
//                    +'{"date": 1357254000000,"value": 45},'
//                    +'{"date": 1357340400000,"value": 53},'
//                    +'{"date": 1357426800000,"value": 58},'
//                    +'{"date": 1357513200000,"value": 66},'
//                    +'{"date": 1357599600000,"value": 72},'
//                    +'{"date": 1357686000000,"value": 77},'
//                    +'{"date": 1357772400000,"value": 84},'
//                    +'{"date": 1357858800000,"value": 89},'
//                    +'{"date": 1357945200000,"value": 97},'
//                    +'{"date": 1358031600000,"value": 104},'
//                    +'{"date": 1358118000000,"value": 109},'
//                    +'{"date": 1358204400000,"value": 115},'
//                    +'{"date": 1358290800000,"value": 123}'
//                    +']}';
                var d = '{"totalRegistered":[1,2,3,4,5]}';
                callback(d);
            }
            });
        });
    }
);