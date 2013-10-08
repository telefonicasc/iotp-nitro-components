define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/draggable',
        'components/chart/chart_container',
        'components/chart/area_chart'
    ],

    function(ComponentManager, DataBinding, Draggable,
        ChartContainer, AreaChart) {

        return ComponentManager.create('rangeSelectionChart',
            RangeSelectionChart, DataBinding);

        function RangeSelectionChart() {

            this.defaultAttrs({

            });

            this.after('initialize', function() {

                this.$node.addClass('range-selection-chart fit');

                this.$selectedRange = $('<div>').addClass('selected-range fit');
                this.$wholeChart = $('<div>').addClass('whole-chart fit');
                this.$selectedChart = $('<div>').addClass('selected-chart fit');

                this.$selectedRange.append(this.$selectedChart);
                this.$node.append(this.$wholeChart, this.$selectedRange);

                //setTimeout($.proxy(function() {
                    ChartContainer.attachTo(this.$wholeChart, {
                        valueField: 'totalRegistered',
                        rangeField: 'range',
                        charts: [{
                            type: 'areaChart',
                            valueField: 'totalRegistered',
                            rangeField: 'range'
                        }]
                    });
                    ChartContainer.attachTo(this.$selectedChart, {
                        valueField: 'totalRegistered',
                        rangeField: 'range',
                        charts: [{
                            type: 'areaChart',
                            valueField: 'totalRegistered',
                            rangeField: 'range'
                        }]
                    });

                    this.$wholeChart.trigger('render');
                    this.$selectedChart.trigger('render');

                this.leftHandler = $('<div>')
                    .addClass('range-selection-handler');
                this.leftHandler.appendTo(this.$node);
                Draggable.attachTo(this.leftHandler,
                    { containment: this.$node });

                this.rightHandler = $('<div>')
                    .addClass('range-selection-handler');
                this.rightHandler.appendTo(this.$node);
                Draggable.attachTo(this.rightHandler,
                    { containment: this.$node });

                function updateRange() {
                    var value = this.value,
                        left = this.leftHandler.position().left,
                        right = this.rightHandler.position().left,
                        width = this.$node.width();

                    this.value.selectedRange = [];
                    this.value.selectedRange[0] = ((left / width) *
                        (value.range[1] - value.range[0])) + value.range[0];
                    this.value.selectedRange[1] = ((right / width) *
                        (value.range[1] - value.range[0])) + value.range[0];

                    this.trigger('valueChange', { value: this.value });
                }
                this.leftHandler.on('drag', $.proxy(function() {
                    updateRange.call(this);
                },this));
                this.rightHandler.on('drag', $.proxy(function() {
                    updateRange.call(this);
                },this));

                this.on('valueChange', function(e, o) {
                    var value = this.value = o.value,
                        start, end, min, max, leftPos, rightPos;

                    if (!value.selectedRange) {
                        value.selectedRange = [value.range[0], value.range[1]];
                    }

                    min = value.range[0];
                    max = value.range[1];
                    start = value.selectedRange[0];
                    end = value.selectedRange[1];
                    leftPos = this.$node.width() * (start - min) / (max - min);
                    rightPos = this.$node.width() * (end - min) / (max - min);

                    this.leftHandler.css({
                        left: leftPos
                    });
                    this.rightHandler.css({
                        left: rightPos
                    });
                    this.$selectedRange.css({
                        left: leftPos, width: rightPos - leftPos
                    });
                    this.$selectedChart.css({
                        marginLeft: 0 - leftPos
                    });
                });
            });
        }
    }
);
