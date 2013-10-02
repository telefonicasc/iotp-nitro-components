define(
    [
        'components/component_manager',
        'components/chart/mixin/chart_element'
    ],

    function(ComponentManager, ChartElement) {

        return ComponentManager.create('chartGrid',
            ChartElement, ChartGrid);

        function ChartGrid() {
            this.defaultAttrs({
                stroke: '#ffffff',
                valueTicks: 5,
                classGrid: 'bg_grid'
            });

            var dayStep = 1000 * 60 * 60 * 24,
                maxSteps = 21;

            function timeTicks(t0, t1) {
                var nStep = Math.ceil((t1 - t0) / dayStep / maxSteps),
                    steps = [],
                    t = t0;

                while (t <= t1) {
                    steps.push(t);
                    t = d3.time.day.offset(t, nStep);
                }

                return steps;

                //return d3.time.days(t0, t1, steps);
            }

            this.after('updateChart', function() {

                this.context.selectAll('.'+this.attr.classGrid).remove();

                var attrib = this.attr,
                    backgroundGrid = this.context.selectAll('.background_grid'),
                    timeTicksInScale = this.scalex.ticks(timeTicks).length-1,
                    backgroundGridWidth;
                if(timeTicksInScale < 1){
                    timeTicksInScale = 1;
                }
                backgroundGridWidth = this.width/(timeTicksInScale);
                backgroundGrid.selectAll('.rect_bg')
                    .data(this.scalex.ticks(timeTicks))
                    .enter().append('rect')
                    .attr('class', function(d, i){
                        if (i%2===0){
                            return attrib.classGrid + ' odd';
                        }
                        return attrib.classGrid + ' even';
                    })
                    .attr('height', this.height)
                    .attr('x', this.scalex)
                    .attr('width', backgroundGridWidth);

                var xLines = this.context.selectAll('line.x')
                        .data(this.scalex.ticks(timeTicks)),
                    yLines = this.context.selectAll('line.y')
                        .data(this.scaley.ticks(this.attr.valueTicks));


                yLines.enter().append('line')
                    .attr('class', 'y');
                xLines.enter().append('line')
                    .attr('class', 'x');
                yLines
                    .attr('x1', 0)
                    .attr('x2', this.width)
                    .attr('y1', this.scaley)
                    .attr('y2', this.scaley);

                xLines
                    .attr('x1', this.scalex)
                    .attr('x2', this.scalex)
                    .attr('y1', 0)
                    .attr('y2', this.height);

                d3.select(this.node.parentNode)
                    .selectAll('line.baseline').remove();
                if (this.scaley.domain()[0] < 0) {
                    d3.select(this.node.parentNode).append('line')
                        .attr('class', 'baseline')
                        .attr('x1', 0)
                        .attr('x2', this.width)
                        .attr('y1', this.scaley(0))
                        .attr('y2', this.scaley(0));
                }

                xLines.exit().remove();
                yLines.exit().remove();

            });
        }
    }
);
