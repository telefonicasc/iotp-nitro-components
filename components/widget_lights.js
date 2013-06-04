define (
[
    'components/component_manager',
    'libs/raphael/raphael'
],
                                
function (ComponentManager) {
    
    return ComponentManager.create('lightsWidget', LightsWidget);
                                                        
    function LightsWidget () {
        
        this.defaultAttrs({
            lightsChart: '.lights-chart',
            lightsLabel: '.lights-label',
            fillColor: '#6F8388',
            borderColor: '#6F8388',
            baseColor: '#E9EFF0',
            id: 'lights-widget',
            arrowURL: 'url(res/images/arrow.png)',
            greyLightURL: 'url(res/images/greyLight.png)'
        });
                                                                                        
        this.after('initialize', function () {
            this.$node.attr('id', this.attr.id);
            
            this.$nodeMap = $('<div>').addClass('lights-label').appendTo(this.$node);

            //var obj = this.createTemperatureChart();
            this.on('drawLights', function () {
                console.log('Drawing lights widget');
                this.attr.lightsChartWidget = this.createLightsChart(); 
                //this.drawLights(this.attr.widget, this.attr.angle);
                $(this.attr.lightsLabel).html(
                    "On (30 seconds) &nbsp &nbsp &nbsp&nbspError&nbsp &nbsp  "
                );
            });
        });
        
        this.formatData = function (lightArray) {
            var array = [];
            for(var i= 0; i < lightArray.data.length; i++) {
              var count = 1;
              var init = lightArray.data[i+count];
              var next = lightArray.data[i+count+1];
              while (next && init.ms.v == next.ms.v) {
                  count++;
                  init = next;
                  next = lightArray.data[i+count+1];
              }
              if (init && init.ms.v != "off") {
                  var fin = new Date(lightArray.data[i].st);
                  var ini = new Date(init.st);
                  var segProp = init.ms.v == "error" ? 150: (fin.getTime() - ini.getTime())/1000;
                  var error = init.ms.v == "error" ? "-error": "";
                  array.push({'timestamp': ini, 'type':lightArray.data[i].ms.p + error, 'value': segProp});
              }
              i = i + count - 1;
            }
            return array;
        };
        
        this.requestDataCallback = function(redLight, yellowLight, greenLight) {

            var result = this.formatData(greenLight);
            result = result.concat(this.formatData(redLight));
            result = result.concat(this.formatData(yellowLight));
            result.sort(function(a, b) {
                if (a.timestamp < b.timestamp)
                    return -1;
                if (a.timestamp > b.timestamp)
                    return 1;
                return 0;
            });

            if (result.length > 20) {
                result = result.slice(result.length - 20);
                this.lightsChartWidget.arrow.animate({
                    x: 14 * (result.length - 1)
                }, 300);
            }

            for (var i = 0; i < 20; i++) {
                var value = 70;
                var style = {
                    fill: greyLightURL
                };

                if (result[i] != null) {
                    if (result[i].value < 150) {
                        value = result[i].value * 70 / 150; //150 is the 100%
                        value = Math.ceil(value / 14) * 14; //Adjust to icon size
                    }

                    style = {
                        fill: 'url(res/images/' + result[i].type + '.png)'
                    };

                }

                this.lightsChartWidget.bars[i].attr({
                    height: value,
                    y: 70 - value
                });

                this.lightsChartWidget.bars[i].attr(style);
            }
            this.updating = false;
        };
        
        
        
        this.getLightData = function (url, red, yellow, green) {
            
        };
        
        this.drawLights = function (url) {
            
        };

        this.createLightsChart = function(options) {
            var paper = Raphael(this.attr.id, 300, 120),
            bars = []; 
            var arrow = paper.rect(-50, 75, 12, 10);
            arrow.attr({
                'stroke-width': 0,
                fill: this.attr.arrowURL
            });
            
            var style = {
                'stroke-width': 0,
                fill: this.attr.greyLightURL
            };
            
            for (var i=0; i<20; i++) {
                var bar = paper.rect(14*i, 0, 14, 70);
                bar.attr(style);
                bars[i] = bar;
            }
            var on = paper.circle(6,84,5);
            var error = paper.circle(118,84,5);
            on.attr({fill: this.attr.fillColor, stroke: this.attr.borderColor});
            error.attr({stroke: this.attr.borderColor, "stroke-width":1,'fill-opacity':0});
         
            return {
                paper: paper,
                bars: bars,
                arrow: arrow
            };
        };
        

    } // </LightsWidget>
});

