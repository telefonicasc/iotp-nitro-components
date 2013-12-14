/*
axis

@name axis
@option {Function} axisFn [D3.svg.axis](https://github.com/mbostock/d3/wiki/SVG-Axes)
@option {String} orientation 'right' Orientation: 'left', 'right'
@option {Number} ticks 10 ticks
*/
define(
  [
    'components/component_manager',
    'components/chart/mixin/chart_element'
  ],

  function(ComponentManager, ChartElement) {

    return ComponentManager.create('axis',
      ChartElement, Axis);

    function Axis() {

      this.defaultAttrs({
        axisFn: d3.svg.axis,
        orientation: 'right',
        ticks: 10
      });

      this.after('initialize', function() {

        if (this.attr.orientation === 'left' ||
            this.attr.orientation === 'right') {
          this.scale = this.scaley;
        } else {
          this.scale = this.scalex;
        }

        this.axis = this.attr.axisFn();

        this.axis
          .scale(this.scale)
          .orient(this.attr.orientation)
          .ticks(this.attr.ticks);

        this.context.call(this.axis);

        this.after('updateChart', function() {
          this.context.call(this.axis);
        });
      });

    }
  }

);
