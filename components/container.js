define(
    [
        'components/component_manager',
        'components/mixin/container',
        'components/mixin/data_binding'
    ],

    function(ComponentManager, ContainerMixin, DataBinding) {
        return ComponentManager.create('container', ContainerMixin, DataBinding);
    }

);
