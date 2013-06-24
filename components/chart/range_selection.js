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
            y: d3.scale.linear().range([0, 0])
        });

        this.after('initialize', function() {
            var previousExtend = null;
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

                  var ext = [start, end];
                  if (this.attr.fixRange > 0){
                      ext = getFixExtent(this.brush.extent(), this.attr.fixRange);
                  }
                  this.updateExtent(ext);
                  this.value[this.attr.selectedRangeField] = ext;
                  this.value['brush'] = 'brush';
                  previousExtend = ext;
                  this.trigger('valueChange', { value: this.value });                       
                    
              }, this))
              .on('brushstart', $.proxy(function() {
                  this.value['brush'] = 'start';
              }, this))
              .on('brushend', $.proxy(function(){
                  ext = getFixExtent(this.brush.extent(), this.attr.fixRange);
                  this.updateExtent(ext);
                  this.value[this.attr.selectedRangeField] = [start, end];
                  this.value['brush'] = 'end';
                  this.trigger('valueChange', { value: this.value });
              }, this));

            if (this.attr.x && this.attr.y){
                context
                  .call(this.brush)
                  .selectAll('rect')
                    .attr('y', 0)
                    .attr('height', function() { y.range()[0]; });

                context.selectAll('.resize rect')
                    .attr('width', 10)
                    .attr('rx', 4)
                    .attr('ry', 4)
                    .style('visibility', 'inherit');
            }  

            this.updateExtent = function(extent) {
                this.brush.extent(extent);
                var start = this.attr.x(extent[0]),
                    end = this.attr.x(extent[1]);

                context.select('.w').attr('transform', 'translate(' + start + ',0)').style('display', 'block');
                context.select('.e').attr('transform', 'translate(' + end + ',0)').style('display', 'block');
                context.select('.extent').attr('x', start).attr('width', end - start);

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

                if (this.attr.fixRange > 0){
                    var ext = getFixExtent(this.brush.extent(), this.attr.fixRange);
                    this.value[this.attr.selectedRangeField] = ext;
                    this.value['fixRange'] = item.fixRange;
                    this.updateExtent(ext);
                }

                this.trigger('valueChange', { value: this.value });
                e.stopPropagation();
            });
        });

        function getFixExtent(currentExtent, range){
            var endDate = new Date( d3.time.day.round(currentExtent[0]).getTime() + (range)*24*60*60*1000 );
            var ext = [d3.time.day.round(currentExtent[0]), endDate];
            return ext;
        }

    }
});
