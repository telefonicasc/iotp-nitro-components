define(
  [
    'components/component_manager'
  ],

  function(ComponentManager) {

    return ComponentManager.create('map', Map);

    function Map() {
      
      this.defaultAttrs({
        center: { lat: 0, lon: 0},
        zoomMin: 1,
        zoomMax: 14
      });
      
      this.after('initialize', function() {
        
        this.$node.addClass('map');
        this.$node.html(this.attr.contenido);
        
      });
    }
  }
);
