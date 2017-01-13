<!-- Start ./components/README.md -->
#m2m-nitro-components

* [**Mixin**]
    * [DataBinding]
    * [ContainerMixin]
    * [Template]
    * [DraggableMixin]
* [**Core**]
    * [ComponentManager]
    * [jqueryPlugins]
    * [AngularDirective]
    * [component]
* [**Dashboard components**]
    * [DashboardMap]
    * [MapMarkerGroupTooltip]
* TODO: rule editor and cards definition
* [**Others components**]
    * [Tooltip]
    * [Slider]

------------------------
##Mixin

###ContainerMixin

The container Mixin allows you to create components that can contain another
components inside. There is also a Container component that it is just
the a component with the container mixin.

If you pass an *items* attribute when you create an instance of the component,
it will add those items to node. For example:
```javascript
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
```

It will create the following html

```html
<div class="blabla">
    <div>Hello</div>
    <span>bye</span>
    <div class="myitem m2m-slider">
        <!-- Slider stuff -->
    </div>
</div>
```

You can nest containers. If an item has another items inside, and no component
is set for the item, a Container component will be attached to it.

The mixin calls "renderItems" function. So if you want to dinamically change
the items before they get render you can use `this.before('renderItems', ...)`
or if you want to do something after the items finished rendering you can
do this.after('renderItems',...)`

Look at components/dashboard/dashboard.js for an example of this.

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 tag | _String_ | 'div' | Type of tag for the node.
 html | _String_ | '' | Html content of the item
 style | _Object_ | undefined | CSS Style properties for the node
 component | _String_ | 'container' | Name of the component to be applied to the node. The item object itself will be passed as options for the component.
 insertPoint | _String_ | '' | By default child items will be inserted as direct childs of the container node. You can specify an insertPoint as a jquery selector, if you want child items to be inserted somewhere else inside the container nodes.
 items | _Array_ | undefined | You can set array of components for add nodes children of this component

###DataBinding

This mixin is used to bind data to components. You can pass a data object
to a parent component, and use this mixin to automatically update its children.

You can set the *model* property in each children if you want to select some
part of the data object passed to the parent.

This is best explained with an example. Imagine we have a panel component.

```javascript
define (
    [
        'components/component_manager',
        'components/mixin/data_binding'
    ],
    function (ComponentManager, DataBinding) {
        function Panel() {
        }
        return ComponentManager.create('Panel', Panel, DataBinding);
    }
);
```

And we have a subpanel component:

```javascript
define (
    [
        'components/component_manager',
        'components/mixin/data_binding'
    ],
    function (ComponentManager, DataBinding) {
        function SubPanel() {
            this.on('valueChange', function(e, o) {
                // The value is passed inside o
                this.$node.html(o.value);
            });
        }
        return ComponentManager.create('SubPanel', SubPanel, DataBinding);
    }
)
```

We have this html:

```html
<div id="panel">
    <div id="subpanel1"></div>
    <div id="subpanel2"></div>
</div>
```
We initialize components for each of these panels:

```javascript
$('#panel').m2mPanel();
$('#subpanel1').m2mSubPanel({ model: 'field1' });
$('#subpanel2').m2mSubPanel({ model: 'field2' });
```

We are setting *model* field1 for subpanel1 and *model* field2 for subpanel2.
So if we set the data for the parent panel like this:

```javascript
$('#panel').trigger('valueChange', {
    value: { field1: 'Manolo', field2: 'Pepe' }
});
```

It will change the value for subpanel1 to Manolo, and the value for subpanel2
will be Pepe, and will change the html to:

```html
<div id="panel">
    <div id="subpanel1">Manolo</div>
    <div id="subpanel2">Pepe</div>
</div>
```

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 resetModel | _Boolean_ | false |
 model | _String_ | empty | As in the example above. It will pick the property with that name from the parent value.
 model | _Function_ | empty | The function will be executed to get the value for the component. The parent value will be passed as parameter.
 model | _jsonPath_ | empty | String to select the data from the parent value.
 model | _Object_ | empty | This will be the value of the component, no matter what the value of the parent component is.

<!-- End ./components/mixin/data_binding.js -->

<!-- Start ./components/mixin/template.js -->

###Template

This is a mixin for generating the html content of the component from a
template. It uses **[Hogan.js](http://twitter.github.io/hogan.js/)** library (it is basically a lightweight
implementation of [moustache](http://mustache.github.io/) ).

It will use the template given in the *tpl* option, and you can use the rest
of options as variables in your template.

So if you define a component with this mixin like this:

```javascript
define(
    [
        'components/component_manager',
        'components/mixin/template'
    ],
    function(ComponentManager, Template) {
        function MyComponent() {
            this.defaultAttrs({
                tpl: '<div><span>{{field1}}</span>' +
                     '<span>{{field2}}</span></div>',
                nodes: {
                    span1: 'span:eq(0)',
                    span2: 'span:eq(1)'
                }
            });
        }
        return ComponentManager.create('MyComponent', MyComponent, Template);
    }
);
```

And you use it like this:

```javascript
$('#blabla').m2mMyComponent({
    field1: 'Manolo',
    field2: 'Pepe'
});
```

Will produce this html:

```html
<div id="blabla">
    <div>
         <span>Manolo</span>
         <span>Pepe</span>
    </div>
</div>
```

If you need redraw template with new values, trigger `'valueChange'` event and set object with `'value'` parameter:
```javascript
$('#blabla').trigger('valueChange', {
  value: {
    field1: 'Maria',
    //you can use filter function
    field2: function(data){
      return data.field1 + ' Magdalena'
    }
  }
});
```

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 updateOnValueChange | _Boolean_ | true | Re-draw template when trigger `'valueChange'` envent
 nodes | _Object_ | undefined | Object selector of elements, key is name of selector and value is jQuerySelector and you can atribute with '$' prefix: `this.$myNode`

#### Events

Event | Argument | Description
--- | --- | ---
 valueChange | _undefined_ | {value:{}} If `updateOnValueChange` is true, use param.value for redraw template

###DraggableMixin

Convert node in draggable item. Use `jQueryUI.Draggable()`

##Core

###ComponentManager

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

###jqueryPlugins

components/jquery_plugins* will take all the components created using the
ComponentManager* and will create jQuery plugins for each of them.
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

###AngularDirective

We have created a set of angular directives to ease the use of the components
inside [AngularJS](http://angularjs.org/).

The data-nitro-component directive, attach a component to the node. You can
set the options for component using data-nitro-options directive:
```html
    <div id="blabla"
        data-nitro-component="m2mMyComponent"
        data-nitro-options="{ ... }">
```

This is like doing:
```javascript
    $('#blabla').m2mMyComponent({ ... });
```

You can use scope values inside the data-nitro-options definition.

The data-nitro-value directive can be used for data binding. Components should
trigger a *valueChange* event when the component data is changed.
This directive sets the value of the component when the scope is changed, and
it changes de scope when the value of the component changes.
```html
    <div data-nitro-component="m2mMyComponent"
         data-nitro-value="scopefield">
```

When $scope.scopefield changes, it will trigger *valueChange* on the component
updating its value. When the components changes its value, it will automatically
update the $scope.scopefield.


###component

_**Mixin:**_ [*Template*] - [*DataBinding*] -

Create wrapper with Template and DataBinding functionalities

##Dashboard components

###DashboardMap

Map component for dashboards using leaflet

```javascript
{
  latitude: 40.5,
  longitude: -3,
  cssClass: 'red',
  title: 'Marker 1'
}
```

__DefaultTooltipComponent__
```javascript
{
    component: 'Tooltip',
    items: [{
        html: '',
        className: 'tooltip-arrow-border'
    }, {
        html: '',
        className: 'tooltip-arrow'
    }, {
        tpl: '{{value.marker.title}}'
    }]
}
```

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 maxGroupRadius | _Number_ | 20 | Maximum distance to group markers
 fitBounds | _Boolean_ | true | fit bounds of markers when update
 fitBoundsOnce | _Boolean_ | false | Once fit bounds of markers when update
 zoomControl | _Boolean_ | true | Show zoom control
 markerFactory | _Function_ | fn() | Factory function to translate from input data items to the format the DashboardMapMarkerOption is specting.
 iconFunction | _Function_ | fn() | Function to create the icon for the marker. By default it creates a div with css class 'marker' and the 'cssClass' attribute of the marker
 groupIconFunction | _Function_ | fn() | Function to create the icon for a marker group By default it creates a div with css classes 'marker', 'group', and all the child item css classes. The content of the div is the number of markers in the group
 tooltip | _Object_ | DefaultTooltipComponent | Tooltip component

#### Events

Event | Argument | Description
--- | --- | ---
 itemselected | _undefined_ | When it is received, the css class 'selected' is added to the marker of the selected item
 valueChange | _undefined_ | map markers are updated with the data in the event


Maximum distance to group markers

fit bounds of markers when update *

Show zoom control

Factory function to translate from input data items to
 the format the marker is specting.
 {
   latitude: 40.5,
   longitude: -3,
   cssClass: 'red',
   title: 'Marker 1'
 }

 By default it just expects items to be in that format

Function to create the icon for the marker.
By default it creates a div with css class 'marker'
and the 'cssClass' attribute of the marker

Function to create the icon for a marker group
 By default it creates a div with css classes
 'marker', 'group', and all the child item css classes.
 The content of the div is the number of markers in
 the group

Default tooltip component

Tooltip for marker groups

Tooltip displayed when you

###MapMarkerGroupTooltip

_**Mixin:**_ [*Tooltip*] - [*DataBinding*] -

Manages tooltips of markers groups

__DefaultItems__
```javascript
{
    className: 'tooltip-arrow-border'
}, {
    className: 'tooltip-arrow'
}, {
    className: 'group-tooltip-marker-list'
}
```

#### Events

Event | Argument | Description
--- | --- | ---
 hide | _undefined_ | none Trigger for hide group
 show | _undefined_ | none Trigger for show group
 fix | _undefined_ | none Trigger for fix position

<!--  ./components/card/README.md -->
<!--  ./components/card/card.js -->
<!--  ./components/card/card_data.js -->
<!--  ./components/card/card_side.js -->
<!--  ./components/card/card_toolbox.js -->
<!--  ./components/card/delimiter.js -->
<!--  ./components/card/rule_editor.js -->
<!--  ./components/card/rule_editor_toolbar.js -->
<!--  ./components/container.js -->
<!--  ./components/draggable.js -->
<!--  ./components/flippable.js -->
<!--  ./components/graph_editor.js -->
<!--  ./components/panel/border_collapsable_panel.js -->

###Slider

_**Mixin:**_ [*Template*] -

Create dinamic slider element and triger 'valueChange' event with value when drag pitch element

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 label | _String_ | 'value' | Label
 value | _Number_ | 0 | Value
 minValue | _Number_ | 0 | Min Value
 maxValue | _Number_ | 100 | Max Value
 showSliderLabel | _Boolean_ | true | Show slider label
 showSliderValue | _Boolean_ | true | Show slider value

###Tooltip

_**Mixin:**_ [*DataBinding*] -

Create tooltip element

#### Events

Event | Argument | Description
--- | --- | ---
 hide | _undefined_ | undefined Trigger this event for hide element
 show | _undefined_ | undefined Trigger this event for show element
