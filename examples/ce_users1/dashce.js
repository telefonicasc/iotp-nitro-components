var DashCE_users = DashCE_users || {};

(function() {


    var apiUrl = '/dashce/';

    DashCE_users.config = {
      mainContent: [
      {
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
              component: 'toggle',
              model: 'showRegistered',
              className: 'purple dot-toggle'
            }, {
              text: 'Visitors online',
              component: 'toggle',
              model: 'showVisitors',
              className: 'blue dot-toggle'
            }, {
              text: 'Total registered users',
              component: 'toggle',
              model: 'showRegistered',
              className: 'green dot-toggle'
            }, {
              text: 'Total unique visitors',
              component: 'toggle',
              model: 'showUnique',
              className: 'orange dot-toggle'
            }]
          }]
        },
        items: [{
          component: 'chartContainer',
          rangeField: 'selectedRange',
          valueField: 'total_users',
          className: 'chart top',
          marginRight: 45,
          marginBottom: 20,
          axisy: true,
          axisx: true,
          timeAxis: { className: 'timeaxis_bg', tickFormat: '%e', margin: 0, stepType: 'day', paddingTick: 0 },
          grid: false,
          charts: [{
            type: 'areaChart',
            tooltip: true,
            model: 'total_users',
            rangeField: 'selectedRange',
            cssClass: 'brown'
          },
          {
            type: 'areaChart',
            tooltip: true,
            model: 'deactivations',
            rangeField: 'selectedRange',
            cssClass: 'green'
          },
          {
            type: 'areaChart',
            tooltip: true,
            area: true,
            model: 'newly_registers_acc',
            rangeField: 'selectedRange',
            cssClass: 'yellow'
          },
          {
            type: 'areaChart',
            tooltip: true,
            area: false,
            model: 'consumers',
            rangeField: 'selectedRange',
            cssClass: 'blue'
          },
          {
            type: 'columnChart',
            model: 'total_users',
            rangeField: 'selectedRange' 
          }/*, {
            type: 'areaChart',
            tooltip: true,
            area: false,
            model: 'visitors',
            rangeField: 'selectedRange',
            cssClass: 'brown'
          },
          {
            type: 'areaChart',
            tooltip: true,
            area: true,
            model: 'deactivations',
            rangeField: 'selectedRange',
            cssClass: 'blue'
          }*/]
        },
        {
          component: 'chartContainer',
          rangeField: 'selectedRange',
          valueField: 'total_users',
          className: 'chart bottom',
          marginRight: 45,
          marginBottom: 10,
          axisy: false,
          axisx: false,
          grid: false,
          charts: [
          {
            type: 'columnChart',
            model: 'total_users',
            rangeField: 'selectedRange',
            fixHeight: 170,
            items: [{
              component: 'cellBarchartSubpanel',
              text: {
                  content: { value: '' , caption: 'unique users online' },
              },
              chart: {        //(optional)
                  conf: {
                    maxHeight: 80,
                    width: 60,
                    barPadding: 4
                  },
                  data: []    //values from 0 - 100 
              }
            }]
          }]
        }]
      },
      {
        component: 'dashboardMainPanel',
        title: 'Total Users',
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
            }, {
              text: 'Quarter',
              action: 'action-quarter',
              fixRange: 140 // 20 weeks of 7 days
            }, {
              text: 'Unconstrained',
              action: 'action-unconstrained',
              fixRange: -1
            }],
            onSelect: function(item){
              $('.range-selection-chart').trigger('rangeSelected', item);
            }
        },
        items: [{
          component: 'chartContainer',
          rangeField: 'range',
          valueField: 'total_users',
          className: 'chart range-selection-chart',
          marginRight: 0,
          axisx: true,
          timeAxis: { tickFormat: '%B', margin: -20, stepType: 'month', paddingTick: 25, stepTick: 1 },
          rangeSelection: {
            rangeField: 'range',
            selectedRangeField: 'selectedRange',
          },
          charts: [{
            type: 'areaChart',
            model: 'total_users',
            //rangeField: 'range',
            cssClass: 'whole-chart'
          }, {
            type: 'areaChart',
            model: 'total_users',
            clipRange: 'selectedRange',
            //rangeField: 'selectedRange',
            cssClass: 'selected-chart'
          }]
        }]
      }],
      overviewPanel: {
        title: 'Days of user stats',
        contextMenu: {
          onSelect: function(item) {
            if (item.actionid === 'export') {
              window.location = 'http://mongodb1-1/CE/excel/ce.xls';
            }
          },
          items: [{
            actionid: 'export',
            text: 'Export data'
          }, {
            text: '--'
          }, {
            text: 'Set period'
          }, {
            text: 'Set comparison baseline',
            items: [{
              text: 'Previous 10 days'
            }, {
              text: 'This month'
            }, {
              text: 'This quarter'
            }, {
              text: 'All time'
            }]
          }]
        },
        items: [{
          className: 'date-range last-section-panel',
          tpl: '{{#value}} {{start}} to {{end}} {{/value}}',
          model: function(value) {
            var format = d3.time.format('%e-%b-%y');
            if (value && value.selectedRange) {
              return {
                start: format(value.selectedRange[0]),
                end: format(value.selectedRange[1])
              };
            }
          }
        }, {
          component: 'OverviewSubpanel',
          iconClass: 'cyan',
          text: function(data) {
            if (data) {
              return sum(data.newly_registers, data.selectedRange);
            } else {
              return 0;
            }
          },
          caption: 'New users'
        }, {
          component: 'OverviewSubpanel',
          iconClass: 'blue',
          text: function(data) {
            if (data) {
              return last(data.total_users, data.selectedRange);
            } else {
              return 0;
            }
          },
          caption: 'Total registered users'
        }, {
          component: 'OverviewSubpanel',
          iconClass: 'purple',
          className: 'last-section-panel',
          text: function(data) {
            if (data) {
              return sum(data.deactivations, data.selectedRange);
            } else {
              return 0;
            }
          },
          caption: 'Online visitors (not registered)'
        },{
          className: 'vertical-panel-group last-section-panel',
          items: [{
            component: 'OverviewSubpanel',
            className: 'vertical-panel',
            iconClass: function(data) {
              if (data) {
                var baseVisitors = last(data.consumers_acc),
                    baseRegistrations = last(data.total_users),
                    visitors = sum(data.consumers, data.selectedRange),
                    registrations = sum(data.newly_registers, data.selectedRange),
                    baseCr = baseVisitors/baseRegistrations,
                    cr = visitors/registrations;

                if (baseCr > cr) {
                  return 'arrow-down';
                } else {
                  return 'arrow-up';
                }
              } else {
                return '';
              }
            },
            text: function(data) {
              if (data) {
                var visitors = sum(data.consumers, data.selectedRange),
                    registrations = sum(data.newly_registers, data.selectedRange);
                return (registrations/visitors*100).toFixed(1) + '%';
              } else {
                return '';
              }
            },
            caption: 'Conversion rate'
          }, {
            component: 'OverviewSubpanel',
            className: 'vertical-panel',
            iconClass: function(data) {
              if (data) {
                var registered = last(data.total_users, data.selectedRange),
                    deactivations = sum(data.deactivations, data.selectedRange),
                    baseRegistered = last(data.total_users),
                    baseDeactivations = sum(data.deactivations),
                    dc = deactivations/registered,
                    baseDc = baseDeactivations/baseRegistered;
                if (baseDc > dc) {
                  return 'arrow-down';
                } else {
                  return 'arrow-up';
                }
              } else {
                return '';
              }
            },
            text: function(data) {
              if (data) {
                var registered = last(data.total_users, data.selectedRange),
                    deactivations = 0-sum(data.deactivations, data.selectedRange);
                return (deactivations/registered*100).toFixed(1) + '%';
              } else {
                return '';
              }
            },
            caption: 'Deactivation churn'
          }, {
            component: 'OverviewSubpanel',
            className: 'vertical-panel last-vertical-panel',
            iconClass: function(data) {
              if (data) {
                var registered = last(data.total_users, data.selectedRange),
                    online = avg(range(data.consumers, data.selectedRange)),
                    baseRegistered = last(data.total_users),
                    baseOnline = avg(data.consumers),
                    uc = online/registered,
                    baseUc = baseOnline/baseRegistered;

                if (baseUc > uc) {
                  return 'arrow-down';
                } else {
                  return 'arrow-up';
                }
              } else {
                return '';
              }
            },
            text: function(data) {
              if (data) {
                var registered = last(data.total_users, data.selectedRange),
                    online = avg(range(data.consumers, data.selectedRange));
                return (online/registered*100).toFixed(1) + '%';
              } else {
                return '';
              }
            },
            caption: 'Usage churn'
          }]
        }/*, {
          component: 'radarChart',
          maxValues: function(attr, value) {
            if (value) {
              return $.map(value[0].values, function(v) {
                return v*2;
              });
            } else {
              return [];
            }
          },
          model: function(data) {
            var onlineUser = 0,
                onlineUserBase = 1,
                unseen = 1,
                unseenBase = 1,
                visitor = 0,
                visitorBase = 1,
                deactivations = 0,
                deactivationsBase = 1,
                totalUsers = 0,
                totalUsersBase = 1,
                registration = 0,
                registrationBase = 1;


            onlineUserBase = avg(data.onlineRegistered);
            onlineUser = avg(range(data.onlineRegistered, data.selectedRange));
            visitorBase = avg(data.visitors);
            visitor = avg(range(data.visitors, data.selectedRange));
            totalUsersBase = last(data.totalRegistered);
            totalUsers = last(range(data.totalRegistered, data.selectedRange));
            deactivationsBase = avg(data.deactivations);
            deactivations = avg(range(data.deactivations, data.selectedRange));
            registrationBase = avg(data.registrations);
            registration = avg(range(data.registrations,data.selectedRange));

            return [{
              values: [onlineUserBase, unseenBase, visitorBase,
                  deactivationsBase, totalUsersBase, registrationBase],
              className: 'base'
            }, {
              values: [onlineUser, unseen, visitor,
                  deactivations, totalUsers, registration]
            }];
          }
        }*/]
      },
      data: function(cb) {
          doQuery(cb);
      }
    };

    function doQuery2(cb){
      $.getJSON('data/fake_data.json', function(data) {
          $.each(data.deactivations, function(i, item) {
            //item.value = 0 - item.value;
          });

          cb(data);
      });
    }

    function last(a, range) {  
        var res = a ? a[a.length - 1].value : 0; 
        if (a && range) {
          $.each(a, function(i, item) {
            if (!range ||
              item.date >= range[0] &&
              item.date <= range[1]) {
              res = item.value;
            }
          });
          return res;
        }
    }

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

    function avg(a, range) {
      return sum(a, range)/a.length;
    }

    function range(a, range) {
      return a && $.map(a, function(item) {
        if (!range ||
          item.date >= range[0] &&
          item.date <= range[1]) {
          return item;
        }
      });
    }


  var doQuery = function(cb, from, to){
      var uris = ['data/bundles.json', 'data/accounts.json'];
      //var uris = getAllDataUris();

      if (from && to){
        uris = getDataUris(from, to);
      }
      
      $.when( $.getJSON(uris[0]), $.getJSON(uris[1]) ).done(function(res1, res2) {
          console.log('bundles', res1);
          console.log('accounts', res2);
          var data = createDataObject(res1, res2);
          console.log('processData', data);
          cb(data);
        }).fail(function(e) {
            alert('Error fetching data from server');
      });
  };

  var getAllDataUris = function(){
      var to = new Date().getTime();
      var uriBundles = encodeURI(apiUrl+'bundles/_find?batch_size=1000&criteria={"ts": {"$lte": {"$date" : '+to+'}}}');
      var uriAccounts = encodeURI(apiUrl+'accounts/_find?batch_size=1000&criteria={"ts": {"$lte": {"$date" : '+to+'}}}');
      return [uriBundles, uriAccounts];
  };

  var getDataUris = function(from, to){
      var uriBundles = encodeURI(url+'bundles/_find?batch_size=1000&criteria={"ts": {"$gte": {"$date" : '+from+'}, "$lte": {"$date" : '+to+'}}}');
      var uriAccounts = encodeURI(url+'accounts/_find?batch_size=1000&criteria={"ts": {"$gte": {"$date" : '+from+'}, "$lte": {"$date" : '+to+'}}}');
      return [uriBundles, uriAccounts];
  };

  var createDataObject = function(bundlesData, accountsData){
      var data = {
              total_users: [],
              deactivations: [],
              newly_registers: [],
              newly_registers_acc: [],
              consumers: [],
              consumers_acc: []
            }

      results = accountsData[0];
      $.each(results, function(i, item) {
        var ts = item.ts;
        data['total_users'].push({ date: ts, value:item.total_users });
        data['deactivations'].push({ date: ts, value:item.deactivations });
        data['newly_registers'].push({ date: ts, value:item.new_registers.count });
        data['consumers'].push({ date: ts, value:item.consumers.count });
        data['newly_registers_acc'].push({ date: ts, value:item.total_users+item.new_registers.count });
        if (i === 0){
          data['consumers_acc'].push({ date: ts, value:item.consumers.count });
        }else{
          data['consumers_acc'].push({ date: ts, value:data['consumers_acc'][i-1].value+item.consumers.count });
        }

        
      });
      return data;
  };

})();
