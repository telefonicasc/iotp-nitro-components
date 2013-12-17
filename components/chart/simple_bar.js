/*
SimpleBar

@name SimpleBar
@mixin DataBinding

@option {String} valueField 'value' Name of attribute on model for `value` value
@option {String} maxField 'max' Name of attribute on model for `max` value
*/
define(
    [
        'components/component_manager',
        'components/mixin/data_binding'
    ],

    function(ComponentManager, DataBinding) {

        return ComponentManager.create('SimpleBar',
            SimpleBar, DataBinding);

        function SimpleBar() {

            this.defaultAttrs({
                valueField: 'value',
                maxField: 'max'
            });

            this.after('initialize', function() {

                var bar = $('<div>')
                            .addClass('bar-value')
                            .appendTo(this.$node);

                bar.css('height', '100%');
                bar.css('width', '0%');

                this.on('valueChange', function(e, o) {
                    var value = o.value[this.attr.valueField],
                        max = o.value[this.attr.maxField];

                    bar.css('width', (100*value/max) + '%');
                });
            });
        }
    }
);
