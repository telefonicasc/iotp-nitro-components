define(
  [
    'libs/flight/lib/component',
  ],
  function(defineComponent) {

    var components = {};

    var ComponentManager = {
    
      create: function() {
        var name = Array.prototype.shift.call(arguments);
        components[name] = defineComponent.apply(this, arguments);
        return components[name];
      },

      register: function(name, component) { 
        components[name] = component;
      },

      get: function(name) {
        return components[name]; 
      }
    };

    return ComponentManager;
  }
);
