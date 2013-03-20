define(
  [
    'components/component_manager',
    'components/mixin/data_binding',
    'components/mixin/template'
  ],

  function(ComponentManager, DataBinding, Template) {

    return ComponentManager.create('component', DataBinding, Template);
  }
);
