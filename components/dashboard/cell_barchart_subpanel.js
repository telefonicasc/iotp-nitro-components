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
          chart: {        //(optional)
            conf: {
              maxHeight: 70,
              width: 45,
              barPadding: 4
            },
            data: [ { gains: 87 }, { losses: 46 }, ... ]    //values from 0 - 100 
          }
        }
   */
   
  function(ComponentManager, DataBinding, ContainerMixin) {

    return ComponentManager.create('cellBarchartSubpanel',
        CellBarchartSubpanel, DataBinding, ContainerMixin);

    function CellBarchartSubpanel() {

      this.defaultAttrs({
        items: [],
        text: {
            title: { value: '', caption: '' },
            content: { value: '', caption: '' }
        }          
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
            .attr("x", function(obj, i) {
              return i * (_chartConf.width + _chartConf.barPadding);
            })
            .attr("y", function(obj) {
              var value = obj[getObjKeys(obj)[0]];
              return _chartConf.maxHeight - value*_chartConf.maxHeight/100; 
            })
            .attr("width", _chartConf.width)
            .attr("height", function(obj) {
              var key = getObjKeys(obj)[0];
              var value = obj[key];
              return parseInt(value)*_chartConf.maxHeight/100;
            })
            .attr('class', function(d, i){
              return ( i%2 === 0 )? 'color2' : 'color1';
            });

            svg.selectAll("text")
            .data(_data).enter().append("text")
            .text(function(obj) {
                var key = getObjKeys(obj)[0];
                return key;
             })
            .attr("x", function(obj, i) {
                return i * (_chartConf.width+_chartConf.barPadding)+ _chartConf.width/2;
            })
            .attr("y", function(obj) {
                return (_chartConf.maxHeight-_chartConf.barPadding-2);
            });

            function getObjKeys(obj){
              var keys = [];
              for(var key in obj) keys.push(key);
              return keys;
            }
           
        }
        
        this.before('renderItems', function() {
          var _text = this.attr.text;
          if (_text){
            var html = (_text.title)? '<div class="title"><div class="value">'+_text.title.value+'</div><div class="caption">'+_text.title.caption+'</div></div>' : '';
            html += (_text.content)? '<div class="content"><div class="value text">'+_text.content.value+'</div><div class="caption">'+_text.content.caption+'</div></div>' : '';

            this.attr.items = [{
              tag: 'div',
              html: html
            }];
          }
          
        });

        this.after('renderItems', function() {
          //If there is chart then render it
          if (this.attr.chart){
            this.createChart();
          }    
        });  

        this.on('resize', function(e, chartSize) {
          //this.createChart();
          e.stopPropagation();
        });   

      });
    }
  }
);