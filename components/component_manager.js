define(
  [
    'libs/flight/lib/component',
  ],
  function(defineComponent) {

    var components = {};

    var ComponentManager = {
    
      create: function() {
        var name = Array.prototype.shift.call(arguments);
        components[name] = {
          mixins: arguments,
          component: defineComponent.apply(this, arguments)
        };
        return components[name].component;
      },

      // TODO:
      extend: function() {
        var baseName = Array.prototype.shift.call(arguments)
          , name = Array.prototype.shift.call(arguments);

        components[name] = {
          mixins: ''
        };
        return components[name].component;
      },

      get: function(name) {
        return components[name].component; 
      },

      each: function(fn) {
        $.each(components, function(name, cmp) {
          fn(name, cmp.component);
        });
      }
    };

    return ComponentManager;
  }
);
