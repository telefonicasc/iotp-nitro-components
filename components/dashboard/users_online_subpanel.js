define(
  [
    'components/component_manager',
    'components/mixin/data_binding',
    'components/mixin/container'
  ],

  /* COMPONENT DATA
  	    {
          component: 'usersOnlineSubpanel',
          className: 'vertical-panel',
          textTitle: function(){
            return '21' + '%';
          },
          text: function(data) {
            return '345';
          },
          chartDataset: [ 16, 48 ] 
        }
   */
   
  function(ComponentManager, DataBinding, ContainerMixin) {

    return ComponentManager.create('usersOnlineSubpanel',
        UsersOnlineSubpanel, DataBinding, ContainerMixin);

    function UsersOnlineSubpanel() {

      this.defaultAttrs({
        chart: {
        	maxHeight: 80,
        	width: 40,
        },
        items: []    
      });

      this.after('initialize', function() {

        this.$node.addClass('users-online-subpanel');

        this.createChart = function(){
        	//Create SVG element
			var svg = d3.select(this.node)
	            .append("svg")
	            .attr("width", this.width)
	            .attr("height", this.height);
	        
	        var chartConfig = this.attr.chart;
	        
	        svg.attr('class', 'chartOnlineUsers');

	        svg.selectAll("rect")
			   .data(this.attr.chartDataset)
			   .enter()
			   .append("rect")
			   .attr("x", function(d, i) {
	    			return i * (chartConfig.width + 2);  //Bar width of 20 plus 1 for padding
				})
			   .attr("y", function(d) {
	    			return chartConfig.maxHeight - d;  //Height minus data value
				})
			   .attr("width", chartConfig.width)
			   .attr("height", function(d) {
	                return d;
	           })
	           .text(function(d) {
	        		return d;
	   		   });
        }

        this.before('renderItems', function() {
          this.attr.items = [{
            tag: 'div',
            html: '<div>' + '<div>'+this.attr.textTitle()+'</div>' +
                  '<div>of users online</div>' +
			 	  '</div>' +
             	  '<div>' + '<div>'+this.attr.text()+'</div>' +
               	  '<div>unique users online</div>' +
             '</div>',
          }];

        });

        this.after('renderItems', function() {
        	this.createChart();
        });   		  

      });
    }
  }
);