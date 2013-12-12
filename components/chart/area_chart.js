/*
areaChart

@name areaChart

@option {Boolean} area true
@option {Object} hoverCircle { className: 'hoverCircle', mouseout: {'r': 6, 'opacity': 0}, mouseover: {'opacity': 1 } }
*/
define(
    [
        'components/component_manager',
        'components/chart/mixin/chart_element'
    ],

    function(ComponentManager, ChartElement) {

        return ComponentManager.create('areaChart',
            ChartElement, AreaChartComponent);

        function AreaChartComponent() {

            this.defaultAttrs({
                area: true,
                hoverCircle: {
                    className: 'hoverCircle',
                    mouseout: {'r': 6, 'opacity': 0},
                    mouseover: {'opacity': 1 }
                }
            });

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

                var area = d3.svg.area().x(this.x).y0(this.height).y1(this.y),
                    line = d3.svg.line().x(this.x).y(this.y),
                    pathArea, pathLine, tooltip, thresholdLine, pathLevel;

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

                this.on('setThreshold', function (e,v) {
                    if ($.isNumeric(v)) {
                        this.attr.threshold = +v;
                    }
                });

                this.after('updateChart', function() {
                    var self = this,
                        hoverCircle, circleAttrs;

                    if (this.attr.tooltip) {
                        circleAttrs = this.attr.hoverCircle;
                        hoverCircle = this.context.selectAll('.hoverCircle')
                            .data(this.value);

                        hoverCircle.enter().append('circle').
                            attr(circleAttrs.mouseout).
                            attr('class', circleAttrs.className)
                            .on('mouseover', function(d) {
                                d3.select(this).attr(circleAttrs.mouseover);
                                self.showTooltip(this, d);
                            })
                            .on('mouseout', function(d) {
                                d3.select(this).attr(circleAttrs.mouseout);
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

                    // Show level line if required

                    if (this.attr.threshold) {
                        var levelValues = [];
                        var thresholdValues = [];
                        var first = this.value[0];
                        var last = this.value[this.value.length-1];
                        if (this.value.length) {
                            levelValues = [$.extend({},first), $.extend({},last)];
                            levelValues[0].value = levelValues[1].value;

                            thresholdValues = [$.extend({},first), $.extend({},last)];
                            thresholdValues[0].value = +this.attr.threshold;
                            thresholdValues[1].value = +this.attr.threshold;
                        }

                        var lineClass = this.attr.levelLineClass ? this.attr.levelLineClass : 'stroke-black';
                        var thLineClass = this.attr.thresholdLineClass ? this.attr.thresholdLineClass : 'stroke-red';
                        // Level line
                        if (!pathLevel) {
                            pathLevel = this.context.append('path')
                                .datum(levelValues)
                                .attr('class', 'level-line ' + lineClass)
                                .attr('d', line);
                        }
                        else pathLevel.datum(levelValues);
                        pathLevel.attr('d', line);

                        // Threshold line
                        if (!thresholdLine) {
                            thresholdLine = this.context.append('path')
                                .datum(thresholdValues)
                                .attr('class', 'level-line ' + thLineClass)
                                .attr('d', line);
                        }
                        else thresholdLine.datum(thresholdValues);
                        thresholdLine.attr('d', line);
                    }

                    if (this.attr.area){
                        (this.anim)? pathArea.transition().duration(500).attr('d', area) : pathArea.attr('d', area);
                    }
                    (this.anim)? pathLine.transition().duration(500).attr('d', line) : pathLine.attr('d', line);

                    this.anim = false;
                });

            });
        }
    }
);

