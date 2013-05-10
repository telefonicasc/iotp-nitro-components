define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('timeAxis',
            TimeAxis);

        function TimeAxis() {

            var dayStep = 1000 * 60 * 60 * 24;

            this.defaultAttrs({
                orientation: 'bottom',
                valueField: 'totalRegistered',
                rangeField: 'selectedRange',
                tickFormat: '%e-%b',
                stepType: 'day',                //day, month, year
                stepTick: 1
            });

            this.getTransform = function() {

            };

            this.after('initialize', function() {
                var context = d3.select(this.node),
                    maxSteps = this.attr.maxSteps;

                this.scale = d3.time.scale();
                this.axis = d3.svg.axis();
                var attribs = this.attr;
                this.axis
                    .scale(this.scale)
                    .orient(this.attr.orientation)
                    .ticks(function(t0, t1) {
                        var ticks = [], // = d3.time.days(t0, t1, steps);
                            t = t0;

                        while (t < t1) {
                            t = d3.time.day.offset(t, attribs.stepTick);
                            ticks.push(t);
                        }

                        ticks.pop();
                        return ticks;
                    })
                    .tickSize(1, 1, 1)
                    .tickFormat(d3.time.format(this.attr.tickFormat));

                context.call(this.axis);

                if (this.attr.orientation === 'bottom') {
                    this.scale.range([0, this.width]);
                } else {
                    this.scale.range([this.height, 0]);
                }

                this.on('resize', function(e, chartSize) {
                    
                    this.width = chartSize.width;
                    this.height = chartSize.height;

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
