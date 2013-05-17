DV.Traffic = DV.Traffic || {};
DV.Traffic.Views = DV.Traffic.Views || {};

DV.Traffic.Views.BatteryLevel = Backbone.Marionette.ItemView.extend({

  template: DV.Traffic.Templates.batteryLevel,

  className: 'sidebaritem',

  ui: {
	batteryChart: '.battery-chart',
   	batteryGraph: '.battery-graph', 
   	batteryLabel: '.battery-label',
   	batteryTitle: '.battery-title'
  }, 

  fillColor: '#6F8388',
  borderColor: '#6F8388',
  baseColor: '#E9EFF0',

  events: {

  },
  
  initialize: function() {
  	
  	Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
	    color = color || "#000";
	    var path;
	        rowHeight = h / hv,
	        columnWidth = w / wv;

      /*path = ["M", Math.round(x) + 0.5, Math.round(y) + 0.5, "H", Math.round(x + w) + 0.5],
	   	    for (var i = 1; i < hv; i++) {
	        path = path.concat(["M", Math.round(x) + 0.5, Math.round(y + i * rowHeight) + 0.5, "H", Math.round(x + w) + 0.5]);
	    }*/
      path = ["M", Math.round(x) + 0.5, Math.round(y + h) + 0.5 , "H", Math.round(x + w) + 0.5];
	    path = path.concat(["M",Math.round(x) + 4*columnWidth, Math.round(y) + 0.5,"V",y + 2*rowHeight]);
	    
	    return this.path(path.join(",")).attr({stroke: color});
	  };
	
	  Raphael.fn.drawYLabels = function (x, y, w, h, hv, maxY, tag, style) {
	    var ylabels = [];
	    ylabels.push(this.text(Math.round(x + w) + 25, Math.round(y) + 0.5, maxY + tag).attr(style));
	    ylabels.push(this.text(Math.round(x + w) + 25, Math.round(y + h) + 0.5, 0 + tag).attr(style));
	    
	    var rowHeight = h / hv;
	    
	    for (var i = 1; i < hv; i++) {
	    	ylabels.push(this.text(Math.round(x + w) + 25, Math.round(y + i * rowHeight) + 0.5, Math.round(maxY/hv) * (hv - i) + tag).attr(style));
	    }
	    return ylabels;
	  };
	
	  Raphael.fn.drawXLabels = function (x, y, w, h, wv, labels, tag, style) {
	    var xlabels = [];
	    xlabels.push(this.text(Math.round(x) + 15, Math.round(y + h) + 25, labels[0] + tag).attr(style));
	    xlabels.push(this.text(Math.round(x + w) - 10, Math.round(y + h) + 25, labels[labels.length -1] + tag).attr(style));
	    
	    var columnWidth = w / wv;
	    
	    for (var i = 1; i < wv; i++) {
	    	xlabels.push(this.text(Math.round(x + i * columnWidth) + 15, Math.round(y + h) + 25, labels[i] + tag).attr(style));
	    }
	    return xlabels;
	  };
	
  },

  onRender: function() {
    var self = this;
    this.batteryGraph = this.createBatteryGraph();
    this.ui.batteryTitle.html(__('TrafficDashboard.batteryTitle'));
    setTimeout(function() { self.batteryChart = self.createBatteryChart(); });

  },
  
  getBatteryValue: function(level) {
  	var batteryStatus = 0;
    console.log(level)
    switch(level) {
    	case "full":
    		batteryStatus = 100;
    		break;
    	case "low":
    		batteryStatus = 30;
    		break;
      case "empty":
        batteryStatus = 0;
        break;
    }
    return batteryStatus;
  },
  
  requestDataCallback: function(model, batteryHistory) {
  	this.batteryChart.lineChart.remove();
  	
  	var options =  {
      nostroke: false,   
      symbol: "circle",    
      smooth: false,     
      width:1,
      colors: [ this.fillColor
         /*,"#5a6568"
         "#00ff0000"*/
      ]
    };
    var width = 220,
        height = 50,
        leftgutter = 0,
        rightgutter = 70,
        topgutter = 10;
    
    var xval = [];
    var yval = [];
    
    var initDate;
   	var endDate = new Date();
   	var me = this;
   	//xval.push(endDate.getTime());
   	//yval.push(me.getBatteryValue(model.getSensorValue('voltage')));
   	
   	$.each(batteryHistory.data, function(index, value) {
   		var date= new Date(value.st);
   		//Only values in the las 24 hours
   		if (date > endDate.getTime() - 86400000) {
  			xval.push(date.getTime());
  			//yval.push(me.getBatteryValue(value.ms.v));
        //yval.push(value.ms.v*100/14);
        yval.push(value.ms.v);
  			initDate = date;
   		}
   	});
   	this.batteryChart.lineChart = this.batteryChart.paper.linechart(
   		0 + leftgutter, 0, 
   		width - rightgutter - leftgutter, height + topgutter, 
   		[xval,[endDate.getTime() - 86400000]],[yval,[14, 0]], options);

    this.updateGraph(yval[yval.length-1],model);

  },

  updateGraph: function (value,model){
    var voltage = model.getSensorValue('voltage');
    if(voltage == null)
      this.ui.batteryLabel.html("Error");
    else{
      this.ui.batteryLabel.html((Math.round(parseFloat(voltage) * 10)/10) + 'V');
      this.batteryGraph.fill.animate({
        height: Math.min(parseFloat(voltage), 14)*1.2,
        y: 48 - Math.min(parseFloat(voltage), 14)*1.2
      }, 300);
      this.batteryGraph.fill.show();
    }
  },
  
    // Request history data for voltage
  requestData: function(model, callback) {
  	callback = _.bind(callback, this);
  	model.getSensorHistory('voltage', function(batteryHistory) {
      callback(model, batteryHistory);
    });
    
  }, 
  
  createBatteryChart: function(options) {
    var paper = Raphael(this.ui.batteryChart.get(0), 300, 100),
    lineChart; 
    
    var maxY = 14,
    	width = 220,
      height = 50,
      leftgutter = 0,
      rightgutter = 70,
      bottomgutter = 0,
      topgutter = 10,
      linesColor = "#CEDBDC",
      color = "#ff0000",
      tag = "V",
      txtStyle = {font: '12px Helvetica, Arial', fill: "#5a6568"},
    	date = new Date(),
    	labels = [new Date(date.getTime() - 86400000).toLocaleTimeString().split(":")[0] + ":00",
    		new Date(date.getTime() - 57600000).toLocaleTimeString().split(":")[0] + ":00", 
    		new Date(date.getTime() - 28800000).toLocaleTimeString().split(":")[0] + ":00",""];
    var grid = paper.drawGrid(leftgutter, topgutter + 0.5, width - leftgutter - rightgutter , height - topgutter - bottomgutter, 4, 2, linesColor);
    //var ylabels = paper.drawYLabels(leftgutter , topgutter , width - leftgutter - rightgutter , height - topgutter - bottomgutter, 2, maxY, tag, txtStyle);
    var xlabels = paper.drawXLabels(leftgutter , topgutter + 0.5, width - leftgutter - rightgutter , height - topgutter - bottomgutter, 3, labels, "", txtStyle);
    
	  var options =  {
       nostroke: false,   
       symbol: "circle",    
       smooth: false,     
       colors: [
         "#5a6568",
         "#00ff0000"
       ]
     };
	
  	lineChart= paper.linechart(0, 0, width, height + topgutter,[],[[],[100, 0]], options);
	
	  return {
      paper: paper,
      lineChart: lineChart,
      xlabels: xlabels
    //  ylabels: ylabels
    };
  }, 

  createBatteryGraph: function() {
    var paper = Raphael(this.ui.batteryGraph.get(0), 320, 100),
      fill, 
      stack;
    connector = paper.rect(20,26,6,3,0.5);
    stack = paper.rect(17,28,12,23,2);
    eraseLine = paper.rect(21,27.5,4,3);
    connector.attr({fill: this.baseColor, stroke: this.borderColor, 'stroke-width':1.5});
    stack.attr({fill: this.baseColor, stroke: this.borderColor, 'stroke-width':1.5});
    eraseLine.attr({fill: this.baseColor, stroke: this.baseColor});
    fill = paper.rect(19.5,48,7,0,0);
    fill.attr({fill: this.fillColor, stroke: this.borderColor});
    fill.hide();
    return {
      stack:stack,
      fill:fill
    };
  }


});
