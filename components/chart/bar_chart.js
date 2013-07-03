define(
    [
        'components/component_manager',
        'components/chart/mixin/tooltip'
    ],

    function(ComponentManager, Tooltip) {

        return ComponentManager.create('barChart',
            BarChart, Tooltip);

        function BarChart() {

            this.defaultAttrs({
                barWidth: 0.8
            });

            this.after('initialize', function() {

                var x = d3.time.scale().range([0, this.width]),
                    y = d3.scale.linear().range([this.height, 0]),
                    data = this.$node.data('value') || this.attr.value || [],
                    context = d3.select(this.node);

                context.attr('class', 'chart barchart ' + this.attr.cssClass);


                var anim = false;

                this.updateChart = function() {
                    var bars = context.selectAll('.bar').data(data),
                        barWidth = this.attr.barWidth *
                            this.width / (data.length + 1),
                        halfBarWidth = barWidth / 2;

                    bars.enter().append('rect').attr('class', function(d){
                        return 'bar';
                    });
                    var self = this;
                    bars.attr('x', function(d) {
                        return x(d.date) - halfBarWidth;
                    })
                    .attr('id', function(d){
                        return d.date;
                    })
                    .attr('width', barWidth);
                    bars.on('mouseover', function(d) {
                        console.log('mouseover');
                        self.showTooltip(this, d.value, barWidth/2-6);
                    });
                    bars.exit().remove();
                    
                    if (anim){
                        bars = bars.transition().duration(800);
                    }
                    bars.attr('height', function(d) {
                        return Math.abs(y(0) - y(d.value));
                    })
                    .attr('y', function(d) {
                        return d.value >= 0 ? y(d.value) : y(0);
                    });
                    anim = false;
                   
                };

                this.on('resize', function(e, chartSize) {
                    this.width = chartSize.width;
                    this.height = chartSize.height;
                    x.range([0, this.width]);
                    y.range([this.height, 0]);
                    this.updateChart();
                    e.stopPropagation();
                });

                this.on('valueChange', function(e, options) {
                    var valueField = this.attr.model;
                    this.attr.value = $.map(options.value[valueField], function(val, i) {
                            if (val.date > options.range[0] &&
                                val.date < options.range[1]) {
                                return val;
                            }
                        });
                    data = this.attr.value;
                    x.domain(options.range);
                    y.domain(options.valueRange);
                    this.options = options;
                    this.updateChart();
                    e.stopPropagation();
                });

                this.on('actionSelected', function(e, value){
                    e.stopPropagation();
                    if (value.newModel){
                        this.attr.model = value.newModel;
                    }
                    if (this.attr.tooltip)
                        this.attr.tooltip.caption = (value.caption)? value.caption: '';
                    anim = true;
                    this.trigger('valueChange', this.options);

                });

                this.showTooltip = function(elem, d, offset) {
                    if (d === 0){
                        return;
                    }
                    var html = '<div class="value">'+d+' €</div><div class="caption">'+this.attr.tooltip.caption+'</div>';                        
                    this.trigger('showTooltip', {'elem':elem, 'html': html, 'offset': offset} );
                };

            });
        }
    }
);
