var CEUsersDashboard = CEUsersDashboard || {};

(function() {
    CEUsersDashboard.config = {
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
          valueField: 'totalRegistered',
          className: 'chart',
          marginRight: 45,
          marginBottom: 8,
          grid: true,
          axisy: true,
          charts: [{
            type: 'areaChart',
            tooltip: true,
            model: 'totalRegistered',
            rangeField: 'selectedRange',
            cssClass: 'cyan'
          }, {
            type: 'areaChart',
            tooltip: true,
            model: 'onlineRegistered',
            rangeField: 'selectedRange',
            cssClass: 'blue'
          }, {
            type: 'areaChart',
            tooltip: true,
            model: 'visitors',
            rangeField: 'selectedRange',
            cssClass: 'purple'
          }]
        }]
      },
      {
        component: 'dashboardMainPanel',
        title: 'Registrations & deactivations',
        className: 'registrations',
        items: [{
          component: 'chartContainer',
          rangeField: 'selectedRange',
          valueField: 'registrations',
          className: 'chart',
          grid: true,
          marginBottom: 20,
          marginRight: 45,
          axisx: true,
          axisy: true,
          charts: [{
            type: 'barChart',
            model: 'registrations'
            //rangeField: 'selectedRange'
          }, {
            type: 'barChart',
            model: 'deactivations',
            cssClass: 'grey dashed'
            //rangeField: 'selectedRange'
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
          iconClass: 'dot cyan',
          text: function(data) {
            if (data) {
              return last(range(data.totalRegistered, data.selectedRange));
            } else {
              return 0;
            }
          },
          caption: 'Total registered users'
        }, {
          component: 'OverviewSubpanel',
          iconClass: 'dot blue',
          text: function(data) {
            if (data) {
              return sum(data.onlineRegistered, data.selectedRange);
            } else {
              return 0;
            }
          },
          caption: 'Online registered users'
        }, {
          component: 'OverviewSubpanel',
          iconClass: 'dot purple',
          className: 'last-section-panel',
          text: function(data) {
            if (data) {
              return sum(data.visitors, data.selectedRange);
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
                var baseVisitors = sum(data.visitors),
                    baseRegistrations = sum(data.registrations),
                    visitors = sum(data.visitors, data.selectedRange),
                    registrations = sum(data.registrations, data.selectedRange),
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
                var visitors = sum(data.visitors, data.selectedRange),
                    registrations = sum(data.registrations, data.selectedRange);
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
                var registered = last(range(data.totalRegistered, data.selectedRange)),
                    deactivations = 0-sum(data.deactivations, data.selectedRange),
                    baseRegistered = last(data.totalRegistered),
                    baseDeactivations = 0-sum(data.deactivations),
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
                var registered = last(range(data.totalRegistered, data.selectedRange)),
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
                var registered = last(range(data.totalRegistered, data.selectedRange)),
                    online = avg(range(data.onlineRegistered, data.selectedRange)),
                    baseRegistered = last(data.totalRegistered),
                    baseOnline = avg(data.onlineRegistered),
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
                var registered = last(range(data.totalRegistered, data.selectedRange)),
                    online = avg(range(data.onlineRegistered, data.selectedRange));
                return (online/registered*100).toFixed(1) + '%';
              } else {
                return '';
              }
            },
            caption: 'Usage churn'
          }]
        }, {
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
        }]
      },
      data: function(cb) {
        $.getJSON('/m2m-nitro-components/examples/ce_user/data/random.json', function(data) {
          $.each(data.deactivations, function(i, item) {
            item.value = 0 - item.value;
          });
          cb(data);
        });
      }
    };

    function last(a) {
        return a ? a[a.length - 1].value : 0;
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

    function generateRandomData() {
        var data = {
              totalRegistered: [],
              onlineRegistered: [],
              visitors: [],
              registrations: [],
              deactivations: []
            },
            date = new Date(2013, 0, 1).getTime(),
            totalRegistered = 20,
            conversionRate = 0.11,
            registeredRate = 0.7,
            deactivationRate = 0.01,
            endDate = new Date(2013, 3, 14).getTime(),
            dayInc = 1000*60*60*24;

        while (date < endDate) {
            var todayCr = conversionRate*(Math.random()*0.4+0.8),
                todayOnlineRegistered = Math.round(totalRegistered*(Math.random()*0.4+0.1)),
                todayRr = registeredRate*(Math.random()*0.4+0.8),
                todayDr = deactivationRate*(Math.random()*0.4+0.8),
                todayVisitors = Math.round(totalRegistered*(Math.random()*0.2)+60),
                todayRegistrations = Math.round(todayVisitors*todayCr),
                todayDeactivations = Math.round(totalRegistered*todayDr);

            totalRegistered += todayRegistrations;
            totalRegistered -= todayDeactivations;

            data.totalRegistered.push({ date: date, value: totalRegistered });
            data.onlineRegistered.push({ date: date, value: todayOnlineRegistered });
            data.visitors.push({ date: date, value: todayVisitors });
            data.registrations.push({ date: date, value: todayRegistrations });
            data.deactivations.push({ date: date, value: todayDeactivations });
            date += dayInc;
        }
    }

})();