requirejs.config({
  baseUrl: '../../'
});

define(
  [
    'components/dashboard/dashboard',
    'components/chart/group_bar_chart',
    'components/chart/bar_chart',
    'components/chart/range_selection_chart',
    'components/dashboard/dashboard_main_panel',
    'components/dashboard/overview_subpanel',
    'components/dashboard/cell_barchart_subpanel'
  ],
  
  function() {
    requirejs(['sales/dashce.js','components/jquery_plugins'], function() {
      
      $('.dashboard').m2mdashboard(DashCE.config);
    });
  }
);
