define (
[
    'components/component_manager',
    'libs/raphael/raphael'
],
                                
function (ComponentManager) {
    
    return ComponentManager.create('temperatureWidget', TemperatureWidget);
                                                        
    function TemperatureWidget () {
        
        this.defaultAttrs({
            detailsTitle: '.details-title',
            temperatureChart: '.temperature-chart',
            temperatureLabel: '.temperature-label',
            fillColor: '#6F8388',
            borderColor: '#6F8388',
            baseColor: '#E9EFF0',
            id: 'temperature-widget',
            tmin: 0,
            tmax: 20,
            temp: 15.6
        });
                                                                                        
        this.after('initialize', function () {
            this.$node.attr('id', this.attr.id);
            
            //this.$nodeMap = $('<div>').addClass('temperature-label').appendTo(this.$node);

            //var obj = this.createTemperatureChart();
            this.on('drawTemperature', function (event, temp) {
                console.log('Drawing temperature widget');
                if (temp != null) this.attr.temp = temp;
                this.$node.empty();
                this.$nodeMap = $('<div>').addClass('temperature-label').appendTo(this.$node);
                this.attr.widget = this.createTemperatureChart(); 
                this.drawTemperature(this.attr.widget, this.attr.temp);
                $(this.attr.temperatureLabel).html(this.attr.temp + 'ºC');
            });
        });

        // ==========================
        // [UPDATE] Temperature Chart
        // ==========================
        this.drawTemperature = function(temperatureChart,temperature) {
            var temp;
            //var tmin = 0;
            //var tmax = 20;
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
            tamano = temp*(tmax-1)/(tmax-tmin);

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
              thermoBar = paper.rect(22,55, 4, 0),
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
        }
    }
});

