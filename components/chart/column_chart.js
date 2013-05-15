define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('columnChart',
            ColumnChart);

        function ColumnChart() {

            this.defaultAttrs({
                step: 7
            });

            this.after('initialize', function() {

                var x = d3.time.scale().range([0, this.width]),
                    y = d3.scale.linear().range([this.height, 0]),
                    data = this.$node.data('value') || this.attr.value || [],
                    context = d3.select(this.node);

                context.attr('class', 'chart ' + this.attr.cssClass);
                var subPanelgroup = context.append('g');


                this.updateChart = function() {
                    
                    var _width = this.width;
                    var _height = this.height;
                    subPanelgroup.remove();
                   
                    this.bars = context.selectAll('.bar_column').data(data);
                        
                    this.bars.enter().append('rect').attr('class', 'bar_column');
                    this.bars.attr('x', function(d) {
                        return x(d.date);
                    })
                    .style('opacity', function(d, i){
                        
                        if (i%2 !== 0){
                            return 0.04;
                        }else{
                            return 0;
                        }
                       
                    })
                    .attr('width', _width/(data.length+1))
                    .attr('y', 0)
                    .attr('height', _height)
                    .attr('y', 0)
                    .attr('height', _height);

                    this.bars.exit().remove();
                    _items = this.attr.items;
                    if (_items && _items.length > 0){

                        subPanelgroup = context.append('g');
                        subPanelgroup.attr('transform', 'translate(0, 0)');
                        subPanelgroup.selectAll('.foreignObject')
                        .data(data)
                        .enter().append('foreignObject')
                        .attr('class', function(d){
                            var setting = _items[0];
                            /* THIS IS FAKE DATA, it will be removed when real data available */
                            if (setting.text.content){
                                setting.text.content.value = Math.floor(Math.random()*(1230)+100);
                            }
                            if (setting.text.title){
                                setting.text.title.value = Math.floor(Math.random()*(91)+10)+'%';
                            }
                            if (setting.chart && setting.chart.data){
                                setting.chart.data = [ { gains: Math.floor(Math.random()*(81)+10) }, { losses: Math.floor(Math.random()*(81)+10) } ]
                            }
                            ComponentManager.get(_items[0].component).attachTo(this,setting);
                            return 'cell-barchart-subpanel';
                        })
                        .attr('x', function(d) {
                            return x(d.date);
                        })
                        .attr('width', _width/(data.length+1))
                        .attr('height', _height);
                    }
                };

                this.on('resize', function(e, chartSize) {
                    this.width = chartSize.width;
                    this.height = chartSize.height;
                    //this.$node.find('.cell-barchart-subpanel')
                    //    .trigger('resize', {width:  chartSize.width/(data.length+1), height: 0});
                    x.range([0, this.width]);
                    y.range([this.height, 0]);
                    this.updateChart();
                    e.stopPropagation();
                });

                this.on('valueChange', function(e, options) {
                    
                    var valueField = this.attr.model;
                    this.attr.value = $.map(options.value[valueField], function(val, i) {
                        if (val.date > options.range[0] &&
                            val.date < options.range[1]) {
                            return val;
                        }
                    });
                    
                    var res = [],
                    step = this.attr.step;
                    var _fixHeight = this.attr.fixHeight;
                    var sum = 0;
                    $.each(this.attr.value, function(i, item){
                        sum += item.value;
                        if (i%step === 0) {
                           res.push({date: item.date, value: sum });
                           sum = 0;
                        }
                    });
                    res.pop();
                    data = res;

                    x.domain(options.range);
                    y.domain(options.valueRange);
                    this.updateChart();
                    e.stopPropagation();
                });
            });
        }
    }
);
