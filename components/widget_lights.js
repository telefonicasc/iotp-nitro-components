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
                this.attr.widget = this.createLightsChart(); 
                //this.drawLights(this.attr.widget, this.attr.angle);
                $(this.attr.lightsLabel).html(
                    "On (30 seconds) &nbsp &nbsp &nbsp&nbspError&nbsp &nbsp  "
                );
            });
        });

        this.createLightsChart = function(options) {
            var paper = Raphael(this.attr.id, 300, 120),
            bars = []; 
            arrow = paper.rect(-50, 75, 12, 10);
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

