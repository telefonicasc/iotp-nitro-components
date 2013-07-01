define (
[
    'components/component_manager',
    'components/mixin/data_binding',
    'libs/raphael/raphael'
],
                                
function (ComponentManager, DataBinding) {
    
    return ComponentManager.create('temperatureWidget', TemperatureWidget, DataBinding);
                                                        
    function TemperatureWidget () {
        
        this.defaultAttrs({
            detailsTitle: '.details-title',
            temperatureChart: '.temperature-chart',
            temperatureLabel: '.temperature-label',
            fillColor: '#6F8388',
            borderColor: '#6F8388',
            baseColor: '#DDEAEC',
            id: 'temperature-widget',
            tmin: 0,
            tmax: 30,
            temp: 0.0
        });
                                                                                        
        this.after('initialize', function () {
            this.$node.attr('id', this.attr.id);
            this.$node.addClass('temperature-widget');
            this.$nodeMap = $('<div>').addClass('temperature-label').appendTo(this.$node);

            this.on('render', function () {
                this.attr.widget = this.createTemperatureChart(); 
            });
            
            this.on('drawTemperature', function (event, temp) {
                if (temp !== undefined && temp !== null) {
                    this.attr.temp = temp;
                    this.drawTemperature(this.attr.widget, this.attr.temp);
                    this.select('temperatureLabel').html(this.attr.temp + 'ºC');
                }
                else {
                    this.attr.temp = 0;
                    this.drawTemperature(this.attr.widget, 0);
                    this.select('temperatureLabel').html('-');
                }
            });

            this.on('valueChange', function(e,o) {

                var value = o.value;
                if (value !== undefined && typeof value === 'number') {
                    this.trigger('drawTemperature', value);
                }
                else {
                    this.trigger('drawTemperature', null);
                }
            });
        });

        // ==========================
        // [UPDATE] Temperature Chart
        // ==========================
        this.drawTemperature = function(temperatureChart,temperature) {
            var temp;
            var tmin = this.attr.tmin;
            var tmax = this.attr.tmax;
            var tempCelsius = parseFloat(temperature);
            if(tempCelsius < tmin){
              temp = tmin;
            }
            else if (tempCelsius > tmax){
              temp = tmax;
            }
            else{
              temp = tempCelsius;
            }
            tamano = (((temp - tmin) / (tmax - tmin)) + 0.5) * 12;
            temperatureChart.thermoBar.animate({
              height: tamano,
              y: 42 - tamano
            }, 300);

            temperatureChart.thermoBar.show();
            temperatureChart.thermoBorder.show();
            temperatureChart.thermoCircle.show();
        };
  
        // ==========================
        // [CREATE] Temperature Chart 
        // ==========================    
        this.createTemperatureChart = function(options) {
            var paper = Raphael(this.attr.id,100,60)
              , thermoBar; 

            options = $.extend({
              thermoColor: this.attr.fillColor, 
              thermoLines: this.attr.borderColor
            }, options);
            
            var thermoBorder = paper.set();
            thermoBorder.push(
              thermoBarBorder = paper.rect(20,21,8,22.5,4),
              thermoCircleBorder = paper.circle(24,45,6,13), 
              cover = paper.rect(20.2,40.8,7.5,8)
            );
            thermoBorder.attr({
              stroke: this.attr.borderColor,
              fill: this.attr.baseColor
            });
            cover.attr({
              'stroke-width':0
            });

            var mercury = paper.set();
            mercury.push(
              thermoBar =  paper.rect(22,48, 4, 0),
              thermoCircle = paper.circle(24,45,4)
            );

            mercury.attr({
              fill: options.thermoColor,
              stroke: options.thermoBar
            });
         
            thermoCircleBorder.toBack();
            thermoBar.toFront();

            mercury.hide();
            thermoBorder.hide();
            return {
              paper: paper,
              thermoBar: thermoBar,
              thermoCircle: thermoCircle,
              thermoBorder: thermoBorder
            };
        };
    }
});

