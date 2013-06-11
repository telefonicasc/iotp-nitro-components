define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('areaStackedChart',
            AreaStackedChart);

        function AreaStackedChart() {

            this.defaultAttrs({
                colorArea: ['#ff0000'],
                colorLine: ['#00ff00'],
                fillOpacity: 0.85,
                subModels: []
            });

            this.after('initialize', function() {

                var x = d3.time.scale().range([0, this.width]),
                    y = d3.scale.linear().range([this.height, 0]),
                    data = this.$node.data('value') || [],
                    context = d3.select(this.node);

                context.attr('class', 'chart stacked');

                if (this.attr.tooltip) {
                    this.tooltip = $('<div>').addClass('tooltip')
                        .appendTo($('body'));
                }

                var stack = d3.layout.stack()
                  .offset('zero')
                  .values(function(d) { return d.values; })
                  .x(function(d) { return d.date; })
                  .y(function(d) { return d.value; });

                var area = d3.svg.area()
                  //.interpolate('cardinal')
                  .x(function(d) { return x(d.date); })
                  .y0(function(d) { return y(d.y0); })
                  .y1(function(d) { return y(d.y0 + d.value); });

                var line = d3.svg.line()
                  //.interpolate('basis')
                  .x(function(d) { return x(d.date); })
                  .y(function(d) { return y(d.y0 + d.value); });

                var svg = context.select('svg').append('g');

                this.updateChart = function() {

                    context.select('svg').remove();
                    svg = context.append('svg').append('g');

                    var attrib = this.attr;

                    var areaColor = this.attr.colorArea;

                    if (this.attr.colorPattern){
                      areaColor = [];
                      $.each(this.attr.colorPattern, function( i, pattern ) {
                        var defs = svg.append('svg:defs');
                        defs.append('svg:pattern')
                          .attr('id', 'pattern_'+pattern)
                          .attr('patternUnits', 'userSpaceOnUse')
                          .attr('width', 20)
                          .attr('height', 20)
                          .append('svg:image')
                          .attr('xlink:href', pattern)
                          .attr('x', 0)
                          .attr('y', 0)
                          .attr('width', 20)
                          .attr('height', 20);

                        areaColor.push('url(#pattern_'+pattern+')');
                      });           
                    }

                    svg.attr('width', this.width).attr('height', this.height);

                    if (data && data.length > 0){

                        var layers = stack(data);
                        var self = this;

                        svg.selectAll('.layer')
                          .data(layers)
                          .enter().append('svg:path')
                          .attr('class', function(d, i){
                              'layer'+attrib.cssClass[i];
                          })
                          .attr('d', function(d) { return area(d.values); })
                          .style('fill', function(d, i){
                              return areaColor[i];
                          })
                          .style('fill-opacity', attrib.fillOpacity);
                        
                        svg.selectAll('.line')
                          .data(layers)
                          .enter().append('svg:path')
                          .attr('d', function(d) { return line(d.values); })
                          .style('stroke', function(d, i){
                            return attrib.colorLine[i];
                          })
                          .attr('class', function(d){
                            return 'line '+d.key;
                          });
                        
                        if (attrib.tooltip) {

                            $.each(data, function(i, val){

                                var hoverCircle = null;

                                hoverCircle = svg.selectAll('.hoverCircle '+val.key)
                                    .data(val.values);

                                hoverCircle.enter().append('circle')
                                    .attr('r', 6)
                                    .attr('opacity', 0)
                                    .attr('class', 'hoverCircle '+val.key)
                                    .on('mouseover', function(d) {
                                        d3.select(this).attr('opacity', 1);
                                        self.showTooltip(this, d);
                                    })
                                    .on('mouseout', function(d) {
                                        d3.select(this).attr('opacity', 0);
                                        self.hideTooltip();
                                    })
                                    .attr('transform', function (d, i){
                                        return 'translate('+x(d.date)+','+y(d.y0 + d.value)+')';
                                    });

                                hoverCircle.exit().remove();
                     
                            });  
                        }  
                    }
                };

                this.on('resize', function(e, chartSize) {
                    e.stopPropagation();

                    this.width = chartSize.width;
                    this.height = chartSize.height;
                    x.range([0, this.width]);
                    y.range([this.height, 0]);
                    this.updateChart();
                });

                this.on('valueChange', function(e, options) {
                    e.stopPropagation();

                    var valueField = this.attr.model;
                    data = [];

                    $.each(this.attr.subModels, function (i, submodel){
                      var values = $.map(options.value[valueField+submodel], function(val, i) {
                          if (val.date >= options.range[0] &&
                              val.date <= options.range[1]) {
                              return val;
                          }
                    });

                      data.push({key: valueField+submodel, values: values});
                    });
                    
                    x.domain(options.range);
                    y.domain(options.valueRange);

                    this.options = options;

                    this.updateChart();
                    
                });

                this.on('actionSelected', function(e, value){
                    e.stopPropagation();

                    if (value.newModel){
                        this.attr.model = value.newModel;
                    }
                    this.attr.tooltip.caption = value.caption;
                    this.trigger('valueChange', this.options);
                });

                this.showTooltip = function(circle, d) {
                    var pos = $(circle).offset();
                    
                    if (!this.attr.tooltip.caption) this.attr.tooltip.caption = '';

                    this.tooltip.html('<div class"value">'+d.value+'</div><div class="caption">'+this.attr.tooltip.caption+'</div>');
                    this.tooltip.css({
                        top: pos.top,
                        left: pos.left + $(circle).width() / 2
                    });
                    this.tooltip.show();
                    $('.chart rect.bar:first').trigger('mouseenter');
                };

                this.hideTooltip = function() {
                    this.tooltip.hide();
                };
            });
        }
    }
);
