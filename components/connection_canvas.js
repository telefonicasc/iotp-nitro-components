define(
  [
    'components/component_manager'
  ],

  function(ComponentManager) {

    return ComponentManager.create('connectionCanvas',
      ConnectionCanvas);

    function ConnectionCanvas() {
      
      this.defaultAttrs({

      });

      this.after('initialize', function() {
        
           
         
      });
    }
  }
);
