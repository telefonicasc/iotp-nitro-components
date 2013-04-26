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
  
    requirejs(['components/jquery_plugins'], function() {
      
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
              action: 'action-week' 
            }, {
              text: 'Month',
              action: 'action-month' 
            }, {
              text: 'Quarter',
              action: 'action-quarter' 
            }, {
              text: 'Unconstrained',
              action: 'action-unconstrained' 
            }],
            onSelect: function(item){
              console.log(item);
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
              selectedRangeField: 'selectedRange'
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
          $.getJSON('data/fake_data.json', function(data) {
            $.each(data.deactivations, function(i, item) {
              item.value = 0 - item.value;
            });
            var data = generateRandomData(1356998400000, 35);    
            cb(data);
          });
        }
      });

      function generateRandomData(from, days) {
        var data = {
            totalRegistered: [],
            onlineRegistered: [],
            visitors: [],
            registrations: [],
            deactivations: [],
            bundleSales:[],
            bundleSalesSum:[]
        }
          , date = from
          , totalRegistered = 20
          , conversionRate = 0.11
          , registeredRate = 0.7
          , deactivationRate = 0.01
          , dayInc = 1000*60*60*24;
          var endDate = from + days*dayInc;  

        while (date < endDate) {

          var todayCr = conversionRate*(Math.random()*0.4+0.8)
            , todayOnlineRegistered = Math.round(totalRegistered*(Math.random()*0.4+0.1))
            , todayRr = registeredRate*(Math.random()*0.4+0.8)
            , todayDr = deactivationRate*(Math.random()*0.4+0.8)
            , todayVisitors = Math.round(totalRegistered*(Math.random()*0.2)+60)
            , todayRegistrations = Math.round(todayVisitors*todayCr)
            , todayDeactivations = Math.round(totalRegistered*todayDr);

          var sales1h = Math.floor(Math.random()*(9)+1),
              sales4h = Math.floor(Math.random()*(9)+1),
              sales8h = Math.floor(Math.random()*(9)+1),
              sales1d = Math.floor(Math.random()*(9)+1),
              sales1m = Math.floor(Math.random()*(9)+1),
              sales50Meg =Math.floor(Math.random()*(9)+1),
              sales250Meg = Math.floor(Math.random()*(9)+1);

          totalRegistered += todayRegistrations;
          totalRegistered -= todayDeactivations;      

          data.totalRegistered.push({ date: date, value: totalRegistered });
          data.onlineRegistered.push({ date: date, value: todayOnlineRegistered });
          data.visitors.push({ date: date, value: todayVisitors });
          data.registrations.push({ date: date, value: todayRegistrations });
          data.deactivations.push({ date: date, value: todayDeactivations });
          data.bundleSales.push({ date: date, value: {'1 hour':sales1h , '4 hours': sales4h,'8 hours':sales8h, '1 day':sales1d, '1 month':sales1m, '50 megs':sales50Meg, '250 megs':sales250Meg} });
          data.bundleSalesSum.push({ date: date, value: (sales1h+sales4h+sales8h+sales1d+sales1m+sales50Meg+sales250Meg) });



          date += dayInc;
        }
          
        return data;
      }

    });
  }
);
