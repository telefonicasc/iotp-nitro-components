requirejs.config({
  baseUrl: '../../',
  hostUrl: './'
});

define(
  [
    'components/dashboard/dashboard',
    'components/chart/bar_chart',
    'components/chart/area_chart',
    'components/chart/radar_chart',
    'components/chart/range_selection_chart',
    'components/dashboard/dashboard_main_panel',
    'components/dashboard/overview_subpanel',
    'components/dashboard/cell_barchart_subpanel'
  ],
  
  function() {
  
    requirejs(['dashce.js','components/jquery_plugins'], function() {
      
      $('.dashboard').m2mdashboard(DashCE_users.config);
      $('.range-selection-chart').trigger('rangeSelected', {
              text: 'Month',
              action: 'action-month',
              range: 35 // 5 weeks of 7 days
            });

    });
  }
);
