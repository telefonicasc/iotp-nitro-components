define(
  [
    'components/component_manager',
    'components/mixin/container'
  ],

  function(ComponentManager, ContainerMixin) {
    return ComponentManager.create('container', ContainerMixin);
  }

);
