define(
  [
    'components/component_manager',
    'components/panel/border_collapsable_panel'
  ],

  function(ComponentManager, BorderCollapsablePanel) {

    return ComponentManager.extend(BorderCollapsablePanel, 
        'CardToolbox', CardToolbox);

    function CardToolbox() {

    }
  }
);
