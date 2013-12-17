/*
timeAxis

__ResizeObject__
```javascript
{
    width: 0,
    height:0,
}
```

@name timeAxis
@option {String} orientation 'bottom' orientation
@option {String} valueField 'totalRegistered' valueField
@option {String} rangeField: 'selectedRange' rangeField
@option {String} tickFormat '%e-%b' [Time formating](https://github.com/mbostock/d3/wiki/Time-Formatting)
@option {String} stepType 'day' Steps: 'day', 'month', 'year'
@option {Number} stepTick 1 stepTick
@option {Number} paddingTick 0 Distance each tick should display away from its theorical center

@event resize ResizeObject Resize chart
@event rangeChange {range:[]} define [D3.range](https://github.com/mbostock/d3/wiki/Arrays#wiki-d3_range) of chart
*/
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
                tickFormat: '%e-%b',            // https://github.com/mbostock/d3/wiki/Time-Formatting
                stepType: 'day',                // day, month, year
                stepTick: 1,                    //
                paddingTick: 0                  // Distance each tick should display away from its theorical center
            });

            this.getTransform = function() {

            };

            this.after('initialize', function() {
                var context = d3.select(this.node),
                    dayStep = 86400000,
                    maxSteps = this.attr.maxSteps,
                    _maxTicks = this._maxTicks;
                this.scale = d3.time.scale();
                this.axis = d3.svg.axis();
                this.width = this.width || 0;
                this.height = this.height || 0;
                var attribs = this.attr;
                this.axis
                    .scale(this.scale)
                    .orient(this.attr.orientation)
                    .ticks(function(t0, t1) {
                        var ticks = [], // = d3.time.days(t0, t1, steps);
                            stepTick = attribs.stepTick,
                            t = t0,
                            _maxTicks = attribs._maxTicks;

                        if (maxSteps && attribs.stepType === 'day') {
                            if ((t1-t0)/dayStep > maxSteps) {
                                stepTick = Math.ceil((t1-t0)/dayStep/maxSteps);
                            }
                        }

                        var i = 0;
                        while (t <= t1) {
                            t = d3.time.day.offset(t, 1);
                            if (attribs.stepType === 'month'){
                                if (t.getUTCDate() === 3 && i%stepTick === 0){
                                    ticks.push(t);
                                }
                            }else if (attribs.stepType === 'day' && i%stepTick === 0){
                                ticks.push(t);
                            }
                            i++;
                        }
                        if (attribs.stepType === 'day' && !maxSteps){
                            ticks.pop();
                        }

                        ticks = _resumenTicks(ticks, _maxTicks);
                        return ticks;
                    })
                    .tickSize(1,1,1)
                    .tickFormat(function(t,i){
                        var format = d3.time.format(attribs.tickFormat);
                        if (i===0 && attribs.stepType === 'day'){
                            format = d3.time.format('%b %e');
                        }
                        return format(t);
                    });

                context.call(this.axis);

                if (this.attr.orientation === 'bottom') {
                    this.scale.range([0, this.width]);
                } else {
                    this.scale.range([this.height, 0]);
                }

                this.on('resize', function(e, chartSize) {
                    this.width = chartSize.width;
                    this.height = chartSize.height;
                    this.attr._maxTicks = _calculeMaxTicks(this.width, this.attr.tickFormat);

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
        function _calculeMaxTicks(width, formatData, padding){
            var max;
            padding = padding || 5;
            width = width || 0;
            max = ( width / ( (formatData.length *  10) + padding) );
            return Math.floor( max );
        }
        function _resumenTicks(ticks, maxTicks){
            var step, first, last, newticks = [], isValid = (ticks.length > maxTicks);
            if( isValid && maxTicks === 1 ){
                step = Math.floor(ticks.length / 2 );
                newticks.push( ticks[step] );
            } else if( isValid && maxTicks === 2 ){
                newticks.push( ticks.shift() );
                newticks.push( ticks.pop() );
            } else if( isValid && maxTicks === 3 ){
                step = Math.floor(ticks.length / 2 );
                newticks.push( ticks.shift() );
                newticks.push( ticks[step] );
                newticks.push( ticks.pop() );
            } else if( maxTicks > 3 && (ticks.length) > maxTicks ){
                step = Math.floor(ticks.length / (maxTicks-1));
                for (var i = 0, n = ticks.length; i < n; i += step) {
                    newticks.push( ticks[i] );
                };
            } else {
                newticks = ticks;
            }
            return newticks;
        }
    }
);
