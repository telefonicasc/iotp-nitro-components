define(
[
    'components/component_manager',
    'components/chart/mixin/chart_element'
],

  function(ComponentManager, ChartElement) {

    return ComponentManager.create('axisLabels',
      ChartElement, AxisLabels);

    function AxisLabels() {

        this.defaultAttrs({
            orientation: 'vertical',
            width: 70 
        });

        this.after('initialize', function() {

            var context = d3.select(this.node),
                y = d3.scale.linear().range([this.height, 0]);
            this.values = this.attr.values || { maxValues:[] } ;

            this.labelAxis = context.append('rect').attr('class','axis-labels')
            .style('fill', 'transparent')
            .attr('width', this.attr.width)
            .attr('x',0)
            .attr('y',0)
            .attr('height', this.height);
            this.labels = context.selectAll('.labels').data(this.values.maxValues);

            this.updateLabels = function(){

                this.labels.remove();

                var _height = this.height;
                var _values = this.values;

                this.labels = context.selectAll('.labels').data(_values.maxValues);
                this.labels.enter().append('text')
                .attr('class', 'labels')
                .text(function(d, i){
                    return y(i);
                })
                .attr('y', function(d){
                    return _height-d;
                })
                .attr('x',0)
                .style('fill','#0c2e49');
               
            }
                  

            this.on('resize', function(e, chartSize){
                e.stopPropagation();
                this.height = chartSize.height;
                this.labelAxis.attr('height', this.height);

            });


            this.on('valueChange', function(e, options){
                e.stopPropagation();
                this.values = getMaxValues(options);
                y.domain([0,69]);
                this.updateLabels();
            });

        });

        function getMaxValues(options){
            var maxValues = [];
            var keys = [];
            $.each(options.value, function(key, item){

                var valuesRange = $.map(item, function(val, i) {
                    if (val.date >= options.range[0] && val.date <= options.range[1]) {
                        return val;
                    }
                });

                if (valuesRange.length > 0){
                   maxValues.push(valuesRange[valuesRange.length -1].value); 
                   keys.push(key);
                }
            });
            return { text:keys, maxValues: maxValues };
        }

    }
});
