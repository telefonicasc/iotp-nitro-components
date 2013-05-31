'use strict';

function DashCE_sales() {};

DashCE_sales.prototype.config = {
    mainContent: [
      {
      component: 'dashboardMainPanel',
      title: 'Number of bundles sold',
      className: 'top-chart',
      items: [{
        component: 'chartContainer',
        rangeField: 'selectedRange',
        valueField: 'revenueTotal',
        className: 'chart',
        axisy: true,
        grid: true,
        marginBottom: 0,
        marginRight: 40,
        charts: [{
          type: 'areaStackedChart',
          colorPattern: './img/pattern_yellow.png',
          colorLine: '#b5a86a',
          model: 'revenueTotal',
          tooltip: {
            caption: 'Bundles sold',
          },
          rangeField: 'selectedRange',
          cssClass: 'yellow'  
        },
        {
          type: 'areaStackedChart',
          colorPattern: './img/pattern_green.png',
          colorLine: '#aec4bc',
          model: 'revenueDATA',
          rangeField: 'selectedRange',
          cssClass: 'green'  
        }]
      }]
    },
    {
        component: 'dashboardMainPanel',
        title: 'Revenue earned',
        className: 'bottom-chart',
        items: [{
          component: 'chartContainer',
          rangeField: 'selectedRange',
          valueField: 'revenueTotal',
          className: 'chart',
          grid: true,
          classGrid: 'bg_grid_green',
          marginBottom: 15,
          marginRight: 40,
          axisx: true,
          timeAxis: { stepTick: 1, margin: 0, paddingTick: 10, tickFormat: '%b %e' }, 
          axisy: true,
          charts: [{
            type: 'barChart',
            model: 'revenueTotal',
            tooltip: {
              caption: 'in revenues'
            }
            //rangeField: 'selectedRange'
          }]
        }]
    },
    {
      component: 'dashboardMainPanel',
      title: 'Time period',
      className: 'timeline',
      contextMenu: {
        text: 'Set view size',
        items: [{
          text: 'Week',
          action: 'action-week',
          fixRange: 7
        }, {
          text: 'Month',
          action: 'action-month',
          fixRange: 35 // 5 weeks of 7 days
        }],
        onSelect: function(item){
          $('.range-selection-chart').trigger('rangeSelected', item);
        }
      },  
      items: [{
        component: 'chartContainer', 
        rangeField: 'range',
        valueField: 'revenueTotal',
        axisx: true,
        timeAxis: { tickFormat: '%B', margin: -20, stepType: 'month', paddingTick: 25, stepTick: 1 },
        className: 'chart range-selection-chart',
        rangeSelection: {
          rangeField: 'range',
          selectedRangeField: 'selectedRange',
          fixRange: 7
        },
        charts: [{
            type: 'areaChart',
            model: 'revenueTotal',
            //rangeField: 'range',
        },{
            type: 'areaChart',
            model: 'revenueTotal',
            clipRange: 'selectedRange',
            //rangeField: 'selectedRange',
            cssClass: 'selected-chart'
        }] 
      }]
    }
    ],
    overviewPanel: {
      title: 'days of sales',
      contextMenu: null,
      items: [
        {
          className: 'date-range last-section-panel',
          tpl: '<div>{{#value}} {{start}} - {{end}} ({{num_days}} days) {{/value}}</div><div>{{}}</div>',
          model: function(value) {
            var format = d3.time.format('%e %b %Y');
            if (value && value.selectedRange) {              
              return {
                start: format(value.selectedRange[0]),
                end: format(value.selectedRange[1]),
                num_days: (value.selectedRange[1]-value.selectedRange[0])/(1000*60*60*24)
              }
            }
          }
        },{

          component: 'OverviewSubpanel',
          iconClass: 'brown',
          text: function(data) {
            if (data) {
              return sum(data.bundlePurchasedTIMETotalDay, data.selectedRange);
            } else {
              return 0;
            }
          },
          text1: function(data){
            if (data) {
              return ' € '+Math.floor(sum(data.revenueTotal, data.selectedRange)*100)/100;
            } else {
              return 0;
            }
          },
          caption: 'Total bundles sold'
        }, {
          component: 'OverviewSubpanel',
          iconClass: 'yellow',
          text: function(data) {
            if (data) {
              return sum(data.bundlePurchasedTIMETotalDay, data.selectedRange) - sum(data.bundlePurchasedDATATotalDay, data.selectedRange);
            } else {
              return 0;
            }
          },
          text1: function(data){
            if (data) {
              return ' € '+(Math.floor(sum(data.revenueTotal, data.selectedRange)*100)/100 - Math.floor(sum(data.revenueDATA, data.selectedRange)*100)/100) ;
            } else {
              return 0;
            }
          },
          caption: 'Time bundles sold'
        }, {
          component: 'OverviewSubpanel',
          iconClass: 'green',
          className: 'last-section-panel',
          text: function(data) {
            if (data) {
              return sum(data.bundlePurchasedDATATotalDay, data.selectedRange);
            } else {
              return 0;
            }
          },
          text1: function(data){
            if (data) {
              return ' € '+Math.floor(sum(data.revenueDATA, data.selectedRange)*100)/100;
            } else {
              return 0;
            }
          },
          caption: 'Data bundles sold'
        }
      ]
    },
    data: function(cb) {
       $.getJSON('data/bundles.json')
       .done(function(json){
          var data = DashCE_sales.createDataObject(json);
          cb(data);
          setTimeout(function(){
              $('.range-selection-chart').trigger('rangeSelected', {
                  text: 'Day',
                  action: 'action-day',
                  fixRange: 7 // 5 weeks of 7 days
              });
          }, 500);
       })    
    }
};

DashCE_sales.prototype.createDataObject = function(json){
  var data = {
          bundlePurchasedTIME: [],
          bundlePurchasedTIMETotalDay: [],
          bundlePurchasedTIMEAcc: [],
          bundlePurchasedDATA: [],
          bundlePurchasedDATATotalDay: [],
          bundlePurchasedDATAAcc: [],
          revenueTotal: [],
          revenueDATA: [],
          fixRange: 35
  }

  $.each(json, function(i, item) {
    var date = d3.time.day.round(new Date(item.ts)).getTime();
    var purchasedTIME = { date: date, value:{} };
    var purchasedTIMETotalDay = { date: date, value: 0 };
    var purchasedDATA = { date: date, value:{} };
    var purchasedDATATotalDay = { date: date, value: 0 };
    var revenueTotal = { date: date, value: 0, value2: 0 };
    var revenueDATA = { date: date, value: 0, value2: 0 };
    
    $.each(item.type, function(j, bundle){
      if (bundle.type === 'DATA'){
         purchasedDATA.value[bundle.name] = bundle.purchased;   
         purchasedDATATotalDay.value += bundle.purchased;
         revenueDATA.value += (bundle.price * bundle.purchased)/100;
         revenueDATA.value2 = purchasedDATATotalDay.value;
      }

      purchasedTIME.value[bundle.name] = bundle.purchased;   
      purchasedTIMETotalDay.value += bundle.purchased;       
      revenueTotal.value += (bundle.price * bundle.purchased)/100;
      revenueTotal.value2 = purchasedTIMETotalDay.value;
    });

    data['bundlePurchasedTIME'].push(purchasedTIME);
    data['bundlePurchasedTIMETotalDay'].push(purchasedTIMETotalDay);
    data['bundlePurchasedDATA'].push(purchasedDATA);
    data['bundlePurchasedDATATotalDay'].push(purchasedDATATotalDay);

    revenueTotal.value = Math.floor(revenueTotal.value*100)/100;
    data['revenueTotal'].push(revenueTotal);

    revenueDATA.value = Math.floor(revenueDATA.value*100)/100;
    data['revenueDATA'].push(revenueDATA);

  });

  var prev = 0;
  $.each(data['bundlePurchasedTIMETotalDay'], function(i, item){
    var total = { date: item.date, value: item.value + prev };  
    data['bundlePurchasedTIMEAcc'].push(total);    
    prev = total.value;   
  });

  console.log('data', data);
  return data;
}


/* -------- PRIVATE --------- */

function sum(a, range) {
    var sum = 0;
    if (a) {
      $.each(a, function(i, item) {
        if (!range ||
          item.date >= range[0] &&
          item.date <= range[1]) {
          sum += item.value;
        }
      });
    }
    return sum;
}

var DashCE_sales = new DashCE_sales();
