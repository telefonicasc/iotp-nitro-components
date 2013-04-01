(function() {

  define(['components/component_manager'], function(ComponentManager) {

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
