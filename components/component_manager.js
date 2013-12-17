/*
The *ComponentManager* object is used to create components. It is a wrapper for
twitter flight defineComponent function, but it allows you to define a name
for the component. This allows the library to create jQuery plugins and
angular directives for each of the components you defined, using that name.
You can add components to a *Container* using this name also.

You create a component using the *create* method of the *ComponentManager*:
```javascript
    define(
        [
            'components/component_manager'
        ],

        function(ComponentManager) {

            return ComponentManager.create('MyComponent', MyComponent);

            function MyComponent() {

                // Component Code here

            }
        }
    );
```

In this example MyComponent function, is the same constructor function you
would use
You can get a Component by its name using *get* method:
```javascript
    ComponentManager.get('ComponentName');
```

You can also extend a Component using *extend* method:
```javascript
    ComponentManager.extend(ParentComponent, 'ChildComponent', ChildComponent);
```

This basically creates a new component including all the mixins defined for
ParentComponent plus the mixins you pass for the ChildComponent.

Look at twitter flight documentation and other components for examples of
how to build your own components.

### Methods

Method | Parameters | Return | Description
--- | --- | --- | ---
create | _name, constructor, mixins_ | component | Create componente with [Twitter Flight](http://twitter.github.io/flight/)
extend | _constructor, name, mixins_ | component | Extended component
get | _name_ | component | Get component
each | _function(name, component)_ | undefined | Iterator for all components

@name ComponentManager

*/
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
                var cmp = components[name];
                var flightComponent = null;
                if(cmp){
                    flightComponent = components[name].flightComponent;
                }else{
                    console.error('Component "'+name+'" is undefined; components :', components);
                }
                return flightComponent;
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
