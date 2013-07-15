
define (
[
    'components/component_manager',
    'components/mixin/data_binding',
    'libs/raphael/raphael'
],
                                
function (ComponentManager, Data_binding) {
    
    function Component () {
        
        this.defaultAttrs({            
            value: 0,
            unit: '',
            maxValue: 100,
            minValue: 0,
            id: 'gauge',
            selector: '.gauge-widget',
            labelSelector: '.gauge-label',
            size: 76,
            gaugeBackground: '#f2f2f2',
            sphereBorder: '000', // none
            opts: {
                threshold: {
                    "0":"green",
                    "60":"#D7DF01",
                    "80":"#B40404"
                }
            }
        });
                                                                                        
        this.after('initialize', function () {

            var initialText = this.attr.value + ' ' + this.attr.unit;

            this.$node.addClass('gauge');
            this.$nodeMap = $('<div>').addClass('gauge-widget').attr('id',this.attr.id).appendTo(this.$node);
            this.$nodeMap = $('<span>').addClass('gauge-label').html(initialText).appendTo(this.$node);
           
            this.on('render', function () {
                this.attr.gauge = this.gauge(this.attr.value, "green", "#063743", this.attr.opts);
            });
            

            this.on('setValue', function (e,o) {
                this.attr.value = o && typeof o === 'number' ? o : 0;
                this.attr.gauge.update(this.calculatePercent(this.attr.value));
                this.select('labelSelector').html(this.attr.value + ' ' + this.attr.unit);
            });

            this.on('valueChange', function (e,o) {
                this.attr.value = o && typeof o === 'number' ? o.value : this.attr.value;
                this.attr.gauge.update(this.calculatePercent(this.attr.value));
                this.select('labelSelector').html(this.attr.value + ' ' + this.attr.unit);
            });
        });

        this.calculatePercent = function (value) {
            var onePercent = 100 / (this.attr.maxValue - this.attr.minValue);
            var finalValue = (value - this.attr.minValue) * onePercent;
            if (finalValue > 100) finalValue = 100;
            if (finalValue < 0) finalValue = 0;
            return finalValue;
        };

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
            var canvasHeight = this.attr.size + 10;
            var canvasWidth = this.attr.size * 2 + 20;
            // 300,100
            var canvas = Raphael(this.attr.id, canvasWidth, canvasHeight);
            //var canvas = Raphael(this.attr.id, 100, canvasHeight);
            var arc = this.arc;

            if(opts !== undefined ) {
                if(opts.threshold !== undefined) {
                    //opts.threshold['0']=fill;
                    fill = this.thresholdCalculator(opts.threshold, percent, fill);
                }
            }
                                        // arc(80, 80, 76, -180, 0)
            var size = this.attr.size;
            var hvpos = size + 4;
            this.background         = canvas.path(arc(hvpos, hvpos, size, -180, 0))
                                        .attr({ "fill": this.attr.gaugeBackground, "stroke": this.attr.sphereBorder });
            this.fill               = canvas.path(arc(hvpos,hvpos, size, -180, -180 * (1 + (percent / 100))))
                                        .attr({ "fill": fill, "stroke": this.attr.sphereBorder });
            this.indicator          = canvas.rect(hvpos,hvpos, size, 2)
                                        .attr({ "fill": highlight, "stroke": this.attr.sphereBorder })
                                        .rotate(180 * (1 + (percent / 100)), hvpos, hvpos);
            this.indicator.rotation = 180 * (1 + (percent / 100));
            this.indicatorCircle    = canvas.circle(hvpos,hvpos, 6)
                                        .attr({ "fill": highlight, "stroke": this.attr.sphereBorder });

            return {
                fill:this.fill,
                opts:this.opts,
                indicator:this.indicator,
                canvas:this.canvas,
                thresholdCalculator: this.thresholdCalculator,
                update: function (percent) {
                    this.indicator
                        .rotate(-this.indicator.rotation, hvpos, hvpos)
                        .rotate(180 * (1 + (percent / 100)), hvpos, hvpos);
                    this.indicator.rotation = 180 * (1 + (percent / 100));

                    if(opts !== undefined ) {
                        if(opts.threshold !== undefined) {
                            fill = this.thresholdCalculator(opts.threshold, percent);
                        }
                    }

                    this.fill.animate(
                        { path: arc(hvpos, hvpos, size, -180, -180 * (1 + (percent / 100))) }, 
                        canvasWidth, 
                        "elastic"
                    ).attr({ "fill": fill, "stroke": "none" });
                }
            }
        };

    };

    return ComponentManager.create('gaugeWidget', Data_binding, Component);
});

