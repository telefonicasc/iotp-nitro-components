(function() {

  var nitroComponents = requirejs.s.contexts._.config.nitroComponents ||
    [
      'components/dashboard/dashboard',
      'components/dashboard/dashboard_main_panel',
      'components/container',
      'components/chart/area_chart',
      'components/chart/bar_chart',
      'components/chart/radar_chart',
      'components/chart/chart_container',
      'components/chart/range_selection_chart',
      'components/dashboard/overview_subpanel',
      'components/toggle',
      'components/graph_editor',
      'components/card/card'
    ];

  nitroComponents.unshift('components/component_manager');

  define(nitroComponents, function(ComponentManager) {

      var pluginPrefix = 'm2m';

      ComponentManager.each(function(name, component) {
        var fullName = pluginPrefix + name;
        jQuery.fn[fullName] = function(options) {
          return this.each(function() {
            component.attachTo(jQuery(this), options);
          })
        };
      });
    }
  );
})();
