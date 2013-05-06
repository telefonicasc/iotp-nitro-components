define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('barChart',
            BarChart);

        function BarChart() {

            this.defaultAttrs({
                barWidth: 0.8
            });

            this.after('initialize', function() {

                var x = d3.time.scale().range([0, this.width]),
                    y = d3.scale.linear().range([this.height, 0]),
                    data = this.$node.data('value') || this.attr.value || [],
                    context = d3.select(this.node);

                context.attr('class', 'chart ' + this.attr.cssClass);

                this.updateChart = function() {
                    var bars = context.selectAll('.bar').data(data),
                        barWidth = this.attr.barWidth *
                            this.width / (data.length + 1),
                        halfBarWidth = barWidth / 2;

                    bars.enter().append('rect')
                        .attr('class', 'bar');

                    bars
                        .attr('x', function(d) {
                            return x(d.date) - halfBarWidth;
                        })
                        .attr('width', barWidth)
                        .attr('y', function(d) {
                                return d.value >= 0 ? y(d.value) : y(0);
                            })
                        .attr('height', function(d) {
                                return Math.abs(y(0) - y(d.value));
                            });

                    bars.exit().remove();
                   
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
                    this.updateChart();
                    e.stopPropagation();
                });

            });
        }
    }
);
