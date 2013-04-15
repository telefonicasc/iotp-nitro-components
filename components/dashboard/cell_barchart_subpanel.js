define(
  [
    'components/component_manager',
    'components/mixin/data_binding',
    'components/mixin/container'
  ],

  /* DATA BINDING SAMPLE
  	    {
          component: 'cellBarchartSubpanel',
          className: 'cell-barchart-subpanel',
          text: {
            title: { value: '21%', caption: 'of users online' },
            content: { value: '345', caption: 'unique users online' }
          },
          chart: {
            conf: {
              maxHeight: 70,
              width: 45,
              barPadding: 4
            },
            data: [{ key: 'gains', value: '87' }, { key: 'losses', value: '46' }, ... ]    //values from 0 - 100 
          }
        }
   */
   
  function(ComponentManager, DataBinding, ContainerMixin) {

    return ComponentManager.create('cellBarchartSubpanel',
        CellBarchartSubpanel, DataBinding, ContainerMixin);

    function CellBarchartSubpanel() {

      this.defaultAttrs({
        items: []    
      });

      this.after('initialize', function() {

        this.createChart = function(){

           var _chartConf = this.attr.chart.conf;
           var _data = this.attr.chart.data;

  			   var svg = d3.select(this.node)
  	          .append("svg")
  	          .attr("width", _chartConf.width*_data.length + _chartConf.barPadding*(_data.length - 1))
  	          .attr("height", _chartConf.maxHeight);       
  	       
  	       svg.selectAll("rect")
  			   .data(_data).enter().append("rect")
  			   .attr("x", function(d, i) {
  	    			return i * (_chartConf.width + _chartConf.barPadding);
  				 })
  			   .attr("y", function(d) {
  	    			return _chartConf.maxHeight - d.value*_chartConf.maxHeight/100; 
  				 })
  			   .attr("width", _chartConf.width)
  			   .attr("height", function(d) {
  	          return parseInt(d.value)*_chartConf.maxHeight/100;
  	       });

           svg.selectAll("text")
           .data(_data).enter().append("text")
  	       .text(function(d) {
                return d.key;
  	   		 })
           .attr("x", function(d, i) {
                return i * (_chartConf.width+_chartConf.barPadding)+ _chartConf.width/2;
           })
           .attr("y", function(d) {
                return (_chartConf.maxHeight-_chartConf.barPadding-2);
           })
           
        }
        
        this.before('renderItems', function() {
          var _text = this.attr.text;
          this.attr.items = [{
            tag: 'div',
            html: '<div class="title"><div>'+_text.title.value+'</div>' +
                  '<div class="caption">'+_text.title.caption+'</div></div>' +
             	    '<div class="content"><div class="value text">'+_text.content.value+'</div>' +
               	  '<div class="caption">'+_text.content.caption+'</div></div>',
          }];
        });

        this.after('renderItems', function() {
        	this.createChart();
        });   		  

      });
    }
  }
);