define(
    [
        'components/component_manager',
        'components/mixin/draggable'
    ],

    function(ComponentManager, DraggableMixin) {
        return ComponentManager.create('draggable', DraggableMixin);
    }

);
