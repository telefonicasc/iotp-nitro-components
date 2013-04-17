define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('groupBarChart',
            GroupBarChart);

        function GroupBarChart(){

        	this.defaultAttrs({
        		data: [
        			{group:'CA' ,values: [2704659,4499890,2159981,3853788,10604510,8819342,4114496]},
        			{group:'TX' ,values: [2027307,3277946,1420518,2454721,7017731,5656528,2472223]},
        			{group:'NY' ,values: [1208495,2141490,1058031,1999120,5355235,5120254,2607672]},
        			{group:'FL' ,values: [1140516,1938695,925060,1607297,4782119,4746856,3187797]},
        			{group:'IL' ,values: [894368,1558919,725973,1311479,3596343,3239173,1575308]},
        			{group:'PA' ,values: [737462,1345341,679201,1203944,3157759,3414001,1910571]}

        		],
        		names: ['Under 5 Years','5 to 13 Years','14 to 17 Years','18 to 24 Years','25 to 44 Years','45 to 64 Years','65 Years and Over'],
        		colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]
            });

            this.after('initialize', function() {
				
				var margin = {top: 0, right: 20, bottom: 20, left: 0};
				var x0 = d3.scale.ordinal().rangeRoundBands([0, this.width], .1),
					x1 = d3.scale.ordinal(),
					y = d3.scale.linear().range([this.height, 0]);

				var xAxis = d3.svg.axis().scale(x0).orient("bottom");
				var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.tickFormat(d3.format("0.01s"));		

				var svg = d3.select(this.node).append("svg")
				.append("g")
				.attr("transform", "translate(" + 0 + "," + margin.top + ")");

				var axisX = svg.append("g")
				.attr("class", "x axis");

				var axisY = svg.append("g")
				.attr("class", "y axis");

				var barGroups = svg.selectAll(".barGroup").data(this.attr.data);
				

				this.updateChart = function() {
					
					barGroups.remove();

					svg.attr("width", this.width + margin.left + margin.right)
					.attr("height", this.height + margin.top + margin.bottom)
					
					var _data= this.attr.data;
					var _names= this.attr.names;
					var _colors= this.attr.colors;
					    
					_data.forEach(function(d) {
						d.ages = [];
						d.values.forEach(function(val, i){
							d.ages.push({name: _names[i], value: val});
						});
					});

					x0.domain(_data.map(function(d) { 
						return d.group; 
					}));
					x1.domain(_names).rangeRoundBands([0, x0.rangeBand()]);
					y.domain([0, d3.max(_data, function(d) { 
						return d3.max(d.ages, function(d) { 
							return d.value; 
						}); 
					})]);
			
					axisX.attr("transform", "translate(0," + this.height + ")")
					.call(xAxis);
					
					axisY.attr("transform", "translate("+(this.width+20)+"," + 0 + ")")
					.call(yAxis);

					barGroups = svg.selectAll(".state").data(this.attr.data);
					barGroups.enter().append("g");
					
					barGroups.attr("class", "g")
					.attr("transform", function(d) { 
						return "translate(" + x0(d.group) + ",0)"; 
					});
					
					var _height = this.height;

					var bars = barGroups.selectAll(".bar2")
					.data(function(d) { 
						return d.ages; 
					});

					bars.enter().append("rect")
					.attr('class', 'bar2')
					.attr("width", x1.rangeBand()-2)
					.attr("x", function(d,i) { 
						return x1(d.name); 
					})
					.attr("y", function(d) { 
						return y(d.value); 
					})
					.attr("height", function(d) { 
						return _height - y(d.value); 
					})
					.style("fill", function(d,i) { 
						return _colors[i] 
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
                   
                    e.stopPropagation();
                });

            });	
        }
    }      
);
