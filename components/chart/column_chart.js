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
                opacity: 0.04
            });

            this.after('initialize', function() {

                var x = d3.time.scale().range([0, this.width]),
                    y = d3.scale.linear().range([this.height, 0]),
                    data = this.$node.data('value') || this.attr.value || [],
                    context = d3.select(this.node);

                context.attr('class', 'chart ' + this.attr.cssClass);
                var subPanelgroup = context.append('g');
                var setting = fakeData(this.attr);

                this.updateChart = function() {

                    var _width = this.width;
                    var _height = this.height;
                    var _attr = this.attr;

                    subPanelgroup.remove();


                    this.bars = context.selectAll('.bar_column').data(data);
                    this.bars.enter().append('rect').attr('class', 'bar_column');
                    this.bars.attr('x', function(date) {
                        return x(date);
                    })
                    .style('opacity', function(d, i){
                        return (i%2 !== 0)? _attr.opacity: 0;
                    })
                    .attr('width', _width/5)
                    .attr('height', _height);

                    this.bars.exit().remove();
                    var _items = this.attr.items;
                    if (_items && _items.length > 0){

                        subPanelgroup = context.append('g');
                        subPanelgroup.attr('transform', 'translate(0, 0)');
                        subPanelgroup.selectAll('.foreignObject')
                        .data(data)
                        .enter().append('foreignObject')
                        .attr('class', function(date, i){
                            return 'cell-barchart-subpanel';
                        })
                        .attr('x', function(date) {
                            return x(date);
                        })
                        .attr('width', _width/5+3)
                        .attr('height', _height);

                        $.each(subPanelgroup.node().childNodes, function(i, panel){
                            ComponentManager.get(_items[0].component).attachTo(this, setting);
                        })
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
                            val.date <= options.range[1]) {
                            val.date = d3.time.day.round(new Date(val.date));
                            return val;
                        }
                    });         

                    if (!this.res){
                        this.res = [];   
                        this.attr.step = options.value.fixRange/5;
                        this.attr.step = 7;
                        var step = this.attr.step;
                        var self = this.res;
                        
                        $.each(this.attr.value, function(i, item){
                            if (i % step === 0) {
                                self.push(item.date);
                            }
                        });

                        this.res.pop();
                    }

                    data = this.res;

                    x.domain(options.range);
                    y.domain(options.valueRange);
                    this.updateChart();
                    e.stopPropagation();
                });

                function fakeData(attr){
                    if (attr.items && attr.items.length > 0){
                        var setting = attr.items[0];
                        /* THIS IS FAKE DATA, it will be removed when real data available */
                        if (setting.text && setting.text.content){
                            setting.text.content.value = Math.floor(Math.random()*(1230)+100);
                        }
                        if (setting.text && setting.text.title){
                            setting.text.title.value = Math.floor(Math.random()*(91)+1)+'%';
                        }
                        if (setting.chart && setting.chart.data){
                            setting.chart.data = [
                                { gains: Math.floor(Math.random()*(setting.chart.conf.maxHeight)+1) },
                                { losses: Math.floor(Math.random()*(setting.chart.conf.maxHeight)+1) }
                            ];
                        }
                     }
                    return setting;
                }
            });        
        }
    }
);
