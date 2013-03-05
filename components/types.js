define(
  [
    'components/container',
    'components/dashboard/dashboard',
    'components/chart/chart_container',
    'components/chart/area_chart'
  ],

  function(
    Container,
    Dashboard,
    ChartContainer,
    AreaChart
  ) {
    debugger;
    return {
      'container': Container,
      'dashboard': Dashboard,
      'chartContainer': ChartContainer,
      'areaChart': AreaChart
    };
  }
);

