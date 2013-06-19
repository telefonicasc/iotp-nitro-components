define(
[
    'components/component_manager'
],

    function(ComponentManager, CellBarchartSubpanel) {

        return ComponentManager.create('groupBarChart', GroupBarChart);

        function GroupBarChart(){

            this.defaultAttrs({
                grid: true,
                incremental: true,
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

                this.values = null, 
                this.maxValue = 100;

                var barGroups = context.selectAll('.barGroup');
                var backgroundGroups = context.append('g').attr('class','backgroundGroups');
                var carouselGroup = context.append('g').attr('class', 'carouselGroup');

                if (this.attr.tooltip){
                    this.tooltip = $('<div>').addClass('tooltip').appendTo($('body'));
                }


                this.updateChart = function() {

                    context.attr('height', (this.height+130));

                    if (axisX && axisY) {
                        axisX.attr('transform', 'translate(0, '+this.height+')').call(xAxis);
                        axisY.attr('transform', 'translate('+this.width+', 0)').call(yAxis);
                    }

                    x0.domain(keys.map(function(key) {
                        return key;
                    }));
                    var rangeGroup = d3.range(this.values[0].length);
                    x1.domain(rangeGroup).rangeRoundBands([0, x0.rangeBand()]);
                    var maxValuePeriod = d3.max(this.values, function(d) {
                        return d3.max(d, function(d) {
                            return d;
                        });
                    
                    });
                    //y.domain([0, maxValuePeriod]);
                    y.domain([0, this.maxValue]);
        

                    if (this.newGroups){
                        //********** Background rectangles
                        var bgGroups = backgroundGroups.selectAll('.bg_group').data(keys);
                        bgGroups.enter().append('rect')
                        .attr('class', function(key, i){
                            return (i%2 === 0)? 'bg_group odd' : 'bg_group';
                        })
                        .attr('x', function(key) {
                            return  x0(key)-x0(0)/2;
                        })
                        .attr('width', this.width/keys.length )
                        .attr('height', this.height);
                        bgGroups.exit().remove();

                        //************ Carousel panels               
                        carouselGroup.attr('transform', 'translate(0, '+(this.height+30)+')');
                        
                        this.carousel = carouselGroup.selectAll('.cell-barchart-subpanel')
                        .data(keys).enter().append('foreignObject')
                        .attr('class', function(key, i){
                            return 'cell-barchart-subpanel';
                        })
                        .attr('height', 100)
                        .attr('x', function(key) {
                            return  x0(key)-x0(0)/2+3;
                        })
                        .attr('width', this.width/keys.length-6);
                        

                        //Attach carousel subpanels
                        $('.cell-barchart-subpanel').each(function(i, panel){
                            ComponentManager.get('carouselPanel').attachTo(panel);
                        });
                    }

                   
                    


                    //************ Bar groups
                    barGroups.remove();
                    barGroups = context.selectAll('.group').data(this.values);
                    barGroups.enter().append('g')
                    .attr('fill', function(key, i) {
                        return colors[(i%colors.length)];
                    })
                    .attr('class', function(key){
                        return 'group';
                    })
                    .attr('transform', function(d, i) {
                        return 'translate(' + x0(keys[i]) + ',0)';
                    });
                    barGroups.exit().remove();


                    //Bars
                    var self = this;
                    var bars = barGroups.selectAll('.chartbar')
                    .data(function(d) { return d; });

                    bars.enter().append('rect')
                    .attr('class', 'chartbar')
                    .attr('width', x1.rangeBand()-1)
                    .attr('x', function(d, i) {
                        return x1(i);
                    })
                    .attr('y', function(d) {
                        return y(d);
                    })
                    .attr('height', function(d) {
                        return self.height - y(d);
                    });

                    if (this.attr.tooltip){
                        bars = barGroups.selectAll('.chartbar')
                        .data(function(d) {
                            return d;
                        });
                        bars.on('mouseover', function(d) {
                            self.showTooltip(this, d);
                        })
                        .on('mouseout', function(d) {
                            self.hideTooltip();
                        });
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

                this.transition = function(){

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
					x0.rangeRoundBands([0, this.width], 0.1);
					y.range([this.height, 0]);
                    
					
                    //Update
                    if (this.values){
                        
                        //carouselGroup.selectAll('.cell-barchart-subpanel').remove();
                        backgroundGroups.selectAll('.bg_group').remove();
                        this.newGroups = true;
                        
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

                    var newKeys = getObjKeys(rawValues);
                    this.newGroups = newKeys.join(',') !== keys.join(',');
                    if (this.newGroups) {
                        keys = newKeys;
                    }

                    //Aggregate data by 'group'
                    this.values = [];
                    for (group in rawValues){
                        this.values.push(rawValues[group]);
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
		}
	}
);