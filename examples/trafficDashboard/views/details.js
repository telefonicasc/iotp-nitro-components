DV.Traffic = DV.Traffic || {};
DV.Traffic.Views = DV.Traffic.Views || {};

DV.Traffic.Views.Details = Backbone.Marionette.ItemView.extend({

  template: DV.Traffic.Templates.details,

  className: 'sidebaritem',

  ui: {
  	detailsTitle: '.details-title',
    temperatureChart: '.temperature-chart',
    temperatureLabel: '.temperature-label',
    pitchChart: '.pitch-chart',
    pitchLabel: '.pitch-label'
  }, 
  fillColor: '#6F8388',
  borderColor: '#6F8388',
  baseColor: '#E9EFF0',

  events: {
   
  },

  initialize: function() {
    this.bindTo(DV.Traffic.Collections.trafficLights, "change:selected", this.updateChart, this);
  },

  onRender: function() {
  	this.ui.detailsTitle.html(__('TrafficDashboard.detailsTitle'));
    this.temperatureChart = this.createTemperatureChart(); 
    this.pitchChart = this.createPitchChart();
  },

  updateChart: function(model) {
    var temperature = model.getSensorValue('temperature') || 0;
    var angle = model.getSensorValue('pitch') ;

    if (model.get('selected')) {
      this.ui.temperatureLabel.html(temperature + 'ºC');
      this.ui.pitchLabel.html(angle+'º');
      this.drawTemperature(this.temperatureChart,temperature)
      this.drawPitch(this.pitchChart,angle);

    }
  },

  drawPitch: function(pitchChart, angle) {
    xmin = 15.5;
    ymax = 52.5;
    r = 27; 

    if (angle > 90){
      angle = abs(angleSmph-180);
    }
    if (angle < 10)
      angle = 10;
    
    angleSmph = -angle + 90;

    x1 = xmin + r * Math.cos(-0 * Math.PI / 180),
    x2 = xmin + r * Math.cos(-angle * Math.PI / 180),
    y1 = ymax + r * Math.sin(-0 * Math.PI / 180),
    y2 = ymax + r * Math.sin(-angle * Math.PI / 180);

    pitchChart.greenLight.animate({
      transform: "r" + angleSmph +","+xmin + ","+ ymax
    },500);
    pitchChart.yellowLight.animateWith(pitchChart.smph,null,{
      transform: "r" + angleSmph +","+xmin + ","+ ymax

    },500);
    pitchChart.redLight.animateWith(pitchChart.smph,null,{
      transform: "r" + angleSmph +","+xmin + ","+ ymax
    },500);
    pitchChart.arm.animateWith(pitchChart.smph,null,{
      transform: "r"+ angleSmph +","+xmin + ","+ ymax
    },500);
    pitchChart.smph.animateWith(pitchChart.smph,null,{
      transform: "r"+angleSmph+","+xmin + ","+ ymax
    },500);
    pitchChart.fill.animateWith(pitchChart.smph,null,{
      transform: "r"+angleSmph+","+xmin + ","+ ymax
    },500);
    pitchChart.coverLine.animateWith(pitchChart.smph,null,{
      transform: "r"+angleSmph+","+xmin + ","+ ymax
    },500);
    pitchChart.line.animateWith(pitchChart.smph,null,{
      path: ["M", x1, y1, "A", r, r, 0, 0, 0, x2, y2],
      stroke: this.borderColor
    },500);
    
    //Show elements
    pitchChart.smph.show();
    pitchChart.base.show();
    pitchChart.arm.show();
    pitchChart.redLight.show();
    pitchChart.yellowLight.show();
    pitchChart.greenLight.show();
    this.pitchChart.line.show();
  },

  obtainLine: function(cx, cy, r, startAngle, endAngle, paper){
    x1 = cx + r * Math.cos(-startAngle * Math.PI / 180),
    x2 = cx + r * Math.cos(-endAngle * Math.PI / 180),
    y1 = cy + r * Math.sin(-startAngle * Math.PI / 180),
    y2 = cy + r * Math.sin(-endAngle * Math.PI / 180);
    x =paper.path(["M", x1, y1, "A", r, r, 0, 0, 0, x2, y2]).attr({stroke: this.borderColor});//, 'stroke-miterlimit': "decimal"});
    return x;
  },

  drawTemperature: function(temperatureChart,temperature){
    var temp;
    var tmin = 0;
    var tmax = 20;
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
  },

  createTemperatureChart: function(options) {
    var paper = Raphael(this.ui.temperatureChart.get(0),100,60)
      , thermoBar; 

    options = $.extend({
      thermoColor: this.fillColor, 
      thermoLines: this.borderColor
    }, options);
    
    var thermoBorder = paper.set();
    thermoBorder.push(
      thermoBarBorder = paper.rect(20,21,8,22.5,4),
      thermoCircleBorder = paper.circle(24,45,6,13), 
      cover = paper.rect(20.2,40.8,7.5,8)
    );
    thermoBorder.attr({
      stroke: this.borderColor,
      fill: this.baseColor

    });
    cover.attr({
      'stroke-width':0
    })

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
  },


  createPitchChart: function() {
     var paper = Raphael(this.ui.pitchChart.get(0), 100, 60)
      , arm; 

    arm = paper.rect(11.5,37, 4, 15.5);
    smph = paper.rect(8,10,11,27,3);
    redLight = paper.circle(13.6,16, 2.25);
    yellowLight =paper.circle(13.6,23.5, 2.25);
    greenLight = paper.circle(13.6,31, 2.25);
    base = paper.rect(18,52,21.5,1);
    line = this.obtainLine(16, 52, 29, 0 , 90, paper);
    fill = paper.rect(12.5,35,2, 3);
    coverLine = paper.rect(16,23.5,5,4);

    base.attr({stroke: this.borderColor, "stroke-width":0,'fill-opacity':0});
    arm.attr({stroke: this.borderColor,'fill-opacity':0});
    smph.attr({stroke: this.borderColor,'fill-opacity':0}); 
    redLight.attr({fill: this.fillColor,stroke: this.fillColor});
    yellowLight.attr({fill: this.fillColor,stroke: this.fillColor});
    greenLight.attr({fill: this.fillColor,stroke: this.fillColor});
    fill.attr({fill: this.baseColor, stroke: this.baseColor});
    coverLine.attr({fill: this.baseColor, stroke: this.baseColor});

    coverLine.toBack();

    redLight.toFront();
    yellowLight.toFront();
    greenLight.toFront();
    line.toBack();
    base.toBack();
     arm.toBack();

    greenLight.hide();
    arm.hide();
    yellowLight.hide();
    redLight.hide();
    smph.hide();
    base.hide();
    line.hide();

    return {
      base: base,
      redLight: redLight,
      yellowLight: yellowLight,
      greenLight: greenLight,
      smph: smph,
      paper: paper,
      arm: arm,
      line:line,
      fill: fill,
      coverLine: coverLine
    };
  }
});
