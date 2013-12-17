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
