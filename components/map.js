/* 
 * Mapbox generic map component
 *
 * Marker symbols: http://mapbox.com/maki/
 * Mapbox: www.mapbox.com
 * 
 */

define(
  [
    'components/component_manager'
  ],

function(ComponentManager) {

    return ComponentManager.create('map', Map);

    function Map() {

	    var mapC = null;
        var self = null;

        this.defaultAttrs({
		    mapId: 'keithtid.map-w594ylml',
            center: { lat: 40.414431, lon: -3.703696 },
			zoomInitial: 15,
            zoomMin: 15,
            zoomMax: 20,
			markers: [],
            marker_click_event: 'marker-clicked',
            debug: false
        });
      
        // ==================================================================
        this.after('initialize', function() {
            self = this;
            // Creating map 	
            this.$node.addClass('fit');
            this.$nodeMap = $('<div>').addClass('mapbox').appendTo(this.$node);
			this.mapC = mapbox.map(this.$nodeMap[0]);
			this.mapC.addLayer(mapbox.layer().id(this.attr.mapId));
			this.mapC.setZoomRange(this.attr.zoomMin, this.attr.zoomMax);
			this.mapC.centerzoom(this.attr.center, this.attr.zoomInitial);

			// marker layer
			this.markerLayer = mapbox.markers.layer();
			var interaction = mapbox.markers.interaction(this.markerLayer);
			this.mapC.addLayer(this.markerLayer);

            // Put markers	
			var len = this.attr.markers.length;
			for (var i = 0; i < len; i++) {
				if (i in this.attr.markers) {
					var feature = this.addMarkerToMap(this.attr.markers[i]);
				}
			}
           
            // Add trigger for the markers
            this.markerLayer.factory(
                function(model) {
                    var elem = mapbox.markers.simplestyle_factory(model);
                    MM.addEvent(
                        elem,
                        'click',
                        function () {
                            // Only for this
                            console.log("layer click: " + elem.alt);
                            self.trigger('echo');
                            self.trigger(document, 'triggerTest');
                            self.trigger(document, 'echo-test');
                            // Trigger the event specified
                            self.trigger(self.attr.marker_click_event);
                        } 
                    );
                    return elem;
                }
            );

            // ---------------------
            // Trigger subscriptions
            // ---------------------
            this.on(
                'echo',
                function () {
                    console.log('Map.js  :: trigger["echo"]');
                }
            ); 

            this.on(
                this.attr.marker_click_event,
                function () {
                    console.log('Map.js  :: trigger["' + this.attr.marker_click_event + '"]');
                }
            );

        }); // </this.after(...,function)>

        // ================================================================== 
		this.addMarkerToMap = function(data) {
            // Just in case some fields are not there
			data.color = data.color == null ? '#000' : data.color;
            data.title = data.title == null ? '' : data.title;
            data.description = data.description == null ? '' : data.description;
            data.symbol = data.symbol == null ? 'star' : data.symbol;
            // Es realmente una feature, ¿o el layer entero?
			var feature = this.markerLayer.add_feature(
				{
				geometry: { coordinates: [data.lon, data.lat] },
				properties: {
					'marker-color': data.color,
					'marker-symbol': data.symbol,
					title: data.title,
					description: data.description }
				}
			);
            return feature;
		}
        // ================================================================== 
    } // </function Map()>
} // </function(ComponentManager)>
);
