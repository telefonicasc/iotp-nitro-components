'use strict';

function DashCE_pmix() {};

DashCE_pmix.prototype.config = {
    mainContent: [
      {
      component: 'dashboardMainPanel',
      title: 'Product Mix',
      className: 'product-mix',
      items: [{
        component: 'chartContainer',
        rangeField: 'selectedRange',
        valueField: 'bundleConsumed',
        className: 'chart',
        marginBottom: 150,
        marginRight: 30,
        charts: [{
          type: 'groupBarChart',
          model: 'bundlePurchasedBars',
          tooltip: true,
          incremental:true,
          colors: ["#d3d2bc", "#dfcab5", "#c5cfc5", "#d7b7ab", "#d6d5a4", "#c1aeb0"]
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
        valueField: 'bundleConsumed',
        axisx: true,
        timeAxis: { tickFormat: '%B', margin: -20, stepType: 'month', paddingTick: 25, stepTick: 1 },
        className: 'chart range-selection-chart',
        rangeSelection: {
          rangeField: 'range',
          selectedRangeField: 'selectedRange',
          fixRange: 7
        },
        charts: [{
            type: 'barChart',
            model: 'bundlePurchasedSum',
            //rangeField: 'range',
            cssClass: 'whole-chart'   
        },{
            type: 'barChart',
            model: 'bundlePurchasedSum',
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
        }
      ]
    },
    data: function(cb) {
       $.getJSON('data/bundles.json')
       .done(function(json){
          var data = createDataObject(json);
          cb(data);
          setTimeout(function(){
              $('.range-selection-chart').trigger('rangeSelected', {
                  text: 'Month',
                  action: 'action-month',
                  fixRange: 35 // 5 weeks of 7 days
              });
          }, 500);
       })    
    }
};

/* -------- PRIVATE --------- */


function createDataObject(json){
  var data = {
          bundlePurchased: [],
          bundlePurchasedSum: [],
          bundleConsumed: [],
          bundleConsumedSum: [],
          bundleOnhold: [],
          bundleOnholdSum: [],
          fixRange: 35
  }

  $.each(json, function(i, item) {
    var consumed = { date: item.ts, value:{} };
    var consumedSum = { date: item.ts, value: 0 };
    var purchased = { date: item.ts, value:{} };
    var purchasedSum = { date: item.ts, value: 0 };
    var onhold = { date: item.ts, value:{} };
    var onholdSum = { date: item.ts, value: 0 };
    
    $.each(item.type, function(j, bundle){
        purchased.value[bundle.name] = bundle.purchased;
        consumed.value[bundle.name] = bundle.consumed;
        onhold.value[bundle.name] = bundle.on_hold;
        purchasedSum.value += bundle.purchased;
        consumedSum.value += bundle.consumed;
        onholdSum.value += bundle.on_hold;
    });

    data['bundlePurchased'].push(purchased);
    data['bundlePurchasedSum'].push(purchasedSum);
    data['bundleConsumed'].push(consumed);
    data['bundleConsumedSum'].push(consumedSum);
    data['bundleOnhold'].push(onhold);
    data['bundleOnholdSum'].push(onholdSum);
  });

  var lastDate = json[json.length-1].ts;

  data['bundlePurchasedBars'] = getBars(data['bundlePurchased'], lastDate);
  data['bundleConsumedBars'] = getBars(data['bundleConsumed'], lastDate);
  data['bundleOnholdBars'] = getBars(data['bundleOnhold'], lastDate);

  console.log('data', data);
  return data;
}


function getBars(data, endTs){
    var maxPeriod = 0;
    var out1 = { maxValue: 0, values:{}};
    var out2 = { maxValue: 0, values:{}};
    var res = {};

    fillDataBars(data, out1, 35, endTs);
    fillDataBars(data, out2, 7, endTs);
    res[35] = out1;
    res[7] = out2;

    return res;
}

function fillDataBars(data, out, fixRange, endTs){
  var maxPeriod = 0;
  $.each(data, function(z, item){

      var end = item.date + fixRange*24*60*60*1000; 
      var endDate = new Date(end);
      var range = [new Date(item.date), endDate];

      //Extract ranged data
      var rawData = $.map(data, function(val, i) {
          if (val.date >= range[0] && val.date < range[1]) {
              return val;
          }
      });

      var num = (fixRange === 7)? 7: 5,
        dataOut = {},
        keys = null,
        maxGroup = 0;

      $.each(rawData, function(i, val){
        if (!keys){
          keys = getObjKeys(val.value);
          $.each(keys, function(j, key){
            dataOut[key] = zeros(num);
          });
        }
        var x = i%num;
        $.each(keys, function(j, key){
          dataOut[key][x] += val.value[key];
                        
        });
      });
  
      $.each(keys, function(j, key){
          var group = dataOut[key];
          $.each(group, function(i, val){
              if (i > 0) {
                  group[i] += group[i-1];
                  if ( group[i] > maxGroup ) { maxGroup = group[i] }
              }
          });
      });

      if (maxGroup > maxPeriod) { maxPeriod = maxGroup }
      var roundDate = d3.time.day.round(new Date(item.date)).getTime();
      out.values[roundDate] = dataOut;
      if (end > endTs){ return false;  }
      
    });

    out.maxValue = maxPeriod;
}

function zeros(length){
    var vector = [];
    for (var i = 0; i < length; i++){ vector[i] = 0; }
    return vector;
}

function getObjKeys(obj){
    var keys = [];
    for(var key in obj){ keys.push(key); }
    return keys;
}

var DashCE_pmix = new DashCE_pmix();
