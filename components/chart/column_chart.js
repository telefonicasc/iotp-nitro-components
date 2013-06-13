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
                paddingColumn: 3
            });

            this.after('initialize', function() {

                var x = d3.time.scale().range([0, this.width]),
                    y = d3.scale.linear().range([this.height, 0]),
                    data = this.$node.data('value') || this.attr.value || [],
                    columns = 0,
                    columnsData = [],
                    context = d3.select(this.node).append('svg');
                
                d3.select(this.node).attr('class', 'chart columns ' + this.attr.cssClass);   
                
                var subPanelgroup = context.append('g');
                var carousel = [];

                this.updateChart = function() {

                    var columnWidth = this.width/(columns)-this.attr.paddingColumn,
                        _attr = this.attr;

                    context.attr('width', this.width);

                    carousel.length = 0;
                    subPanelgroup.remove();

                    this.bars = context.selectAll('.bar_column').data(data);
                    this.bars.enter().append('rect').attr('class', 'bar_column');
                    this.bars.attr('x', function(d) {
                        return x(d.date);
                    })
                    .style('opacity', function(d, i){
                        return (i%2 === 0)? _attr.opacity: 0;
                    })
                    .attr('width', columnWidth)
                    .attr('height', this.height);

                    this.bars.exit().remove();
                    var _items = this.attr.items;
                    if (_items && _items.length > 0){

                        subPanelgroup = context.append('g').attr('width', this.width);
                        subPanelgroup.attr('transform', 'translate(0, 0)');
                        subPanelgroup.selectAll('.foreignObject')
                        .data(data)
                        .enter().append('foreignObject')
                        .attr('class', 'cell-barchart-subpanel')
                        .attr('x', function(d) {
                            return x(d.date);
                        })
                        .attr('width', columnWidth)
                        .attr('height', this.height);
                    }

                    if (_attr.items){
                        $('.cell-barchart-subpanel').each(function(i, panel){
                            var attr = $.extend(_attr.items[0].text, _attr.items[0].chart);
                            ComponentManager.get(_attr.items[0].component).attachTo(panel, attr);
                            $(panel).trigger('valueChange',
                                { text1:data[i].text1, text2:data[i].text2, values: data[i].values } );
                        });
                    }

                };

                this.on('resize', function(e, chartSize) {
                    e.stopPropagation();

                    this.width = chartSize.width;
                    this.height = chartSize.height;
                    $('.cell-barchart-subpanel').each(function(i, panel){
                            //$(panel).trigger('resize', chartSize);
                    });
                    x.range([0, this.width]);
                    y.range([this.height, 0]);
                    this.updateChart();
                    
                });

                this.on('valueChange', function(e, options) {
                    e.stopPropagation();

                    if (!options.value.fixRange){ return; }

                    var valueField = this.attr.model;
                    this.attr.value = options.value[valueField];

                    var daysTick = (options.value.fixRange === 35) ? 7 : 1;

                    if (columns !== options.value.fixRange/daysTick){
                        columnsData = getData(this.attr.value, daysTick);
                    }

                    columns = options.value.fixRange/daysTick;
                    data = [];
                    $.each(this.attr.value, function(i, val){
                        if (i % daysTick === 0) {
                            data.push({date:val.date,
                                values: columnsData[i/daysTick]['values'],
                                text1: columnsData[i/daysTick]['text1'],
                                text2: columnsData[i/daysTick]['text2']
                            });
                        }
                    });
                    x.domain(options.range);
                    this.updateChart();

                });

                function getData(values, daysTick){
                    var list = [],
                        val1 = 0,
                        val2 = 0;
                    $.each(values, function(i, item){
                        val1 += item.value;
                        val2 += item.value2;
                        if (i % daysTick === 0) {
                            var data = { values:[], text1: Math.floor(Math.random()*(91)+1)+'%', text2:  Math.floor(Math.random()*(1001)+1) };
                            data['values'].push({ name:'+', value: val1  });
                            data['values'].push({ name:'-', value: val2 });
                            list.push(data);
                            val1 = 0;
                            val2 = 0;
                        }

                    });
                    return list;
                }

            });
        }
    }
);
