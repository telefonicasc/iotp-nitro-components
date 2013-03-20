define(
  [
    'components/component_manager'
  ],

  function(ComponentManager) {

    return ComponentManager.create('timeAxis', 
      TimeAxis);

    function TimeAxis() {
    
      var dayStep = 1000*60*60*24;

      this.defaultAttrs({
        orientation: 'bottom',
        valueField: 'totalRegistered',
        rangeField: 'selectedRange',
        dateFormat: '%e-%b',
        maxSteps: 12
      });

      this.getTransform = function() {

      };

      this.width = 700;
      this.height = 300;

      this.after('initialize', function() {
        var context = d3.select(this.node)
          , maxSteps = this.attr.maxSteps;

        this.scale = d3.time.scale();
        this.axis = d3.svg.axis();

        this.axis
          .scale(this.scale)
          .orient(this.attr.orientation)
          .ticks(function(t0, t1) {
            var steps = Math.ceil((t1-t0)/dayStep/maxSteps)
              , ticks = [] // = d3.time.days(t0, t1, steps);
              , t = t0;

            while (t < t1) {
              t = d3.time.day.offset(t, steps);
              ticks.push(t);
            } 

            ticks.pop();
            return ticks; 
          })
          .tickSize(1,1,1)
          .tickFormat(d3.time.format(this.attr.dateFormat));
                   
        context.call(this.axis);

        if (this.attr.orientation === 'bottom') { 
          this.scale.range([0, this.width]);
        } else {
          this.scale.range([this.height, 0]);
        }

        this.on('resize', function(e) {
          if (this.attr.orientation === 'bottom') {
            this.scale.range([0, this.width]);
          } else {
            this.scale.range([this.height, 0]);
          }
          context.call(this.axis);

          e.stopPropagation();
        });

        this.on('rangeChange', function(e, options) {
          this.scale.domain(options.range);
          context.call(this.axis);
        });
      });
    }
  }
);
