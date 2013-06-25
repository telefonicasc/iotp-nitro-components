define(
    [
        'libs/guid'
    ],

    function(GUID) {

        return ChartElement;

        function ChartElement() {

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
                this.width = size.width;
                this.height = size.height;
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

                    if (options.range && value) {
                        this.value = $.map(value, function(item) {
                            if (item[xkey] >= options.range[0] &&
                                item[xkey] <= options.range[1]) {
                                return item;
                            }
                        });

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

    }
);
