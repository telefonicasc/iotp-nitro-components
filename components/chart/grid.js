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
        stroke: '#b3b8be',
        model: 'totalRegistered',
        valueTicks: 5
      });

      var dayStep = 1000*60*60*24
        , maxSteps = 12; 
      function timeTicks(t0, t1) {
        var nStep = Math.ceil((t1-t0)/dayStep/maxSteps)
          , steps = []
          , t = t0;

        while (t < t1) {
          steps.push(t);
          t = d3.time.day.offset(t, nStep);
        } 
        
        return steps;

        //return d3.time.days(t0, t1, steps);
      }

      this.after('updateChart', function() {        
        var xLines = this.context.selectAll('line.x')
              .data(this.scalex.ticks(timeTicks))
          , yLines = this.context.selectAll('line.y')
              .data(this.scaley.ticks(this.attr.valueTicks));

        xLines.enter().append('line')
          .style('stroke', this.attr.stroke)
          .attr('class', 'x');

        yLines.enter().append('line')
          .style('stroke', this.attr.stroke)
          .attr('class', 'y');

        xLines
          .attr('x1', this.scalex)
          .attr('x2', this.scalex)
          .attr('y1', 0)
          .attr('y2', this.height);

        yLines
          .attr('x1', 0)
          .attr('x2', this.width)
          .attr('y1', this.scaley)
          .attr('y2', this.scaley);

        d3.select(this.node.parentNode).selectAll('line.baseline').remove();
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
