define(
  [
    'components/component_manager',
    'components/chart/grid',
    'components/chart/range_selection',
    'components/mixin/data_binding',
    'components/mixin/watch_resize'
  ],

  function(ComponentManager, Grid, RangeSelection, DataBinding, WatchResize) {

    return ComponentManager.create('chartContainer', 
      ChartContainer, DataBinding, WatchResize);

    function ChartContainer() {

      this.defaultAttrs({
        showGrid: true,
        gridStrokeWidth: 1,
        gridStrokeColor: '#AAA'
      });

      this.after('initialize', function() {
          
        var x = d3.time.scale().range([0, this.width])
        //var x = d3.scale.ordinal().rangeRoundBands([0, this.width], 0)
          , y = d3.scale.linear().range([this.height, 0])
          , data = this.$node.data('value') || this.attr.value || []
          , svg = d3.select(this.node).append('svg')
              .attr('width', this.width)
              .attr('height', this.height)
          , grid, rangeSelection;
        
        this.$node.data('value', data);      

        if (this.attr.grid) {
          grid = svg.append('g').attr('class', 'grid');
          Grid.attachTo(grid.node(), $.extend({
            x: x, y: y
          }, this.attr.grid)); 
        }

        if (this.attr.charts) {
          $.each(this.attr.charts, $.proxy(function(i, chart) {
            chart.node = svg.append('g').attr('class', 'chart').node();
            ComponentManager.get(chart.type).attachTo(chart.node, $.extend({
              x: x, y: y 
            }, chart));
          }, this));
        }

        if (this.attr.rangeSelection) {
          rangeSelection = svg.append('g').attr('class', 'x brush');
          RangeSelection.attachTo(rangeSelection.node(), $.extend({
            x: x, y: y 
          }, this.attr.rangeSelection));
        }

        this.on('changeData', function(e, attr, value) {
          if (attr === 'value') {
            this.trigger('valueChange', { value: value });
          }
        });        

        this.on('resize', function() {
          svg.attr('width', this.width).attr('height', this.height);
          x.range([0, this.width])
          //x.rangeRoundBands([0, this.width], 0);
          y.range([this.height, 0])
          this.$node.find('g.chart, g.grid, g.brush').trigger('resize');
        });

        this.on('valueChange', function(e, options) {
          var model = options.value
            , value = model[this.attr.valueField]
            , rangeField = this.attr.rangeField
            , range = rangeField && model[rangeField];

          if (range) {
            x.domain(range); 
            //x.domain(d3.time.days(new Date(range[0]), new Date(range[1])));
              //.rangeRoundBands([0, this.width], .1);
            //debugger;
          } else {
            x.domain(d3.extent(value, function(d) { return new Date(d.date); }));
            //x.domain(d3.time.days(
            //  d3.min(value, function(d) { return d.date }), 
            //  d3.max(value, function(d) { return d.date; })));
          }

          y.domain([0, d3.max(value, function(d) { return d.value; })*1.2]);
          this.$node.find('g.chart, g.grid').trigger('valueChange', options);
        });

      });
    }
  }
);
