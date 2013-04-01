define(
  [
    'components/component_manager',
    'components/flippable'    
  ],
  function(ComponentManager, Flippable) {
    
    ComponentManager.create('card', Card);

    function Card() {

      this.defaultAttrs({
        flippable: true
      });

      this.after('initialize', function() {

        if (this.attr.flippable) {
          Flippable.attachTo(this.node);
        }

      });
    }
  }
);
