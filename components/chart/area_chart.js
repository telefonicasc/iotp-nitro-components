define(
    [
        'components/component_manager',
        'components/chart/mixin/chart_element'
    ],

    function(ComponentManager, ChartElement) {

        return ComponentManager.create('areaChart',
            ChartElement, AreaChartComponent);

        function AreaChartComponent() {

            this.showTooltip = function(circle, d) {
                var pos = $(circle).offset();
                this.tooltip.html(d[this.attr.y.key]);
                this.tooltip.css({
                    top: pos.top,
                    left: pos.left + $(circle).width() / 2
                });
                this.tooltip.show();
            };

            this.hideTooltip = function() {
                this.tooltip.hide();
            };

            this.after('initialize', function() {
                var area = d3.svg.area()
                            .x(this.x)
                            .y0(this.height)
                            .y1(this.y),
                    line = d3.svg.line()
                            .x(this.x)
                            .y(this.y,
                    pathArea,
                    pathLine,
                    tooltip;

                if (this.attr.tooltip) {
                    this.tooltip = $('<div>').addClass('tooltip')
                        .appendTo($('body'));
                }

                this.context.attr('class', 'chart ' + this.attr.cssClass);

                pathArea = this.context.append('path')
                    .datum(this.value)
                    .attr('class', 'area')
                    .attr('d', area);

                pathLine = this.context.append('path')
                    .datum(this.value)
                    .attr('class', 'line')
                    .attr('d', line);

                this.after('updateChart', function() {
                    var self = this,
                        hoverCircle;

                    if (this.attr.tooltip) {
                        hoverCircle = this.context.selectAll('.hoverCircle')
                            .data(this.value);
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
                            });

                        hoverCircle
                            .attr('cx', this.x)
                            .attr('cy', this.y);

                        hoverCircle.exit().remove();
                    }

                    area.y0(this.height);

                    pathArea.datum(this.value);
                    pathLine.datum(this.value);
                    pathArea.attr('d', area);
                    pathLine.attr('d', line);
                });
            });
        }
    }
);
