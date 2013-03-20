define(
  [
    'components/component_manager'
  ],
  
  function (ComponentManager) {

    return ComponentManager.create('tooltip',
      Tooltip);

    function Tooltip() {

      var panelPath = [];

      this.defaultAttrs({

      });

      this.after('initialize', function() {

        this.$node.addClass('tooltip');

        this.on('show', function(e) {
          this.$node.show();
          e.stopPropagation();
        });

        this.on('hide', function(e) {
          e.stopPropagation();
        });

      });

    }

  }
);
