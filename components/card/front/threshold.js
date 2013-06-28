define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/mixin/template'
    ],

    function(ComponentManager, DataBinding, Template) {
        

        function CardFrontThreshold() {
            
            this.defaultAttrs({
                tpl: '<div class="m2m-card-threshold">' +
                    '<div class="m2m-card-threshold-phenomenon" >Temperatura' +
                    '</div>' +
                    '<div class="m2m-card-threshold-level"> Nivel crítico' +
                    '</div>' +
                    '</div>'
            });
        }
        
        return ComponentManager.create('CardFrontThreshold', DataBinding,
            Template, CardFrontThreshold);

    }
);