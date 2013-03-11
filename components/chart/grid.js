define(
  [
    'components/component_manager'
  ],

  function(ComponentManager) {
    
    return ComponentManager.create('chartGrid', ChartGrid);

    function ChartGrid() {
      this.defaultAttrs({
        stroke: '#b3b8be'
      });

      this.after('initialize', function() {
        var x = this.attr.x
          , y = this.attr.y
          , data = this.$node.data('value') || this.attr.value || []
          , svg = d3.select(this.node)
          , xLines = svg.selectAll('line.x')
          , yLines = svg.selectAll('line.y');

        xLines.data(data)
        //xLines.data(x.ticks(10))
          .enter().append('line')
            .style('stroke', this.attr.stroke)
            .attr('class', 'x');

        yLines.data(y.ticks(10))
          .enter().append('line')
            .style('stroke', this.attr.stroke)
            .attr('class', 'y');
          
        this.updateGrid = function() {
          svg.selectAll('line.x')
            .data(data)
              .attr('x1', function(d) { return x(d.date); })
              .attr('x2', function(d) { return x(d.date); })
              .attr('y1', 0)
              .attr('y2', y(0));

          svg.selectAll('line.y')
            .data(y.ticks(10))
              .attr('x1', 0)
              .attr('x1', x.range()[1])
              .attr('y1', y)
              .attr('y2', y);          
        };

        this.on('resize', function(e) {
          this.updateGrid();
          e.stopPropagation();
        });

        this.on('valueChange', function(e, options) {
          data = options.value.registered;
          this.updateGrid();
          e.stopPropagation();
        });

      });
    }
  }
);
