define (
[
    'components/component_manager',
    'libs/raphael/raphael'
],
                                
function (ComponentManager) {
    
    return ComponentManager.create('lightsWidget', LightsWidget);
                                                        
    function LightsWidget () {
        
        this.defaultAttrs({
            lightsChart: '.lights-chart',
            lightsLabel: '.lights-label',
            fillColor: '#6F8388',
            borderColor: '#6F8388',
            baseColor: '#E9EFF0',
            id: 'lights-widget',
            useKermit: false,
            arrowURL: 'url(res/images/arrow.png)',
            greyLightURL: 'url(res/images/greyLight.png)',
            imageBaseURL: 'url(res/images/'
        });
                                                                                        
        this.after('initialize', function () {
            this.$node.attr('id', this.attr.id);
            
            this.$nodeMap = $('<div>').addClass('lights-label').appendTo(this.$node);

            this.on('drawLights', function () {
                this.attr.lightsChartWidget = this.createLightsChart(); 
                //this.drawLights(this.attr.widget, this.attr.angle);
                $(this.attr.lightsLabel).html(
                    "On (30 seconds) &nbsp &nbsp &nbsp&nbspError&nbsp &nbsp  "
                );
            });
            
            /* To use in local mode */
            this.on('updateLights', function (event, data) {
                this.drawLights(data);
            });
            
            /* To use with kermit */
            this.on('paintLights', function (event, red, yellow, green) {
                this.requestDataCallback(red,yellow,green);
            });
        });
        
        this.formatData = function (lightArray) {
            var array = [];
            for(var i= 0; i < lightArray.data.length; i++) {
              var count = 1;
              var init = lightArray.data[i+count];
              var next = lightArray.data[i+count+1];
              while (next && init.ms.v == next.ms.v) {
                  count++;
                  init = next;
                  next = lightArray.data[i+count+1];
              }
              if (init && init.ms.v != "off") {
                  var fin = new Date(lightArray.data[i].st);
                  var ini = new Date(init.st);
                  var segProp = init.ms.v == "error" ? 150: (fin.getTime() - ini.getTime())/1000;
                  var error = init.ms.v == "error" ? "-error": "";
                  array.push({'timestamp': ini, 'type':lightArray.data[i].ms.p + error, 'value': segProp});
              }
              i = i + count - 1;
            }
            return array;
        };
        
        this.requestDataCallback = function(redLight, yellowLight, greenLight) {

            var result = this.formatData(greenLight);
            result = result.concat(this.formatData(redLight));
            result = result.concat(this.formatData(yellowLight));
            result.sort(function(a, b) {
                if (a.timestamp < b.timestamp)
                    return -1;
                if (a.timestamp > b.timestamp)
                    return 1;
                return 0;
            });

            if (result.length > 20) {
                result = result.slice(result.length - 20);
                this.attr.lightsChartWidget.arrow.animate({
                    x: 14 * (result.length - 1)
                }, 300);
            }

            for (var i = 0; i < 20; i++) {
                var value = 70;
                var style = {
                    fill: this.attr.greyLightURL
                };

                if (result[i] != null) {
                    if (result[i].value < 150) {
                        value = result[i].value * 70 / 150; //150 is the 100%
                        value = Math.ceil(value / 14) * 14; //Adjust to icon size
                    }

                    style = {
                        fill: this.attr.imageBaseURL + result[i].type + '.png)'
                    };
                }

                this.attr.lightsChartWidget.bars[i].attr({
                    height: value,
                    y: 70 - value
                });

                this.attr.lightsChartWidget.bars[i].attr(style);
            }
            this.updating = false;
        };
        
        this.requestApiData = function (url, callback, useKermit) {
            if (useKermit) {
                API.http.request({method:'GET', url:url})
                    .success(function (data,status,headers,config) {
                        callback(data);
                    })
                    .error(function (data,status,headers,config) {
                        console.error("Can't access to API REST.");
                    });
            }
            else {
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'json',
                    success: function(response) {
                        callback(response);
                    },
                    error: function (request, errorText, errorThrown) {
                        console.log('error: ' + errorThrown);
                    }
                });
            }
        };
        
        
        
        this.drawLights = function (urls) {
            // Get lights data
            var self = this;
            var data = [];
            var fn = function (response) {
                data.push(response);
                if (data.length === 3) self.requestDataCallback(data[0],data[1],data[2]);
            };
            
            $.each(urls, function (k,v) {
                self.requestApiData(v,fn,self.attr.useKermit);
            });
            
        };

        this.createLightsChart = function(options) {
            var paper = Raphael(this.attr.id, 300, 120),
            bars = []; 
            var arrow = paper.rect(-50, 75, 12, 10);
            arrow.attr({
                'stroke-width': 0,
                fill: this.attr.arrowURL
            });
            
            var style = {
                'stroke-width': 0,
                fill: this.attr.greyLightURL
            };
            
            for (var i=0; i<20; i++) {
                var bar = paper.rect(14*i, 0, 14, 70);
                bar.attr(style);
                bars[i] = bar;
            }
            var on = paper.circle(6,84,5);
            var error = paper.circle(118,84,5);
            on.attr({fill: this.attr.fillColor, stroke: this.attr.borderColor});
            error.attr({stroke: this.attr.borderColor, "stroke-width":1,'fill-opacity':0});
         
            return {
                paper: paper,
                bars: bars,
                arrow: arrow
            };
        };
        

    } // </LightsWidget>
});

