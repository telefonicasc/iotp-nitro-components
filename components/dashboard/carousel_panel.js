define(
  [
    'components/component_manager'
],
  function(ComponentManager) {

    return ComponentManager.create('carouselPanel',
        CarouselPanel);

    function CarouselPanel() {

        this.defaultAttrs({
            title: { value: '', caption: '' },
            content: { value: '', caption: '' },
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

            //Add nodes to component
            this.$bottomNode.appendTo(this.$node);
            if (this.attr.conf){
              this.$chartNode.appendTo(this.$node);
              var chart = ComponentManager.get('carouselBarchart').attachTo(this.$chartNode, this.attr);
            }               
            this.$topNode.appendTo(this.$node); 

            this.on('valueChange', function(e, data) {
                
                this.$topValueNode.html( (data.text1 ) ? data.text1: '');
                this.$bottomValueNode.html( (data.text2)?data.text2: ''); 
                this.$topCaptionNode.html( (data.caption1)?data.caption1: '');
                this.$bottomCaptionNode.html( (data.caption2)?data.caption2: '');
                this.$chartNode.trigger('valueChange', {values: data.values} );

                e.stopPropagation();
            });
        });

    }

});