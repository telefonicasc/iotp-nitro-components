/**
  * @component batteryWidget
  *
  * @event {in} valueChange Change value in component
  * @event {in} drawBattery Change value in component
  * @event {in} drawBattery-voltage Change Voltage in component
  * @event {in} drawBattery-level Change Charge-Level in component
  * @event {in} refresh Redraw component
  *
  * @mixin Template, Data_binding
  */

define (
[
    'components/component_manager',
    'components/mixin/template',
    'components/mixin/data_binding',
    'libs/raphael/raphael',
    'libs/jsonpath'
],

function (ComponentManager, Template, Data_binding) {

    Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
        color = color || '#000';
        var path,
            rowHeight = h / hv,
            columnWidth = w / wv;
        path = ['M', Math.round(x) + 0.5, Math.round(y + h) + 0.5 , 'H', Math.round(x + w) + 0.5];
        path = path.concat(['M',Math.round(x) + 4*columnWidth, Math.round(y) + 0.5,'V',y + 2*rowHeight]);

        return this.path(path.join(",")).attr({stroke: color});
    };
    //no se está usando en ningun lado
    Raphael.fn.drawYLabels = function (x, y, w, h, hv, maxY, tag, style) {
        var ylabels = [];
        var rowHeight = h / hv;
        var _ey;
        var _ex;
        var label;
        ylabels.push(this.text(Math.round(x + w) + 25, Math.round(y) + 0.5, maxY + tag).attr(style));
        ylabels.push(this.text(Math.round(x + w) + 25, Math.round(y + h) + 0.5, 0 + tag).attr(style));

        for (var i = 1; i < hv; i++) {
            _ex = Math.round(x + w) + 25;
            _ey = Math.round(y + i * rowHeight) + 0.5;
            label = Math.round(maxY/hv) * (hv - i) + tag;
            ylabels.push(this.text(_ex, _ey, label).attr(style));
        }
        return ylabels;
    };

    Raphael.fn.drawXLabels = function (x, y, w, h, labels, tag, style) {
        var xlabels = [];
        var columnWidth = w / labels.length;
        var _ey = Math.round(y + h) + 25;
        var _ex;


        for (var i = 0, n = labels.length; i < n; i++) {
            _ex = Math.round(x + i * columnWidth) + 15;
            xlabels.push( this.text(_ex, _ey, labels[i] + tag).attr(style) );
        }
        return xlabels;
    };

    function BatteryWidget () {

        this.defaultAttrs({
            batteryGraph: '.battery-graph',
            batteryChart: '.battery-chart',
            batteryLabel: '.battery-label',
            batteryLegend: '.battery-legend',
            fillColor: '#6F8388',
            borderColor: '#6F8388',
            baseColor: '#DDEAEC',
            id: 'battery-widget',
            height:100,
            value: {
                voltage:null,
                charge:null
            },
            defaultValue:{
                voltage:'-',
                charge:'-'
            },
            tpl: '<div class="battery-graph" id="battery-graph"/>' +
                 '<div class="battery-chart" id="battery-chart"/>' +
                 '<div class="battery-label"/>' +
                 '<div class="battery-legend"/>'
        });

        this.after('initialize', function () {

            this.attr.batteryLabelID = this.attr.batteryLabel.substring(1);
            this.$node.addClass('m2m-widgetBattery');
            if(this.attr.id){
                this.$node.attr('id', this.attr.id);
            }

            this.on('drawBattery', function (event, batteryLevel, voltage) {
                this.attr.value = {
                    voltage:voltage,
                    charge:batteryLevel
                };

                this.drawBatteryVoltage(voltage);
                this.drawBatteryLevel(batteryLevel);
            });

            this.on('drawBattery-voltage', function (event, voltage) {
                this.attr.value.voltage = voltage;
                this.drawBatteryVoltage(voltage);
            });

            this.on('drawBattery-level', function (event, batteryLevel) {
                this.attr.value.charge = batteryLevel;
                this.drawBatteryLevel(batteryLevel);
            });

            this.on('refresh', this.refresh);

            // Receives and array of measures, and parses the data required
            // Requires: {value: {charge: <text>, voltage: <float>}, silent:<>bln }
            this.on('valueChange', this.valueChange);

            this.valueChange(null, this.attr);
        });

        this.valueChange = function(event, opt){
            var value = opt.value;
            if( $.isArray(value) ) {
                value = value[0];
            }
            this.attr.value = value;
            this.attr.widgetGraph = this.createBatteryGraph();
            this.attr.widgetChart = this.createBatteryChart();

            this.drawBatteryVoltage(this.attr.value.voltage);
            this.drawBatteryLevel(this.attr.value.charge);
        };

        this.refresh = function(){
            this.trigger('valueChange', {
                value: this.attr.value,
                silent:true
            });
        };

        this.drawBatteryVoltage = function (voltage) {
            var text = this.attr.defaultValue.voltage;
            voltage = parseFloat(voltage);
            if( $.isNumeric(voltage) ){
                text = (Math.round(voltage * 10) / 10) + 'V';
            }
            this.select('batteryLabel').html( text );
        };

        this.drawBatteryLevel = function (batteryLevel) {
            var batteryStatus;

            batteryLevel = batteryLevel || this.attr.defaultValue.charge;

            switch (batteryLevel) {
                case 'full':
                    batteryStatus = 16.8;
                    break;
                case 'low':
                    batteryStatus = 16.8*0.3;
                    break;
                case 'empty':
                    batteryStatus = 0;
                    break;
                default:
                    batteryStatus = 0;
            }

            this.attr.widgetGraph.fill.animate({
                height: batteryStatus,
                y: 48 - batteryStatus
            }, this.attr.height);
            this.attr.widgetGraph.fill.show();
        };

        this.createBatteryGraph = function() {
            var $graph = this.select('batteryGraph')[0];
            var paper = Raphael($graph, 50, this.attr.height);
            var connector = paper.rect(20,26,6,3,0.5);
            var stack = paper.rect(17,28,12,23,2);
            var eraseLine = paper.rect(21,27.5,4,3);
            var fill = paper.rect(19.5,48,7,0,0);

            connector.attr({fill: this.attr.baseColor,
                stroke: this.attr.borderColor, 'stroke-width':1.5});
            stack.attr({fill: this.attr.baseColor,
                stroke: this.attr.borderColor, 'stroke-width':1.5});
            eraseLine.attr({fill: this.attr.baseColor, stroke: this.attr.baseColor});


            fill.attr({fill: this.attr.fillColor, stroke: this.attr.borderColor});
            fill.hide();
            return {
                stack:stack,
                fill:fill
            };
        };

        this.createBatteryChart = function(options) {
            var $chart = this.select('batteryChart')[0],
                paper = Raphael($chart, 200, this.attr.height),
                lineChart;

            var maxY = 14,
                width = 180,
                height = 50,
                leftgutter = 0,
                rightgutter = 0,
                bottomgutter = 0,
                topgutter = 10,
                linesColor = '#CEDBDC',
                color = '#ff0000',
                tag = 'V',
                txtStyle = {
                    font: '12px Helvetica, Arial',
                    fill: '#5a6568'
                },
                date = new Date(),
                labels = [
                    new Date(date.getTime() - 86400000).toLocaleTimeString().split(':')[0] + ':00',
                    new Date(date.getTime() - 57600000).toLocaleTimeString().split(':')[0] + ':00',
                    new Date(date.getTime() - 28800000).toLocaleTimeString().split(':')[0] + ':00'
                ];
            var grid = paper.drawGrid(
                leftgutter,
                topgutter + 0.5, width - leftgutter - rightgutter,
                height - topgutter - bottomgutter, 4, 2, linesColor
            );

            var xlabels = paper.drawXLabels(
                leftgutter ,
                topgutter + 0.5,
                width - leftgutter - rightgutter ,
                height - topgutter - bottomgutter,
                labels,
                '',
                txtStyle
            );

            return {
                paper: paper,
                xlabels: xlabels
            };
        };
    }

    return ComponentManager.create('batteryWidget', Template, BatteryWidget, Data_binding);
});

