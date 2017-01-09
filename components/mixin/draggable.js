/**
Convert node in draggable item. Use `jQueryUI.Draggable()`

@name DraggableMixin
*/
define(
  [
        'node_modules/jquery-ui/core',
        'node_modules/jquery-ui/widget',
        'node_modules/jquery-ui/mouse',
        'node_modules/jquery-ui/draggable',
        'node_modules/jquery-ui/droppable'
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
