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
        		max_num_bars: 7,
        		incremental: true,
        		colors: ['#000000'] 
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

				this.value = this.attr.data,
					_keys = getObjKeys(this.value),
					barGroups = context.selectAll(".barGroup").data(_keys),
					backgroundGroups = context.append("g"),
					subPanelgroup = context.append("g");

				
                this.tooltip = $('<div>').addClass('tooltip')
                    .appendTo($('body'));
                
			
				this.updateChart = function() {					
					
					context.attr("height", (this.height+130));

					barGroups.remove();	
					backgroundGroups.remove();
					subPanelgroup.remove();

					_keys = getObjKeys(this.value); 
					
					//Grouping data by 'key'
					var values = [], barIndexList = [];	
					var _data = this.value;
					$.each(_keys, function(j, k){ 
						var barsGroup = [] ;	
						barIndexList = [];	
						$.each(_data[k], function(i, val){ 
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

					/* TODO: this is just for Demo, it won't be here finally */
					subPanelgroup = context.append("g");
					subPanelgroup.attr("transform", "translate(0, "+(this.height+30)+")");
					subPanelgroup.selectAll(".foreignObject")
					.data(_keys)
					.enter().append("foreignObject")
					.attr("class", function(key, i){
						CellBarchartSubpanel.attachTo(this,{
							text: {
								title: { value: Math.floor(Math.random()*(91)+10) +'%', caption: 'of sessions' },
								content: { value: Math.floor(Math.random()*(1230)+100), caption: 'Packages consumed' }
							}
						});
						return "cell-barchart-subpanel";
					})
					.attr("x", function(key) { 
						return  x0(key)-x0(0)/2+3;
					})
					.attr("width", this.width/_keys.length-6 )
					.attr("height", 100);
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
						return self.height - y(d.value); 
					})
					.on('mouseover', function(d) {
						self.showTooltip(this, d);
					})
					.on('mouseout', function(d) {
						self.hideTooltip();
					});
				}	

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

				this.prepareChartData = function(dataIn, period_days){
					if (period_days > this.attr.max_num_bars && checkPrimo(period_days)){
						period_days++;
					}
					var num_bars = numBars(period_days, this.attr.max_num_bars),
					    _inc = this.attr.incremental,
					    dataOut = {data:{}, daysBar: period_days/num_bars }, 
						keys = null; 

					$.each(dataIn, function(i, val){ 
						if (!keys){
							keys = getObjKeys(val.value);		
							$.each(keys, function(j, key){ 
								dataOut.data[key] = zeros(num_bars);
							});
						} 
						var x = i%num_bars;		
						$.each(keys, function(j, key){ 
							if (x > 0){
								dataOut.data[key][x] = dataOut.data[key][x] + ((_inc)? dataOut.data[key][x-1] : 0) +val.value[key];
							}else{
								dataOut.data[key][x] = dataOut.data[key][x] + val.value[key];						
							}
						});

					});
					return dataOut;
				}


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
					var daysRange = (options.range[1] - options.range[0])/(1000*60*60*24) + 1;
					var d = this.prepareChartData(rawData, daysRange);
					this.value = d.data;
					this.attr.daysBar = d.daysBar;	
					this.updateChart();
					e.stopPropagation();
					});
				});			

			function checkPrimo(number){
				var primo=0;
				for(var i=0; i<=number; i++){
					if(number%i==0 ){
						primo++;
					}
					if(primo>2) break;
				} 
				return (primo==2)? true: false; 
			}

			function numBars(days, maxbars){
				if (days <= maxbars) return days;
				for (var i = maxbars ; i >= 2; i--) {
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

			function getObjKeys(obj){
		      var keys = [];
		      for(var key in obj) keys.push(key);
		      return keys;
   			}
		}
	}  
);