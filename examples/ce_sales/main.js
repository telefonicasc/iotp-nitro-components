requirejs.config({
  baseUrl: '../../',
  hostUrl: './'
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
  
    requirejs(['dashce.js','components/jquery_plugins'], function() {
      
      $('.dashboard').m2mdashboard({
        mainContent: [
          {
          component: 'dashboardMainPanel',
          title: 'Product Mix',
          className: 'product-mix',
          items: [{
            component: 'chartContainer',
            rangeField: 'selectedRange',
            valueField: 'registrations',
            className: 'chart',
            grid: false,
            marginBottom: 150,
            marginRight: 30,
            axisx: false,
            axisy: false,
            charts: [{
              type: 'groupBarChart',
              model: 'bundleSales',
              colors: ["#d3d2bc", "#dfcab5", "#c5cfc5", "#d7b7ab", "#d6d5a4", "#c1aeb0"]
            }]
          }]
        },
        {
          component: 'dashboardMainPanel',
          title: 'Timeline',
          className: 'timeline',
          contextMenu: {
            text: 'Set view size',
            items: [{
              text: 'Week',
              action: 'action-week',
              range: 7
            }, {
              text: 'Month',
              action: 'action-month',
              range: 35 // 5 weeks of 7 days
            }, {
              text: 'Quarter',
              action: 'action-quarter',
              range: 140 // 20 weeks of 7 days
            }, {
              text: 'Unconstrained',
              action: 'action-unconstrained',
              range: 7
            }],
            onSelect: function(item){
              $('.range-selection-chart').trigger('rangeSelected', item);
            }
          },  
          items: [{
            component: 'chartContainer', 
            rangeField: 'range',
            valueField: 'totalRegistered',
            axisx: false,
            className: 'chart range-selection-chart',
            rangeSelection: {
              rangeField: 'range',
              selectedRangeField: 'selectedRange',
              fixRange: 7
            },
            charts: [{
              type: 'barChart',
              model: 'bundleSalesSum',
              //rangeField: 'range',
              cssClass: 'whole-chart'   
            }] 
          }]
        }
        ],
        overviewPanel: {
          title: 'Samples Overview Panel',
          contextMenu: null,
          items: [
            {
              className: 'date-range last-section-panel',
              tpl: '<div>{{#value}} {{start}} to {{end}} ({{num_days}} days) {{/value}}</div><div>{{}}</div>',
              model: function(value) {
                var format = d3.time.format('%e-%b-%y');
                if (value && value.selectedRange) {              
                  return {
                    start: format(value.selectedRange[0]),
                    end: format(value.selectedRange[1]),
                    num_days: (value.selectedRange[1]-value.selectedRange[0])/(1000*60*60*24)+1
                  }
                }
              }
            }
          ]
        },
        data: function(cb) {
          DashCE.doQuery(cb);
        }
      });
    });
  }
);
