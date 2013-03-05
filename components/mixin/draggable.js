define(
  [],

  function() {
  
    return DraggableMixin;

    function DraggableMixin() {
      
      this.defaultAttrs({

      });

      this.after('initialize', function() {

        // TODO: No time to implement this properly
        // using jquery ui draggable.
        // Would be nice to implement it and remove that dependency
        this.$node.draggable(this.attr);

        /*this.$node.mousedown($.proxy(function(e) {
          this.dragging = true;           
        }, this));

        this.$node.mousemove($.proxy(function(e) {
          if (this.dragging) {
            debugger;  
          }
        }, this));

        this.$node.mouseup($.proxy(function(e) {
          this.dragging = false;
        }, this));*/
        
      });
    }
  }
);
