define(
  [
    'libs/flight/lib/component'
  ],

  function(defineComponent) {

    return defineComponent(Map);

    function Map() {
      
      this.defaultAttrs({
        center: { lat: 0, lon: 0},
        zoomMin: 1,
        zoomMax: 14
      });

      this.after('initialize', function() {
        
        this.map = mapbox.map(this.node)
        
      });
    }
  }
);
