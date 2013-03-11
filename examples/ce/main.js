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
    'components/chart/range_selection_chart',
    'components/dashboard/overview_subpanel'
  ],
  
  function(Dashboard) {

    Dashboard.attachTo('.dashboard', {
      mainContent: [{
        component: 'dashboardMainPanel', 
        title: 'Online users',
        className: 'online-users',
        contextMenu: {
          onSelect: function(item) {
            if (item.action === 'actionRegistered') {
              console.log('create action registered');
            } else if (item.action === 'actionVisitors') {
              console.log('create action visitors');
            }
          },
          items: [{
            text: 'Create action for registered',
            action: 'actionRegistered'            
          }, {
            text: 'Create action for visitors',
            action: 'actionVisitors'
          }, {
            text: '--'
          }, {
            text: 'Show on chart',
            items: [{
              text: 'Registered users online',
              type: 'checkbox'
            }, {
              text: 'Visitors online',
              type: 'checkbox'
            }, {
              text: 'Total registered users',
              type: 'checkbox'
            }, {
              text: 'Total unique visitors',
              type: 'checkbox'
            }]
          }]
        },
        items: [{
          component: 'chartContainer', 
          rangeField: 'selectedRange',
          valueField: 'registered',
          className: 'chart',
          grid: true,
          charts: [{
            type: 'areaChart',
            valueField: 'registered',
            rangeField: 'selectedRange',
            cssClass: 'blue'            
          }, {
            type: 'areaChart',
            valueField: 'visitors',
            rangeField: 'selectedRange',
            cssClass: 'green'
          }]
        }]
      }, {
        component: 'dashboardMainPanel',
        title: 'Registrations & deactivations',
        className: 'registrations',
      }, {
        component: 'dashboardMainPanel',
        title: 'Timeline',
        className: 'timeline',
        contextMenu: {
          text: 'Set view size',
          items: [{
            text: 'Week'
          }, {
            text: 'Month'
          }, {
            text: 'Quarter'
          }, {
            text: 'Unconstrained'
          }]
        },  
        items: [{
          component: 'chartContainer', 
          rangeField: 'range',
          valueField: 'registered',
          className: 'chart',
          rangeSelection: {
            rangeField: 'range',
            selectedRangeField: 'selectedRange'
          },
          charts: [{
            type: 'areaChart',
            valueField: 'registered',
            rangeField: 'range',
            cssClass: 'blue'            
          }, {
            type: 'areaChart',
            valueField: 'registered',
            rangeField: 'selectedRange',
            cssClass: 'green'
          }]
          //component: 'rangeSelectionChart'
        }]
      }],
      overviewPanel: {
        title: 'Days of user stats',
        items: [{
          component: 'overviewSubpanel',
          iconClass: 'icon-arrow-up',
          text: 'Blablblbal',
          caption: 'aasdasd' 
        }]
      },
      data: function(cb) {
        $.getJSON('data/registered.json', function(data) {
          cb(data);
        });
      }
    });
  }

);
