/*
Mapbox map component.

### Style
* mapViewer.less

### Config
```
this.defaultAttrs({
            // Do NOT modify these selectors!!
            selectMapbox: '.mapbox',
            selectOffscreenIndicator: '.offscreen-indicator',
            map: {
                id: 'keithtid.map-w594ylml',
                center: {lat: 40.414431, lon: -3.703696},
                maxZoom: 20,
                minZoom: 12,
                initialZoom: 15,
                zoomButtons: true,
                showTooltip: true,
                groupMarkers: true
            },
            markerClicked: {
                center: true,
                onClickFn: function (f, dom) {}
            },
            private: {
                map: null,
                markerLayer: null,
                markers: [],
                selected: null
            },
            // featuresPreprocessor: null,
            customTooltip : '',
            createOffscreenIndicators: false,
            features: [],
            markerColorOK: '#5D909F',
            markerColorWARN: '#CB3337',
            whenZoomed: function () {},
            whenPanned: function () {}
        });
```

### API
* **'center-map'** _(float lat, float lon)_: Centers map at the given position.
* **'add-feature'** _(GeoJson feature)_: Add a new feature (and marker) to the map, and updates.
* **'set-features'** _([GeoJson] features, boolean skipPreprocessing)_: Removes all markers and replaces them with the array provided. If skipPreprocessing is false, the preprocessing function provided will not be called.
* **'announce-features'** _(locator)_: Requests the component to sent an event to the provided locator, with the features array, the map extent, and the current center. The event sent will be: 'feature-announcement'.
* **'zoom-map'** _(int zoomLevel)_: Sets the current zoom to the value specified.
* **'get-selected-feature'** _(string locator)_: Requests the component to sent an event to the provided locator, with the currently selected feature, or null if there is none. The event sent will be: 'feature-selected'.
* **'update-feature-property'** _(string markerTitle, String property, Object value)_: Finds the feature with the given title, and sets the property to the given value.
* **'center-on-feature'** _(string featureTitle)_: Centers the map on the feature with the title property given.
* **'reload-features'**: Destroys current map, and recreates it with the current features.
* **'select-feature'** _(string featureTitle, function callback)_: Finds the feature with the given title property, and runs the callback function with it.

### Generated events
* **'marker-clicked'** _(DOM node, GeoJSon feature)_: Issued when a marker is clicked.
*/

define(
[
    'components/component_manager',
    'components/mixin/data_binding'
],
function(ComponentManager, DataBinding) {



    function Component() {

        // =====================================================================
        // Configuration
        // =====================================================================
        this.defaultAttrs({
            // Do NOT modify these selectors!!
            selectMapbox: '.mapbox',
            selectOffscreenIndicator: '.offscreen-indicator',
            map: {
                id: 'keithtid.map-w594ylml',
                center: {lat: 40.414431, lon: -3.703696},
                maxZoom: 20,
                minZoom: 12,
                initialZoom: 15,
                zoomButtons: true,
                showTooltip: true,
                groupMarkers: true
            },
            markerClicked: {
                center: true,
                onClickFn: function (ft, sel, dom) {}
            },
            private: {
                map: null,
                markerLayer: null,
                markers: [],
                selected: null
            },
            // featuresPreprocessor: null,
            customTooltip : '',
            createOffscreenIndicators: false,
            features: [],
            markerColorOK: '#5D909F',
            markerColorWARN: '#CB3337',
            whenZoomed: function () {},
            whenPanned: function () {}
        });

        //<editor-fold defaultstate="collapsed" desc="Html templates">

        this.offscreenIndicatorsHtml =
            '<div class="offscreen-indicator nwmarkers">0</div>' +
            '<div class="offscreen-indicator nmarkers">0</div>' +
            '<div class="offscreen-indicator nemarkers">0</div>' +
            '<div class="offscreen-indicator emarkers">0</div>' +
            '<div class="offscreen-indicator semarkers">0</div>' +
            '<div class="offscreen-indicator smarkers">0</div>' +
            '<div class="offscreen-indicator swmarkers">0</div>' +
            '<div class="offscreen-indicator wmarkers">0</div>';

        //</editor-fold>

        // =====================================================================
        // Functions
        // =====================================================================

        //<editor-fold defaultstate="collapsed" desc="Component methods">

        // Receives: An object to check.
        // Returns: true if not undefined or null, false otherwise.
        this.isValidObject = function (obj) {
            if (typeof obj === 'undefined') return false;
            if (obj === null) return false;
            return true;
        };

        // Receives: features to process, and the map they are in
        // Returns: The features already processed
        this.markerAutogroup = function (inFeatures, map) {
            var marker;
            var markerList = [];
            var features = [];
            var groupID = 0;
            var colorOK = this.attr.markerColorOK;
            var colorWARN = this.attr.markerColorWARN;

            // Reset groups
            $.each(inFeatures, function (k,v) {
                if (typeof v.properties.isGroup !== 'undefined') {
                    if (v.properties.submarkers.length === 0) {
                        v.properties.isGroup = false;
                        v.properties.submarkers = [];
                        features.push(v);
                    }
                    else {
                        $.each(v.properties.submarkers, function (i,m) {
                            m.properties.isGroup = false;
                            m.properties.submarkers = [];
                            features.push(m);
                        });
                    }
                }
                else {
                    v.properties.isGroup = false;
                    v.properties.submarkers = [];
                    features.push(v);
                }
            });

            var areClose = function (feature1, feature2) {

                var point1 = map.locationPoint({
                                lat: feature1.geometry.coordinates[0],
                                lon: feature1.geometry.coordinates[1]
                            });
                var point2 = map.locationPoint({
                                lat: feature2.geometry.coordinates[0],
                                lon: feature2.geometry.coordinates[1]
                            });
                var diffX = point1.x - point2.x;
                var diffY = point1.y - point2.y;
                var distance = diffX * diffX + diffY * diffY;
                return distance <= 300;
            };

            var canJoin = function (a,b) {
                // Can't join to itself
                if (a === b) return false;
                // If isGroup value is there, I can't join (either is already in
                // a group, or is a group by itself)
                if (b.properties.isGroup !== false) return false;
                return areClose(a,b);
            };

            var doJoin = function (marker, submarker) {
                if (marker === null) {
                    marker = {
                        geometry: { coordinates: [ 0.0, 0.0 ] },
                        properties: {
                            'marker-color':colorOK,
                            'marker-symbol':'circle',
                            'marker-size':'medium',
                            title: 'group_' + groupID,
                            caption: submarker.title,
                            isGroup: true,
                            submarkers: [submarker]
                        }

                    };
                    groupID += 1;
                }
                else {
                    marker.properties.submarkers.push(submarker);
                    marker.properties.caption += ' ' + submarker.title;
                }
                submarker.properties.isGroup = true;
                return marker;
            };

            var updateGroupMarkers = function (list) {
                $.each(list, function (k,v){
                    if (v.properties.submarkers.length > 0) {
                        v.properties['marker-symbol'] = v.properties.submarkers.length;
                        var lat = 0;
                        var lon = 0;
                        var color = colorOK;
                        var inc = function(v) {
                            lat += v.geometry.coordinates[0];
                            lon += v.geometry.coordinates[1];
                            if (color === colorWARN  ||
                                    v.properties['marker-color'] === colorWARN)
                            {
                                color = colorWARN;
                            }
                        };
                        $.each(v.properties.submarkers, function(k,v){inc(v)});
                        var count = v.properties.submarkers.length;
                        v.geometry.coordinates = [lat / count, lon / count];
                        v.properties['marker-color'] = color;
                    }
                });
            };

            $.each(features, function (index,a) {
                if (!a.properties.isGroup) {
                    marker = null;
                    $.each(features, function (k,b) {
                        if (canJoin(a,b) === true) {
                            if (marker === null) marker = doJoin(marker,a);
                            marker = doJoin(marker,b);
                        };
                    });
                    if (marker === null) {
                        a.properties.isGroup = true;
                        marker = a;
                    }
                    markerList.push(marker);
                }
            });
            updateGroupMarkers(markerList);
            return markerList;
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
        this.setFeatures = function (features, skipPreprocessor) {
            if (!this.isValidObject(skipPreprocessor)) skipPreprocessor = false;

            if (typeof features === 'undefined' || features === null) {
                if (this.attr.private.markerLayer !== null) {
                    features = this.attr.private.markerLayer.features();
                }
                else features = this.attr.features;
            }

            if (typeof this.attr.featuresPreprocessor === 'function') {
                if (!skipPreprocessor) {
                    try {
                        features = this.attr.featuresPreprocessor (features, this.attr.private.map);
                        if (typeof features === 'undefined') {
                            console.warn('Attention: Preprocessor must return the feature list');
                        }
                    }
                    catch (err) {
                        console.log('Error on feature preprocessor: ' + err);
                    }
                }
            }

            // Auto group markers?
            if (this.attr.map.groupMarkers) {
                features = this.markerAutogroup(features,this.attr.private.map);
            }

            // Create layer
            var markerLayer = mapbox.markers.layer().features(features);
            // Create marker
            markerLayer.factory($.proxy(function(feature) {
                var dom = null;
                if (typeof feature.properties.customMarkerBuilder === 'function') {
                    dom = feature.properties.customMarkerBuilder(feature);
                }
                // Use default feature builder
                else {
                    dom = mapbox.markers.simplestyle_factory(feature);
                }

                $(dom).click($.proxy(function () {
                    if (feature.item) {
                        this.trigger('itemselected', { item: feature.item });
                    }
                    this.trigger('marker-clicked', [this, feature]);
                }, this));

                return dom;
            }, this));

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

            if (typeof feature.properties.submarkers === 'undefined') {
                feature.properties.submarkers = [];
                feature.properties.isGroup = false;
            }

            this.attr.private.markerLayer.add_feature(feature);
            if (this.attr.createOffscreenIndicators) {
                this.updateOffscreenIndicators();
            }
        };

        // Receives: Jquery locator to send the trigger to.
        // Returns: Nothing.
        // Does: Sends an event with the specified configuration containing the
        //       array of features currently on the default markerlayer.
        // Notes:
        //  * Default trigger is 'feature-announcement'
        //  * Default locator is $(this)
        this.announceFeatures = function (event, locator) {
            var trigger = 'feature-announcement';

            if (this.isValidObject(locator)) {
                $(locator).trigger(trigger, [this.attr.private.markerLayer.features(),
                    this.attr.private.map.getExtent(), this.attr.private.map.getCenter()]);
            }
            else {
                this.$node.trigger(trigger, [this.attr.private.markerLayer.features(),
                    this.attr.private.map.getExtent(), this.attr.private.map.getCenter()]);
            }
        };

        // Receives: Dom node to find corresponding feature or feature title.
        // Returns: GeoJson object of the feature if found, null otherwise.
        // Notes: Uses 'alt' attribute to query, corresponding to feature title.
        this.getFeatureByTitle = function (obj) {

            if (typeof obj === 'object') title = $(obj).attr('alt');
            else title = obj;
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
            var trigger = 'feature-selected';

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
        //      also runs the onClickFn, if declared (!== undefined).
        // Notes:
        //  * This method passes the feature, the corresponding dom node and the
        //    previously selected feature to the onClickFn, if any.
        this.markerClicked = function (event, dom, ft) {
            if ((typeof ft !== 'undefined') && (ft !== null)) {
                if (typeof this.attr.markerClicked.onClickFn !== 'undefined') {
                    this.attr.markerClicked.onClickFn(ft, this.attr.private.selected, dom);
                    // Skips preprocessor, not to recalculate groups
                    var skipPreprocessor = true;
                    this.setFeatures(this.attr.private.markerLayer.features(), skipPreprocessor);
                }
                if (this.attr.markerClicked.center) {
                    // Feature coordinates are reversed!
                    this.centerMap(ft.geometry.coordinates[1], ft.geometry.coordinates[0]);
                }
            }

            this.attr.private.selected = ft;
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
                    if (v.properties.title === markerTitle) fn(v);
                }
                else fn(v);
            });

            this.setFeatures(this.attr.private.markerLayer.features());

        };

        // Receives: Nothing.
        // Returns: Nothing.
        // Does: Updates screen indicators, used when zoomed or panned
        this.updateOffscreenIndicators = function () {
            var data = this.attr.private.markerLayer.features();
            var extent = this.attr.private.map.getExtent();

            $.each(this.select('selectOffscreenIndicator'), function(key, value) {
                $(value).hide();
                $(value).html('0');
                $(value).attr('title');
            });

            for (x in data) {
                var el = data[x];
                var lat = el.geometry.coordinates[1];
                var lon = el.geometry.coordinates[0];
                var locator = '.';

                if (lat > extent.north) locator += 'n';
                else if (lat < extent.south) locator += 's';

                if (lon > extent.east) locator += 'e';
                else if (lon < extent.west) locator += 'w';

                locator += 'markers';

                if (locator !== '.markers') {
                    this.attr.selectOffscreen = locator;
                    this.select('selectOffscreen');
                    var count = parseInt(this.select('selectOffscreen').html()) + 1;
                    this.select('selectOffscreen').html(count);
                    this.select('selectOffscreen').show();
                    this.select('selectOffscreen').attr('last', el.properties.title);
                }
            }
        };

        //</editor-fold>

        // =====================================================================
        // Component Initializer
        // =====================================================================

        this.setComponent = function () {
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
            this.attr.private.map.ui.zoomer.add(this.attr.map.zoomButtons);
            this.attr.private.map.centerzoom(
                    this.attr.map.center,
                    this.attr.map.initialZoom);
            // If I already have markers, paint them.
            this.setFeatures();

            var self = this;
            // If offscreen indicators are required, add them to the node and create handler
            if (this.attr.createOffscreenIndicators === true) {
                this.$nodeMap = $(this.offscreenIndicatorsHtml).appendTo(this.$node);

                this.select('selectOffscreenIndicator').on('click', function(event) {
                    self.select('selectMapbox').trigger('center-on-feature', $(event.target).attr('last'));
                    self.updateOffscreenIndicators();
                });
            }

            // Map callbacks ===================================================

            //<editor-fold defaultstate="collapsed" desc="Callbacks">

            var features = this.attr.private.markerLayer.features();
            this.attr.private.map.addCallback('zoomed', function () {
                var map = self.attr.private.map;
                if (self.attr.createOffscreenIndicators) self.updateOffscreenIndicators();
                // Auto group markers?
                if (self.attr.map.groupMarkers) {
                    var features = self.attr.private.markerLayer.features();
                    features = self.markerAutogroup(features,map);
                    self.setFeatures(features,false);
                }
                self.attr.whenZoomed(features);
            });
            this.attr.private.map.addCallback('panned', function () {
                if (self.attr.createOffscreenIndicators) self.updateOffscreenIndicators();
                self.attr.whenPanned(features);
            });
            //</editor-fold>

        };

        this.setAPI = function () {
            // Internal (will bubble up!)
            this.on('marker-clicked',this.markerClicked);
            // Center map:  [lat, lon]
            this.on('center-map', function (e,lat,lon) {this.centerMap(lat,lon);});
            // Add feature: feature
            this.on('add-feature', this.addFeature);
            // Set features: [features]
            this.on('set-features', function (e,f,skip) {
                this.setFeatures(f, skip);
            });
            // Announce features: (locator*)
            this.on('announce-features', this.announceFeatures);
            // Zoom (zoomLevel)
            this.on('zoom-map', this.zoomMap);
            this.on('get-selected-feature', this.getSelectedFeature);
            // (markerTitle*, property, value)
            this.on('update-feature-property', this.updateFeatureProperty);
            // (feature.properties.title)
            this.on('center-on-feature', function (event, title) {
                var f = this.getFeatureByTitle(title).geometry.coordinates;
                this.centerMap(f[1],f[0]);
            });
            this.on('reload-features', function () {
                this.setFeatures(this.attr.private.markerLayer.features());
            });
            this.on('select-feature', function (event, featureTitle, callback) {
                var f = this.getFeatureByTitle(featureTitle);
                if (f !== null) {
                    var previouslySelected = this.attr.private.selected;
                    callback(f,previouslySelected);
                    this.attr.private.selected = f;
                    this.setFeatures(this.attr.private.markerLayer.features());
                    this.select(this.attr.selectMapbox).trigger('feature-selected', f);
                }
            });
            this.on('unselect-feature', function (event, callback) {
                var currentSelected = this.attr.private.selected;
                if (currentSelected !== null) {
                    callback(currentSelected);
                    this.attr.private.selected = null;
                    this.setFeatures(this.attr.private.markerLayer.features());
                }
            });
            this.on('valueChange', function (e, o) {
                var values = o.value;
                if ($.isPlainObject(values)) {
                    values = this.dataFormats[o.value.format](o.value.features);
                }
                this.setFeatures(values);
            });

            this.dataFormats = {
                asset: function (features) {
                    return $.map(features, function(f) {
                        var location = f.asset && f.asset.location;
                        if (location) {
                            return {
                                geometry: { coordinates:
                                    [location.longitude,
                                     location.latitude]
                                },
                                properties: {
                                    'marker-color': '#000',
                                    'title': f.name
                                },
                                item: f
                            };
                        }
                    });
                }
            };
        };

        this.after('initialize', function() {
            this.setComponent();
            this.setAPI();
            // =================================================================
        });

        // =====================================================================

    } // </function Component()>

    return ComponentManager.create('mapViewer', Component, DataBinding);

}); // </function(ComponentManager)>




