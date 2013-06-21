define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/mixin/template'
    ],

    function(ComponentManager, DataBinding, Template) {
        function CardFrontAlarm() {
            this.defaultAttrs({
                tpl: '<div class="m2m-card-alarm">' +
                        '<div class="m2m-card-alarm-img"></div>' +
                     '</div>'
            });
        }
        
        return ComponentManager.create('CardFrontAlarm', DataBinding,
            Template, CardFrontAlarm);

    }
);
