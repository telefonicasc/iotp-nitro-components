define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('areaStackedChart',
            AreaStackedChart);

        function AreaStackedChart() {

            this.defaultAttrs({
            });

            this.after('initialize', function() {

                var x = d3.time.scale().range([0, this.width]),
                    y = d3.scale.linear().range([this.height, 0]),
                    data = this.$node.data('value') || this.attr.value || [],
                    context = d3.select(this.node);

                context.attr('class', 'chart stacked ' + this.attr.cssClass);

                var stack = d3.layout.stack()
                  .offset('zero')
                  .values(function(d) { return d.values; })
                  .x(function(d) { return d.date; })
                  .y(function(d) { return d.value; });

                var area = d3.svg.area()
                  .interpolate('cardinal')
                  .x(function(d) { return x(d.date); })
                  .y0(function(d) { return y(d.y0); })
                  .y1(function(d) { return y(d.y0 + d.value); });

                var line = d3.svg.line()
                  .interpolate('basis')
                  .x(function(d) { return x(d.date); })
                  .y(function(d) { return y(d.y0 + d.value); });

                var svg = context.append('svg').append('g');

                this.updateChart = function() {

                    svg.remove();
                    svg = context.append('svg').append('g');

                    var defs = svg.append('svg:defs');
                    defs.append('svg:pattern')
                        .attr('id', 'pattern_'+this.attr.colorPattern)
                        .attr('patternUnits', 'userSpaceOnUse')
                        .attr('width', '20')
                        .attr('height', '20')
                        .append('svg:image')
                        .attr('xlink:href', './img/pattern_'+this.attr.colorPattern+'.png')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('width', 20)
                        .attr('height', 20);


                    svg.attr('width', this.width).attr('height', this.height);

                    if (data && data.length > 0){
                        var self = this,
                            hoverCircle;

                        var layers = stack(data);
                        var color = this.attr.color;

                        svg.selectAll('.layer')
                          .data(layers)
                          .enter().append('svg:path')
                          .attr('class', 'layer')
                          .attr('d', function(d) { return area(d.values); })
                          .style('fill', 'url(#pattern_'+this.attr.colorPattern+')');

                        svg.selectAll('.line')
                          .data(layers)
                          .enter().append('svg:path')
                          .attr('d', function(d) { return line(d.values); })
                          .style('stroke', this.attr.colorLine)
                          .style('stroke-width', '2px')
                          .attr('class', 'line');

                    }

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
                            if (val.date >= options.range[0] &&
                                val.date <= options.range[1]) {
                                return val;
                            }
                        });
                    data = [];
                    data.push({key: valueField, values: this.attr.value});
                    x.domain(options.range);
                    y.domain(options.valueRange);
                    this.updateChart();
                    e.stopPropagation();
                });

            });
        }
    }
);
