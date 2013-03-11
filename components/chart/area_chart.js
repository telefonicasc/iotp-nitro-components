define(
  [
    'components/component_manager'
  ],

  function(ComponentManager) {
    
    return ComponentManager.create('areaChart', 
      AreaChartComponent);

    function AreaChartComponent() {

      this.defaultAttrs({
        
      });

      this.after('initialize', function() {

        var x = this.attr.x
          , y = this.attr.y
          , data = this.$node.data('value') || this.attr.value || []
          , svg = d3.select(this.node)
          , area = d3.svg.area()
              .x(function(d) { return x(d.date); })
              .y0(y(0))
              .y1(function(d) { return y(d.value); })
          , line = d3.svg.line()
              .x(function(d) { return x(d.date); })
              .y(function(d) { return y(d.value); })
          , pathArea
          , pathLine;
        
        svg.attr('class', 'chart ' + this.attr.cssClass);

        pathArea = svg.append('path')
          .datum(data)
          .attr('class', 'area')
          .attr('d', area);        

        pathLine = svg.append('path')
          .datum(data)
          .attr('class', 'line')
          .attr('d', line);
    
        this.updateChart = function() {
          pathArea.attr('d', area);
          pathLine.attr('d', line);
        };

        this.on('resize', function(e) {
          area.y0(this.attr.y(0));
          this.updateChart();
          e.stopPropagation();
        });

        this.on('valueChange', function(e, options) {
          var model = options.value
            , value = model[this.attr.valueField];

          pathArea.datum(value);
          pathLine.datum(value);
          this.updateChart();
          e.stopPropagation();
        });
      });
    }
  }
);
