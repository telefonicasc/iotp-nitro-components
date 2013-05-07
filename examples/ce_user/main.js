requirejs.config({
  baseUrl: '/m2m-nitro-components'
});

define(
    [
        'components/dashboard/dashboard',
        'components/chart/bar_chart',
        'components/chart/area_chart',
        'components/chart/radar_chart',
        'components/chart/range_selection_chart',
        'components/dashboard/dashboard_main_panel',
        'components/dashboard/overview_subpanel'
    ],

    function() {
        requirejs(['components/jquery_plugins'], function() {
            //CEUsersDashboard is defined in index.js
            $('.dashboard').m2mdashboard(CEUsersDashboard.config);
        });
    }
);
