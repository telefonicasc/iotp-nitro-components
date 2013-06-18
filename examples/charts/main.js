

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
                            className: 'chart type_sidebar',
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
                        var path = '/m2m-nitro-components/examples/charts/res/data/mock.json';

                        $.getJSON(path, function(data) {
                            callback(data);
                        });
                    }
                });
            });
        }
);
