define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/mixin/template',
        'components/mixin/container'
    ],

    function(ComponentManager, DataBinding, Template, Container) {

        return ComponentManager.create('component', Template,  
            DataBinding);
    }
);
