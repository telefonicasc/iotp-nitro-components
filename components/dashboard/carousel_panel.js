define(
  [
    'components/component_manager'
],
  function(ComponentManager) {

    return ComponentManager.create('carouselPanel',
        CarouselPanel);

    function CarouselPanel() {

        this.defaultAttrs({
            //chartConf: null,
            title: { value: '', caption: '' },
            content: { value: '', caption: '' }
        });

        this.after('initialize', function() {

            this.$topNode = $('<div>').addClass('title');

            this.$topValueNode = $('<div>')
              .addClass('value')
              .appendTo(this.$topNode)
              .html(this.attr.title.value);

            this.$topCaptionNode = $('<div>')
              .addClass('caption')
              .appendTo(this.$topNode)
              .html(this.attr.title.caption);

            this.$bottomNode = $('<div>').addClass('content');

            this.$bottomValueNode = $('<div>')
              .addClass('value')
              .appendTo(this.$bottomNode)
              .html(this.attr.content.value);

            this.$bottomCaptionNode = $('<div>')
              .addClass('caption')
              .appendTo(this.$bottomNode)
              .html(this.attr.content.caption);

            this.$chartNode = $('<div>').addClass('chart-carousel');

            //Add nodes to component (order matters)
            this.$bottomNode.appendTo(this.$node);
            if (this.attr.chartConf){
              //If chart then attache 'carouselBarchart' component
              this.$chartNode.appendTo(this.$node);
              var chart = ComponentManager.get('carouselBarchart').attachTo(this.$chartNode, this.attr);
            }               
            this.$topNode.appendTo(this.$node); 

            this.on('valueChange', function(e, data) {
              
              /*
              var data = {
                  topValue: "a",
                  topCaption: "a1",
                  bottomValue: "c",
                  bottomCaption: "c1",
                  chartValues: [{name:'', value: 10}, {name: '', value:20}, .... ]
              }
              */

              var _attr = this.attr;
              this.$topValueNode.html( (data.topValue) ? data.topValue: _attr.title.value);
              this.$bottomValueNode.html( (data.bottomValue )? data.bottomValue: _attr.content.value); 
              this.$topCaptionNode.html( (data.topCaption) ? data.topCaption: _attr.title.caption);
              this.$bottomCaptionNode.html( (data.bottomCaption) ? data.bottomCaption: _attr.content.caption);
              this.$chartNode.trigger('valueChange', {values: data.chartValues});

              e.stopPropagation();
            });
        });

    }

});