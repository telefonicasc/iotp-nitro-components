/* 
 * Mapbox generic map component for M2M-Nitro
 *
 * Andres Picazo Cuesta 
 * Telefonica I+D
 *
 * Marker symbols: http://mapbox.com/maki/
 * Mapbox: www.mapbox.com
 *
 * ==> Configuration:
 * - mapId: mapbox map identifier  
 * - center [default:{ lat: 40.414431, lon: -3.703696 }] => Starting center point, with format {lat: <value>, lon: <value>} 
 * - zoomInitial [default:15] => The initial zoom value (recomended 14)
 * - zoomMin [default:15 ]=> Minimum zoom value
 * - zoomMax [default:20] => Maximum zoom value
 * - showZoomButtons [default:false] => If true, show the buttons to zoomin / zoomout
 * - hoveringTooltip [default: true] => Show tooltip when clicked (false), or hovered (true)  
 * - centerOnClick [default: false] => Center map on marker when clicked
 * - markers [default:[]] => Array of markers (see below for description)
 * - markerClickEvent [default:'marker-clicked'] => flight event to trigger when a marker is clicked
 * - unSelectedSymbol [default: 'circle-stroked']: symbol to assign marker when not selected
 * - selectedSymbol[default:'circle']: symbol to assign marker when selected
 * - unselectedColor[default:#0000FF]: color to assign marker when not selected
 * - selectedColor[default:#00FF00]: color to assign marker when selected
 * - debug [default:false] => enables console log output (default: false)
 *
 * ==> Marker description (example):
 * {   
 *  geometry: { 
 *      coordinates: [ -3.665, 40.515] },
 *      properties: {
 *          'id': 1,
 *          'marker-color':'#000',
 *          'marker-symbol':'police',
 *          'marker-size': small,
 *          'title': 'Marker 1',
 *          'description': 'Marker 1 description',
 *          'status': 'ok'
 *      }                        
 * }
 *
 * For available symbol descriptions, see: http://mapbox.com/maki
 * (Examples are: 'star', 'star-stroked', 'circle', 'circle-stroked'...)
 *
 * ==> Flight events:
 * [SENT] 
 * config.markerClickEvent :: Sent when a marker is clicked
 *
 * [RECEIVED]
 * 'update-marker': Updates marker view
 *
 *
 * Usage notes:
 *
 * Zoomer buttons require to have an associated css to be seen, bare minimum would be:
 *
 *      .zoomer {
 *          position:absolute;
 *      }
 *
 *      .zoomer.zoomin {
 *          left:10px;
 *      }
 *
 * or thought jquery:
 *
 *      $('.zoomer').css('position','absolute');
 *      $('.zoomer.zoomin').css('left','10px');
 *
 * ==> To sent an event (example):
 *
 * $('.mapbox').trigger('update-marker',{title: 'Marker 1'});
 */

define(
    [
        'components/component_manager'
    ],

function(ComponentManager) {

    return ComponentManager.create('map', Map);

    function Map() {

        /* === Mapbox map component instance === */
	    var mapC = null;
        /* === Self pointer to call from functions === */
        var self = null;

        /* === Component default attributes === */
        this.defaultAttrs({
		    mapId: 'keithtid.map-w594ylml',
            center: { lat: 40.414431, lon: -3.703696 },
			zoomInitial: 15,
            zoomMin: 15,
            zoomMax: 20,
            showZoomButtons: false,
            features: [],
			markers: [],
            markerClickEventTarget: '',
            markerClickEvent: 'marker-clicked',
            hoveringTooltip: true,
            centerOnClick: false,
            unselectedSymbol: 'circle-stroked',
            unselectedColor: '#0000FF',
            selectedSymbol: 'circle',
            selectedColor: '#00FF00',
            selected: 0,
            debug: false
        });
      
        /* === Component intializer (after) === */
        this.after('initialize', function() {
            
            self = this;
            // ==> Create map 	
            this.$node.addClass('fit');
            this.$nodeMap = $('<div>').addClass('mapbox').appendTo(this.$node);
			this.mapC = mapbox.map(this.$nodeMap[0]);
			this.mapC.addLayer(mapbox.layer().id(this.attr.mapId));
			this.mapC.setZoomRange(this.attr.zoomMin, this.attr.zoomMax);
			this.mapC.centerzoom(this.attr.center, this.attr.zoomInitial);

            // ==> Add zoom buttons
            if (this.attr.showZoomButtons) {
                this.mapC.ui.zoomer.add();
            }            

			// ==> Create marker layer
			this.markerLayer = mapbox.markers.layer();
                //.features(this.attr.features)
                //.key(function (f) { return f.properties.title });
			var interaction = mapbox.markers.interaction(this.markerLayer);
			this.mapC.addLayer(this.markerLayer);
            // ==> Remove hovering tooltips?
            if (this.attr.hoveringTooltip == false) {
                interaction.showOnHover(false);
            } 
            // ==> Create markers
            // All markers unselected
            for (var i = 0; i < self.attr.features.length; i++) {
                // AUTO ID
                self.attr.features[i].properties['_marker_id'] = '_marker_' + i;
                if (self.attr.features[i].properties['marker-color'] == null) {
                    self.attr.features[i].properties['marker-color'] = self.attr.unselectedColor;
                }
                if (self.attr.features[i].properties['marker-symbol'] == null ) {
                    self.attr.features[i].properties['marker-symbol'] = self.attr.unselectedSymbol;
                }
            }
            
            // Check this: http://mapbox.com/mapbox.js/example/marker-movement/
            this.markerLayer.features(this.attr.features);
            //    .key(function (f) {return f.properties.id} );
            // ==> On click event trigger for the markers 
            this.markerLayer.factory(
                function(model) {
                    var elem = mapbox.markers.simplestyle_factory(model);
                    // Adds the id to the class, to be able to recover it later
                    $(elem).addClass(model.properties['_marker_id']);
                    MM.addEvent(elem, 'click',
                        function (mouseEvent) {
                            // Update markers
                            self.trigger('update-marker-views', { id:$(elem).attr('class') } );
                            // Trigger the event specified
                            // Get marker model
                            var modelIndex = self.findMarker($(elem).attr('class'));
                            var model = self.attr.features[modelIndex];
                            if (self.attr.markerClickEventTarget != '') {
                                $(self.attr.markerClickEventTarget).trigger(self.attr.markerClickEvent, model);
                            }
                            else {
                                self.trigger(self.attr.markerClickEvent, model);
                            }
                        } 
                    );
                    // Elem se ha actualizado, por lo que este nodo ya no existe!!
                    return elem;
                }
            );

            if (self.attr.debug) {
                // ==> Event suscriptions and handlers
                console.log('Created click event debug handler');
                // TEST
                this.on(this.attr.markerClickEvent, function (event,payload) {
                    console.log('Map.js  :: trigger["' + 
                        this.attr.markerClickEvent + '"] Target class name: ' +event.currentTarget.className);
                });
            }

            this.on('update-marker-model', function (event, payload) {
                var index = self.findMarker(payload.id);
                console.log('index: ' + index);
            });

            // => Marker update on click
            this.on('update-marker-views', function (event, payload) {
                if (self.attr.debug) console.log('Map.js [trigger] updating markers');
                var sel = self.attr.selected;
                i = self.findMarker(payload.id);
                if (i < 0) {
                    if (self.attr.debug) console.log('marker not found!!');
                    return null;
                }
                // => Update unselected marker
                //self.attr.features[sel].properties['marker-symbol'] = self.attr.unselectedSymbol;
                //self.attr.features[sel].properties['marker-color'] = self.attr.unselectedColor;
                self.attr.features[sel].properties['marker-size'] = 'medium';
                
                // => Update selected marker
                //self.attr.features[i].properties['marker-symbol'] = self.attr.selectedSymbol;
                //self.attr.features[i].properties['marker-color'] = self.attr.selectedColor;
                self.attr.features[i].properties['marker-size'] = 'large';

                // => Reload features
                self.markerLayer.features(self.attr.features);
                // => Center map on selected
                if (self.attr.centerOnClick) {
                    // lat/lon come reversed from geometry
                    var feature_lat = self.attr.features[i].geometry.coordinates[1];
                    var feature_lon = self.attr.features[i].geometry.coordinates[0];
                    self.mapC.center({lat: feature_lat, lon: feature_lon});
                }
                // => Update attribute selected
                self.attr.selected = i;
            });

            this.findMarker = function (markerid) {
                var i = 0;
                var found = false;
                // Find marker to update
                while (i < self.attr.features.length && !found) {
                    var current = self.attr.features[i];
                    if (markerid.indexOf(self.attr.features[i].properties._marker_id) >= 0) {
                        found = true;
                    }
                    else i++;
                }
                if (!found) return -1;
                else return i;
            }
            
        }); // </this.after(...,function)>

    } // </function Map()>

} // </function(ComponentManager)>
);
