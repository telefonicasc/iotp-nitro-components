define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('groupBarChart',
            GroupBarChart);

        function GroupBarChart(){

        	this.defaultAttrs({
        		grid: true,
        		data: {}    
            });

            this.after('initialize', function() {
				
				var x0 = d3.scale.ordinal().rangeRoundBands([0, this.width]),
					x1 = d3.scale.ordinal(),
					y = d3.scale.linear().range([this.height, 0]),
					colors = this.attr.colors;			

				var context = d3.select(this.node).append("svg")
				.attr('class', 'group-barchart')
				.attr("width", this.width).attr("height", this.height);

				
				var axisX, axisY, xAxis, yAxis = null;		
				if (this.attr.grid){
					axisX = context.append("g").attr("class", "axis_x");
					axisY = context.append("g").attr("class", "axis_y");
					xAxis = d3.svg.axis().scale(x0).orient("bottom");
					yAxis = d3.svg.axis().scale(y).orient("right").tickFormat(d3.format("1"));		
				}
				var _data = this.attr.data;
				var _keys = Object.keys(_data);
				var barGroups = context.selectAll(".barGroup").data(_keys);
				var backgroundGroups = context.append("g");
			
				this.updateChart = function() {
					var _height = this.height;
					var _width = this.width;
					delete _data.datos;
					console.log('_data', _data);
					_keys = Object.keys(_data);					

					
					var _names = [];	
					barGroups.remove();	
					backgroundGroups.remove();
					_data.datos = [];
					_keys.forEach(function(k) {	
						var agesValues = {ages:[]};	
						_names = [];	
						_data[k].forEach(function(val, i){
							_names.push("bar"+i);
							agesValues.ages.push({name: "bar"+i, value: val});
						});
						_data.datos.push(agesValues);
					});

					x0.domain(_keys.map(function(key) {
						return key; 
					}));

					x1.domain(_names).rangeRoundBands([0, x0.rangeBand()]);
					
					y.domain([0, d3.max(_data.datos, function(d) { 
						return d3.max(d.ages, function(d) { 
							return d.value; 
						}); 
					})]);
					
					if (axisX && axisY) {	
						axisX.attr("transform", "translate(0, "+this.height+")").call(xAxis);
						axisY.attr("transform", "translate("+this.width+", 0)").call(yAxis);
					}

					//Background group 		
					backgroundGroups = context.append("g");
					backgroundGroups.selectAll(".bg_group")
					.data(_keys)
					.enter().append("rect")
					.attr('class', function(key, i){
						return (i%2 == 0)? 'bg_group odd' : 'bg_group';
					})
					.attr("x", function(key) { 
						return  x0(key)-x0(0)/2;
					})
					.attr("width", _width/_keys.length )
					.attr("height", _height);

					//Bar groups
					barGroups = context.selectAll(".group").data(_data.datos);
					barGroups.enter().append("g")
					.attr("fill", function(key, i) { 
						return colors[(i%colors.length)]; 
					})
					.attr("class", "group")
					.attr("transform", function(d, i) { 
						return "translate(" + x0(_keys[i]) + ",0)"; 
					});	
					
					//Bars
					var bars = barGroups.selectAll(".chartbar")
					.data(function(d) { 
						return d.ages; 
					});	

					bars.enter().append("rect")
					.attr('class', 'chartbar')
					.attr("width", x1.rangeBand()-2)
					.attr("x", function(d,i) { 
						return x1(d.name); 
					})
					.attr("y", function(d) {
						return y(d.value); 
					})
					.attr("height", function(d) { 
						return _height - y(d.value); 
					});
            	}	

            	this.on('resize', function(e, chartSize) {
                   this.width = chartSize.width;
                   this.height = chartSize.height;
                   x0.rangeRoundBands([0, this.width], .1);
				   y.range([this.height, 0]);				   
                   this.updateChart();	
                   e.stopPropagation();
                });


                this.on('valueChange', function(e, options) {
                	var valueField = this.attr.model;
                   	var rawData = $.map(options.value[valueField], function(val, i) {
                            if (val.date >= options.range[0] && val.date <= options.range[1]) {
                                return val;
                            }
                        });
                    _data = processData(rawData, options.range[0], options.range[1]); 	
                   	this.updateChart();
                    e.stopPropagation();
                });

            });	
        }

        function processData(dataIn, startDate, endDate){
        	var dataOut = {};
        	var keys = null;
   			
        	dataIn.forEach(function(val, i){
        		if (!keys){
        			keys = Object.keys(val.value);		
        			keys.forEach(function(key, i){
        				dataOut[key] = [];
        			});
        		} 
        		keys.forEach(function(key, j){
        			dataOut[key].push(val.value[key]);
        		});	
  
			});
			return dataOut;
        }
    }      
);