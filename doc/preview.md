### How to use the library

The library is designed to be included into your project using *npm*, and 
generate a custom build selecting desired components using *grunt*.
Install iotp-nitro-components npm package from pdihub:

    npm install git+ssh://git@pdihub.hi.inet:iotp-nitro-components

That will download iotp-nitro-components and put it in the node_modules directory.
Install grunt packages:

    npm install grunt grunt-contrib-requirejs grunt-contrib-less grunt-contrib-copy

Next you need to define in your Gruntfile what widgets do you want to include
in your iotp-nitro-components built version. A sample Gruntfile.js including the
MapDashboard widget will be:

    module.exports = function(grunt) {

        grunt.initConfig({

            nitroComponents: {
                build: {
                    out: 'app/lib/nitrocomponents/nitro_components.js',                 //default: your application directory
                    outCss: 'app/lib/nitrocomponents/style/css/nitro_components.css',   //default: style/css/nitro_components.css
                    outImages: 'app/lib/nitrocomponents/style/img',                     //default: style/img
                    components: [
                        'components/dashboard/map',
                        'components/jquery_plugins'
                    ]
                },
                dev: {
                    path: '../iotp-nitro-components/',
                    optimize: 'none',
                    out: '<%= nitroComponents.build.out %>',
                    outCss: '<%= nitroComponents.build.outCss %>',
                    outImages: '<%= nitroComponents.build.outImages %>',
                    components: '<%= nitroComponents.build.components %>'
                }
            }

        });

        grunt.loadNpmTasks('grunt-contrib-less');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-requirejs');
        grunt.loadNpmTasks('grunt-contrib-copy');

        grunt.loadTasks('node_modules/m2m-nitro-components/tasks');

    };

Now if you run:

    grunt nitroComponents

It will generate a javascript file in `app/lib/nitrocomponents/nitro_components.js`,
a css file in `app/lib/nitrocomponents/style/css/nitro-components.css`,
and an images folder in `app/lib/nitrocomponents/style/img` in your app.

The only dependency of iotp-nitro-components is jquery, that you should include
in your page before nitro_components.js. Although, some of the widgets will
require additional dependencies. For example the map widget will depend on
leaflet, but the dependency will be resolved in your built version of `nitro_components.js`.

All the widgets are accesible as jQuery plugins in the form of m2mComponentName.
An options object could be passed to the jQuery plugin.
Here it is an example web page using the mapDashboard widget:

    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title></title>
      <link rel="stylesheet" href="style/css/nitro-components.css" />
    </head>
    <body>
      <div class="panel-body" id="map-secttion"
          data-nitro-component="m2mDashboardMap"
          data-nitro-options="m2mDashboardMapOptions"
          data-nitro-value="entitiesInDashboard">
      </div>
      <script src="jquery.js"></script>
      <script src="nitro_components.js"></script>
    </body>
    </html>

All the communication with the components is done through dom events.
So if you want to change the value of the slider you can do:
```javascript
$('#blabla').trigger('valueChange', { value: 34 });
```

And if you want to do something when the value of the slider is changed
you can do:
```javascrip
$('#blabla').on('valueChange', function(e, o) {
    console.log('value of the slider is ' + o.value);
});
```

## Building components

### Component Manager

The *ComponentManager* object is used to create components. It is a wrapper for
twitter flight defineComponent function, but it allows you to define a name
for the component. This allows the library to create jQuery plugins and
angular directives for each of the components you defined, using that name.
You can add components to a *Container* using this name also.

You create a component using the *create* method of the *ComponentManager*:

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

In this example MyComponent function, is the same constructor function you
would use
You can get a Component by its name using *get* method:

    ComponentManager.get('ComponentName');

You can also extend a Component using *extend* method:

    ComponentManager.extend(ParentComponent, 'ChildComponent', ChildComponent);

This basically creates a new component including all the mixins defined for
ParentComponent plus the mixins you pass for the ChildComponent.

Look at twitter flight documentation and other components for examples of
how to build your own components.

### jQuery plugin generation

*components/jquery_plugins* will take all the components created using the
*ComponentManager* and will create jQuery plugins for each of them.
The name of the plugin is 'm2m' + name of the plugin.
This file needs to be included after all the components have been created.

If you have a component created with the name 'MyComponent' you can do:

    $('#blabla').m2mMyComponent({ ... });

This is the same as doing:
    
    define(
        [ 
            'path/to/mycomponent'
        ],

        function(MyComponent) {
            MyComponent.attachTo($('#blabla'), { ... });
        }
    );

### Angular directives

We have created a set of angular directives to ease the use of the components
inside angular.

The data-nitro-component directive, attach a component to the node. You can
set the options for component using data-nitro-options directive:

    <div id="blabla" 
        data-nitro-component="m2mMyComponent"
        data-nitro-options="{ ... }">

This is like doing:

    $('#blabla').m2mMyComponent({ ... });

You can use scope values inside the data-nitro-options definition.

The data-nitro-value directive can be used for data binding. Components should
trigger a *valueChange* event when the component data is changed.
This directive sets the value of the component when the scope is changed, and
it changes de scope when the value of the component changes.

    <div data-nitro-component="m2mMyComponent"
         data-nitro-value="scopefield">
        
When $scope.scopefield changes, it will trigger *valueChange* on the component
updating its value. When the components changes its value, it will automatically
update the $scope.scopefield.

### Container mixin

The container Mixin allows you to create components that can contain another
components inside. There is also a Container component that it is just
the a component with the container mixin.

If you pass an *items* attribute when you create an instance of the component,
it will add those items to node. For example:

    $('.blabla').m2mContainer({
        items: [{
            html: 'Hello'
        }, {
            tag: 'span'
            html: 'bye'
        }, { 
            component: 'Slider',
            maxValue: 0,
            minValue: 100,
            className: 'myitem' //TODO: maybe cssClass is a better name for this
        }]
    })

It will create the following html

    <div class="blabla">
        <div>Hello</div>
        <span>bye</span>
        <div class="myitem m2m-slider">
            <!-- Slider stuff -->
        </div>
    </div>

Each item will have its own node, and can be configured with the following 
properties:

* *tag*: Type of tag for the node. "div" by default.
* *html*: Html content of the item
* *style*: CSS Style properties for the node
* *component*: Name of the component to be applied to the node. The item 
object itself will be passed as options for the component.
* *insertPoint*: By default child items will be inserted as direct childs of
the container node. You can specify an insertPoint as a jquery selector, if you
want child items to be inserted somewhere else inside the container nodes.

You can nest containers. If an item has another items inside, and no component
is set for the item, a Container component will be attached to it.

The mixin calls "renderItems" function. So if you want to dinamically change
the items before they get render you can use this.before('renderItems', ...,
or if you want to do something after the items finished rendering you can 
do this.after('renderItems',...


### Template mixin

This is a mixin for generating the html content of the component from a 
template. It uses Hogan.js library (it is basically a lightweight
implementation of moustache).

It will use the template given in the *tpl* option, and you can use the rest
of options as variables in your template.

So if you define a component with this mixin like this:

    define(
        [
            'components/component_manager',
            'components/mixin/template'
        ],

        function(ComponentManager, Template) {
            return ComponentManager.create('MyComponent', MyComponent, Template);

            function MyComponent() {
                
                this.defaultAttrs({
                    tpl: '<div><span>{{field1}}</span>' +
                         '<span>{{field2}}</span></div>'
                });
            }
        }
    );

And you use it like this:

    $('#blabla').m2mMyComponent({
        field1: 'Manolo',
        field2: 'Pepe'
    });

Will produce this html:

    <div id="blabla">
        <div>
             <span>Manolo</span>
             <span>Pepe</span>
        </div>
    </div>
    

### Data-binding mixin

This mixin is used to bind data to components. You can pass a data object
to a parent component, and use this mixin to automatically update its children.

You can set the *model* property in each children if you want to select some
part of the data object passed to the parent.

This is best explained with an example. Imagine we have a panel component.

    define (
        [
            'components/component_manager',
            'components/mixin/data_binding'
        ], 

        function (ComponentManager, DataBinding) {

            return ComponentManager.create('Panel', Panel, DataBinding);

            function Panel() {                               

            }
        }
    );

And we have a subpanel component:

    define (
        [
            'components/component_manager',
            'components/mixin/data_binding'
        ],
        
        function (ComponentManager, DataBinding) {
            
            return ComponentManager.create('SubPanel', SubPanel, DataBinding);
            
            function SubPanel() {
                
                this.on('valueChange', function(e, o) {
                    // The value is passed inside o
                    this.$node.html(o.value);
                });
            }
        }
    )                  

We have this html:

    <div id="panel">
        <div id="subpanel1"></div>
        <div id="subpanel2"></div>
    </div>

We initialize components for each of these panels:

    $('#panel').m2mPanel();
    $('#subpanel1').m2mSubPanel({ model: 'field1' });
    $('#subpanel2').m2mSubPanel({ model: 'field2' });
    
We are setting *model* field1 for subpanel1 and *model* field2 for subpanel2.
So if we set the data for the parent panel like this:

    $('#panel').trigger('valueChange', { 
        value: { field1: 'Manolo', field2: 'Pepe' }
    });

It will change the value for subpanel1 to Manolo, and the value for subpanel2
will be Pepe, and will change the html to:

    <div id="panel">
        <div id="subpanel1">Manolo</div>
        <div id="subpanel2">Pepe</div>
    </div>

*model* can be:

* A string. As in the example above. It will pick the property with that name
from the parent value.
* A function. The function will be executed to get the value for the component.
The parent value will be passed as parameter. 
* A jsonPath string to select the data from the parent value.
* A raw object. This will be the value of the component, no matter what the 
value of the parent component is.
