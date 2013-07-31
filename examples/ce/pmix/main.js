requirejs.config({
  baseUrl: '../../../'
});

define(
  [
    'components/dashboard/dashboard',
    'components/chart/bar_chart',
    'components/chart/area_chart',
    'components/chart/area_stacked_chart',
    'components/chart/group_bar_chart',
    'components/chart/column_chart',
    'components/chart/radar_chart',
    'components/chart/range_selection_chart',
    'components/chart/carousel_barchart',
    'components/dashboard/dashboard_main_panel',
    'components/dashboard/overview_subpanel',
    'components/dashboard/carousel_panel'
  ],
  
  function() {
  
    requirejs(['../commons.js','dashce.js','components/jquery_plugins'], function() {
      
      $('.dashboard').m2mdashboard(DashCE_pmix.config);
    
    });
  }
);
