define(
[
    'components/component_manager'
],

function(ComponentManager) {

    var GroupBarChart = function(){

        this.defaultAttrs({
            //labels:{},
            tooltip:false,
            grid: true,
            colors: ['#000000'],
            carouselHeight: 100,
            animDuration: 600,
            axisXheight: 35,
            minWidthGroup: 200
        });

        var marginRight = 100;

        this.after('initialize', function() {

            var div = d3.select(this.node),
                foreign = null;

            if (this.attr.minWidthGroup){
                foreign = d3.select(this.node)
                            .append('svg:foreignObject')
                            .attr('class', 'foreign');
                div = foreign.append('xhtml:div')
                            .style('overflow-y', 'hidden')
                            .style('overflow-x', 'scroll');
            }
            var minW = this.width;

            console.log(d3.select('.chartDIV')[0]);

            var x0 = d3.scale.ordinal().rangeRoundBands([0, minW]),
                x1 = d3.scale.ordinal(),
                y = d3.scale.linear().range([this.height, 0]),
                colors = this.attr.colors,
                context = div.append('svg')
                    .attr('class', 'group-barchart')
                    .attr('width', minW)
                    .attr('height', this.height),
                keys = [],
                maxValuePeriod = 0,
                prevMaxValuePeriod = 0;


            var axisX, axisY, xAxis, yAxis = null;
            if (this.attr.grid){
                axisX = context.append('g').attr('class', 'axis_x');
                axisX.append('rect').attr('width', minW)
                .attr('height', this.attr.axisXheight).attr('fill', '#e0e0db');
                axisY =  d3.select(this.node).append('g').attr('class', 'axis_y');
                xAxis = d3.svg.axis().scale(x0).orient('bottom');
                yAxis = d3.svg.axis().scale(y).orient('right');
            }

            this.values = null;
            this.valueEx = [];

            var backgroundGroups = context.append('g').attr('class','backgroundGroups');
            var carouselGroup = context.append('g').attr('class', 'carouselGroup');
            //MaxLine
            var maxLine = context.append('line')
            .attr('class', 'maxLine').attr('x1', 0)
            .attr('stroke', '#9F9F9F')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray','20,5,20');

            if (this.attr.tooltip){
                this.tooltip = $('<div>').addClass('tooltip').appendTo($('body'));
            }

            var labelsPanel = null;
            if (this.attr.labels){
                labelsPanel = d3.select(this.node).append('g')
                .append('foreignObject')
                .attr('class', 'chart-labels')
                .attr('width', this.attr.labels.width);
            }

            this.createChart = function(){

                x0.domain(keys.map(function(key) {
                    return key;
                }));

                //********** Background rectangles
                backgroundGroups.selectAll('.bg_group').remove();
                backgroundGroups.selectAll('.bg_group')
                .data(keys).enter().append('rect')
                .attr('class', function(key, i){
                    return (i%2 === 0)? 'bg_group odd' : 'bg_group';
                });

                //************ Carousel panels
                carouselGroup.selectAll('.cell-barchart-subpanel').remove();
                carouselGroup.selectAll('.cell-barchart-subpanel')
                .data(keys).enter().append('foreignObject')
                .attr('class', function(key, i){
                    return 'cell-barchart-subpanel';
                })
                .attr('height', this.attr.carouselHeight);

                //Attach carousel subpanels
                $('.cell-barchart-subpanel').each(function(i, panel){
                    ComponentManager.get('carouselPanel').attachTo(panel);
                });

                //************ Bars
                context.selectAll('.group').remove();
                var barGroups = context.selectAll('.group')
                .data(this.values).enter().append('g')
                .attr('fill', function(d, i) {
                    return colors[(i%colors.length)];
                })
                .attr('class', function(d, i){
                    return 'group '+keys[i].replace(' ','');
                });
                barGroups.selectAll('.chartbar').remove();
                var bars = barGroups.selectAll('.chartbar')
                .data(function(d) { return d; })
                .enter().append('rect')
                .attr('class', 'chartbar');

                //************ Bars Excedent
                context.selectAll('.groupEx').remove();
                var barGroupsEx = context.selectAll('.groupEx')
                .data(this.valueEx).enter().append('g')
                .attr('fill', function(d, i) {
                    return colors[(i%colors.length)];
                })
                .attr('class', function(d, i){
                    return 'groupEx '+keys[i].replace(' ','');
                });
                barGroupsEx.selectAll('.chartbarEx').remove();
                var barsEx = barGroupsEx.selectAll('.chartbarEx')
                .data(function(d) { return d; })
                .enter().append('rect')
                .attr('class', 'chartbarEx');

                if (this.modelData.labels && this.attr.labels) {
                    var labelsPanelEl = $('.chart-labels');
                    $.each(this.modelData.labels, function(i, label){
                        labelsPanelEl.append($('<div>').attr('class', 'labelChart').html(label));
                    });
                }

            };

            this.updateChart = function(anim) {

                var height = this.height,
                    width = this.width,
                    rowWidth = minW/keys.length;

                if (this.attr.minWidthGroup){
                    foreign.attr('width', width).attr('height', height+this.attr.carouselHeight+60);
                    context.attr('width', minW).attr('height', height+this.attr.carouselHeight+20);
                    div.attr('width', minW);
                    x0.rangeRoundBands([0, minW]);
                }

                if (this.modelData.labels && this.attr.labels){
                    labelsPanel.attr('height', this.attr.carouselHeight+40)
                    .attr('x', width+30)
                    .attr('y', height+10);
                    $('.labelChart').remove();
                    $.each(this.modelData.labels, function(i, label){
                        $('.chart-labels').append($('<div>').attr('class', 'labelChart').html(label));
                    });
                }

                context.selectAll('.minLine').remove();
                var minLine = context.append('line')
                .attr('class', 'minLine').attr('x1', 0)
                .attr('stroke', '#9F9F9F')
                .attr('stroke-width', 1)
                .attr('stroke-dasharray','20,5,20');

                var rangeGroup = d3.range(this.values[0].length);
                x1.domain(rangeGroup).rangeRoundBands([0, x0.rangeBand()], 0);
                y.domain([0, maxValuePeriod+0.2*maxValuePeriod]);

                //Update carousel attributes
                carouselGroup.attr('transform', 'translate(0, '+(this.height+this.attr.axisXheight)+')');
                var carouselPanel = carouselGroup.selectAll('.cell-barchart-subpanel')
                .attr('width', rowWidth - 2)
                .attr('x', function(key) { return  x0(key); });

                //Update backgrounds attributes
                var backgrounds = backgroundGroups.selectAll('.bg_group');
                backgrounds.attr('x', function(key) { return x0(key); })
                .attr('width', rowWidth )
                .attr('height', height);

                //Update bars location and dimensions
                var currentMax = getMaxPeriodValue(this.values);
                var currentMin = getMinPeriodValue(this.values);
                var topValue = (currentMax<maxValuePeriod )? currentMax : maxValuePeriod;

                var barGroups = context.selectAll('.group');
                barGroups.data(this.values)
                .attr('transform', function(d, i) {
                    return 'translate(' + (x0(keys[i])) + ',0)';
                });
                var bars = barGroups.selectAll('.chartbar');
                bars.data(function(d) { return d; })
                .attr('width', x1.rangeBand()-1)
                .attr('x', function(d, i) { return x1(i); });
                if (anim){
                    bars.transition().ease('sin').duration(this.attr.animDuration).attr('y', function(d) {
                        return y(d);
                    })
                    .attr('height', function(d) {
                        return height - y(d);
                    });
                    maxLine.attr('x2', width).transition().ease('sin').duration(this.attr.animDuration)
                    .attr('y1', y(topValue))
                    .attr('y2', y(topValue));
                }else{
                    bars.attr('y', function(d) {
                        return (d>maxValuePeriod)? y(maxValuePeriod): y(d);
                    })
                    .attr('height', function(d) {
                        var yd = (d>maxValuePeriod)? y(maxValuePeriod): y(d);
                        return (height - yd);
                    });
                    /*
                    maxLine.attr('x2', width).transition().ease('sin').duration(25)
                    .attr('y1', y(topValue))
                    .attr('y2', y(topValue));*/
                }
                minLine.attr('x2', width)
                .attr('y1', y(currentMin))
                .attr('y2', y(currentMin));

                //Update bars EX location and dimensions
                var barGroupsEx = context.selectAll('.groupEx');
                barGroupsEx.data(this.valueEx)
                .attr('transform', function(d, i) {
                    return 'translate(' + (x0(keys[i])) + ','+(y(topValue) - 25)+')';
                });
                var barsEx = barGroupsEx.selectAll('.chartbarEx');
                barsEx.data(function(d) { return d; })
                .attr('width', x1.rangeBand()-1)
                .attr('x', function(d, i) { return x1(i); })
                .attr('y', function(d) {
                    return 0;
                })
                .attr('height', function(d) {
                    return d;
                });

                //Update tooltips values for each bar
                if (this.attr.tooltip){
                    var self = this;
                    bars = barGroups.selectAll('.chartbar')
                    .data(function(d) { return d; });
                    bars.on('mouseover', function(d, i) {
                        self.showTooltip(this, d, i);
                    })
                    .on('mouseout', function(d) {
                        self.hideTooltip();
                    });
                }

                //Update axes location and dimension
                if (axisX && axisY) {
                    axisY.attr('transform', 'translate('+width+', 0)');
                    axisX.attr('transform', 'translate(0, '+(height)+')').call(xAxis);
                    axisX.selectAll('rect').attr('width', minW);
                    if (anim){
                        axisY.transition().ease('sin').duration(this.attr.animDuration).call(yAxis);
                    }else{
                        axisY.call(yAxis);
                    }
                }
            };

            this.updateSubpanel = function(){
                var self = this;
                //Propagate valueChange to each subpanel
                if (this.panelData){
                    $('.cell-barchart-subpanel').each(function(i, panel){
                        var val = {
                            topValue: self.panelData[i].topValue,
                            topCaption: self.modelData.caption1,
                            bottomValue: self.panelData[i].bottomValue+'',
                            bottomCaption: self.modelData.caption2
                        };
                        $(panel).trigger('valueChange', val);
                    });
                }
            };

            this.showTooltip = function(rect, d, i) {
                var pos = $(rect).offset();
                if ( this.tooltipCaption && $.isFunction(this.tooltipCaption) ){
                    this.tooltip.html(this.tooltipCaption(d, i));
                }else{
                    this.tooltip.html('<div>'+d+'</div>');
                }
                this.tooltip.css({
                    top: pos.top,
                    left: pos.left + x1.rangeBand()/3
                });
                this.tooltip.show();
            };

			this.hideTooltip = function() {
				this.tooltip.hide();
			};

			this.on('resize', function(e, chartSize) {
                var labelWidth = (this.attr.labels)? this.attr.labels.width: 0;

				this.width = chartSize.width-labelWidth;
				this.height = chartSize.height;
                minW = this.getMinWidth();

                x0.rangeRoundBands([0, minW], 0);

                //Update axe ranges
				y.range([this.height, 0]);
                //Update
                if (this.values){
                    this.updateChart();
                    this.updateSubpanel();
                }

                e.stopPropagation();

			});

			this.on('valueChange', function(e, options) {
                e.stopPropagation();

                if (!this.attr.model || !this.attr.aggregation) { return; }
                var fixRange = options.value.fixRange;
                var roundDate = options.range[0].getTime();

                this.modelData = options.value[this.attr.aggregation+this.attr.model][fixRange];
                var rawValues = this.modelData.values[roundDate];
                if (this.modelData.panelData){
                    this.panelData = this.modelData.panelData[roundDate];
                }
                if (this.modelData.tooltipCaption){
                    this.tooltipCaption = this.modelData.tooltipCaption[roundDate];
                }
                this.options = options;

                //Aggregate data by 'group'
                this.values = [];
                for (var group in rawValues){
                    this.values.push(rawValues[group]);
                }

                var anim = false;
                if (options.value.brush === 'end'){
                    maxValuePeriod = getMaxPeriodValue(this.values);
                    anim = true;
                    prevMaxValuePeriod = maxValuePeriod;
                    this.valueEx = getValuesExeed(this.values);
                }else if (options.value.brush === 'brush') {
                    var self = this;
                    this.valueEx = getValuesExeed(this.values, prevMaxValuePeriod);
                }

                if ( !options.value.brush ){
                    maxValuePeriod = getMaxPeriodValue(this.values);
                    prevMaxValuePeriod = maxValuePeriod;
                    this.valueEx = getValuesExeed(this.values);
                }

                //Check if aggregation mode has changed
                var newKeys = getObjKeys(rawValues);
                if (newKeys.join(',') !== keys.join(',') || !options.value.brush) {
                    keys = newKeys;
                    this.createChart();
                }

                minW = this.getMinWidth();

                this.updateChart(anim);
                this.updateSubpanel();

            });

            this.on('actionSelected', function(e, value){
                e.stopPropagation();
                if (value.newModel){
                    this.attr.model = value.newModel;
                }
                if (value.aggregation){
                    this.attr.aggregation = value.aggregation;
                    this.options.value.brush = null;
                }

                this.trigger('valueChange', this.options);
            });

            this.getMinWidth = function(){
                var rowWidth;
                var w = this.width;
                if(this.attr.minWidthGroup && keys.length){
                    rowWidth = this.width / keys.length;
                    w = (this.attr.minWidthGroup > rowWidth) ? (this.attr.minWidthGroup * keys.length):(this.width);
                }
                return w;
            };

        });

		function getObjKeys(obj){
            var keys = [];
            for(var key in obj){ keys.push(key); }
            return keys;
        }


        function getMaxPeriodValue(vals){
            var maxValue = d3.max(vals, function(d) {
                return d3.max(d, function(d) {
                    return d;
                });
            });
            return maxValue;
        }

        function getMinPeriodValue(vals){
            var min = getMaxPeriodValue(vals);
            for (var i = vals.length - 1; i >= 0; i--) {
                vals[i].map(function(d){
                    if (d>0 && d<min){
                        min = d;
                    }
                });
            }

            return min;
        }

        function getValuesExeed(vals, max){
            var exeed = [];
            vals.map(function(d){
                var r = [];
                d.forEach(function(value){
                    if (!max){
                        r.push(0);
                    }else{
                        r.push( (value > max)? 20: 0 );
                    }
                });
                exeed.push(r);
            });
            return exeed;
        }
	};


    return ComponentManager.create('groupBarChart', GroupBarChart);
});