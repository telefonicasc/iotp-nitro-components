define(
  [
    'components/component_manager',
    'components/mixin/container',
    'components/mixin/data_binding',
    'components/mixin/scrollable'
  ],

  function(ComponentManager, ContainerMixin, DataBinding, Scrollable) {
    return ComponentManager.create('container', ContainerMixin, DataBinding, Scrollable);
  }

);
