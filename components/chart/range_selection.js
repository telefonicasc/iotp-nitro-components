define(
  [
    'components/component_manager',
    'components/mixin/data_binding'
  ],

  function(ComponentManager, DataBinding) {

    return ComponentManager.create('rangeSelection',
      RangeSelection, DataBinding);

    function RangeSelection() {

      this.defaultAttrs({

      });

      this.after('initialize', function() {
        var x = this.attr.x,
            y = this.attr.y,
            context = d3.select(this.node),
            brush = d3.svg.brush()
                .x(this.attr.x)
                .on('brush', $.proxy(function() {
                    var currentExtent = brush.extent();
                    brush.extent([d3.time.day.round(currentExtent[0]),
                        d3.time.day.round(currentExtent[1])]);
                    this.value[this.attr.selectedRangeField] = brush.extent();
                    this.updateExtent(brush.extent());

                    this.trigger('valueChange', { value: this.value });
                }, this));

        this.updateExtent = function(extent) {
          var start = this.attr.x(extent[0]),
              end = this.attr.x(extent[1]);

          context.select('.w').attr('transform', 'translate(' + start + ',0)');
          context.select('.e').attr('transform', 'translate(' + end + ',0)');
          context.select('.extent').attr('x', start).attr('width', end - start);
        };

        context
          .call(brush)
          .selectAll('rect')
            .attr('y', 0)
            .attr('height', function() { y.range()[0]; });

        context.selectAll('.resize rect')
          .attr('width', 10)
          .attr('rx', 4)
          .attr('ry', 4)
          .style('visibility', 'inherit');

        this.on('resize', function(e) {
          d3.select(this.node).select('rect')
            .attr('width', this.attr.x.range()[1]);
          d3.select(this.node).selectAll('rect')
            .attr('height', this.attr.y.range()[0]);
          e.stopPropagation();
        });

        this.on('valueChange', function(e, options) {
          this.value = options.value;
          //e.stopPropagation();
        });
      });

    }
  }
);
