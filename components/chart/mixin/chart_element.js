/*
ChartElement

@name ChartElement
@option {Object} x { scaleFun: d3.time.scale, key: 'date' }
@option {Object} y { scaleFun: d3.time.linear, key: 'value' }
*/
define(
    [
        'libs/guid'
    ],
    function(GUID) {

        var ChartElement = function () {
            this.defaultAttrs({
                x: {
                    scaleFun: d3.time.scale,
                    key: 'date'
                },
                y: {
                    scaleFun: d3.scale.linear,
                    key: 'value'
                }
            });

            this.updateChart = function() {};

            this.updateSize = function(size) {
                this.width = size.width || 0;
                this.height = size.height || 0;
                this.scalex.range([0, this.width]);
                this.scaley.range([this.height, 0]);

            };

            this.after('initialize', function() {
                var clipRange, clipRangeId;

                this.scalex = this.attr.x.scaleFun();
                this.scaley = this.attr.y.scaleFun();
                this.value = this.$node.data('value') || this.attr.value || [];
                this.context = d3.select(this.node);

                this.context.append('g').attr('class', 'background_grid');

                this.x = $.proxy(function(d) {
                    return this.scalex(d[this.attr.x.key]);
                }, this);

                this.y = $.proxy(function(d) {
                    return this.scaley(d[this.attr.y.key]);
                }, this);

                if (this.attr.clipRange) {
                    clipRangeId = GUID.get();
                    clipRange = d3.select(this.node.parentNode).select('defs')
                        .append('clipPath')
                        .attr('id', clipRangeId).append('rect');
                    this.context.attr('clip-path', 'url(#' + clipRangeId + ')');
                } else {
                    if (this.attr.clipId) {
                        this.context.attr('clip-path', 'url(#' +
                            this.attr.clipId + ')');
                    }
                }

                this.updateSize({
                    width: this.attr.width,
                    height: this.attr.height
                });

                this.on('resize', function(e, size) {
                    this.updateSize(size);
                    this.updateChart();
                    e.stopPropagation();
                });

                this.on('valueChange', function(e, options) {
                    var xkey = this.attr.x.key,
                        model = options.value,
                        value = model[this.attr.model],
                        rangeStartx, rangeEndx;

                    if (options.range && options.range.length === 2 && value) {
                        this.value = _filterDataByRangetime(xkey, value, options.range);

                        if (clipRange && model[this.attr.clipRange]) {
                            rangeStartx = this.scalex(
                                model[this.attr.clipRange][0]);
                            rangeEndx = this.scalex(
                                model[this.attr.clipRange][1]);
                            clipRange
                                .attr('x', rangeStartx)
                                .attr('height', this.height)
                                .attr('width', rangeEndx - rangeStartx);
                        }
                    } else {
                        this.value = value;
                    }

                    this.scalex.domain(options.range);
                    this.scaley.domain(options.valueRange);
                    this.updateChart();
                    this.options = options;
                    e.stopPropagation();
                });

                this.on('actionSelected', function(e, value){
                    e.stopPropagation();
                    if (value.newModel){
                        this.attr.model = value.newModel;
                    }
                    this.anim = true;
                    this.trigger('valueChange', this.options);
                });
            });
        }

        var _filterDataByRangetime = function (keyData, data, range){
            //                   newData
            // ---.---------.xxxxxxxxxxxxx.-------.---
            //  keyA    timeStart    timeEnd    keyB
            var newData = [],
                timeStart = range[0],
                timeEnd = range[1],
                distanceA, distanceB,
                keyA, keyB;

            var setKeyA = function(time, index){
                var a = timeStart - time;
                if(!distanceA) {
                    distanceA = a;
                }
                if(a <= distanceA ){
                    distanceA = a;
                    keyA = index;
                }
            };
            var setKeyB = function(time, index){
                var b = time - timeEnd;
                if(!distanceB){
                    distanceB = b;
                }
                if(b <= distanceB ){
                    distanceB = b;
                    keyB = index;
                }
            };
            newData = $.map(data, function(item, index) {
                var a, b, time = item[keyData];
                if(time < timeStart){
                    setKeyA(time, index);
                }
                if(time > timeEnd){
                    setKeyB(time, index);
                }
                if (time >= timeStart && time <= timeEnd) {
                    return item;
                }
            });
            if(data[keyA]){
                newData.unshift( data[keyA] );
            }
            if(keyB && data[keyB]){
                newData.push( data[keyB] );
            }
            return newData;
        };

        return ChartElement;
    }
);
