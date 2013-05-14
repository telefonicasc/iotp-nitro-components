DV.Traffic = DV.Traffic || {};
DV.Traffic.Views = DV.Traffic.Views || {};

DV.Traffic.Views.Location = Backbone.Marionette.ItemView.extend({

  template: DV.Traffic.Templates.location,

  className: 'sidebaritem',

  ui: {
    map: '.mapbox',
    locationTitle: '.location-title'
  },

  events: {

  },

  initialize: function () {
    this.bindTo(DV.Traffic.Collections.trafficLights, "change:selected", this.updateLocation, this);
  },

  updateLocation: function (model) {
    var latitude  = model.getLatitude();
    var longitude = model.getLongitude();

    if(model.get('selected')){
      this.map.center({lat:latitude, lon:longitude});
      this.map.zoom(18);
      this.map.removeLayer(this.markerLayer);
      this.markerLayer = mapbox.markers.layer();
      var status = model.get('status');

      this.markerLayer.factory(function(m) {
        var elem = mapbox.markers.simplestyle_factory(m);
        $(elem).click(function() {
          self.selectLight(m.model);
        });
        return elem;
      });
      
      if (status === 'warning'){
        this.map.addLayer(this.markerLayer);
        this.markerLayer.add_feature({
         "model": model,
          "geometry": {
            "coordinates": [model.getLongitude(), model.getLatitude()]
          },
          properties: {
            'title': 'Semaphore',
            'description': 'SidebarDevice'                
          }
       }).factory (function (f) {
          var img = document.createElement('img');
          img.className = 'marker-image';
          img.style.pointerEvents = 'all';
          img.style.position = "absolute";
          img.style.marginLeft = '-17px';         
          img.style.marginTop = '-30px'; 
          img.setAttribute('class', "redSidebar");
          img.setAttribute('src', "res/images/rojo-on-1.png");
          return img;
        });
      }   
      else if (status === 'normal'){
        this.map.addLayer(this.markerLayer);
        this.markerLayer.add_feature({
         "model": model,
          "geometry": {
            "coordinates": [model.getLongitude(), model.getLatitude()]
          },
          properties: {
            'title': 'Semaphore',
            'description': 'Device'                
          }
        }).factory (function (f) {
          var img = document.createElement('img');
          img.className = 'marker-image';
          img.style.pointerEvents = 'all';
          img.style.position = "absolute";
          img.style.marginLeft = '-17px';        
          img.style.marginTop = '-30px'; 
          img.setAttribute('class', "blueSidebar");
          img.setAttribute('src', "res/images/azul-on-1.png");
          return img;
        });
      }    
    }
  },

  onRender: function() {
    var self = this;
    this.map = mapbox.map(this.ui.map.get(0))
      .center(DV.Traffic.Models.mapModel.get("centre"))
      .setZoomRange(DV.Traffic.Models.mapModel.get("zoomMin"), 
          DV.Traffic.Models.mapModel.get("zoomMax"));
	  this.ui.locationTitle.html(__('TrafficDashboard.locationTitle'));
    this.map.addLayer(mapbox.layer().id(DV.Config.locationMap.mapboxID));    

    this.map.zoom(9);

    this.$el.on('panelresize', function() {
      self.map.draw();
    });
  }

});
