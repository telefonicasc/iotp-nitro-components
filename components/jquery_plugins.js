/**

*components/jquery_plugins* will take all the components created using the
*ComponentManager* and will create jQuery plugins for each of them.
The name of the plugin is `'m2m' + name` of the plugin.
This file needs to be included after all the components have been created.

If you have a component created with the name 'MyComponent' you can do:
```javascript
$('#blabla').m2mMyComponent({ ... });
```

This is the same as doing:
```javascript
define(
    [
        'path/to/mycomponent'
    ],
    function(MyComponent) {
        MyComponent.attachTo($('#blabla'), { ... });
    }
);
```

@name jqueryPlugins
*/
(function() {

    define([
        'components/component_manager',
        'components/component'
    ], function(ComponentManager) {

        var pluginPrefix = 'm2m';

        function createJqueryPlugin(name, component) {
            var fullName = pluginPrefix + name;
            jQuery.fn[fullName] = function(options) {
                return this.each(function() {
                    component.attachTo(jQuery(this), options);
                });
            };
        }

        ComponentManager.each(function(name, component) {
            createJqueryPlugin(name, component);
        });

        jQuery.m2mExtend = function() {
            var component = ComponentManager.extend.apply(this, arguments),
                name = component.componentName;
            createJqueryPlugin(name, component);
        };
    });
})();
