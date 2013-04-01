define(
  [
    'components/component_manager'
  ],
  function(ComponentManager) {

    return ComponentManager.create('flippable', Flippable);
    
    function Flippable() {
      
      this.after('initialize', function() {
        this.$node.addClass('flippable');
        this.$node.on('click', function() {
          $(this).toggleClass('flip');
        });
      });
    }
  }
);
