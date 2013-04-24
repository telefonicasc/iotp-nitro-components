define(
    [
        'components/component_manager',
        'components/dashboard/cell_barchart_subpanel'
    ],

    function(ComponentManager, CellBarchartSubpanel) {

        return ComponentManager.create("groupBarChart",
            GroupBarChart);

        function GroupBarChart(){

        	this.defaultAttrs({
        		grid: true,
        		data: {},
        		max_num_bars: 7   
            });

            this.after("initialize", function() {
				
				var x0 = d3.scale.ordinal().rangeRoundBands([0, this.width]),
					x1 = d3.scale.ordinal(),
					y = d3.scale.linear().range([this.height, 0]),
					colors = this.attr.colors,			
					context = d3.select(this.node).append("svg")
							.attr("class", "group-barchart")
							.attr("width", this.width)
							.attr("height", (this.height));
				
				var axisX, axisY, xAxis, yAxis = null;		
				if (this.attr.grid){
					axisX = context.append("g").attr("class", "axis_x");
					axisY = context.append("g").attr("class", "axis_y");
					xAxis = d3.svg.axis().scale(x0).orient("bottom");
					yAxis = d3.svg.axis().scale(y).orient("right").tickFormat(d3.format("1"));		
				}

				var _data = this.attr.data,
					_keys = Object.keys(_data),
					barGroups = context.selectAll(".barGroup").data(_keys),
					backgroundGroups = context.append("g"),
					subPanelgroup = context.append("g");

				
                this.tooltip = $('<div>').addClass('tooltip')
                    .appendTo($('body'));
                
			
				this.updateChart = function() {					
					
					console.log('height', this.height);
					context.attr("height", (this.height+190));

					barGroups.remove();	
					backgroundGroups.remove();
					subPanelgroup.remove();

					_keys = Object.keys(_data); 
					
					//Grouping data by 'key'
					var values = [], barIndexList = [];	
					_keys.forEach(function(k) {	
						var barsGroup = [] ;	
						barIndexList = [];	
						_data[k].forEach(function(val, i){
							barIndexList.push(i);
							barsGroup.push( {index: i, value: val} );
						});
						values.push(barsGroup);
					});

					x0.domain(_keys.map(function(key) {
						return key; 
					}));
					x1.domain(barIndexList).rangeRoundBands([0, x0.rangeBand()]);			
					y.domain([0, d3.max(values, function(d) { 
						return d3.max(d, function(d) { 
							return d.value; 
						}); 
					})]);	
					if (axisX && axisY) {	
						axisX.attr("transform", "translate(0, "+this.height+")").call(xAxis);
						axisY.attr("transform", "translate("+this.width+", 0)").call(yAxis);
					}

					//Background rectangles 		
					backgroundGroups = context.append("g");
					backgroundGroups.selectAll(".bg_group")
					.data(_keys)
					.enter().append("rect")
					.attr("class", function(key, i){
						return (i%2 == 0)? "bg_group odd" : "bg_group";
					})
					.attr("x", function(key) { 
						return  x0(key)-x0(0)/2;
					})
					.attr("width", this.width/_keys.length )
					.attr("height", this.height);

					var _height = this.height;

					/* TODO: this is just for Demo, it won't be here finally */
					subPanelgroup = context.append("g");
					subPanelgroup.attr("transform", "translate(0, "+(this.height+30)+")");
					subPanelgroup.selectAll(".foreignObject")
					.data(_keys)
					.enter().append("foreignObject")
					.attr("class", function(key, i){
						CellBarchartSubpanel.attachTo(this,{
							text: {
			                title: { value: Math.floor(Math.random()*(91)+10) +'%', caption: 'of users online' },
			                content: { value: Math.floor(Math.random()*(401)+100), caption: 'unique users online' }
			              },
			              chart: {
			                conf: {
			                  maxHeight: 70,
			                  width: 45,
			                  barPadding: 4
			                },
			                data: [ { gains: Math.floor(Math.random()*(61)+40) }, { losses: Math.floor(Math.random()*(100-40+1)+40) } ]    //values from 0 - 100 
			              }
						});
						return "cell-barchart-subpanel";
					})
					.attr("x", function(key) { 
						return  x0(key)-x0(0)/2;
					})
					.attr("width", this.width/_keys.length )
					.attr("height", 165);
					/*------------------------------------*/

					//Bar groups
					barGroups = context.selectAll(".group").data(values);
					barGroups.enter().append("g")
					.attr("fill", function(key, i) { 
						return colors[(i%colors.length)]; 
					})
					.attr("class", "group")
					.attr("transform", function(d, i) { 
						return "translate(" + x0(_keys[i]) + ",0)"; 
					});	

					//Bars
					var self = this;
					var bars = barGroups.selectAll(".chartbar")
					.data(function(d) { 
						return d; 
					});	
					bars.enter().append("rect")
					.attr("class", "chartbar")
					.attr("width", x1.rangeBand()-2)
					.attr("x", function(d,i) { 
						return x1(d.index); 
					})
					.attr("y", function(d) {
						return y(d.value); 
					})
					.attr("height", function(d) { 
						return _height - y(d.value); 
					})
					.on('mouseover', function(d) {
                        //d3.select(this).attr('opacity', 1);
                        self.showTooltip(this, d);
                    })
                    .on('mouseout', function(d) {
                        //d3.select(this).attr('opacity', 0);
                        self.hideTooltip();
                    });
            	}	

				this.showTooltip = function(rect, d) {
					var pos = $(rect).offset();
					this.tooltip.html(d.value);
					this.tooltip.css({
						top: pos.top,
						left: pos.left + x1.rangeBand()/3 
					});
					this.tooltip.show();
				};

				this.hideTooltip = function() {
					this.tooltip.hide();
				};


            	this.on("resize", function(e, chartSize) {
                   this.width = chartSize.width;
                   this.height = chartSize.height;
                   x0.rangeRoundBands([0, this.width], .1);
				   y.range([this.height, 0]);				   
                   this.updateChart();	
                   e.stopPropagation();
                });

                this.on("valueChange", function(e, options) {
                	var valueField = this.attr.model;
                   	var rawData = $.map(options.value[valueField], function(val, i) {
                            if (val.date >= options.range[0] && val.date <= options.range[1]) {
                                return val;
                            }
                        });

		    		var period_days = (options.range[1] - options.range[0])/(1000*60*60*24) + 1;
		    		var num_bars = numBars(period_days, 7);
                    _data = prepareData(rawData, period_days, num_bars).data;	

                   	this.updateChart();
                    e.stopPropagation();
                });

            });	

			function prepareData(dataIn, period_days, num_bars){
		    	
		    	var dataOut = {data:{}, datesRange: zeros(num_bars)}, 
		    		keys = null; 	
		    		
		    	dataIn.forEach(function(val, i){    	
		    		if (!keys){
		    			keys = Object.keys(val.value);		
		    			keys.forEach(function(key){
		    				dataOut.data[key] = zeros(num_bars);
		    			});
		    		} 
		    		var x = i%num_bars;		
		    		keys.forEach(function(key){
		    			dataOut.data[key][x] = dataOut.data[key][x] + val.value[key];						
		    		});

				});
				return dataOut;
		    }

		    function numBars(days, maxbars){
		    	if (days <= maxbars) return days;
		    	for (var i = 2 ; i <= maxbars; i++) {
		    		if ((days%i) == 0 && (days/i) <= maxbars ) {
		    			return days/i;
		    		}
		    	};
		    	return days;
		    }

		    function zeros(length){
		    	var vector = [];
		    	for (var i = 0; i < length; i++) vector[i] = 0;
				return vector;	
		    }
        }
    }      
);