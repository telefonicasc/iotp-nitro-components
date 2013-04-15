define(
  [
    'components/component_manager',
    'components/mixin/data_binding',
    'components/mixin/container'
  ],

  /* COMPONENT DATA
  	    {
          component: 'cellBarchartSubpanel',
          className: 'cell-barchart-subpanel',
          text: {
            title: { value: '21%', caption: 'of users online' },
            content: { value: '345', caption: 'unique users online' }
          },
          chartData: [{ key: 'gains', value: '16' }, { key: 'losses', value: '48' }, ...] 
        }
   */
   
  function(ComponentManager, DataBinding, ContainerMixin) {

    return ComponentManager.create('cellBarchartSubpanel',
        CellBarchartSubpanel, DataBinding, ContainerMixin);

    function CellBarchartSubpanel() {

      this.defaultAttrs({
        chartConf: {
        	maxHeight: 60,
        	width: 45,
          barPadding: 4
        },
        items: []    
      });

      this.after('initialize', function() {

        this.createChart = function(){

           var _chart = this.attr.chartConf;
           var _data = this.attr.chartData;

  			   var svg = d3.select(this.node)
  	          .append("svg")
  	          .attr("width", (_chart.width+_chart.barPadding)*_data.length)
  	          .attr("height", this.height);       
  	       
  	       svg.selectAll("rect")
  			   .data(_data)
  			   .enter()
  			   .append("rect")
  			   .attr("x", function(d, i) {
  	    			return i * (_chart.width + _chart.barPadding);  //Bar width  plus padding
  				 })
  			   .attr("y", function(d) {
  	    			return _chart.maxHeight - d.value;  //Height minus data value
  				 })
  			   .attr("width", _chart.width)
  			   .attr("height", function(d) {
  	           return d.value;
  	       });

           svg.selectAll("text")
           .data(_data)
           .enter()
           .append("text")
  	       .text(function(d) {
                return d.key;
  	   		 })
           .attr("x", function(d, i) {
                return i * (_chart.width+_chart.barPadding);
           })
           .attr("y", function(d) {
                return (_chart.maxHeight-5);
           });
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