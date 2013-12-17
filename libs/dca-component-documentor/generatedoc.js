var markdox = require('markdox');
var componentesPath = [
    './components/README.md',
    //mixins
    './components/mixin/README.md',
    './components/mixin/container.js',
    './components/mixin/data_binding.js',
    './components/mixin/template.js',
    './components/mixin/draggable.js',
    './components/mixin/watch_resize.js',
    //core
    './components/core/README.md',
    './components/component_manager.js',
    './components/jquery_plugins.js',
    './components/angular_directives.js',
    './components/component.js',

    //dashboard
    './components/dashboard/README.md',
    './components/dashboard/dashboard.js',
    './components/dashboard/dashboard_main_panel.js',
    './components/dashboard/details_panel.js',
    './components/dashboard/details_subpanel.js',
    './components/dashboard/carousel_panel.js',
    './components/dashboard/map.js',
    './components/dashboard/map_marker_group_tooltip.js',
    './components/dashboard/overview_panel.js',
    './components/dashboard/overview_subpanel.js',
    './components/dashboard/overview_subpanel_list.js',

    //chart
    './components/chart/README.md',
    './components/chart/mixin/chart_element.js',
    './components/chart/mixin/tooltip.js',
    './components/chart/axis/axis.js',
    './components/chart/axis/time_axis.js',
    './components/chart/area_chart.js',
    './components/chart/area_stacked_chart.js',
    './components/chart/bar_chart.js',
    './components/chart/carousel_barchart.js',
    './components/chart/chart_container.js',
    './components/chart/column_chart.js',
    './components/chart/grid.js',
    './components/chart/group_bar_chart.js',
    './components/chart/radar_chart.js',
    './components/chart/range_selection.js',
    './components/chart/range_selection_chart.js',
    './components/chart/simple_bar.js',
    //cards
    './components/card/README.md',
    './components/card/card.js',
    './components/card/card_data.js',
    './components/card/card_side.js',
    './components/card/card_toolbox.js',
    './components/card/delimiter.js',
    './components/card/rule_editor.js',
    './components/card/rule_editor_toolbar.js',
    //Widget
    './components/sensor_widget/README.md',
    './components/sensor_widget/mixin/scale_widget.js',
    './components/sensor_widget/angle.js',
    './components/sensor_widget/battery.js',
    './components/widget_temperature.js',
    './components/widget_pitch.js',
    './components/widget_lights.js',
    './components/widget_gauge.js',
    './components/widget_battery.js',
    //otros
    //'./components/others/README.md',
    './components/tooltip.js',
    './components/toggle.js',
    './components/container.js',
    './components/minimap.js',
    './components/context_menu.js',
    './components/context_menu_indicator.js',
    './components/paged_container.js',
    './components/repeat_container.js',
    './components/form/dropdown.js',
    './components/window/window.js',
    './components/draggable.js',
    './components/slider.js',
    './components/application_boxmessage.js',
    './components/flippable.js',
    './components/application_menu.js',
    './components/graph_editor.js',
    './components/iframe.js',
    './components/panel/border_collapsable_panel.js',
    './components/context_menu_panel.js',

    //deprecated
    './components/mapViewer.js',
    './components/dashboard/cell_barchart_subpanel.js'
];
var parseTagTypes = function(str) {
  return str
    .replace(/[{}]/g, '')
    .split(/ *[|,\/] */);
};
function getOptions(args) {
    var REGEPX = /^-/;
    var options = {};
    var index = 0;
    var opt;
    while(opt = args[index++] ){
        if( REGEPX.test(opt) ){
            options[args.shift()] = args.shift();
            --index;
        }
    }
    return options;
}

var args = process.argv.splice(2);
var options = getOptions(args);

var options = {
    output: options['-o'] || 'documentation.md',
    formatter: function(docfile){
        docfile.javadoc.forEach(function(javadoc, index){
            javadoc.tag = javadoc.tag || { option:[] };
            javadoc.raw.tags.forEach(function(tag){
                var string =tag.string || '';
                var parts = string.split(/ +/);
                if (tag.type == 'option' || tag.type == 'event'){

                    if(tag.type == 'option')
                        tag.types = parseTagTypes( parts.shift() || '' ).join(', ');
                    tag.name = parts.shift();


                    if (tag.type == 'option'){
                        tag.default = parts.shift();
                    }
                    tag.description = parts.join(' ');
                };

                if(tag.type){
                    if(!javadoc.tag[tag.type]) javadoc.tag[tag.type] = [];
                    javadoc.tag[tag.type].push(tag);
                }

            });
            //console.log(javadoc.tag);
        });
        return docfile;
    },
    template: options['-t'] ||  __dirname + '/components_doc.ejs'
};

markdox.process(componentesPath, options, function(){
    console.log('Parse files:')
    console.log(componentesPath)
    console.log('Documentation generated in "'+options.output+'"');
});
