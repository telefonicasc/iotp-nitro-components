define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('columnChart',
            ColumnChart);

        function ColumnChart() {

            this.defaultAttrs({
                //model: null,
                //fixRange: null,
                opacity: 0.02,
                paddingColumn: 3,
                cssClass: ''
            });

            this.after('initialize', function() {

                var x = d3.time.scale().range([0, this.width]),
                    y = d3.scale.linear().range([this.height, 0]),
                    data = this.$node.data('value') || this.attr.value || [],
                    columns = 1,
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

                    //If there are ITEMS then attach the item component
                    var _items = _attr.items;
                    if (_items && _items.length > 0){

                        $.each(_items, function (j, item){

                            context.selectAll('.'+item.className).remove();

                            var subPanelgroup = context.selectAll('.'+item.className).data(data);
                            subPanelgroup.enter().append('foreignObject')
                            .attr('class', item.className)
                            .attr('x', function(d) {
                                return x(d.date);
                            })
                            .attr('width', columnWidth)
                            .attr('height', this.height);

                            subPanelgroup.exit().remove();

                            //Attaching item component to nodes
                            $('.'+item.className).each(function(i, panel){
                                ComponentManager.get(item.component).attachTo(panel, item.attr);
                            });

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

                this.updateAttachedComps = function(){

                    if (!this.attr.items) { return; }

                    $.each(this.attr.items, function (j, item){
                        $('.'+item.className).each(function(i, panel){
                            $(panel).trigger('valueChange',  data[i].value);
                        });
                    });
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

                    if (!this.attr.model || ! this.attr.fixRange) { return; }

                    if (options.value.fixRange){
                        this.attr.fixRange = options.value.fixRange;
                    }

                    data = options.value[this.attr.model+this.attr.fixRange];
                    x.domain(options.range);

                    var rangeMillis = options.range[1].getTime()-options.range[0].getTime();
                    var newColumnsNumber = rangeMillis/getTimeIntervalMillis(data);

                    if (newColumnsNumber !== columns){
                        columns = newColumnsNumber;
                        this.createChart();
                        this.updateAttachedComps();

                    }else{
                        this.updateChart();
                    }

                });

                function getTimeIntervalMillis(data){
                    if (data.length>1){
                        return Math.abs(data[1].date - data[0].date);
                    }else{
                        return 1;
                    }
                }
            });
        }
    }
);
