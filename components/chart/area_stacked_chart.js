define(
    [
        'components/component_manager',
        'components/chart/mixin/chart_element'
    ],

    function(ComponentManager, ChartElement) {

        return ComponentManager.create('areaStackedChart',
            ChartElement, AreaStackedChartComponent);

        function AreaStackedChartComponent() {

            this.defaultAttrs({
                colors: ['blue', 'red', 'green']
            });

        
            this.after('initialize', function() {

                var area = d3.svg.area().x(this.x)
                .y0(this.height)
                .y1(this.y);

                this.context.attr('class', 'chart');

                var pathArea = this.context.append('path')
                    .datum(this.value)
                    .attr('class', 'area')
                    .attr('d', area);

                this.after('updateChart', function() {

                    area.y0(this.height-10);


                    pathArea.data(this.value)
                    .enter()
                    .attr('d', area)
                    .style('fill', 'red')
                    .style('opacity', 1);
                    

                    this.context.attr("transform", "translate(40,50");

                });
            });
        }
    }
);
