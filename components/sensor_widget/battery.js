define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/mixin/template',
        'components/sensor_widget/mixin/scale_widget'
    ],

    function(ComponentManager, DataBinding, Template, ScaleWidget) {

        return ComponentManager.create('Battery', DataBinding,
            Template, Battery);

        function Battery() {

            this.defaultAttrs({
                tpl: '<div class="battery-cap"></div>' +
                     '<div class="battery-body"></div>'
            });

            this.after('initialize', function() {
                this.attr.updateOnValueChange = false;
                this.$node.addClass('battery-widget');
                this.$batteryBody = $('.battery-body', this.$node);
                this.$scale = $('<div>').appendTo(this.$batteryBody);
                ScaleWidget.attachTo(this.$scale, {
                    scaleRectStyle: {
                        fill: '#B0C0C5',
                        stroke: 'none'
                    }
                });
            });
        }
    }
);
