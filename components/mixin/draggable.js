/**
Convert node in draggable item. Use `jQueryUI.Draggable()`

@name DraggableMixin
*/
define(
  [
        'libs/jqueryui/jquery.ui.core',
        'libs/jqueryui/jquery.ui.widget',
        'libs/jqueryui/jquery.ui.mouse',
        'libs/jqueryui/jquery.ui.draggable',
        'libs/jqueryui/jquery.ui.droppable'
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
