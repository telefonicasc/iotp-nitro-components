<!-- Start ./components/README.md -->
#m2m-nitro-components

* [**Install**]
* [**Introduction**]
* [**Mixin**]
    * [DataBinding]
    * [ContainerMixin]
    * [Template]
    * [DraggableMixin]
    * [WatchResize]
* [**Core**]
    * [ComponentManager]
    * [jqueryPlugins]
    * [AngularDirective]
    * [component]
* [**Dashboard components**]
    * [dashboard]
    * [dashboardMainPanel]
    * [DashboardDetailsPanel]
    * [carouselPanel]
    * [DashboardMap]
    * [MapMarkerGroupTooltip]
    * [overviewPanel]
    * [OverviewSubpanel]
    * [OverviewSubpanelList]
* [**Chart components**]
    * [ChartElement] _(mixin)_
    * [Tooltip] _(mixin)_
    * [Axis]
    * [TimeAxis]
    * [areaChart]
    * [areaStackedChart]
    * [barChart]
    * [carouselBarchart]
    * [chartContainer]
    * [columnChart]
    * [chartGrid]
    * [GroupBarChart]
    * [radarChart]
    * [rangeSelection]
    * [rangeSelectionChart]
    * [SimpleBar]
* [**Widget components**]
    * [temperatureWidget]
    * [pitchWidget]
    * [gaugeWidget]
* [**Others components**]
    * [carouselPanel]
    * [Tooltip]
    * [toggle]
    * [minimap]
    * [ContextMenu]
    * [pagedContainer]
    * [RepeatContainer]
    * [Slider]
    * [cellBarchartSubpanel]

------------------------

##Install

The library is designed to be included into your project using [npm](https://npmjs.org/), and
generate a custom build selecting desired components using [grunt](http://gruntjs.com/).
Install m2m-nitro-components npm package from pdihub:
```
npm install git+ssh://git@pdihub.hi.inet:M2M/m2m-nitro-components.git#develop --save-dev
```

That will download m2m-nitro-components an put it in the node_modules directory.
Install grunt packages:
```
npm install grunt grunt-contrib-requirejs grunt-contrib-less --save-dev
```

Next you need to define in your Gruntfile what widgets do you want to include
in your m2m-nitro-components build. A sample Gruntfile.js including the
ApplicationMenu widget will be:
```javascript
module.exports = function(grunt) {

    grunt.initConfig({
        nitroComponents: {
            out:'app/lib/nitro_components/nitro_components.js'
            build: {
                components: [
                    'components/application_menu',
                    'components/jquery_plugins'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadTasks('node_modules/m2m-nitro-components/tasks');
};
```

Now if you run:
```
grunt nitroComponents
```

It will generate a javascript file in `app/lib/nitro_components/nitro_components.js` (defined in `out` option)
and a css file in `style/css/nitro-components.css, that you should include in
your package.

The only dependency of m2m-nitro-components is jquery, that you should include
in your page before nitro_components.js. Although, some of the widgets will
require additional dependencies. For example the map widget will depend on
mapbox, and most of the charting components depend on D3.

##Introduction

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
you want to include in that node. So, if you have this HTML
```html
<div id="blabla"></div>
```

and you want to create a slider in that div you could do:
```javascript
$('#blabla').m2mSlider({ maxValue: 80, minValue: 20 });
```

The name of the component is "Slider". We add the 'm2m' prefix to all jquery
plugins to avoid conflicts with other plugins. An object with configuration
options could be passed to the plugin to configure it.

Communication between components and the client application is performed using
events. So if you want to change the value of the slider you can do:
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

We also want to provide an optional set of [AngularJS](http://angularjs.org/) directives, just to
simplify things in case the library is used inside an Angular.js application.
```
<div id="blabla"
    data-nitro-component="m2mSlider"
    data-nitro-options="{ maxValue: 80, minValue: 20 }"></div>
```

Use `data-nitro-component` attribute for define component name and `data-nitro-options` attribute for set options of component

<!-- End ./components/README.md -->

<!-- Start ./components/mixin/README.md -->
##Mixin

<!-- End ./components/mixin/README.md -->

<!-- Start ./components/mixin/container.js -->

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

<!-- End ./components/mixin/container.js -->

<!-- Start ./components/mixin/data_binding.js -->

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

<!-- End ./components/mixin/template.js -->

<!-- Start ./components/mixin/draggable.js -->

###DraggableMixin

Convert node in draggable item. Use `jQueryUI.Draggable()`

<!-- End ./components/mixin/draggable.js -->

<!-- Start ./components/mixin/watch_resize.js -->

###WatchResize

Update size, width and height, when trigger `'resize'` event of window

<!-- End ./components/mixin/watch_resize.js -->

<!-- Start ./components/core/README.md -->
##Core

<!-- End ./components/core/README.md -->

<!-- Start ./components/component_manager.js -->

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

<!-- End ./components/component_manager.js -->

<!-- Start ./components/jquery_plugins.js -->

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

<!-- End ./components/jquery_plugins.js -->

<!-- Start ./components/angular_directives.js -->

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

<!-- End ./components/angular_directives.js -->

<!-- Start ./components/component.js -->

###component

_**Mixin:**_ [*Template*] - [*DataBinding*] -

Create wrapper with Template and DataBinding functionalities

<!-- End ./components/component.js -->

<!-- Start ./components/dashboard/README.md -->
##Dashboard components

<!-- End ./components/dashboard/README.md -->

<!-- Start ./components/dashboard/dashboard.js -->

###dashboard

_**Mixin:**_ [*ContainerMixin*] - [*DataBinding*] -

Este componente crea una interfaz gráfica con tres regiones delimitadas:

```
__________________________________________________________
|                 |                   |                  |
|  $mainContent   |  $overviewPanel   |  $detailsPanel   |
|                 |                   |                  |
|_________________|___________________|__________________|
```

La idea es que el componente sea capaz de gestionar los eventos de 'itemSelected'
ya que cuando hay un elemento seleccionado $overviewPanel se oculta y se muestra $detailsPanel.
Por defecto el dashboard no tiene ningún item seleccionado, para poder seleccionar o
deseleccionar se hará a traves del evento `'itemSelected'`.

Dentro de cada sección podemos insertar cualquier otro componente ya que extienden de ContainerMixin

__$mainContent__
Contenedor de la izquierda que siempre está visible y en el que normalmente se coloca el mapa
*$overviewPanel** Panel de la derecha donde normalmente se coloca un listado
*$detailsPanel**

_**notas**_
Para poder mantener seleccionado un Asset cuando se refresca los datos es necesario que el modelo contenda el parámetro 'id'

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 mainContent | _Array_ | [] | Left section. Ej: map
 overviewPanel | _Object_ | {} | Right section. Ej: list of elememts
 detailsPanel | _Object_ | {} | Right section, show when selected item
 itemData | _Function_ | null | Function for filter item selected data

#### Events

Event | Argument | Description
--- | --- | ---
 itemselected | _undefined_ | itemData selected item
 updateData | _undefined_ | none trigger for update data

<!-- End ./components/dashboard/dashboard.js -->

<!-- Start ./components/dashboard/dashboard_main_panel.js -->

###dashboardMainPanel

_**Mixin:**_ [*ContainerMixin*] -

Componente usado en DashboardMap para pintar la sección de la izquierda

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 title | _String_ | '' | Title

<!-- End ./components/dashboard/dashboard_main_panel.js -->

<!-- Start ./components/dashboard/details_panel.js -->

###DashboardDetailsPanel

_**Mixin:**_ [*WatchResize*] - [*ContainerMixin*] - [*DataBinding*] -

Componente usado en DashboardMap para pintar la sección de la derecha y se muestra cuando hay un item seleccionado

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 marginTop | _Number_ | 36 | Margin top
 expandHorizontally | _Boolean_ | false | Expanded in vertical or horizontal

#### Events

Event | Argument | Description
--- | --- | ---
 expand | _undefined_ | none Trigger this event for expanded
 collapse | _undefined_ | none Trigger this event for collapsed

<!-- End ./components/dashboard/details_panel.js -->

<!-- Start ./components/dashboard/details_subpanel.js -->

###DashboardDetailsSubpanel

_**Mixin:**_ [*Template*] - [*ContainerMixin*] -

Nodo donde se pinta los datos del Asset dentro de la lista

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 header | _String_ | '' | Header title
 contextMenu | _ContextMenuIndicatorOption_ | null | Add context menu

<!-- End ./components/dashboard/details_subpanel.js -->

<!-- Start ./components/dashboard/carousel_panel.js -->

###carouselPanel

__carouselPanelValue__
```javascript
//example
{
    topValue: "a",
    topCaption: "a1",
    bottomValue: "c",
    bottomCaption: "c1",
    chartValues: [{name:'', value: 10}, {name: '', value:20}, .... ]
}
```
__ChartValueObject__
```javascript
{
 value:'',
 caption:''
}
```

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 chartConf | _carouselBarchartOptions_ | undefined | Set carouselBarchart
 title | _ChartValueObject_ | ChartValueObject | Title
 content | _ChartValueObject_ | ChartValueObject | Content
 value | _Object_ | carouselPanelModel | Value

<!-- End ./components/dashboard/carousel_panel.js -->

<!-- Start ./components/dashboard/map.js -->

###DashboardMap

Map component for dashboards using mapbox
__DashboardMapMarkerOption__
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
 mapboxId | _String_ | '' | Mapbox id for the map
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

Mapbox id for the map

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

<!-- End ./components/dashboard/map.js -->

<!-- Start ./components/dashboard/map_marker_group_tooltip.js -->

###MapMarkerGroupTooltip

_**Mixin:**_ [*Tooltip*] - [*DataBinding*] -

Gestiona los tooltips que aparecen en los grupos de markers

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

<!-- End ./components/dashboard/map_marker_group_tooltip.js -->

<!-- Start ./components/dashboard/overview_panel.js -->

###overviewPanel

_**Mixin:**_ [*ContainerMixin*] - [*DataBinding*] -

Create `$overviewPanel` section of __dashboard__ component

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 insertionPoint | _String_ | '.overview-content' | jQuerySelector
 title | _String_ | '' | Title
 count | _String_ | '' | Count value
 countClass | _String_ | 'blue' | Class name of count element

<!-- End ./components/dashboard/overview_panel.js -->

<!-- Start ./components/dashboard/overview_subpanel.js -->

###OverviewSubpanel

_**Mixin:**_ [*DataBinding*] - [*Template*] -

Create list for __overviewPanel__ component

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 iconClass | _String_ | '' | Icon class name
 text | _String_ | '' | Text
 text1 | _String_ | '' | Subtitle
 caption | _String_ | '' | Body of panel

#### Events

Event | Argument | Description
--- | --- | ---
 render | _undefined_ | null Render sub pannel

<!-- End ./components/dashboard/overview_subpanel.js -->

<!-- Start ./components/dashboard/overview_subpanel_list.js -->

###OverviewSubpanelList

Create item of list in `OverviewSubpanel` component

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 text | _String_ | '' | Text
 caption | _String_ | '' | Caption
 iconClass | _String_ | '' | Icon class name
 filter | _Function_ | null | Function for filter data

<!-- End ./components/dashboard/overview_subpanel_list.js -->

<!-- Start ./components/chart/README.md -->
##Chart components

<!-- End ./components/chart/README.md -->

<!-- Start ./components/chart/mixin/chart_element.js -->

###ChartElement

ChartElement

__AxisObject__
```javscript
{
    scaleFun: d3.time.scale,
    key: 'date'
}
```

__DefaultAxisObjectX__
```javscript
{
    scaleFun: d3.time.scale,
    key: 'date'
}
```

__DefaultAxisObjectY__
```javscript
{
    scaleFun: d3.time.linear,
    key: 'value'
}
```

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 x | _AxisObject_ | DefaultAxisObjectX | Axis X
 y | _AxisObject_ | DefaultAxisObjectY | Axis Y

<!-- End ./components/chart/mixin/chart_element.js -->

<!-- Start ./components/chart/mixin/tooltip.js -->

###Tooltip

Tooltip

__ShowTooltipObject__
```javascript
{
    elem:'.container', //jQuery selector
    offset:0 // pixels
}
```

__HideTooltipObject__
```javascript
{
    fn: function(){}
}
```

#### Events

Event | Argument | Description
--- | --- | ---
 showTooltip | _undefined_ | ShowTooltipObject Show Tooltip
 hideTooltip | _undefined_ | HideTooltipObject Hide Tooltip and set callback

<!-- End ./components/chart/mixin/tooltip.js -->

<!-- Start ./components/chart/axis/axis.js -->

###axis

axis

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 axisFn | _Function_ | [D3.svg.axis](https://github.com/mbostock/d3/wiki/SVG-Axes) |
 orientation | _String_ | 'right' | Orientation: 'left', 'right'
 ticks | _Number_ | 10 | ticks

<!-- End ./components/chart/axis/axis.js -->

<!-- Start ./components/chart/axis/time_axis.js -->

###timeAxis

timeAxis

__ResizeObject__
```javascript
{
    width: 0,
    height:0,
}
```

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 orientation | _String_ | 'bottom' | orientation
 valueField | _String_ | 'totalRegistered' | valueField
 rangeField: | _String_ | 'selectedRange' | rangeField
 tickFormat | _String_ | '%e-%b' | [Time formating](https://github.com/mbostock/d3/wiki/Time-Formatting)
 stepType | _String_ | 'day' | Steps: 'day', 'month', 'year'
 stepTick | _Number_ | 1 | stepTick
 paddingTick | _Number_ | 0 | Distance each tick should display away from its theorical center

#### Events

Event | Argument | Description
--- | --- | ---
 resize | _undefined_ | ResizeObject Resize chart
 rangeChange | _undefined_ | {range:[]} define [D3.range](https://github.com/mbostock/d3/wiki/Arrays#wiki-d3_range) of chart

<!-- End ./components/chart/axis/time_axis.js -->

<!-- Start ./components/chart/area_chart.js -->

###areaChart

_**Mixin:**_ [*ChartElement*] -

areaChart

__CircleOption__
```
{
    className: 'hoverCircle',
    mouseout: {
        'r': 6,
        'opacity': 0
    },
    mouseover: {'opacity': 1 }
}
```

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 area | _Boolean_ | true | Draw area
 tooltip | _Boolean_ | Show | tooltip when hover mouse on point of chart
 CircleOption} | _Object_ | hoverCircle | __CircleOption__ Tooltip configuration

<!-- End ./components/chart/area_chart.js -->

<!-- Start ./components/chart/area_stacked_chart.js -->

###areaStackedChart

_**Mixin:**_ [*Tooltip*] -

areaStackedChart

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 colorArea | _Array_ | ['#FF0000'] | Color area
 colorLine | _Array_ | ['#00FF00'] | Color line
 fillOpacity | _Number_ | 0 | Fill Opacity
 subModelsSufix | _Array_ | [] | Set prefix list of model name
 autoscale | _Boolean_ | false | autoscale
 tooltip | _Boolean_ | true | tooltip
 tooltip2 | _Boolean_ | false | tooltip2

<!-- End ./components/chart/area_stacked_chart.js -->

<!-- Start ./components/chart/bar_chart.js -->

###barChart

_**Mixin:**_ [*Tooltip*] -

barChart

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 barWidth | _Number_ | 0.8 | barWidth
 cssClass | _String_ | '' | Css class nane for svg element

<!-- End ./components/chart/bar_chart.js -->

<!-- Start ./components/chart/carousel_barchart.js -->

###carouselBarchart

carouselBarchart
__chartConfDefault__
```javascript
{
    maxHeight: 75,
    width: 60,
    barPadding: 5
}
```

__dataModel__
```javascript
{
    name:'+',
    value: 72
}
```

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 chartConf | _Object_ | chartConfDefault | chartConf
 data | _Array_ | undefined | List of the dataModel object

<!-- End ./components/chart/carousel_barchart.js -->

<!-- Start ./components/chart/chart_container.js -->

###chartContainer

_**Mixin:**_ [*DataBinding*] - [*WatchResize*] -

chartContainer
__timeAxisDefault__
```javascript
{
    margin: 0,
    height: 20
}
```

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 showGrid | _Boolean_ | true | showGrid
 gridStrokeWidth | _Number_ | 1 | gridStrokeWidth
 gridStrokeColor | _String_ | '#AAAAAA' | gridStrokeColor
 marginBottom | _Number_ | 0 | marginBottom
 marginRight | _Number_ | 0 | marginRight
 axisx | _Boolean_ | false | axisx
 axisy | _Boolean_ | false | axisy
 timeAxis | _Object_ | timeAxisDefault | timeAxis

<!-- End ./components/chart/chart_container.js -->

<!-- Start ./components/chart/column_chart.js -->

###columnChart

columnChart

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 opacity | _Number_ | 0.2 | opacity
 paddingColumn | _Number_ | 3 | Padding of bar chart
 cssClass | _string_ | '' | Css class name

<!-- End ./components/chart/column_chart.js -->

<!-- Start ./components/chart/grid.js -->

###chartGrid

_**Mixin:**_ [*ChartElement*] -

chartGrid

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 stroke | _String_ | '#ffffff' | stroke
 valueTicks | _Number_ | 5 | valueTicks
 classGrid | _String_ | 'bg_grid' | Css class name of grid element

<!-- End ./components/chart/grid.js -->

<!-- Start ./components/chart/group_bar_chart.js -->

###GroupBarChart

GroupBarChart

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 labels | _Object_ | empty | labels
 tooltip | _Boolean_ | false | Tooltip tooltip
 colors | _Array_ | ['#000000'] | Color colors
 carouselHeight | _Number_ | 100 | carouselHeight
 animDuration | _Number_ | 600 | animDuration
 axisXheight | _Number_ | 35 | axisXheight
 minWidthGroup | _Number_ | 200 | minWidthGroup

maxLine.attr('x2', width).transition().ease('sin').duration(25)
                    .attr('y1', y(topValue))
                    .attr('y2', y(topValue));

<!-- End ./components/chart/group_bar_chart.js -->

<!-- Start ./components/chart/radar_chart.js -->

###radarChart

_**Mixin:**_ [*WatchResize*] - [*DataBinding*] -

radarChart

__PositionObject__
```javascript
{
    x: 160,
    y: 160
}
```

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 maxValues | _Array_ | [] |
 axis | _Array_ | false | Axis
 radarSize | _Number_ | 120 | Radar Size
 radarPosition | _Object_ | PositionObject | Radar Position

<!-- End ./components/chart/radar_chart.js -->

<!-- Start ./components/chart/range_selection.js -->

###rangeSelection

_**Mixin:**_ [*DataBinding*] -

rangeSelection

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 fixRange | _Number_ | -1 | fixRange
 x | _D3.range_ | [0,0] | [D3 range](https://github.com/mbostock/d3/wiki/Arrays#wiki-d3_range) fo axis X
 y | _D3.range_ | [0,0] | [D3 range](https://github.com/mbostock/d3/wiki/Arrays#wiki-d3_range) fo axis Y
 rangeBorder | _Array_ | [] | Border of range for filter data
 jump | _Boolean_ | false | jump
 animate | _Boolean_ | true | animate

item = {
                range: [start, end],
                fixRange: days,
                reset: True/False
            }

<!-- End ./components/chart/range_selection.js -->

<!-- Start ./components/chart/range_selection_chart.js -->

###rangeSelectionChart

rangeSelectionChart

<!-- End ./components/chart/range_selection_chart.js -->

<!-- Start ./components/chart/simple_bar.js -->

###SimpleBar

_**Mixin:**_ [*DataBinding*] -

SimpleBar

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 valueField | _String_ | 'value' | Name of attribute on model for `value` value
 maxField | _String_ | 'max' | Name of attribute on model for `max` value

<!-- End ./components/chart/simple_bar.js -->

<!-- Start ./components/card/README.md -->
undefined

<!-- End ./components/card/README.md -->

<!-- Start ./components/card/card.js -->

<!-- End ./components/card/card.js -->

<!-- Start ./components/card/card_data.js -->

<!-- End ./components/card/card_data.js -->

<!-- Start ./components/card/card_side.js -->

<!-- End ./components/card/card_side.js -->

<!-- Start ./components/card/card_toolbox.js -->

<!-- End ./components/card/card_toolbox.js -->

<!-- Start ./components/card/delimiter.js -->

<!-- End ./components/card/delimiter.js -->

<!-- Start ./components/card/rule_editor.js -->

<!-- End ./components/card/rule_editor.js -->

<!-- Start ./components/card/rule_editor_toolbar.js -->

<!-- End ./components/card/rule_editor_toolbar.js -->

<!-- Start ./components/sensor_widget/README.md -->
##Widget components

<!-- End ./components/sensor_widget/README.md -->

<!-- Start ./components/sensor_widget/mixin/scale_widget.js -->

@name ScaleWidget

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 value | _Number_ | 0 | value
 maxValue | _Number_ | 100 | maxValue
 scaleRectStyle | _Object_ | {} | [Raphael - Paper.rect()](http://raphaeljs.com/reference.html#Paper.rect) configuration

<!-- End ./components/sensor_widget/mixin/scale_widget.js -->

<!-- Start ./components/sensor_widget/angle.js -->

<!-- End ./components/sensor_widget/angle.js -->

<!-- Start ./components/sensor_widget/battery.js -->

<!-- End ./components/sensor_widget/battery.js -->

<!-- Start ./components/widget_temperature.js -->

###temperatureWidget

This component use [Raphael]() for draw dinamic icon of temperature

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 fillColor | _String_ | '#6F8388' | Fill Color
 borderColor | _String_ | '#6F8388' | Border Color
 baseColor | _String_ | '#DDEAEC' | Base Color
 id | _String_ | 'temperature-widget' | Element Id
 tmin | _Number_ | 0 | Time minimun
 tmax | _Number_ | 30 | Time Maximun
 temp | _Number_ | 0.0 | Temperature

<!-- End ./components/widget_temperature.js -->

<!-- Start ./components/widget_pitch.js -->

###pitchWidget

This component use [Raphael]() for draw dinamic icon of pitch

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 pitchChart | _String_ | '.pitch-chart' | Css class name of chart
 pitchLabel | _String_ | '.pitch-label' | Css class name of label
 fillColor | _String_ | '#6F8388' | Fill color
 borderColor | _String_ | '#6F8388' | Border Color
 baseColor | _String_ | '#E9EFF0' | Base Color
 id | _String_ | 'pitch-widget' | Element Id
 angle | _Number_ | 75 | angle

<!-- End ./components/widget_pitch.js -->

<!-- Start ./components/widget_lights.js -->

<!-- End ./components/widget_lights.js -->

<!-- Start ./components/widget_gauge.js -->

###gaugeWidget

_**Mixin:**_ [*DataBinding*] - [*Component*] -

Draw gauge icon

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 value | _Number_ | 0 | Initial value
 unit | _String_ | '' | Unit to show with label
 maxValue | _Number_ | 100 | Maximum allowed value
 minValue | _Number_ | 0 | Minimum allowed value
 id | _String_ | 'gauge' | Id to attach the svg
 selector | _String_ | '.gauge-widget' | Internal use (flight selector)
 labelSelector | _String_ | '.gauge-label' | Internal use (flight selector)
 size | _Number_ | 76 | Sgv size
 gaugeBackground | _String_ | '#f2f2f2' | Gauge background color
 sphereBorder | _String_ | '000' | Sphere stroke color

#### Events

Event | Argument | Description
--- | --- | ---
 {Number} | _undefined_ | setValue Sets the gauge value
 {Number} | _undefined_ | valueChange Sets the gauge value

<!-- End ./components/widget_gauge.js -->

<!-- Start ./components/widget_battery.js -->

###batteryWidget

_**Mixin:**_ [*Template*] - [*DataBinding*] -

Draw battery icon

#### Events

Event | Argument | Description
--- | --- | ---
 drawBattery | _undefined_ | {} Change value in component
 drawBattery-voltage | _undefined_ | {} Change Voltage in component
 drawBattery-level | _undefined_ | {} Change Charge-Level in component
 refresh | _undefined_ | undefined Redraw component

<!-- End ./components/widget_battery.js -->

<!-- Start ./components/tooltip.js -->

###Tooltip

_**Mixin:**_ [*DataBinding*] -

Create tooltip element

#### Events

Event | Argument | Description
--- | --- | ---
 hide | _undefined_ | undefined Trigger this event for hide element
 show | _undefined_ | undefined Trigger this event for show element

<!-- End ./components/tooltip.js -->

<!-- Start ./components/toggle.js -->

###toggle

_**Mixin:**_ [*DataBinding*] -

Create element for toogle class when trigger 'click' event

<!-- End ./components/toggle.js -->

<!-- Start ./components/container.js -->

<!-- End ./components/container.js -->

<!-- Start ./components/minimap.js -->

###minimap

_**Mixin:**_ [*DataBinding*] -

This component use **[Mapbox](https://www.mapbox.com/mapbox.js/)** librari for draw map witch one marker
Create Map with one element

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 mapId | _String_ | -- | Mapbox user Id
 markerColor | _String_ | '#5C8F9E' | Marker Color
 zoomValue | _Number_ | 16 | Zoom Value
 movable | _Boolean_ | false | Movable map
 listenTo | _String_ | 'updateMinimap' | Evento for update value
 containerClass | _String_ | 'mapbox-mini' | Css class nae of container
 center | _Object_ | {lat:50.45,lon:7.48} | Center in this location

<!-- End ./components/minimap.js -->

<!-- Start ./components/context_menu.js -->

###contextMenu

Contextual menu.

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 items | _Array_ | [] | List of items to show in this context menu
 onSelect | _Function_ | fn(item) | Function that gets called when an item is selected

#### Events

Event | Argument | Description
--- | --- | ---
 show | _undefined_ | undefined Shows the context menu.
 hide | _undefined_ | undefined Hide the context menu.
 back | _undefined_ | undefined Triggered when the user clicks on a go back link
 selected | _undefined_ | undefined Triggered when the user selects one of the options

<!-- End ./components/context_menu.js -->

<!-- Start ./components/context_menu_indicator.js -->

<!-- End ./components/context_menu_indicator.js -->

<!-- Start ./components/paged_container.js -->

###pagedContainer

_**Mixin:**_ [*Container*] - [*Template*] -

Create pagination by component

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 insertionPoint | _String_ | '.elements' | jQuery selector

#### Events

Event | Argument | Description
--- | --- | ---
 valueChange | _undefined_ | Object Change value in component
 update | _undefined_ | undefined Redraw pages
 pageChanged | _undefined_ | undefined When page is changed

<!-- End ./components/paged_container.js -->

<!-- Start ./components/repeat_container.js -->

###RepeatContainer

_**Mixin:**_ [*DataBinding*] -

Create wrapper for each data and create component with option

###Example
origin HTML
```html
<div id="list" ></div>
```

set component and change value
```javascript
$('#list').m2mRepeatContainer({
    item:{
        tpl: '<a href="#">{{name}}</a>'
    }
}):
$('#list').trigger('valueChange', {value:[
    {name:'one'},
    {name:'two'},
    {name:'three'}
]);
```

restult of change
```html
<div id="list" >
    <div class="repeat-container-item">
        <div><a href="#">une</a></div>
    </div>
    <div class="repeat-container-item">
        <div><a href="#">two</a></div>
    </div>
    <div class="repeat-container-item">
        <div><a href="#">three</a></div>
    </div>
</div>
```

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 item | _Object_ | {component:'container'} | Attrs for components that are repeated
 filter | _Function_ | fn() | Filter value from 'valueChange' event

<!-- End ./components/repeat_container.js -->

<!-- Start ./components/form/dropdown.js -->

<!-- End ./components/form/dropdown.js -->

<!-- Start ./components/window/window.js -->

###Window

Window

#### Options

Option | Type | Default | Description
--- | --- | --- | ---
 container | _String_ | 'body' | CSS selector for the container of the window
 showOnInit | _boolean_ | false | True to show the window when initialized
 mask | _boolean_ | true | True to show an opacity mask

#### Events

Event | Argument | Description
--- | --- | ---
 show | _undefined_ | undefined Shows the window
 hide | _undefined_ | undefined Hides the window
 afterShow | _undefined_ | undefined Triggered after the window is showed
 afterHide | _undefined_ | undefined Triggered after the window is hidden

<!-- End ./components/window/window.js -->

<!-- Start ./components/draggable.js -->

<!-- End ./components/draggable.js -->

<!-- Start ./components/slider.js -->

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

<!-- End ./components/slider.js -->

<!-- Start ./components/application_boxmessage.js -->

<!-- End ./components/application_boxmessage.js -->

<!-- Start ./components/flippable.js -->

<!-- End ./components/flippable.js -->

<!-- Start ./components/application_menu.js -->

<!-- End ./components/application_menu.js -->

<!-- Start ./components/graph_editor.js -->

<!-- End ./components/graph_editor.js -->

<!-- Start ./components/iframe.js -->

<!-- End ./components/iframe.js -->

<!-- Start ./components/panel/border_collapsable_panel.js -->

<!-- End ./components/panel/border_collapsable_panel.js -->

<!-- Start ./components/context_menu_panel.js -->

<!-- End ./components/context_menu_panel.js -->

<!-- Start ./components/mapViewer.js -->

**Deprecated**

!
Mapbox map component.

<!-- End ./components/mapViewer.js -->

<!-- Start ./components/dashboard/cell_barchart_subpanel.js -->

###cellBarchartSubpanel

**Deprecated**

Create a BarChart

<!-- End ./components/dashboard/cell_barchart_subpanel.js -->

