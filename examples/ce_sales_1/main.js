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
          var from  = 1356998400000, to = 1364688000000,
              url = 'http://mongodb1-1:27080/dashce/';

          //var uriBundles = encodeURI(url+'bundles/_find?batch_size=1000&criteria={"ts": {"$gte": {"$date" : '+from+'}, "$lte": {"$date" : '+to+'}}}');
          //var uriAccounts = encodeURI(url+'accounts/_find?batch_size=1000&criteria={"ts": {"$gte": {"$date" : '+from+'}, "$lte": {"$date" : '+to+'}}}');
          var uriBundles = 'data/bundles.json', uriAccounts = 'data/accounts.json';
          var queryBundles = $.getJSON(uriBundles);
          var queryAccounts = $.getJSON(uriAccounts);
          
          $.when( queryBundles, queryAccounts ).done(function(res1, res2) {
              var data = createDataObject(res1, res2)
              cb(data);
          }).fail(function(e) {
            alert('Error fetching data from server');
          });
        }
      });
      
      function createDataObject(bundlesData, accountsData){
        var data = {
                totalRegistered: [],
                onlineRegistered: [],
                visitors: [],
                registrations: [],
                deactivations: [],
                bundleSales: [],
                bundleSalesSum: []
              }

        var results = bundlesData[0].results;
        $.each(results, function(i, item) {
          var obj = { date: item.ts.$date, value:{} };
          var objSum = { date: item.ts.$date, value: 0 };
          $.each(item.type, function(j, bundle){
              obj.value[bundle.name] = bundle.purchased;
              objSum.value = objSum.value + bundle.purchased;
          });
          data['bundleSales'].push(obj);
          data['bundleSalesSum'].push(objSum);
        });

        results = accountsData[0].results;
        var sumRegistered = 0;
        var sumOnlineRegistered = 0;
        $.each(results, function(i, item) {
          sumRegistered += item.new_registers.count;
          sumOnlineRegistered += item.online.count;
          data['registrations'].push({ date: item.ts.$date, value:item.new_registers.count });
          data['totalRegistered'].push({ date: item.ts.$date, value:sumRegistered });
          data['onlineRegistered'].push({ date: item.ts.$date, value:sumOnlineRegistered });
          data['deactivations'].push({ date: item.ts.$date, value:item.deactivations });
          data['visitors'].push({ data: item.ts.$date, value: item.visitors.newly_registered})
        });

        return data;
      }

    });
  }
);
