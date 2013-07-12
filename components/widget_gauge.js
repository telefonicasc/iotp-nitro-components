
define (
[
    'components/component_manager',
    'components/mixin/template',
    'components/mixin/data_binding',
    'libs/raphael/raphael'
],
                                
function (ComponentManager, Template, Data_binding) {
    
    function Component () {
        
        this.defaultAttrs({            
            value: 0,
            id: 'gauge',
            tpl: '<div class="gauge-widget" id="gauge"></div>',
            selector: '.gauge-widget',
            gaugeBackground: '#f2f2f2',
            sphereBorder: '000', // none
            opts: {
                threshold: {
                    "0":"blue",
                    "40":"yellow", 
                    "80":"red"
                }
            }
        });
                                                                                        
        this.after('initialize', function () {

            this.on('render', function () {
                this.attr.gauge = this.gauge(this.attr.value, "#BED54E", "#063743", this.attr.opts);
            });

            this.on('setGaugeValue', function (e,o) {
                var value = o ? o : 0;
                this.attr.gauge.update(value);
            });

            this.on('valueChange', function (e,o) {
                var value = o ? o : 0;
                this.attr.gauge.update(value);
            });
        }); 

        this.arc = function(hPos, vPos, size, startingPoint, endingPoint) {
            var startingPoint  = startingPoint * Math.PI / 180;
            var arcCoefficient = endingPoint * Math.PI / 180;
            var endingPoint    = "M " + hPos + " " + vPos;
            var startingPoint  = " L " + (hPos + size * Math.cos(startingPoint)) + " " + 
                                (vPos - size * Math.sin(startingPoint));
            var curve          = " A " + [size, size, 0, 0, 1, hPos + size * Math.cos(arcCoefficient), 
                                vPos - size * Math.sin(arcCoefficient)].join(" ");

            return endingPoint + startingPoint + curve;
        };

        this.thresholdCalculator = function(threshold, percent) {
            hVal = 0
            fill = threshold['0']
            for(var i in threshold) {
                if(percent >= i && hVal <= i) {
                        hVal = i;
                        fill = threshold[i];
                }
            }
            return fill;
        };

        this.gauge = function (percent, fill, highlight, opts) {
            var canvas = Raphael(this.attr.id, 200, 100);
            var arc = this.arc;

            if(opts !== undefined ) {
                if(opts.threshold !== undefined) {
                    opts.threshold['0']=fill;
                    fill = this.thresholdCalculator(opts.threshold, percent, fill);
                }
            }

            this.background         = canvas.path(arc(80, 80, 76, -180, 0))
                                        .attr({ "fill": this.attr.gaugeBackground, "stroke": this.attr.sphereBorder });
            this.fill               = canvas.path(arc(80, 80, 76, -180, -180 * (1 + (percent / 100))))
                                        .attr({ "fill": fill, "stroke": this.attr.sphereBorder });
            this.indicator          = canvas.rect(80, 80, 76, 3)
                                        .attr({ "fill": highlight, "stroke": this.attr.sphereBorder })
                                        .rotate(180 * (1 + (percent / 100)), 80, 80);
            this.indicator.rotation = 180 * (1 + (percent / 100));
            this.indicatorCircle    = canvas.circle(80, 80, 6)
                                        .attr({ "fill": highlight, "stroke": this.attr.sphereBorder });

            return {
                fill:this.fill,
                opts:this.opts,
                indicator:this.indicator,
                canvas:this.canvas,
                thresholdCalculator: this.thresholdCalculator,
                update: function (percent) {
                    this.indicator.rotate(-this.indicator.rotation, 80, 80).rotate(180 * (1 + (percent / 100)), 80, 80);
                    this.indicator.rotation = 180 * (1 + (percent / 100));

                    if(opts !== undefined ) {
                        if(opts.threshold !== undefined) {
                            fill = this.thresholdCalculator(opts.threshold, percent);
                        }
                    }

                    this.fill.animate({ path: arc(80, 80, 76, -180, -180 * (1 + (percent / 100))) }, 300, "elastic")
                        .attr({ "fill": fill, "stroke": "none" });
                }
            }
        };

    };

    return ComponentManager.create('gaugeWidget', Template, Data_binding, Component);
});

