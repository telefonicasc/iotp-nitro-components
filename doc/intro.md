# m2m-nitro-components
 
## What is m2m-nitro-components?
 
We started to develop a dashboard library for the m2m platform. The idea is
that we could easily create custom dashboards reusing existing
components, instead of having to create custom developments for each new client.

We wanted to make the creation of this dashboards as declarative as possible.
Ideally in the future, the creation of a new dashboard could be performed 
just by changing configuration for that particular client.

We thought that it will be good to extend the library to include other types
of component (not just for dashboards), so we can build a library of reusable
components that we can use to build web application for the m2m platform 
easily.

With that focus in mind, components in this library should be as generic 
as possible. So for example if we need to create a map component for displaying
traffic lights on a map, the idea is to create a component that can display
any kind of points in a map (not just traffic lights), and it should be 
possible to configure what icon is used, or what gets displayed on the tooltip
when you mouseover...

The library is provided as a set of jquery plugins. Each component will
be mapped to a jQuery plugin. The reason for this is to maintain the library
as agnostic as possible from any framework. A lot of projects will be using 
jQuery already, and if not, including it should be pretty unobtrusive and it
should play well with any framework (even with Ext.js). 

You select a node in the dom (or many) using jQuery, and you call the component
you want to include in that node. So, if you have a div with id #blabla, and you
want to create a slider in that div you could do:

    $('#blabla').m2mSlider({ maxValue: 80, minValue: 20 });

The name of the component is "Slider". We add the 'm2m' prefix to all jquery
plugins to avoid conflicts with other plugins. An object with configuration
options could be passed to the plugin to configure it.

Communication between components and the client application is performed using
events. So if you want to change the value of the slider you can do:

    $('#blabla').trigger('valueChange', { value: 34 });   

And if you want to do something when the value of the slider is changed
you can do:

    $('#blabla').on('valueChange', function(e, o) {
        console.log('value of the slider is ' + o.value);
    });

We also want to provide an optional set of Angular.JS directives, just to
simplify things in case the library is used inside an Angular.js application. 
More details on this in the Angular directives section.

## Related projects

### m2m-kermit

Currently we have different web portals for different products (Managed
connectivity, DCA, Consumer electronics...). In the future it is desired to have 
only 1 web portal, in which all the different products can be integrated.

Also we want to have transversal modules or packages, that can be added to the
application and used in different products. For example the 'visual rules' 
module, is an user interface that could be used to define bussiness rules, 
and it will be used in both DCA and Consumer electronics.

Kermit is webportal that it is designed to be modular, allowing you to define
by configuration what packages (modules), should be loaded in the application.
Session management is handled by Kermit, to provide a single sign on experience.

Kermit is developed using Angular.js.

The list of modules that are going to be loaded in kermit, are defined in a 
config file located in app/config.js under 'packages'. For example:

    packages: [
        {
            packageName: 'dca',
            jsFiles: [
                '/packages/dca/config.js',
                '/packages/dca/lib/ext/ext-all-debug.js',
                '/packages/dca/lib/jquery-ui-1.9.1.custom.min.js',
                '/packages/dca/lib/backbone-min.js',
                '/packages/dca/lib/traffic.js',
                '/packages/dca/lib/rulesengine.js',
                '/packages/dca/kermit.js'
            ],
            cssFiles: [
                '/packages/dca/res/css/traffic.css',
                '/packages/dca/res/css/nitro.css',
                '/packages/dca/res/css/rulesengine.css',
                '/packages/dca/res/css/cards.css',
                '/packages/dca/lib/ext/resources/css/ext-standard.css',
                '/packages/dca/res/css/base.css'
            ],
            localeFiles: [],
            onLoaded: function () {
                Ext.EventManager.fireDocReady();
                M2M.i18n = Kermit.i18n;
            }
        },

        {
            packagename: 'visualrules',
            jsFiles: [
                '/packages/visualrules/kermit.min.js'
            ]
        }
    ]

In this example, we have two packages; 'dca' and 'visualrules'. For each 
package you can define the list of js and css files that need to be loaded. DCA
and visual rules should be placed inside the packages directories in m2m-kermit.
m2m-kermit/packages/dca should be pointing to dca-portal/src.

A global Kermit object is exposed to allow modules to register main menu
sections, routes and controllers. For example to register a main menu section:

    Kermit.menu.add({
        name: item.id,
        path: item.route,
        acl: item.acl,
        permission: PERMISSION_GROUP,
        cls: item.id,
        parentCls: PACKAGE_NAME
    });

Check kermit.js inside dca-portal/src or m2m-visualrules for examples or how
to use the Kermit API.

### dca-portal

dca-portal is the current web application for the dca product. It is developed
using Ext.js. It will be integrated in kermit as a package, instead of being
an stand alone web application.

Currently there is a feature/kermit-integration branch, that was created to
start fixing or twiking some things to allows us to load the Ext.js application
inside Kermit as a package.

We have created a kermit.js file, that is a modified version of app.js to load
the application inside kermit.
This script uses the Kermit api to register the main menu sections that need 
to be displayed, and registers the routes for each of the DCA controllers.

### dca-rulesenginefe

Current implementation of the visual rules front end part. The idea is to 
migrate the components that can be reused to m2m-nitro-components.
This is just the visual "widgets". The logic and the part that talks to the
BE is located in dca-portal inside a controller.

### m2m-visualrules

This will be the next version of the visual rules module, this time as a kermit 
package. This way, we can reuse it in another projects outside the DCA.
It will contain the logic and the BE communication part, that is currently
inside dca-portal.

### m2m-dashboard

This is another kermit package that will include a dashboard section in the
application. The dashboard that needs to be loaded could be different for each
customer (aka organization, aka service). In the organization data there will
be a parameter (config.dashboard) indicating the url of the javascript file
for the dashboard.

A global M2MDashboard object will be exposed, to allow dashboards to be 
registered in the application. So in the javascript of the dashboard you need to 
do something like: 

    M2MDashboard.register({

        icon: 'aaaaa', // icon for the button in the main menu
        title: 'My dashboard', // Text that will appear in the main menu
        name: 'mydashboard', // name of the dashboard. It can be used to 
                             // set the route  (#/dashboard/mydashboard)
        handler: function(api) { // This function is executed when the 
                                 // dashboard section is opened.
                                 // api is basically the Kermit object so
                                 // dashboard developers can get the div 
                                 // for the dashboard or make requests to BE

            api.getViewContainer().m2mDashboard({ ...
                // Dashboard options
            });

            // Request to BE with credentials
            api.http.request(requestOption).then(function(response) {
                
            });

        }

    });

This package needs to provide this M2MDasboard.register method, and register
the menu items and the route in kermit, and call the handler with the Kermit 
object when the section is accesed.

## Libraries and tools

Description an quick explanation of some of the tools used in this project

### Grunt JS

Grunt is build tool for javascript projects. It is like ant for javascript.
You need to have node.js installed in order to use it.
To install the grunt command line utility you need to do:

    npm install -g grunt-cli

The first time you download a project you should update project dependencies
using npm install. In the root folder of your project just type:

    npm install

This will download all the dependencies for the project, including those needed
to execute the grunt tasks (less, requirejs, phantomjs, jasmine...)

Now you can run any of the task defined for the project typing grunt + name of
the task. For m2m-nitro-components you can do:

For generating dist/nitro-components.js

    grunt build

For generating css files from less files

    grunt less

For runnning tests

    grunt test

If you want to create a new test, just add it in the test folder. The file
name needs to end in '_spec.js'.

All the tasks defined for the project are in the Gruntfile.js file. If you
want the list of all the defined tasks for the project you can do.

    grunt --help


### RequireJS

Require JS allows you to define dependecies between javascript modules.
Usually for development, you want to have a js file for each class or component.
But if you have a lot of them is a bit hard to add all of them to the html file,
and add script tag everytime you create a new js file. Also for production you
usually want to have a single javascript file with all your components, to 
reduce the number of http request the browser needs to do.

RequireJS allows you to define for each Javascript file, what other js files it 
depends on. For development you can include just your "main.js" and all the 
others will be automatically loaded looking at the dependencies. For production
it will automatically generate a single file that includes all the needed 
scripts (this is what grunt build does).

When you work with require.js you start defining the list of dependencies your
module has with the define function:

    define(
      [
        'components/component_manager',
        'components/mixin/container'
      ],

      function(ComponentManager, ContainerMixin) {
        return ComponentManager.create('container', ContainerMixin);
      }

    );

The second parameter for define is a function where you actually put your code.
Whatever you return in the function will get passed to the script that includes
your file. For example if I have test1.js:

    define(
        [], // This file has no dependencies
        function() {
            return { jojo: 'jiji' };
        }
    )

And you have test2.js:

    define(
        [
            'test1'
        ],

        function(Test1) {

        }
    )

Test1 in the second file will be { jojo: 'jiji' }. That's why we have return
ComponentManager.create...

### Twiter flight

Please look at the documentation in twitter flight page. It will be nice to
write a tutorial, but I don't have time currently.

## Magic and Katas

### Component Manager

The *ComponentManager* object is used to create components. It is a wrapper for
twitter flight defineComponent function, but it allows you to define a name
for the component. This allows the library to create jQuery plugins for each
of the components you defined, using the name you give it. You can add 
components to a container using this name also.

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

You can get a Component by its name using *get* method:

    ComponentManager.get('ComponentName');

You can also extend a Component using *extend* method:

    ComponentManager.extend(ParentComponent, 'ChildComponent', ChildComponent);

This basically creates a new component including all the mixins defined for
ParentComponent plus the mixins you pass for the ChildComponent.

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

TODO: It is probably better that jquery plugin creation is inside 
*ComponentManager* *create*. That way you don't have the problem of having
to execute this after all the components have been created. Another possible
solution could be that the ComponentManager trigger an event every time a 
component is created, and jquery_plugins listens to that event.

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

Look at components/dashboard/dashboard.js for an example of this.

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

You can look at examples/ce/main.js for an example of how this works.
