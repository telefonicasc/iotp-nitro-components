define(
  [
        'libs/jqueryui/jquery.ui.core.js',
        'libs/jqueryui/jquery.ui.widget.js',
        'libs/jqueryui/jquery.ui.mouse.js',  
        'libs/jqueryui/jquery.ui.draggable.js',
        'libs/jqueryui/jquery.ui.droppable.js'
  ],
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
