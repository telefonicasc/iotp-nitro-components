define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('columnChart',
            ColumnChart);

        function ColumnChart() {

            this.defaultAttrs({
                step: 7,
                opacity: 0.02
            });

            this.after('initialize', function() {

                var x = d3.time.scale().range([0, this.width]),
                    y = d3.scale.linear().range([this.height, 0]),
                    data = this.$node.data('value') || this.attr.value || [],
                    context = d3.select(this.node).append('svg');
                context.attr('class', 'chart ' + this.attr.cssClass);
                var subPanelgroup = context.append('g');
                var carousel = [];

                this.updateChart = function() {
                    var _width = this.width,
                        _height = this.height,
                        _attr = this.attr;
                    context.attr('width', _width);

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
                    .attr('width', _width/(this.attr.step-2))
                    .attr('height', _height);

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
                        .attr('width', _width/(this.attr.step-2)+3)
                        .attr('height', _height);
                    }

                    if (_attr.items){
                       $('.cell-barchart-subpanel').each(function(i, panel){
                            ComponentManager.get(_attr.items[0].component).attachTo(panel, $.extend({}, _attr.items[0].text, _attr.items[0].chart));
                            
                            $(panel).trigger('valueChange', { text1:data[i].text1, text2:data[i].text2, values: data[i].values } );
                        }); 
                    }
                    
                };

                this.on('resize', function(e, chartSize) {
                    this.width = chartSize.width;
                    this.height = chartSize.height;
                    x.range([0, this.width]);
                    y.range([this.height, 0]);
                    this.updateChart();
                    e.stopPropagation();
                });

                this.on('valueChange', function(e, options) {

                    var valueField = this.attr.model;
                    this.attr.value = $.map(options.value[valueField], function(val, i) {
                        if (val.date > options.range[0] &&
                            val.date <= options.range[1]) {
                            val.date = d3.time.day.round(new Date(val.date));
                            return val;
                        }
                    });

                    if (!data || data.length === 0){
                        var step = this.attr.step;
                        data = [];
                        $.each(this.attr.value, function(i, val){
                            if (i % step === 0) {
                                data.push({date:val.date, 
                                    values: [
                                        { name:'+', value: Math.floor(Math.random()*(91)+1)  }, 
                                        { name:'-', value: Math.floor(Math.random()*(91)+1) } 
                                    ],
                                    text1: Math.floor(Math.random()*(91)+1)+'%',
                                    text2: Math.floor(Math.random()*(1001)+1)
                                });
                            }
                        }); 
                    }


                    x.domain(options.range);
                    this.updateChart();

                    e.stopPropagation();
                });

            });
        }
    }
);
