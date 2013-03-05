define(
  [
    'components/component_manager',
    'components/mixin/watch_resize'
  ],

  function(ComponentManager, WatchResize) {
    
    return ComponentManager.create('areaChart', 
      AreaChartComponent, WatchResize);

    function AreaChartComponent() {

      this.defaultAttrs({

      });

      this.after('initialize', function() {

        var x = d3.time.scale().range([0, this.width])
          , y = d3.scale.linear().range([this.height, 0])
          , xAxis = d3.svg.axis().scale(x).orient('bottom')
          , yAxis = d3.svg.axis().scale(y).orient('left')
          , data = this.$node.data('value') || this.attr.value || []
          , svg = d3.select(this.node).select('svg')
              .attr('width', this.width)
              .attr('height', this.height)          
          , area = d3.svg.area()
              .x(function(d) { return x(d.date); })
              .y0(this.height)
              .y1(function(d) { return y(d.value); })
          , path;
        
        path = svg.append('path')
          .datum(data)
          .attr('class', 'area')
          .attr('d', area);        
    
        this.updateChart = function() {
          path.attr('d', area);
        };

        this.on('resize', function() {
          svg.attr('width', this.width).attr('height', this.height);
          x.range([0, this.width]);
          y.range([this.height, 0]);
          area.y0(this.height);
          this.updateChart();
        });

        this.on('valueChange', function(e, options) {
          var value = options.value;
          x.domain(d3.extent(value, function(d) { return new Date(d.date); }));
          y.domain([0, d3.max(value, function(d) { return d.value; })*1.2]);
          path.datum(value);
          this.updateChart();
        });
      });
    }
  }
);
