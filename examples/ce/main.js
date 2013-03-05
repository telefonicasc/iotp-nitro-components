requirejs.config({
  baseUrl: '/m2m-nitro-components'
});

define(
  [
    'components/dashboard/dashboard',
    'components/dashboard/dashboard_main_panel',
    'components/container',
    'components/chart/area_chart',
    'components/chart/chart_container',
    'components/chart/range_selection_chart'
  ],
  
  function(Dashboard) {

    Dashboard.attachTo('.dashboard', {
      mainContent: [{
        component: 'dashboardMainPanel', 
        title: 'Online users',
        className: 'online-users',
        items: [{
          component: ['chartContainer', 'areaChart'],
          className: 'chart'
        }]
      }, {
        component: 'dashboardMainPanel',
        title: 'Registrations & deactivations',
        className: 'registrations',
      }, {
        component: 'dashboardMainPanel',
        title: 'Timeline',
        className: 'timeline',
        items: [{
          component: 'rangeSelectionChart'
        }]
      }],
      data: function(cb) {
        $.getJSON('data/registered.json', function(data) {
          cb(data.data);
        });
      }
    });
  }

);
