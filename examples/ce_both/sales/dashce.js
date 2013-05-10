'use strict';

var DashCE = (function () {

	var apiUrl = 'http://localhost/dashce/';

  var config = {
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
      doQuery(cb);
    }
  };

  
  var doQuery = function(cb, from, to){

      $.getJSON('data/fake_data.json', function(data) {
          $.each(data.deactivations, function(i, item) {
            item.value = 0 - item.value;
          });
          cb(data);
      });
  }

  var generateRandomData = function(from, days) {
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
  };


	return {
    config: config,
	}

}());