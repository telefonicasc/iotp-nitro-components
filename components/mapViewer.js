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
 * map: {
 *      id: <map key>
 *      center: {
 *              lat: <latitude>,
 *              lon: <longitude>
 *          },
 *      maxZoom: <maximum zoom permitted>,
 *      minZoom: <minimum zoom permitted>,
 *      initialZoom: <starting zoom value>
 * }
 * 
 * markerClicked: {
 *      triggerFunction: <function>
 * }
 * 
 * features: [],
 * filter: <function>
 * private: {
 *      map: <map object>
 *      markers: []
 *      selectedFeature: <selected feature>
 * }
 *
 * ==> Marker description (example):
 * {   
 *  geometry: { 
 *      coordinates: [ -3.665, 40.515] },
 *      properties: {
 *          'marker-color':'#000',
 *          'marker-symbol':'police',
 *          'marker-size': small,
 *          'title': 'Marker 1',
 *          'description': 'Marker 1 description',
 *          'isGroup': false,
 *          'submarkers': [],
 *          'custom-tooltip': function(){},
 *          'custom-marker': function(){}
 *      }                        
 * }
 * 
 * featuresPreprocessor: Updates all features before setting the map
 *
 * For available symbol descriptions, see: http://mapbox.com/maki
 * (Examples are: 'star', 'star-stroked', 'circle', 'circle-stroked'...)
 *
 */

define(
[
    'components/component_manager'
],
function(ComponentManager) {

    return ComponentManager.create('mapViewer', Component);

    function Component() {

        // =====================================================================
        // Configuration
        // =====================================================================
        this.defaultAttrs({
            
            map: {
                id: 'keithtid.map-w594ylml',
                center: {lat: 40.414431, lon: -3.703696},
                maxZoom: 20,
                minZoom: 12,
                initialZoom: 15,
                zoomButtons: true,
                showTooltip: true
            },
            markerClicked: {
                center: true,
                triggerFunction: function (f, dom) {console.log(dom);}
            },
            private: {
                map: null,
                markerLayer: null,
                markers: [],
                selectedFeature: null,
                triggers: {
                    announceFeatures: 'feature-announcement',
                    selectedFeature: 'feature-selected',
                    centerFeature: 'center-on-feature'
                },
                announceTrigger: 'announce-features',
                selected: null
            },
            customTooltip : '',
            features: [],
            whenZoomed: function () {},
            whenPanned: function () {}
        });
        
        // =====================================================================
        // Functions
        // =====================================================================
        
        // Receives: An object to check.
        // Returns: true if not undefined or null, false otherwise.
        this.isValidObject = function (obj) {
            if (typeof obj === 'undefined') return false;
            if (obj === null) return false;
            return true;
        };
        
        // Receives: The GeoJson feature array.
        // Returns: Nothing.
        // Does: Creates a marker layer, including all features provided, and 
        //       sets it to be the 'markers' layer.
        // Notes:
        //  * The marker can be created using a function defined in the GeoJson
        //    object in the property 'customMarkerBuilder', or using the default
        //    simplestyle factory
        //  * Custom tooltips for the markers can be provided too along the attr
        //    using the property 'customTooltip', as a string, or as a function.
        this.setFeatures = function (features) {
            if (typeof features === 'undefined' || features === null) {
                if (this.attr.private.markerLayer !== null) {
                    features = this.attr.private.markerLayer.features();
                }
                else features = this.attr.features;
            }
            
            if (typeof this.attr.featuresPreprocessor === 'function') {
                features = this.attr.featuresPreprocessor (features, this.attr.private.map);
            }
            
            // Create layer
            var markerLayer = mapbox.markers.layer().features(features);
            // Create marker
            markerLayer.factory(function(feature) {
                var dom = null;
                if (typeof feature.properties.customMarkerBuilder === 'function') {
                    dom = feature.properties.customMarkerBuilder(feature);
                }
                // Use default feature builder
                else {
                    dom = mapbox.markers.simplestyle_factory(feature);
                }

                $(dom).click(function () {
                    $(this).trigger('marker-clicked', this);
                });
                
                return dom; 
            });
            
            markerLayer.key (function (f) {
                return f.properties.title;
            });
            
            this.attr.private.map.removeLayer('markers');
            this.attr.private.map.addLayer(markerLayer);
            this.attr.private.markerLayer = markerLayer;

            if (this.attr.map.showTooltip !== false) {
                var self = this;
                var interactionLayer = mapbox.markers.interaction(markerLayer);
                // Set tooltip, using a string or a function 
                if (typeof this.attr.customTooltip === 'string') {
                    if (this.attr.customTooltip !== '') {
                        interactionLayer.formatter(function () {
                            return self.attr.customTooltip;
                        });
                    }
                }
                else if (typeof this.attr.customTooltip === 'function') {
                    var self = this;
                    interactionLayer.formatter(function (feature) {
                        var isSelected;
                        try {
                            isSelected = feature.properties.title === self.attr.private.selected.properties.title;
                        }
                        catch (err) {
                            isSelected = false;
                        }
                        return self.attr.customTooltip(feature, isSelected);
                    });
                }
            }
        };
        
        // Receives: The new feature GeoJson object to add.
        // Returns: Nothing.
        // Does: Adds the feature to the default markerlayer.
        this.addFeature = function (event, feature) {
            this.attr.private.markerLayer.add_feature(feature);
        };
        
        // Receives: Jquery locator to send the trigger to.
        // Returns: Nothing.
        // Does: Sends an event with the specified configuration containing the
        //       array of features currently on the default markerlayer.
        // Notes:
        //  * Default trigger is 'feature-announcement'
        //  * Default locator is $(this)
        this.announceFeatures = function (event, locator) {
            var trigger = this.attr.private.triggers.announceFeatures;
            
            if (this.isValidObject(locator)) {
                $(locator).trigger(trigger, [this.attr.private.markerLayer.features(),
                    this.attr.private.map.getExtent(), this.attr.private.map.getCenter()]);
            }
            else {
                this.$node.trigger(trigger, [this.attr.private.markerLayer.features(),
                    this.attr.private.map.getExtent(), this.attr.private.map.getCenter()]);
            }
        };
        
        // Receives: Dom node to find corresponding feature.
        // Returns: GeoJson object of the feature if found, null otherwise.
        // Notes: Uses 'alt' attribute to query, corresponding to feature title.
        this.getFeatureByTitle = function (obj) {

            if (typeof obj === 'object') title = $(obj).attr('alt');
            else title = obj;
//            var title = $(dom).attr('alt');
            var feature = null;
            var features = this.attr.private.markerLayer.features();
            $.each(features, function (k,v) {
                feature = (v.properties.title === title) ? v : feature;
            });
            return feature;
        };
        
        // Receives: Latitude and longitude.
        // Returns: Nothing.
        // Does: Centers map on the specified location.
        this.centerMap = function (lat, lon){
            this.attr.private.map.center({lat: lat, lon: lon});
        };
        
        // Receives: New zoom level to set
        // Returns: Nothing
        // Does: Zooms map to the selected level
        this.zoomMap = function (event, zoom) {
            this.attr.private.map.zoom(zoom);
        };
        
        // Receives: Locator to send the trigger to.
        // Returns: Nothing.
        // Does: Sends an event with the specified configuration containing the
        //       currently selected feature.
        // Notes:
        //  * Default trigger is 'selected-feature'
        //  * Default locator is $(this)
        this.getSelectedFeature = function (event, locator) {
            var trigger = this.attr.private.triggers.selectedFeature;
            
            if (this.isValidObject(locator)) {
                $(locator).trigger(trigger, this.attr.private.selected);
            }
            else {
                $(this).trigger(trigger, this.attr.private.selected);
            }
        };
        
        // Receives: Event object and dom node clicked.
        // Returns: Nothing.
        // Does: If by config is requested to center map, does it on the marker,
        //      also runs the triggerFunction, if declared (!== undefined).
        // Notes:
        //  * This method passes the feature, the corresponding dom node and the 
        //    previously selected feature to the triggerFunction, if any.
        this.markerClicked = function (event, dom) {
            var f = this.getFeatureByTitle(dom);
            if (f !== null) {
                if (typeof this.attr.markerClicked.triggerFunction !== 'undefined') {
                    this.attr.markerClicked.triggerFunction(f, dom, this.attr.private.selected);
                    this.setFeatures(this.attr.private.markerLayer.features());
                }
                if (this.attr.markerClicked.center) {
                    // Feature coordinates are reversed!
                    this.centerMap(f.geometry.coordinates[1], f.geometry.coordinates[0]);
                }
            }
            
            this.attr.private.selected = f; 
        };
        
        // Receives: The markerTitle to use as finder (optional), the property 
        //      to update and the new value.
        // Returns: Nothing.
        // Notes: if markerTitle is null, all markers will be updated.
        this.updateFeatureProperty = function (event, markerTitle, property, value) {
            
            var fn = function (feature) {
                feature.properties[property] = value;
            };
            
            var self = this;
            $.each(this.attr.private.markerLayer.features(), function (k,v) {
                if (self.isValidObject(markerTitle)) {
                    debugger
                    if (v.properties.title === markerTitle) fn(v);
                }
                else fn(v);
            });
            
            this.setFeatures(this.attr.private.markerLayer.features());
            
        };
        
        // =====================================================================
        // Component Initializer
        // =====================================================================
        
        this.after('initialize', function() {
            // Prepare dom
            this.$node.addClass('fit');
            this.$nodeMap = $('<div>').addClass('mapbox').appendTo(this.$node);
            // Attach map
            this.attr.private.map = mapbox.map(this.$nodeMap[0]);
            // Load map id
            this.attr.private.map.addLayer(mapbox.layer().id(this.attr.map.id));
            // Set zoom ranges and center
            this.attr.private.map.setZoomRange(this.attr.map.minZoom, this.attr.map.maxZoom);
            this.attr.private.map.centerzoom(this.attr.map.center, this.attr.map.initialZoom);
            // Show zoom buttons if required
            if (this.attr.private.map.zoomButtons) this.attr.private.map.ui.zoomer.add();
            this.attr.private.map.centerzoom(
                    this.attr.map.center, 
                    this.attr.map.initialZoom);
            // If I already have markers, paint them.
            this.setFeatures();
            
            // Map callbacks ===================================================
            var features = this.attr.private.markerLayer.features();
            var self = this;
            this.attr.private.map.addCallback('zoomed', function () {
                self.attr.whenZoomed(features);
            });
            this.attr.private.map.addCallback('panned', function () {
                self.attr.whenPanned(features);
            });
            
            // Component API ===================================================
            
            // Internal
            this.on('marker-clicked',this.markerClicked);
            // Center map:  [lat, lon]
            this.on('center-map', function (e,lat,lon) {this.centerMap(lat,lon);});
            // Add feature: feature
            this.on('add-feature', this.addFeature);
            // Set features: [features]
            this.on('set-features', function (e,f) {this.setFeatures(f);});
            // Announce features: (locator*)
            this.on('announce-features', this.announceFeatures);
            this.on('zoom-map', this.zoomMap);
            this.on('get-selected-feature', this.getSelectedFeature);
            // (markerTitle*, property, value)
            this.on('update-feature-property', this.updateFeatureProperty);
            this.on('center-on-feature', function (event, title) {
                var f = this.getFeatureByTitle(title).geometry.coordinates;
                this.centerMap(f[1],f[0]);
            });
        });

    } // </function Component()>
    
}); // </function(ComponentManager)>




