define(
  [
    'components/component_manager'
  ],

function(ComponentManager) {

    return ComponentManager.create('map', Map);

    function Map() {

	    var mapC = null;

        this.defaultAttrs({
		    mapId: 'keithtid.map-w594ylml',
            center: { lat: 40.414431, lon: -3.703696 },
			zoomInitial: 15,
            zoomMin: 15,
            zoomMax: 20,
			hostDiv: 'dashmap',
			markers: []
        });
      
        this.after('initialize', function() {
            // Creating map	
            //
            this.$node.addClass('fit');
            this.$nodeMap = $('<div>').addClass('mapbox').appendTo(this.$node);
			this.mapC = mapbox.map(this.$nodeMap[0]);
			this.mapC.addLayer(mapbox.layer().id(this.attr.mapId));
			this.mapC.setZoomRange(this.attr.zoomMin, this.attr.zoomMax);
			this.centerZoom(this.attr.center, this.attr.zoomInitial);
			console.log("Created map: " + this.attr.mapId);

			// marker layer
			this.markerLayer = mapbox.markers.layer();
			mapbox.markers.interaction(this.markerLayer);
			this.mapC.addLayer(this.markerLayer);	
			console.log('Created marker layer');				

				
			var len = this.attr.markers.length;
			for (var i = 0; i < len; i++) {
				if (i in this.attr.markers) {
					this.addMarkerToMap(this.attr.markers[i]);
				}
			}
			console.log('Created initial markers');			
        });

		this.centerZoom = function(position,zoom) {
			this.mapC.centerzoom(position,zoom);
		};

		this.addMarkerToMap = function(data) {
            // Just in case some fields are not there
			data.color = data.color == null ? '#000' : data.color;
            data.title = data.title == null ? '' : data.title;
            data.description = data.description == null ? '' : data.description;
            data.symbol = data.symbol == null ? 'star' : data.symbol;

			console.log(
                'Event: lat:' + data.lat + 
                ' lon:' + data.lon + 
                ' color: ' + data.color +
                ' title: ' + data.title +
                ' description: ' + data.description);

			this.markerLayer.add_feature(
				{
				geometry: { coordinates: [data.lon, data.lat] },
				properties: {
					'marker-color': data.color,
					'marker-symbol': data.symbol,
					title: 'Example marker',
					description: 'Example description'
					}
				}
			);
		};
        	
        this.on(
            'addMarker', 
            function () {
                console.log('===');    
            }
        );
    } 
});
