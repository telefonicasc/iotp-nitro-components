define(
    [
        'components/component_manager',
        'components/chart/mixin/tooltip'
    ],

    function(ComponentManager, Tooltip) {

        return ComponentManager.create('areaStackedChart',
            AreaStackedChart, Tooltip);

        function AreaStackedChart() {

            this.defaultAttrs({
                colorArea: ['#ff0000'],
                colorLine: ['#00ff00'],
                fillOpacity: 0.85,
                subModelsSufix: [],
                autoscale: false,
                tooltip: true,
                tooltip2: false,
            });

            this.after('initialize', function() {

                var x = d3.time.scale().range([0, this.width]),
                    y = d3.scale.linear().range([this.height, 0]),
                    data = this.$node.data('value') || [],
                    context = d3.select(this.node);
                var svg = context.append('g');
                var axisY = context.append('g').attr('class', 'axis y');
                var yAxis = d3.svg.axis().scale(y).orient('right');
    
                context.attr('class', 'chart stacked');

                this.maxRangeValue = 0;
                this.initialized = null;

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


                var areaColor = this.attr.colorArea;
                var self = this;
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

                var hLine = d3.select(this.node).append('line')
                .attr('class', 'maxLine').attr('x1', 0)
                .attr('stroke', '#ffffff')
                .attr('stroke-width', 2);

                var vLine = d3.select(this.node).append('line')
                .attr('class', 'maxLine').attr('y1', 0)
                .attr('stroke', '#ffffff')
                .attr('stroke-width', 2);

                if (this.attr.tooltip2){
                   this.tooltip2 = $('<div>').addClass('tooltip').addClass('tooltip-2')
                        .appendTo($('body'));
                }
                

                this.createChart = function(){

                  var attrib = this.attr; 
                  var self = this;       
                  if (data && data.length > 0){

                      var layers = stack(data);

                      svg.selectAll('.layer').remove();
                      var l1 = svg.selectAll('.layer').data(layers);
                      l1.enter().append('svg:path')
                      .attr('class', function(d, i){
                          return 'layer '+attrib.cssClass[i];
                      })
                      .style('fill', function(d, i){
                          return areaColor[i];
                      })
                      .style('fill-opacity', attrib.fillOpacity)
                      .attr('d', function(d) { return area(d.values); });


                      svg.selectAll('.line').remove();
                      var l2 = svg.selectAll('.line').data(layers);
                      l2.enter().append('svg:path')
                      .attr('class', function(d){
                        return 'line '+d.key;
                      })
                      .style('stroke', function(d, i){
                        return attrib.colorLine[i];
                      })
                      .attr('d', function(d) { return line(d.values); });
                  }     
                };

                this.updateChart = function() {

                    var attrib = this.attr;
                    svg.attr('width', this.width).attr('height', this.height);
                    axisY.attr('transform', 'translate('+this.width+', 0)');
                    var self = this;
                    if (data && data.length > 0){

                        var layers = stack(data);
                        
                        var areas = svg.selectAll('.layer').data(layers);
                        var lines = svg.selectAll('.line').data(layers);

                        if (this.anim){
                            lines.transition().ease('linear').duration(200).attr('d', function(d) { return line(d.values); });
                            areas.transition().ease('linear').duration(200).attr('d', function(d) { return area(d.values); }); 
                            axisY.transition().ease('linear').duration(200).call(yAxis);  
                        }else{
                            lines.attr('d', function(d) { return line(d.values); });
                            areas.attr('d', function(d) { return area(d.values); }); 
                        }

                        if (this.attr.tooltip) {
                            svg.selectAll('.hoverCircle').remove();
                            this.setTooltip(); 
                        }  
                    }
                };

                this.setTooltip = function(){
                    
                    var val = data[data.length-1];
                    svg.selectAll('.hoverCircle '+val.key).remove();
                    var hoverCircle = null;
                    hoverCircle = svg.selectAll('.hoverCircle '+val.key)
                        .data(val.values);
                    hoverCircle.enter().append('circle')
                        .attr('r', 6)
                        .attr('opacity', 0)
                        .attr('class', function(d){
                          return 'hoverCircle '+val.key;
                        })
                        .attr('transform', function (d, i){
                            return 'translate('+x(d.date)+','+y(d.y0 + d.value)+')';
                        })
                        .on('mouseover', function(d) {
                            self.showTooltip(this, d);
                        });
                       
                    hoverCircle.exit().remove();
                     
                };

                this.on('resize', function(e, chartSize) {
                    e.stopPropagation();
                    
                    if (e.target === this.node){
                        this.width = chartSize.width;
                        this.height = chartSize.height;
                        x.range([0, this.width]);
                        y.range([this.height, 0]);
                        this.updateChart();
                    }
                   
                });

                this.on('valueChange', function(e, options) {
                    e.stopPropagation();

                    var valueField = this.attr.model;
                    data = [];
                    var maxValue = 0;
                    $.each(this.attr.subModelsSufix, function (i, submodel){
                        var values = $.map(options.value[valueField+submodel], function(val, i) {
                            if (val.date >= options.range[0] &&
                                val.date <= options.range[1]) {
                                if ((val.value+val.y0) > maxValue) {
                                  maxValue = (val.value+val.y0);
                                }
                                return val;
                            }
                        });

                        data.push({key: valueField+submodel, values: values});
                    });

                    this.anim = false;
                    var valueRange = options.valueRange;
                    if (this.attr.autoscale){
                        if (this.maxRangeValue !== maxValue){
                          this.maxRangeValue = maxValue;
                          this.anim = true;
                        }
                        valueRange = [0, this.maxRangeValue*1.15];
                    };
                    
                    x.domain(options.range);
                    y.domain(valueRange);

                    this.options = options;

                    if (!this.initialized){
                        this.initialized = true;
                        this.createChart();
                    }else{
                        this.updateChart();
                    }       
                });

                this.on('actionSelected', function(e, value){
                    e.stopPropagation();
                    if (value.newModel){
                        this.attr.model = value.newModel;
                    }
                    this.attr.tooltip.caption = value.caption;
                    this.trigger('valueChange', this.options);
                });

                this.showTooltip = function(elem, d) {

                    if (!this.attr.tooltip.caption) this.attr.tooltip.caption = '';  
                    
                    d3.select(elem).attr('opacity', 1);
                    var offset = $(elem).width() / 2;
                    var hide = function(){
                        d3.select(elem).attr('opacity', 0);
                        hLine.attr('x1',0).attr('x2',0).attr('y1',0).attr('y2', 0);
                        vLine.attr('x1',0).attr('x2',0).attr('y1',0).attr('y2', 0);
                    };
                    var html = '<div class"value">'+(d.value+d.y0)
                              +'</div><div class="caption">'+this.attr.tooltip.caption+'</div>'; 
                    var triggerObj = {'html': html, 'elem': elem, 'offset': offset, 'fnHide':  hide, 'value': d};
                    this.trigger('showTooltip', triggerObj);

                    //Show lines
                    hLine.attr('x2', this.width)
                    .attr('y1', y(d.y0 + d.value))
                    .attr('y2', y(d.y0 + d.value));

                    vLine.attr('y2', this.height)
                    .attr('y1', y(d.y0 + d.value))
                    .attr('x1', x(d.date))
                    .attr('x2', x(d.date));

                    if (this.attr.tooltip2){

                        //Show tooltip percetanges
                        var total = d.value+d.y0;
                        var v1 = (total>0)? Math.round(d.value/total*100*100)/100 : 0;
                        var v2 = (total>0)? Math.round(d.y0/total*100*100)/100 : 0;
                        var pos = $(elem).offset();
                        var html2 = '<div class"value">'+v1+'% Time</div>'
                                    +'<br /><div class"value">'+v2+'% Data</div>'; 
                        var css = { top: pos.top+90, left: pos.left };
                        this.tooltip2.html(html2);
                        this.tooltip2.css(css);
                        this.tooltip2.show();
                    }

                };
            });
        }
    }
);
