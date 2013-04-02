define(
  [
    'components/component_manager'
  ],

  function(ComponentManager) {

    ComponentManager.create('SlidingPanel', SlidingPanel);

    function SlidingPanel() {

      this.defaultAttrs({

      });

      this.after('initialize', function() {

        this.$node.addClass('sliding-panel');
  

      });
    }
  }
);
