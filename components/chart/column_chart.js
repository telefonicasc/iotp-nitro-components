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
                var carousel = [];
                var setting = fakeData();

                this.updateChart = function() {
                    var _width = this.width,
                        _height = this.height,
                        _attr = this.attr;
                    carousel.length = 0;

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
                            var component = ComponentManager.get(_items[0].component).attachTo(this, setting[i]);
                            carousel.push({component: component, date: date});
                            return 'cell-barchart-subpanel';
                        })
                        .attr('x', function(date) {
                            return x(date);
                        })
                        .attr('width', _width/5+3)
                        .attr('height', _height);
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

                    if (!this.res){
                        var step = this.attr.step;                        
                        this.res = $.map(this.attr.value, function(val, i) {
                            if (i % step === 0) {
                                return val.date;
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

            });        
        }

        function fakeData(){
            var fake = [];
            for (var i = 30 - 1; i >= 0; i--) {
                var setting = { 
                        text: {
                          title: { value: Math.floor(Math.random()*(91)+1)+'%', caption: '' },
                          content: { value: Math.floor(Math.random()*(1230)+100) , caption: 'unique users online' },
                        },
                        chart: {       
                            conf: { maxHeight: 70, width: 55, barPadding: 4 },
                        data: [{ gains: Math.floor(Math.random()*(70)+1) },
                               { losses: Math.floor(Math.random()*(70)+1) }]
                        }
                };
                fake.push(setting);
            };
            return fake;
        }
    }
);
