define(
[
    'components/component_manager'
],

function(ComponentManager) {

    var GroupBarChart = function(){

        this.defaultAttrs({
            grid: true,
            colors: ['#000000']
        });

        this.after('initialize', function() {

            var x0 = d3.scale.ordinal().rangeRoundBands([0, this.width]),
                x1 = d3.scale.ordinal(),
                y = d3.scale.linear().range([this.height, 0]),
                colors = this.attr.colors,
                context = d3.select(this.node).append('svg')
                    .attr('class', 'group-barchart')
                    .attr('width', this.width)
                    .attr('height', this.height),
                keys = [];

            var axisX, axisY, xAxis, yAxis = null;
            if (this.attr.grid){
                axisX = context.append('g').attr('class', 'axis_x');
                axisY = context.append('g').attr('class', 'axis_y');
                xAxis = d3.svg.axis().scale(x0).orient('bottom');
                yAxis = d3.svg.axis().scale(y).orient('right');
            }

            this.values = null;
            this.maxValue = 100;

            var backgroundGroups = context.append('g').attr('class','backgroundGroups');
            var carouselGroup = context.append('g').attr('class', 'carouselGroup');

            if (this.attr.tooltip){
                this.tooltip = $('<div>').addClass('tooltip').appendTo($('body'));
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
                .attr('height', 100);

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

            };

            this.updateChart = function() {
                var height = this.height,
                    width = this.width;

                var rangeGroup = d3.range(this.values[0].length);
                x1.domain(rangeGroup).rangeRoundBands([0, x0.rangeBand()], 0);
                var maxValuePeriod = d3.max(this.values, function(d) {
                    return d3.max(d, function(d) {
                        return d;
                    });
                });
                //y.domain([0, maxValuePeriod]);
                y.domain([0, this.maxValue]);

                //Update carousel attributes
                carouselGroup.attr('transform', 'translate(0, '+(this.height+30)+')');
                var carouselPanel = carouselGroup.selectAll('.cell-barchart-subpanel')
                .attr('width', width/keys.length - 2)
                .attr('x', function(key) { return  x0(key); });

                //Update backgrounds attributes
                var backgrounds = backgroundGroups.selectAll('.bg_group');
                backgrounds.attr('x', function(key) { return x0(key); })
                .attr('width', width/keys.length )
                .attr('height', height);

                //Update bars location and dimensions
                var barGroups = context.selectAll('.group');
                barGroups.data(this.values)
                .attr('transform', function(d, i) {
                    return 'translate(' + (x0(keys[i])) + ',0)';
                });
                var bars = barGroups.selectAll('.chartbar');
                bars.data(function(d) { return d; })
                .attr('width', x1.rangeBand()-1)
                .attr('x', function(d, i) { return x1(i); })
                .attr('y', function(d) { return y(d); })
                .attr('height', function(d) {
                    return height - y(d);
                });

                //Update tooltips values for each bar
                if (this.attr.tooltip){
                    var self = this;
                    bars = barGroups.selectAll('.chartbar')
                    .data(function(d) { return d; });
                    bars.on('mouseover', function(d) {
                        self.showTooltip(this, d);
                    })
                    .on('mouseout', function(d) {
                        self.hideTooltip();
                    });
                }

                //Update axes location and dimension
                if (axisX && axisY) {
                    axisX.attr('transform', 'translate(0, '+height+')').call(xAxis);
                    axisY.attr('transform', 'translate('+width+', 0)').call(yAxis);
                }
            };

            this.updateSubpanel = function(){

                var self = this;

                //Propagate valueChange to each subpanel
                $('.cell-barchart-subpanel').each(function(i, panel){
                    var lastIndex = self.values[0].length-1;
                    var count = self.values[i][lastIndex];

                    var val = {
                        text1:  round(count/self.totalCount*100)+' %',
                        caption1: self.modelData.caption1,
                        text2: ((self.modelData.unit)? self.modelData.unit: '')+' '+round(count),
                        caption2: self.modelData.caption2
                    };
                    $(panel).trigger('valueChange', val);
                });

            };

            this.showTooltip = function(rect, d) {
                var pos = $(rect).offset();
                this.tooltip.html('<div class="value">'+((this.modelData.unit)? this.modelData.unit: '')+' '+round(d)+'</div><div class="caption">('+this.attr.daysBar+' days/bar)</div>');
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
				this.width = chartSize.width;
				this.height = chartSize.height;
                //Update axe ranges
				x0.rangeRoundBands([0, this.width], 0);
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

                if (!this.attr.model){ return; }

                var fixRange = options.value.fixRange;
                var roundDate = d3.time.day.round(new Date(options.range[0])).getTime();

                this.modelData = options.value[this.attr.aggregation+this.attr.model][fixRange];
                this.maxValue = this.modelData.maxValue + 5;
                this.attr.daysBar = (fixRange === 7)? 1 : 7;
                var rawValues = this.modelData.values[roundDate];
                this.totalCount = this.modelData.totalCount[roundDate];
                this.options = options;

                //Aggregate data by 'group'
                this.values = [];
                for (var group in rawValues){
                    this.values.push(rawValues[group]);
                }

                //Check if aggregation mode has changed
                var newKeys = getObjKeys(rawValues);
                if (newKeys.join(',') !== keys.join(',')) {
                    keys = newKeys;
                    this.createChart();
                }

                this.updateChart();
                this.updateSubpanel();

            });

            this.on('actionSelected', function(e, value){
                e.stopPropagation();
                if (value.newModel){
                    this.attr.model = value.newModel;
                }
                if (value.aggregation){
                    this.attr.aggregation = value.aggregation;
                }
                this.trigger('valueChange', this.options);
            });

        });

		function getObjKeys(obj){
            var keys = [];
            for(var key in obj){ keys.push(key); }
            return keys;
        }

        function round(val){
            return Math.round(val*100)/100;
        }
	};


    return ComponentManager.create('groupBarChart', GroupBarChart);
});