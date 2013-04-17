define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('groupBarChart',
            GroupBarChart);

        function GroupBarChart(){

        	this.defaultAttrs({
        		grid: true 		
            });

            this.after('initialize', function() {
				
				var x0 = d3.scale.ordinal().rangeRoundBands([0, this.width]),
					x1 = d3.scale.ordinal(),
					y = d3.scale.linear().range([this.height, 0]);			

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

				var barGroups = context.selectAll(".barGroup").data(this.attr.data.values);
				var backgroundGroups = context.append("g");
			
				this.updateChart = function() {
					var _data = this.attr.data;
					var _height = this.height;
					var _width = this.width;

					barGroups.remove();	
					backgroundGroups.remove();

					_data.values.forEach(function(obj) {
						obj.ages = [];
						var values = obj[Object.keys(obj)[0]];
						values.forEach(function(val, i){
							obj.ages.push({name: _data.names[i], value: val});
						});
					});

					x0.domain(_data.values.map(function(d) {
						return Object.keys(d)[0]; 
					}));
					x1.domain(_data.names).rangeRoundBands([0, x0.rangeBand()]);
					y.domain([0, d3.max(_data.values, function(d) { 
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
					.data(_data.values)
					.enter().append("rect")
					.attr('class', function(d, i){
						return (i%2 == 0)? 'bg_group odd' : 'bg_group';
					})
					.attr("x", function(d) { 
						var key = Object.keys(d)[0]; 
						return  x0(key)-x0(0)/2;
					})
					.attr("width", _width/_data.values.length)
					.attr("height", _height);

					//Bar groups
					barGroups = context.selectAll(".group").data(_data.values);
					barGroups.enter().append("g")
					.attr("fill", function(d, i) { 
						return _data.colors[(i%_data.colors.length)]; 
					})
					.attr("class", "group")
					.attr("transform", function(d) { 
						var key = Object.keys(d)[0]; 
						return "translate(" + x0(key) + ",0)"; 
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
					bars.exit().remove();
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
                   
                    e.stopPropagation();
                });

            });	
        }
    }      
);


//SAMPLE DATA BINDER
/*
   {
      values: [
        { '1 hour': [2704,4499,2159,3853,10604,8819,4114] },
        { '4 hours': [2027,3277,1420,2454,7017,5656,2472] },
        { '8 hours': [1208,2141,1058,1999,5355,5120,2607] },
        { '1 day': [1140,1938,925,1607,4782,4746,3187] },
        { '1 month': [894,1558,725,1311,3596,3239,1575] },
        { '50 megs': [737,1345,679,1203,3157,3414,1910] },
        { '250 megs': [837,2345,779,3203,4157,4414,2910] }
      ],
      names: ['Bar1','Bar2','Bar3','Bar4','Bar5','Bar6','Bar7'],  
      colors: ["#d3d2bc", "#dfcab5", "#c5cfc5"]
    }
*/