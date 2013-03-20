define(
  [
    'components/component_manager',
    'components/mixin/watch_resize',
    'components/mixin/data_binding'
  ],

  function(ComponentManager, WatchResize, DataBinding) {

    return ComponentManager.create('radarChart',
      RadarChart, WatchResize, DataBinding);

    function RadarChart() {

      var data;

      this.defaultAttrs({
        maxValues: [],
        axis: [{
          label: 'Online user'
        }, {
          label: 'Unseen in 60 days'
        }, {
          label: 'Visitors'
        }, {
          label: 'Deactivation'
        }, {
          label: 'Total users'
        }, {
          label: 'Registrations'
        }],
        radarSize: 120,
        radarPosition: {
          x: 160, y: 160
        }
      });

      this.get = function(prop) {
        if ($.isFunction(this.attr[prop])) {
          return this.attr[prop](this.attr, this.value);
        } else {
          return this.attr[prop];
        }
      };

      this.after('initialize', function() {
        var svg = d3.select(this.node).append('svg')
              .attr('width', this.width)
              .attr('height', this.height)
          , axis = this.attr.axis
          , axisEl = svg.append('g').attr('class', 'axis')
          , radarLine = d3.svg.line()
          , radarSize = this.attr.radarSize
          , radarX = this.attr.radarPosition.x
          , radarY = this.attr.radarPosition.y
          , maxValues = this.get('maxValues');

        this.$node.addClass('radar-chart');

        function getX(d,i) {
          var angle = Math.PI/2 - i*2*Math.PI/axis.length
            , max = maxValues[i];
          return Math.cos(angle)*radarSize*d/max + radarX;
        }

        function getY(d,i) {
          var angle = Math.PI/2 - i*2*Math.PI/axis.length
            , max = maxValues[i];
          return Math.sin(angle)*radarSize*d/max + radarY;            
        }

        function updateChart() {
          var axisLines = axisEl.selectAll('line').data(axis)
            , axisCircles = axisEl.selectAll('circle').data(axis)
            , axisLabels = axisEl.selectAll('text').data(axis)
            , radarG = svg.selectAll('g.radar').data(data)
            , circles;

          axisLines.enter().append('line');

          axisLines
            .attr('x1', radarX)
            .attr('x2', radarX)
            .attr('y1', radarY)
            .attr('y2', radarY-radarSize)
            .attr('transform', function(d, i) {
                var angle = 360*i/axis.length;
                return 'rotate(' + angle + ',' + radarX + ',' + radarY + ')';
              });

          axisCircles.enter().append('circle').attr('r', 4);
          axisCircles.attr('cx', function(d,i) { return getX(maxValues[i], i) });
          axisCircles.attr('cy', function(d,i) { return getY(maxValues[i], i) });
          axisCircles.exit().remove();

          axisLabels.enter().append('text');
          axisLabels.attr('x', function(d,i) { return getX(maxValues[i], i) });
          axisLabels.attr('y', function(d,i) { 
            var y = getY(maxValues[i], i);
            return y > radarY ? y + 18 : y - 9;
          });
          axisLabels.text(function(d) { return d.label; });
          axisLabels.exit().remove();

          radarLine.x(getX).y(getY);

          radarG.enter().append('g')
            .attr('class', function(d) { return 'radar ' + (d.className || ''); })
            .append('path');
          radarG.select('path').attr('d', function(d) { return radarLine(d.values) + 'Z' });     
          circles = radarG.selectAll('circle').data(function(d) { return d.values });
          circles.enter().append('circle').attr('r', 4);
          circles.attr('cx', getX).attr('cy', getY);
          circles.exit().remove();
          radarG.exit().remove();

          axisLines.exit().remove();
        }

        this.on('valueChange', function(e, o) {
          data = this.value = o.value;
          maxValues = this.get('maxValues');
          updateChart();
        });

        this.on('resize', function() {
          svg.attr('width', this.width).attr('height', this.height);
        });
      });
    }

  }
);
