define(
  [
    'components/component_manager',
    'components/chart/grid',
    'components/chart/range_selection',
    'components/mixin/data_binding',
    'components/mixin/watch_resize',
    'libs/guid',
    'components/chart/axis/time_axis',
    'components/chart/axis/axis'
  ],

  function(ComponentManager, Grid, RangeSelection, DataBinding, WatchResize, GUID) {

    return ComponentManager.create('chartContainer', 
      ChartContainer, DataBinding, WatchResize);

    function ChartContainer() {

      this.defaultAttrs({
        showGrid: true,
        gridStrokeWidth: 1,
        gridStrokeColor: '#AAA',
        marginBottom: 0,
        marginRight: 0
      });

      this.after('initialize', function() {
          
        var x = d3.time.scale().range([0, this.width])
        //var x = d3.scale.ordinal().rangeRoundBands([0, this.width], 0)
          , y = d3.scale.linear().range([this.height, 0])
          , clipId = GUID.get()
          , data = this.$node.data('value') || this.attr.value || []
          , svg = d3.select(this.node).append('svg')
              .attr('width', this.width)
              .attr('height', this.height)
          , grid, clip, rangeSelection, border;
        
        this.$node.data('value', data);      

        if (this.attr.grid) {
          grid = svg.append('g').attr('class', 'grid');
          Grid.attachTo(grid.node(), $.extend({
            clipId: clipId
          }, this.attr.grid)); 
        }

        clip = svg.append('defs').append('clipPath')
            .attr('id', clipId)
          .append('rect');

        border = svg.append('rect').attr('class', 'border');

        if (this.attr.charts) {
          $.each(this.attr.charts, $.proxy(function(i, chart) {
            chart.node = svg.append('g').attr('class', 'chart').node();
            ComponentManager.get(chart.type).attachTo(chart.node, $.extend({
              scalex: x, scaley: y, clipId: clipId 
            }, chart));
          }, this));
        }

        if (this.attr.axisx) {
          var axisx = svg.append('g').attr('class', 'x axis');        
          ComponentManager.get('timeAxis').attachTo(axisx.node());
        }

        if (this.attr.axisy) {
          var axisy = svg.append('g').attr('class', 'y axis');
          ComponentManager.get('axis').attachTo(axisy.node());
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
          var chartSize = {
            width: this.width - this.attr.marginRight,
            height: this.height - this.attr.marginBottom
          };
          svg.attr('width', this.width).attr('height', this.height);
          border.attr('width', chartSize.width).attr('height', chartSize.height);
          x.range([0, this.width])
          y.range([this.height, 0])
          this.$node.find('g.chart, g.grid, g.brush')
            .trigger('resize', chartSize);

          if (this.attr.axisx) {
            axisx.attr('transform', 'translate(0,' + 
              chartSize.height + ')');
          }
          if (this.attr.axisy) {
            axisy.attr('transform', 'translate(' +
              chartSize.width + ',0)');
            this.$node.find('g.axis.y').trigger('resize', {
              height: chartSize.height, width: this.attr.marginRight
            });
          }

          clip.attr('width', chartSize.width)
            .attr('height', chartSize.height);
        });

        this.on('valueChange', function(e, options) {
          var model = options.value
            , value = model[this.attr.valueField]
            , rangeField = this.attr.rangeField
            , range = rangeField && model[rangeField]
            , valueRange = [];

          if (!range) {
            range = d3.extent(value, function(d) { return new Date(d.date); });
          }

          x.domain(range); 

          $.each(this.attr.charts, function(i, chart) {
            var chartMin, chartMax;
            if (model[chart.model]) {
              chartMin = d3.min(model[chart.model], function(d) { return d.value; })*1.2;
              chartMax = d3.max(model[chart.model], function(d) { return d.value; })*1.2;
              if (!valueRange[0] || chartMin < valueRange[0]) {
                valueRange[0] = chartMin;
              }
              if (!valueRange[1] || chartMax > valueRange[1]) {
                valueRange[1] = chartMax;
              }
            }
          });

          valueRange[0] = Math.min(valueRange[0], 0);
          /*valueRange = [
            Math.min(d3.min(value, function(d) { return d.value; })*1.2,0),
            d3.max(value, function(d) { return d.value; })*1.2
          ];*/
          y.domain(valueRange);
          this.$node.find('g.chart, g.grid, g.axis.y').trigger('valueChange', $.extend({ 
              range: range, valueRange: valueRange
            }, options));          

          if (this.attr.axisx) {
            $(axisx.node()).trigger('rangeChange', { range: range, valueRange: valueRange });
          }
        });

      });
    }
  }
);
