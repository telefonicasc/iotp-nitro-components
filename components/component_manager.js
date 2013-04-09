define(
    [
        'libs/flight/lib/component'
    ],
    function(defineComponent) {

        var components = {};

        function createComponent(name, mixins) {
            var component = {
                    mixins: mixins,
                    flightComponent: defineComponent.apply(this, mixins)
                };

            component.flightComponent.componentName = name;
            components[name] = component;
            return component;
        }

        var ComponentManager = {

            create: function() {
                var args = Array.prototype.slice.call(arguments),
                    name = args.shift();
                return createComponent(name, args).flightComponent;
            },

            extend: function() {
                var args = Array.prototype.slice.call(arguments),
                    base = args.shift(),
                    name = args.shift(),
                    baseComponent, mixins;

                if ($.isFunction(base)) {
                    baseComponent = components[base.componentName];
                }else {
                    baseComponent = components[base];
                }

                mixins = baseComponent.mixins.concat(args);
                return createComponent(name, mixins).flightComponent;
            },

            get: function(name) {
                return components[name].flightComponent;
            },

            each: function(fn) {
                $.each(components, function(name, cmp) {
                    fn(name, cmp.flightComponent);
                });
            }
        };

        return ComponentManager;
    }
);
