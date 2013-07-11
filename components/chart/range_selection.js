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
            fixRange: -1,
            x: d3.time.scale().range([0, 0]),
            y: d3.scale.linear().range([0, 0]),
            jump: false
        });

        this.after('initialize', function() {
            var x = this.attr.x,
                y = this.attr.y,
                start = null,
                end = null,
                context = d3.select(this.node);
                
            this.brush = d3.svg.brush()
              .x(this.attr.x)
              .on('brush', $.proxy(function() {
                      
                  start = this.brush.extent()[0];
                  end = this.brush.extent()[1];
                  this.brushing('brush');     

              }, this))
              .on('brushstart', $.proxy(function() {

                  this.value['brush'] = 'start';

              }, this))
              .on('brushend', $.proxy(function(){

                  this.brushing('end');     
                  
              }, this));

            if (this.attr.x && this.attr.y){
                context
                  .call(this.brush)
                  .selectAll('rect')
                    .attr('y', 0)
                    .attr('height', function() { y.range()[0]; });

                context.selectAll('.resize rect')
                    .style('visibility', 'inherit');
            }  

            this.updateExtent = function(extent) {
                this.brush.extent(extent);
                var start = this.attr.x(extent[0]),
                    end = this.attr.x(extent[1]);

                context.select('.w').transition().attr('transform', 'translate(' + start + ',0)')
                .style('display', 'block');
                context.select('.e').transition().attr('transform', 'translate(' + end + ',0)')
                .style('display', 'block');
                context.select('.extent').transition().attr('x', start)
                .attr('width', end - start);

            };

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

            this.on('rangeSelected', function(e, item){
                this.attr.fixRange = item.fixRange;
              
                var ext = this.brush.extent();
                                
                if (this.attr.fixRange > 0){
                    ext = this.setExtend(null, ext);
                    this.value[this.attr.selectedRangeField] = ext;
                    this.value['fixRange'] = item.fixRange;
                    this.updateExtent(ext);
                }
                this.value['brush'] = null;
                this.trigger('valueChange', { value: this.value });
                e.stopPropagation();
            });

            this.brushing = function(state){
                
                var ext = [d3.time.day.round(start), d3.time.day.round(end)];
                this.value['brush'] = state;
                
                ext = this.setExtend(state, ext);

                this.updateExtent(ext);
                this.value[this.attr.selectedRangeField] = ext;
                this.trigger('valueChange', { value: this.value });
            };

            this.setExtend = function(state, ext){
                if (!state || (state === 'end' && this.attr.jump)){
                    var offset = (ext[0].getTimezoneOffset() !== 0)? 1 : 0 ;
                    var dayOfMonth = ext[0].getUTCDate();
                    var month = ext[0].getMonth();
                    var dayOfWeek = ext[0].getUTCDay();
                    if (this.attr.fixRange == 35){ //Month
                        if (dayOfMonth > 15){
                            ext[0].setMonth(month+1);
                        }  
                        ext[0].setUTCDate(1-offset);
                    }else if (this.attr.fixRange == 7){
                        if (dayOfWeek<=3){
                            ext[0].setDate(ext[0].getDate() - (dayOfWeek-1) - offset);
                        }else{
                            ext[0].setDate(ext[0].getDate() + (7+1-dayOfWeek) - offset);
                        }      
                    }
                }

                if (this.attr.fixRange > 0){
                    var days = 7;
                    if (this.attr.fixRange === 35){
                        days = daysInMonth(ext[0]); 
                    } 
                    ext = getFixExtent(ext, days);
                }

                return ext;
            };

        });

        function getFixExtent(currentExtent, range){
            var endDate = new Date( d3.time.day.round(currentExtent[0]).getTime() + (range)*24*60*60*1000 );
            var ext = [d3.time.day.round(currentExtent[0]), endDate];
            return ext;
        }

        function daysInMonth(date){
            var d = new Date(date.getFullYear(), date.getMonth()+1, 0);
            return d.getDate();
        }

    }
});
