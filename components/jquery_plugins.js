(function() {

  define(['components/component_manager'], function(ComponentManager) {

      var pluginPrefix = 'm2m';

      function createJqueryPlugin(name, component) {
        var fullName = pluginPrefix + name;
        jQuery.fn[fullName] = function(options) {
          return this.each(function() {
            component.attachTo(jQuery(this), options);
          })
        };
      }

      ComponentManager.each(function(name, component) {
        createJqueryPlugin(name, component);
      });

      jQuery.m2mExtend = function() {
        var component = ComponentManager.extend.apply(this, arguments)
          , name = component.componentName;
        createJqueryPlugin(name, component);
      }
    }
  );
})();
