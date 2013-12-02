requirejs.config({
  baseUrl: '../../'
});

define(
  [
    'components/dashboard/dashboard',
    'components/chart/area_chart',
    'components/chart/range_selection_chart',
    'components/dashboard/dashboard_main_panel',
    'components/dashboard/overview_subpanel'
  ],

  function() {

    requirejs(['components/jquery_plugins'], function() {

    //window.randomData = generateRandomData();

    $('.dashboard').m2mdashboard({
      mainContent: [{
        component: 'dashboardMainPanel',
        title: 'Online users',
        className: 'online-users',
        contextMenu: null,
        items: [{
          component: 'chartContainer',
          rangeField: 'selectedRange',
          valueField: 'totalRegistered',
          className: 'chart',
          marginRight: 45,
          marginBottom: 20,
          grid: true,
          axisy: true,
          axisx: true,
          timeAxis: { stepTick: 5, margin: 0, paddingTick: 10, tickFormat: '%e-%b' },
          charts: [{
            type: 'areaChart',
            tooltip: true,
            model: 'totalRegistered',
            rangeField: 'selectedRange',
            cssClass: 'purple'
          }]
        }]
      },
      {
        component: 'dashboardMainPanel',
        title: 'Timeline',
        className: 'timeline',
        contextMenu: null,
        axisx: true,
        contextMenu: {
            text: 'Fixed range Data',
            items: [
                { text: 'Week', action: 'action-week', fixRange: 7 },
                { text: 'Month', action: 'action-month', fixRange: 35 },
                { text: 'Manual', fixRange: 0 },
            ],
            onSelect: function (item) {
                $('.range-selection-chart').trigger('rangeSelected', item);
            }
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
            cssClass: 'whole-chart'
          },
          {
            type: 'areaChart',
            model: 'totalRegistered',
            cssClass: 'selected-chart',
            clipRange: 'selectedRange',
          }]
        }]
      }],
      overviewPanel: {
        title: 'Sample overview',
        items: [{
          className: 'date-range last-section-panel',
          tpl: '{{#value}} {{start}} to {{end}} {{/value}}',
          model: function(value) {
            var format = d3.time.format('%e-%b-%y');
            if (value && value.selectedRange) {
              return {
                start: format(value.selectedRange[0]),
                end: format(value.selectedRange[1])
              }
            }
          }
        }]
      },
      data: function(cb) {
        $.getJSON('data2.json', function(data) {
            console.log('data', data);
          cb(data);
        });
      }
    });

    });
  }

);
