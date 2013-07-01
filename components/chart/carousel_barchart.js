define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('carouselBarchart',
            CarouselBarChart);

        function CarouselBarChart() {

            this.defaultAttrs({
                chartConf :{
                    maxHeight: 75, width: 60, barPadding: 5
                }
                //,data: [ { name:'+', value: 72 }, {name:'-', value: 46 } ]
            });

            this.after('initialize', function() {

                var _chartConf = this.attr.chartConf;
                var _data = this.attr.data || [];
                var svg = d3.select(this.node)
                .append('svg')
                .attr('width', _chartConf.width*_data.length + _chartConf.barPadding*(_data.length))
                .attr('height', _chartConf.maxHeight);

                svg.attr('class', 'carousel-barchart');

                this.updateChart = function(){
                    svg.attr('width', _chartConf.width*_data.length + _chartConf.barPadding*(_data.length));

                    svg.selectAll('rect')
                    .data(_data).enter().append('rect')
                    .attr('x', function(d, i) {
                        return i * (_chartConf.width + _chartConf.barPadding);
                    })
                    .attr('y', function(d) {
                        return _chartConf.maxHeight - d.value*_chartConf.maxHeight/100;
                    })
                    .attr('width', _chartConf.width)
                    .attr('height', function(d) {
                        return parseInt(d.value)*_chartConf.maxHeight/100;
                    })
                    .attr('class', function(d, i){
                        return ( i%2 === 0 )? 'color2' : 'color1';
                    });

                    svg.selectAll('text').data(_data)
                    .enter().append('text')
                    .text(function(d) {
                        return d.name;
                    })
                    .attr('x', function(obj, i) {
                        return i * (_chartConf.width+_chartConf.barPadding)+ _chartConf.width/2;
                    })
                    .attr('y', function(obj) {
                        return (_chartConf.maxHeight-_chartConf.barPadding-2);
                    });

                };


                this.on('valueChange', function(e, options) {
                    _data = options.values;
                    this.updateChart();
                    e.stopPropagation();
                });

            });
        }
    }
);
