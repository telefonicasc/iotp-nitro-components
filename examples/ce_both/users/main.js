requirejs.config({
  baseUrl: '../../'
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
  
    requirejs(['users/dashce.js','components/jquery_plugins'], function() {
  
      $('.dashboard').m2mdashboard(DashCE.config);
      
    });
  }

);
