define(
[
    'components/component_manager'
],

    function(ComponentManager, CellBarchartSubpanel) {

        return ComponentManager.create('groupBarChart',
            GroupBarChart);

        function GroupBarChart(){

            this.defaultAttrs({
                grid: true,
                data: {},
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
                        .attr('height', (this.height));

                var axisX, axisY, xAxis, yAxis = null;
                if (this.attr.grid){
                    axisX = context.append('g').attr('class', 'axis_x');
                    axisY = context.append('g').attr('class', 'axis_y');
                    xAxis = d3.svg.axis().scale(x0).orient('bottom');
                    yAxis = d3.svg.axis().scale(y).orient('right').tickFormat(d3.format('1'));
                }

                this.value = this.attr.data,
                this.keys = getObjKeys(this.value);
                this.maxValue = 100;

                var barGroups = context.selectAll('.barGroup').data(this.keys),
                backgroundGroups = context.append('svg'),
                subPanelgroup = context.append('svg');

                if (this.attr.tooltip){
                    this.tooltip = $('<div>').addClass('tooltip').appendTo($('body'));
                }

                this.updateChart = function() {

                    context.attr('height', (this.height+130));

                    barGroups.remove();
                    backgroundGroups.remove();
                    subPanelgroup.remove();

                    this.keys = getObjKeys(this.value);

                    //Grouping data by 'key'
                    var values = [], barIndexList = [];
                    var _data = this.value;
                    $.each(this.keys, function(j, k){
                        var barsGroup = [] ;
                        barIndexList = [];
                        $.each(_data[k], function(i, val){
                            barIndexList.push(i);
                            barsGroup.push( {index: i, value: val} );
                        });
                        values.push(barsGroup);
                    });

                    x0.domain(this.keys.map(function(key) {
                        return key;
                    }));
                    x1.domain(barIndexList).rangeRoundBands([0, x0.rangeBand()]);
                    /*y.domain([0, d3.max(values, function(d) {
                        return d3.max(d, function(d) {
                            return d.value;
                        });
                    
                    })]);*/
                    y.domain([0, this.maxValue]); 
                    if (axisX && axisY) {
                        axisX.attr('transform', 'translate(0, '+this.height+')').call(xAxis);
                        axisY.attr('transform', 'translate('+this.width+', 0)').call(yAxis);
                    }

                    //Background rectangles
                    backgroundGroups = context.append('g');
                    backgroundGroups.selectAll('.bg_group')
                    .data(this.keys)
                    .enter().append('rect')
                    .attr('class', function(key, i){
                        return (i%2 === 0)? 'bg_group odd' : 'bg_group';
                    })
                    .attr('x', function(key) {
                        return  x0(key)-x0(0)/2;
                    })
                    .attr('width', this.width/this.keys.length )
                    .attr('height', this.height);

                    var keys = this.keys;
                    subPanelgroup = context.append('g');
                    subPanelgroup.attr('transform', 'translate(0, '+(this.height+30)+')');
                    subPanelgroup.selectAll('.foreignObject')
                    .data(this.keys)
                    .enter().append('foreignObject')
                    .attr('class', function(key, i){
                        return 'cell-barchart-subpanel';
                    })
                    .attr('x', function(key) {
                        return  x0(key)-x0(0)/2+3;
                    })
                    .attr('width', this.width/keys.length-6 )
                    .attr('height', 100);

                    $('.cell-barchart-subpanel').each(function(i, panel){
                        ComponentManager.get('carouselPanel').attachTo(panel,{
                            title: { value: Math.floor(Math.random()*(91)+10) +'%', caption: 'of sessions' },
                            content: { value: Math.floor(Math.random()*(1230)+100), caption: 'Packages consumed' }
                        });
                    });

                    //Bar groups
                    barGroups = context.selectAll('.group').data(values);
                    barGroups.enter().append('g')
                        .attr('fill', function(key, i) {
                            return colors[(i%colors.length)];
                        })
                        .attr('class', 'group')
                        .attr('transform', function(d, i) {
                            return 'translate(' + x0(keys[i]) + ',0)';
                        });

                    //Bars
                    var self = this;
                    var bars = barGroups.selectAll('.chartbar')
                    .data(function(d) {
                        return d;
                    });
                    bars.enter().append('rect')
                    .attr('class', 'chartbar')
                    .attr('width', x1.rangeBand()-1)
                    .attr('x', function(d,i) {
                        return x1(d.index);
                    })
                    .attr('y', function(d) {
                        return y(d.value);
                    })
                    .attr('height', function(d) {
                        return self.height - y(d.value);
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

                this.showTooltip = function(rect, d) {
                    var pos = $(rect).offset();
                    this.tooltip.html('<div>'+d.value+'</div><div>('+this.attr.daysBar+' d/b)</div>');
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
					x0.rangeRoundBands([0, this.width], 0.1);
					y.range([this.height, 0]);
					this.updateChart();
					e.stopPropagation();
				});

				this.on('valueChange', function(e, options) {
                    e.stopPropagation();

                    var fixRange = options.value.fixRange;
                    var modelData = options.value[this.attr.model][fixRange];
                    
                    this.maxValue = modelData.maxValue;
                    this.attr.daysBar = fixRange/7;
                    var roundDate = d3.time.day.round(options.range[0]).getTime();
                    this.value = modelData.values[roundDate];
                    this.updateChart();
                    
                });
            });

			function getObjKeys(obj){
                var keys = [];
                for(var key in obj){ keys.push(key); }
                return keys;
            }
		}
	}
);