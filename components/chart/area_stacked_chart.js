define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('areaStackedChart',
            AreaStackedChart);

        function AreaStackedChart() {

            this.defaultAttrs({
                colorArea: '#ff0000',
                colorLine: '#00ff00',
                fillOpacity: 0.85
            });

            this.after('initialize', function() {

                var x = d3.time.scale().range([0, this.width]),
                    y = d3.scale.linear().range([this.height, 0]),
                    data = this.$node.data('value') || this.attr.value || [],
                    context = d3.select(this.node);

                context.attr('class', 'chart stacked ' + this.attr.cssClass);

                if (this.attr.tooltip) {
                    this.tooltip = $('<div>').addClass('tooltip')
                        .appendTo($('body'));
                }

                var stack = d3.layout.stack()
                  .offset('zero')
                  .values(function(d) { return d.values; })
                  .x(function(d) { return d.date; })
                  .y(function(d) { return d.value; });

                var area = d3.svg.area()
                  //.interpolate('cardinal')
                  .x(function(d) { return x(d.date); })
                  .y0(function(d) { return y(d.y0); })
                  .y1(function(d) { return y(d.y0 + d.value); });

                var line = d3.svg.line()
                  //.interpolate('basis')
                  .x(function(d) { return x(d.date); })
                  .y(function(d) { return y(d.y0 + d.value); });

                var svg = context.append('svg').append('g');

                this.updateChart = function() {

                    svg.remove();
                    svg = context.append('svg').append('g');

                    var areaColor = this.attr.colorArea;

                    if (this.attr.colorPattern){
                        var defs = svg.append('svg:defs');
                        defs.append('svg:pattern')
                          .attr('id', 'pattern_'+this.attr.colorPattern)
                          .attr('patternUnits', 'userSpaceOnUse')
                          .attr('width', 20)
                          .attr('height', 20)
                          .append('svg:image')
                          .attr('xlink:href', this.attr.colorPattern)
                          .attr('x', 0)
                          .attr('y', 0)
                          .attr('width', 20)
                          .attr('height', 20);

                        areaColor = 'url(#pattern_'+this.attr.colorPattern+')';
                    }

                    svg.attr('width', this.width).attr('height', this.height);

                    if (data && data.length > 0){

                        var self = this,
                            hoverCircle;

                        var layers = stack(data);

                        svg.selectAll('.layer')
                          .data(layers)
                          .enter().append('svg:path')
                          .attr('class', 'layer')
                          .attr('d', function(d) { return area(d.values); })
                          .style('fill', areaColor)
                          .style('fill-opacity', this.attr.fillOpacity);

                        svg.selectAll('.line')
                          .data(layers)
                          .enter().append('svg:path')
                          .attr('d', function(d) { return line(d.values); })
                          .style('stroke', this.attr.colorLine)
                          .attr('class', 'line');

                        if (this.attr.tooltip) {
                            hoverCircle = svg.selectAll('.hoverCircle')
                                .data(data[0].values);

                            hoverCircle.enter().append('circle')
                                .attr('r', 6)
                                .attr('opacity', 0)
                                .attr('class', 'hoverCircle')
                                .on('mouseover', function(d) {
                                    d3.select(this).attr('opacity', 1);
                                    self.showTooltip(this, d);
                                })
                                .on('mouseout', function(d) {
                                    d3.select(this).attr('opacity', 0);
                                    self.hideTooltip();
                                })
                                .attr('transform', function (d, i){
                                    return 'translate('+x(d.date)+','+y(d.y0 + d.value)+')';
                                });

                            hoverCircle.exit().remove();
                        }
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

                this.showTooltip = function(circle, d) {
                    var pos = $(circle).offset();
                    this.tooltip.html('<div>'+d.value2+'</div><div class="caption">'+this.attr.tooltip.caption+'</div>');
                    this.tooltip.css({
                        top: pos.top,
                        left: pos.left + $(circle).width() / 2
                    });
                    this.tooltip.show();
                    console.log($('.chart rect.bar:first')[0]);
                    $('.chart rect.bar:first').trigger('mouseenter');
                };

                this.hideTooltip = function() {
                    this.tooltip.hide();
                };
            });
        }
    }
);
