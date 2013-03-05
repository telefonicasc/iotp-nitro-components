define(
  [
    'components/component_manager',
    'components/draggable'
  ],

  function(ComponentManager, Draggable) {

    return ComponentManager.create('rangeSelectionChart',
      RangeSelectionChart);

    function RangeSelectionChart() {
      
      this.defaultAttrs({

      });

      this.after('initialize', function() {

        this.$node.addClass('range-selection-chart fit');

        this.leftHandler = $('<div>').addClass('range-selection-handler');
        this.leftHandler.appendTo(this.$node);
        this.leftHandler.css('left', 0);
        Draggable.attachTo(this.leftHandler, { containment: this.$node });

        this.rightHandler = $('<div>').addClass('range-selection-handler');
        this.rightHandler.appendTo(this.$node);
        this.rightHandler.css('right', 0);
        Draggable.attachTo(this.rightHandler, { containment: this.$node });

      });
    }
  }
);
