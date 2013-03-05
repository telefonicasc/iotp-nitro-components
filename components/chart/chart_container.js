define(
  [
    'components/component_manager',
    'components/mixin/data_binding',
    'components/mixin/watch_resize'
  ],

  function(ComponentManager, DataBinding, WatchResize) {

    return ComponentManager.create('chartContainer', 
      ChartContainer, DataBinding, WatchResize);

    function ChartContainer() {

      this.defaultAttrs({
        showGrid: true,
        gridStrokeWidth: 1,
        gridStrokeColor: '#AAA',
        charts: [{
          type: 'area', key: 'registered', label: 'Registered' 
        }]
      });

      this.after('initialize', function() {
          
        var x = d3.time.scale().range([0, this.width])
          , y = d3.scale.linear().range([this.height, 0])
          , data = this.$node.data('value') || this.attr.value || []
          , svg = d3.select(this.node).append('svg')
              .attr('width', this.width)
              .attr('height', this.height)
          , grid = svg.append('g');
        
        this.$node.data('value', data);      

        this.on('changeData', function(e, attr, value) {
          if (attr === 'value') {
            this.trigger('valueChange', { value: value });
          }
        });        

        grid.selectAll('line.x')
          .data(x.ticks(10))
          .enter().append('line')
            .style('stroke', '#ccc')
            .attr('class', 'x');

        grid.selectAll('line.y')
          .data(y.ticks(10))
          .enter().append('line')
            .style('stroke', '#ccc')
            .attr('class', 'y');

        this.updateChart = function() {
          grid.selectAll('line.x')
            .data(x.ticks(10))
              .attr('x1', x)
              .attr('x2', x)
              .attr('y1', 0)
              .attr('y2', this.height);

          grid.selectAll('line.y')
            .data(y.ticks(10))
              .attr('x1', 0)
              .attr('x2', this.width)
              .attr('y1', y)
              .attr('y2', y);
        };

        this.on('resize', function() {
          svg.attr('width', this.width).attr('height', this.height);
          x.range([0, this.width])
          y.range([this.height, 0])
          this.updateChart();
        });

        this.on('valueChange', function(e, options) {
          var value = options.value;
          x.domain(d3.extent(value, function(d) { return new Date(d.date); }));
          y.domain([0, d3.max(value, function(d) { return d.value; })*1.2]);
          this.updateChart();
        });

      });
    }
  }
);
