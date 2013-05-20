define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/mixin/template'
    ],

    function(ComponentManager, DataBinding, Template) {
        return ComponentManager.create('CardFrontText', DataBinding,
            Template, CardFrontText);

        function CardFrontText() {
            
            this.defaultAttrs({
                tpl: '<div class="m2m-card-text">' +
                        '<div class="m2m-card-text-value">{{value}}' +
                        '</div>' +
                     '</div>'
            });
        }

    }
);
