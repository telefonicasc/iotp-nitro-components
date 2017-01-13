/**
Create tooltip element

Tooltip

mixin DataBinding

event hide undefined Trigger this event for hide element
event show undefined Trigger this event for show element
*/
define(
    [
        'components/component_manager',
        'components/container',
        'components/mixin/data_binding'
    ],

    function(ComponentManager, Container, DataBinding) {

        function Tooltip() {

            this.defaultAttrs({
            });

            this.after('initialize', function() {
                var hoverEl = $(this.attr.hoverEl),
                    hoverSelector = this.attr.hoverSelector;

                this.$node.addClass('tooltip');
                this.$tooltipContent = $('<div>').appendTo(this.$node);
                Container.attachTo(this.$tooltipContent, {
                    items: this.attr.items
                });

                this.on('show', function(e) {
                    this.$node.show();
                    e.stopPropagation();
                });

                this.on('hide', function(e) {
                    this.$node.hide();
                    e.stopPropagation();
                });

                this.on('valueChange', function(e, o) {
                    e.stopPropagation();
                });

                this.$tooltipContent.on('valueChange', function(e, o) {
                    e.stopPropagation();
                });

                this.trigger('hide');
            });
        }

        return ComponentManager.create('Tooltip',
            Tooltip, DataBinding);
    }
);
