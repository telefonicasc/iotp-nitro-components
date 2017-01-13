/**
 Convert node in draggable item. Use `jQueryUI.Draggable()`

 DraggableMixin
 */
define(
    [
        'node_modules/jquery-ui-browserify/ui/jquery.ui.core',
        'node_modules/jquery-ui-browserify/ui/jquery.ui.widget',
        'node_modules/jquery-ui-browserify/ui/jquery.ui.mouse',
        'node_modules/jquery-ui-browserify/ui/jquery.ui.draggable',
        'node_modules/jquery-ui-browserify/ui/jquery.ui.droppable'
    ],
    function() {

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

        return DraggableMixin;
    }
);
