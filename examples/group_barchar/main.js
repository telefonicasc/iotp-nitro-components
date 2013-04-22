requirejs.config({
  baseUrl: '/m2m-nitro-components'
});

define(
  [
    'components/dashboard/dashboard',
    'components/chart/group_bar_chart',
    'components/chart/range_selection_chart',
    'components/dashboard/dashboard_main_panel',
    'components/dashboard/overview_subpanel',
    'components/dashboard/cell_barchart_subpanel'
  ],
  
  function() {
  
    requirejs(['components/jquery_plugins'], function() {
      
      var data = JSON.stringify(generateRandomData());

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
            marginBottom: 20,
            marginRight: 45,
            axisx: false,
            axisy: false,
            charts: [{
              type: 'groupBarChart',
              model: 'productMix',
              colors: ["#d3d2bc", "#dfcab5", "#c5cfc5", "#d7b7ab", "#b3c1bf", "#d6d5a4", "#c1aeb0"]
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
            valueField: 'totalRegistered',
            className: 'chart range-selection-chart',
            rangeSelection: {
              rangeField: 'range',
              selectedRangeField: 'selectedRange'
            },
            charts: [{
              type: 'areaChart',
              model: 'totalRegistered',
              //rangeField: 'range',
              cssClass: 'whole-chart'   
            }, {
              type: 'areaChart',
              model: 'totalRegistered',
              clipRange: 'selectedRange',
              //rangeField: 'selectedRange',
              cssClass: 'selected-chart'
            }] 
          }]
        }
        ],
        overviewPanel: {
          title: 'Samples Overview Panel',
          contextMenu: null,
          items: [{
            component: 'cellBarchartSubpanel',
            className: 'cell-barchart-subpanel',
            text: {
              title: { value: '21%', caption: 'of users online' },
              content: { value: '345', caption: 'unique users online' }
            },
            chart: {
              conf: {
                maxHeight: 70,
                width: 45,
                barPadding: 4
              },
              data: [ { gains: 87 }, { losses: 46 } ]    //values from 0 - 100 
            }
          }]
        },
        data: function(cb) {
          $.getJSON('data/fake_data.json', function(data) {
            $.each(data.deactivations, function(i, item) {
              item.value = 0 - item.value;
            })
            cb(data);
          });
        }
      });

      function generateRandomData() {
      var data = {
          totalRegistered: [],
          onlineRegistered: [],
          visitors: [],
          registrations: [],
          deactivations: [],
          productMix: []
        }
        , date = new Date(2013, 0, 1).getTime()
        , totalRegistered = 20
        , conversionRate = 0.11
        , registeredRate = 0.7
        , deactivationRate = 0.01
        , endDate = new Date(2013, 1, 1).getTime()
        , dayInc = 1000*60*60*24;      

      while (date < endDate) {
        var todayCr = conversionRate*(Math.random()*0.4+0.8)
          , todayOnlineRegistered = Math.round(totalRegistered*(Math.random()*0.4+0.1))
          , todayRr = registeredRate*(Math.random()*0.4+0.8)
          , todayDr = deactivationRate*(Math.random()*0.4+0.8)
          , todayVisitors = Math.round(totalRegistered*(Math.random()*0.2)+60)
          , todayRegistrations = Math.round(todayVisitors*todayCr)
          , todayDeactivations = Math.round(totalRegistered*todayDr)
          , bundle1hour = randomFromInterval(1, 10)
          , bundle4hours = randomFromInterval(1, 10)
          , bundle8hours = randomFromInterval(1, 10)
          , bundle1day = randomFromInterval(1, 10)
          , bundle1month = randomFromInterval(1, 10)
          , bundle50megs = randomFromInterval(1, 10)
          , bundle250megs = randomFromInterval(1, 10);


        totalRegistered += todayRegistrations;
        totalRegistered -= todayDeactivations;      

        data.totalRegistered.push({ date: date, value: totalRegistered });
        data.onlineRegistered.push({ date: date, value: todayOnlineRegistered });
        data.visitors.push({ date: date, value: todayVisitors });
        data.registrations.push({ date: date, value: todayRegistrations });
        data.deactivations.push({ date: date, value: todayDeactivations });
        data.productMix.push({ date: date, value: {'1 hour': bundle4hours, '4 hours': bundle4hours, '8 hours': bundle8hours, '1 day': bundle1day, '1 month': bundle1month, '50 megs': bundle50megs, '250 megs': bundle250megs} });

        date += dayInc;
      }

      console.log(JSON.stringify(data));
      
      return data;
    }

    function randomFromInterval(from,to)
    {
        return Math.floor(Math.random()*(to-from+1)+from);
    }

    });
  }
);
