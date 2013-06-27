define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('columnChart',
            ColumnChart);

        function ColumnChart() {

            this.defaultAttrs({
                opacity: 0.02,
                paddingColumn: 3,
                cssClass: ''
            });

            this.after('initialize', function() {

                var x = d3.time.scale().range([0, this.width]),
                    y = d3.scale.linear().range([this.height, 0]),
                    data = this.$node.data('value') || this.attr.value || [],
                    columns = 0,
                    context = d3.select(this.node).append('svg');
                
                d3.select(this.node).attr('class', 'chart columns ' + this.attr.cssClass);   
                
                this.createChart = function() {
                    var columnWidth = this.width/(columns)-this.attr.paddingColumn,
                        _attr = this.attr;

                    context.attr('width', this.width);

                    context.selectAll('.bar_column').remove();
                    var columnsBars = context.selectAll('.bar_column').data(data);
                    columnsBars.enter().append('rect').attr('class', 'bar_column');
                    columnsBars.attr('x', function(d) {
                        return x(d.date);
                    })
                    .style('opacity', function(d, i){
                        return (i%2 === 0)? _attr.opacity: 0;
                    })
                    .attr('width', columnWidth)
                    .attr('height', this.height);

                    columnsBars.exit().remove();

                    var _items = _attr.items;
                    if (_items && _items.length > 0){

                        context.selectAll('.cell-barchart-subpanel').remove();
                        var subPanelgroup = context.selectAll('.cell-barchart-subpanel').data(data);
                        subPanelgroup.enter().append('foreignObject')
                        .attr('class', 'cell-barchart-subpanel')
                        .attr('x', function(d) {
                            return x(d.date);
                        })
                        .attr('width', columnWidth)
                        .attr('height', this.height);

                        subPanelgroup.exit().remove();

                        $('.cell-barchart-subpanel').each(function(i, panel){
                            var attr = $.extend(_items[0].text, _items[0].chart);
                            ComponentManager.get(_items[0].component).attachTo(panel, attr);
                            $(panel).trigger('valueChange', { text1:data[i+1].value.text[0]+'', text2:data[i+1].value.text[1]+'', values: data[i+1].value.chart } );
                            
                        });
                    }

                };

                this.updateChart = function(){
                    
                    var columnWidth = this.width/(columns)-this.attr.paddingColumn;

                    var columnsBars = context.selectAll('.bar_column').data(data);
                    var subPanelgroup = context.selectAll('.cell-barchart-subpanel').data(data);
                    columnsBars.attr('x', function(d) {
                        return x(d.date);
                    })
                    .attr('width', columnWidth)
                    .attr('height', this.height);

                    
                    subPanelgroup.attr('x', function(d, i) {
                        return x(d.date);
                    })
                    .attr('width', columnWidth)
                    .attr('height', this.height);

                };

                this.on('resize', function(e, chartSize) {
                    e.stopPropagation();
                    
                    this.width = chartSize.width;
                    this.height = chartSize.height;
                    
                    x.range([0, this.width]);
                    y.range([this.height, 0]);

                    this.updateChart();       
                    
                });

                this.on('valueChange', function(e, options) {
                    e.stopPropagation();
                    console.log(options);
                    if (!options.value.fixRange){ return; }

                    x.domain(options.range); 

                    var valueField = this.attr.model;
                    this.attr.value = options.value[valueField];
                    var daysTick = (options.value.fixRange === 35) ? 7 : 1;

                    var newDivision = options.value.fixRange/daysTick;
                    
                    if (newDivision !== columns){
                        columns = options.value.fixRange/daysTick;

                        data = [];
                        var s = 0;
                        var percent = sum(this.attr.value, options.range);

                        $.each(this.attr.value, function(i, val){
                            s += val.value.text[1];
                            if (i % daysTick === 0) {
                                var d = { date:val.date, value: {text:[val.value.text[0], s], chart: val.value.chart } };
                                data.push(d);
                                s = 0;
                            }
                        });

                        this.createChart();
                    }else{
                        this.updateChart();
                    }                  

                });

                function sum(a, range) {
                    var sum = 0;
                    if (a) {
                      $.each(a, function(i, item) {
                        if (!range ||
                          item.date >= range[0] &&
                          item.date <= range[1]) {
                          sum += item.value;
                        }
                      });
                    }
                    return sum;
                }

            });
        }
    }
);
