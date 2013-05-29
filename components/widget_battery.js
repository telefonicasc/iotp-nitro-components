define (
[
    'components/component_manager',
    'libs/raphael/raphael'
],
                                
function (ComponentManager) {
    
    return ComponentManager.create('batteryWidget', BatteryWidget);
                                                        
    function BatteryWidget () {
        
        this.defaultAttrs({
            batteryGraph: '.battery-graph',
            batteryChart: '.battery-chart',
            batteryLabel: '.battery-label',
            batteryLegend: '.battery-legend',
            fillColor: '#6F8388',
            borderColor: '#6F8388',
            baseColor: '#E9EFF0',
            id: 'battery-widget',
            value: 0
        });
                                                                                        
        this.after('initialize', function () {
            
            // Set attributes for use with raphael
            this.attr.batteryLabelID = this.attr.batteryLabel.substring(1);
            
            this.$node.attr('id', this.attr.id);
            
            this.$nodeMap = $('<div>').addClass('battery-graph')
                .attr('id','battery-graph').appendTo(this.$node);
            this.$nodeMap = $('<div>').addClass('battery-chart')
                .attr('id','battery-chart').appendTo(this.$node);
            this.$nodeMap = $('<div>').addClass('battery-label').appendTo(this.$node);
            this.$nodeMap = $('<div>').addClass('battery-legend').appendTo(this.$node);
       
            this.select('batteryLegend').html('<pre>09:00   17:00   01:00</pre>');
            this.on('drawBattery', function (event, batteryLevel, voltage) {
                console.log('Drawing battery widget');
                this.attr.widgetGraph = this.createBatteryGraph(); 
                this.attr.widgetChart = this.createBatteryChart();
                this.drawBatteryGraph(this.attr.widgetGraph, batteryLevel, voltage);

                this.drawBatteryVoltage(voltage);
                this.drawBatteryVoltage(batteryLevel);
            });
            
            this.on('drawBattery-voltage', function (event, voltage) {
                this.drawBatteryVoltage(voltage);
            });
            
            this.on('drawBattery-level', function (event, batteryLevel) {
                this.drawBatteryLevel(batteryLevel);
            });

            Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
                color = color || "#000";
                var path;
                    rowHeight = h / hv,
                    columnWidth = w / wv;
                path = ["M", Math.round(x) + 0.5, Math.round(y + h) + 0.5 , 
                     "H", Math.round(x + w) + 0.5];
                path = path.concat(["M",Math.round(x) + 4*columnWidth, 
                        Math.round(y) + 0.5,"V",y + 2*rowHeight]);
                
                return this.path(path.join(",")).attr({stroke: color});
            };
            
            Raphael.fn.drawYLabels = function (x, y, w, h, hv, maxY, tag, style) {
                var ylabels = [];
                ylabels.push(this.text(Math.round(x + w) + 25, 
                            Math.round(y) + 0.5, maxY + tag).attr(style));
                ylabels.push(this.text(Math.round(x + w) + 25, 
                            Math.round(y + h) + 0.5, 0 + tag).attr(style));
                
                var rowHeight = h / hv;
                
                for (var i = 1; i < hv; i++) {
                    ylabels.push(this.text(Math.round(x + w) + 25, 
                                Math.round(y + i * rowHeight) + 0.5, 
                                Math.round(maxY/hv) * (hv - i) + tag).attr(style));
                }
                return ylabels;
            };
            
            Raphael.fn.drawXLabels = function (x, y, w, h, wv, labels, tag, style) {
                var xlabels = [];
                xlabels.push(this.text(Math.round(x) + 15, Math.round(y + h) + 25, 
                            labels[0] + tag).attr(style));
                xlabels.push(this.text(Math.round(x + w) - 10, Math.round(y + h) + 25,
                            labels[labels.length -1] + tag).attr(style));
                
                var columnWidth = w / wv;
                
                for (var i = 1; i < wv; i++) {
                    xlabels.push(this.text(Math.round(x + i * columnWidth) + 15, 
                                Math.round(y + h) + 25, labels[i] + tag).attr(style));
                }
                return xlabels;
            };
	

        }); // </after>


        this.drawBatteryVoltage = function (voltage) {
            if (voltage == null) {
                $(this.select('batteryLabel')).html('Error');
            }
            else {
                $(this.select('batteryLabel')).html((Math.round(parseFloat(voltage) * 10) / 10) + 'V');
            }
        };
        
        this.drawBatteryLevel = function (batteryLevel) {
            if (batteryLevel == null) {
                console.log('Battery Status Level is: NULL');
            }
            else {
                var batteryStatus;
                switch (batteryLevel) {
                    case "full":
                        batteryStatus = 16.8;
                        break;
                    case "low":
                        batteryStatus = 16.8*0.3;
                        break;
                    case "empty":
                        batteryStatus = 0;
                        break;
                    default:
                        batteryStatus = 0;
                }
                
                this.attr.widgetGraph.fill.animate({
                    height: batteryStatus,
                    y: 48 - batteryStatus
                }, 300);
//                this.attr.widgetGraph.fill.animate({
//                    height: Math.min(parseFloat(batteryStatus), 14) * 1.2,
//                    y: 48 - Math.min(parseFloat(batteryStatus), 14) * 1.2
//                }, 300);
                this.attr.widgetGraph.fill.show();
            }
        };

        this.drawBatteryGraph = function(batteryGraph, batteryLevel, voltage) {
            // Set voltage level
            if (voltage == null) {
                $(this.select('batteryLabel')).html('Error');
//                this.ui.batteryLabel.html("Error");
            }
            else {
                $(this.select('batteryLabel')).html((Math.round(parseFloat(voltage) * 10) / 10) + 'V');
//                this.batteryGraph.fill.animate({
//                    height: Math.min(parseFloat(voltage), 14) * 1.2,
//                    y: 48 - Math.min(parseFloat(voltage), 14) * 1.2
//                }, 300);
//                this.batteryGraph.fill.show();
            }
            
            // Fill the battey graphic
        };
        
        this.createBatteryGraph = function() {
            var paper = Raphael('battery-graph', 320, 100),
              fill, 
              stack;
            connector = paper.rect(20,26,6,3,0.5);
            stack = paper.rect(17,28,12,23,2);
            eraseLine = paper.rect(21,27.5,4,3);
            connector.attr({fill: this.attr.baseColor, 
                stroke: this.attr.borderColor, 'stroke-width':1.5});
            stack.attr({fill: this.attr.baseColor, 
                stroke: this.attr.borderColor, 'stroke-width':1.5});
            eraseLine.attr({fill: this.attr.baseColor, stroke: this.attr.baseColor});
            fill = paper.rect(19.5,48,7,0,0);
            fill.attr({fill: this.attr.fillColor, stroke: this.attr.borderColor});
            fill.hide();
            return {
                stack:stack,
                fill:fill
            };
        };
        

        this.createBatteryChart = function(options) {
            var paper = Raphael('battery-chart', 300, 100),
                        lineChart; 
            
            var maxY = 14,
              width = 220,
              height = 50,
              leftgutter = 0,
              rightgutter = 70,
              bottomgutter = 0,
              topgutter = 10,
              linesColor = "#CEDBDC",
              color = "#ff0000",
              tag = "V",
              txtStyle = {
                    font: '12px Helvetica, Arial', fill: "#5a6568"},
                    date = new Date(),
                    labels = [
                    new Date(date.getTime() - 86400000).toLocaleTimeString().split(":")[0] + ":00",
                    new Date(date.getTime() - 57600000).toLocaleTimeString().split(":")[0] + ":00", 
                    new Date(date.getTime() - 28800000).toLocaleTimeString().split(":")[0] + ":00",""
                    ];
            var grid = paper.drawGrid(
                    leftgutter, topgutter + 0.5, width - leftgutter - rightgutter,
                        height - topgutter - bottomgutter, 4, 2, linesColor
                );
            var xlabels = paper.drawXLabels(leftgutter , topgutter + 0.5, 
                    width - leftgutter - rightgutter , height - topgutter - bottomgutter,
                    3, labels, "", txtStyle
                );
            
            var options =  {
               nostroke: false,   
               symbol: "circle",    
               smooth: false,     
               colors: [
                 "#5a6568",
                 "#00ff0000"
               ]
            };
            // TODO: Fix this
//            lineChart = paper.linechart(0, 0, width, height + topgutter,[],
//              [[],[100, 0]], options);
            
            return {
                paper: paper,
//                lineChart: lineChart,
                xlabels: xlabels
                //  ylabels: ylabels
            };
        } 
        

    } // </PitchWidget>
});

