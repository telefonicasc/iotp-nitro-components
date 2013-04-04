define(
  [],

  function() {
  
    return DraggableMixin;

    function DraggableMixin() {
      
      this.defaultAttrs({

      });

      this.after('initialize', function() {

        // TODO: No time to implement this properly
        // using jquery ui draggable for the time being.
        // Would be nice to implement it and remove that dependency
        this.$node.draggable($.extend({}, this.attr));
        
      });
    }
  }
);
