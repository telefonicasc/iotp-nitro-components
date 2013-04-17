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
        		names: ['Under 5 Years','5 to 13 Years','14 to 17 Years','18 to 24 Years','25 to 44 Years','45 to 64 Years','65 Years and Over']

            });

            this.after('initialize', function() {

				var margin = {top: 0, right: 0, bottom: 25, left: 0},
				width = 800,
				height = 240;

				var x0 = d3.scale.ordinal().rangeRoundBands([0, width], .1);
				var x1 = d3.scale.ordinal();
				var y = d3.scale.linear().range([height, 0]);

				var color = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

				var xAxis = d3.svg.axis().scale(x0).orient("bottom");
				var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.tickFormat(d3.format("0.01s"));

				var svg = d3.select(this.node).append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + 0 + "," + margin.top + ")");

				var _data= this.attr.data;
				var _names= this.attr.names;
				    
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

				svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

				svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate("+width+"," + 0 + ")")
				.call(yAxis);
				

				var state = svg.selectAll(".state")
				.data(_data)
				.enter().append("g")
				.attr("class", "g")
				.attr("transform", function(d) { 
					return "translate(" + x0(d.group) + ",0)"; 
				});

				state.selectAll("rect")
				.data(function(d) { 
					return d.ages; 
				})
				.enter().append("rect")
				.attr("width", x1.rangeBand())
				.attr("x", function(d,i) { 
					console.log(d);
					return x1(d.name); 
				})
				.attr("y", function(d) { 
					return y(d.value); 
				})
				.attr("height", function(d) { return height - y(d.value); })
				.style("fill", function(d) { return color(d.name); });

				this.updateChart = function() {

            	}	

            	this.on('resize', function(e, chartSize) {
                   this.width = chartSize.width;
                   this.height = chartSize.height;	
                   e.stopPropagation();
                });


                this.on('valueChange', function(e, options) {
                   
                    e.stopPropagation();
                });

            });	
        }
    }      
);
