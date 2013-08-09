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
* **'unselect-feature'** _(function callback)_: Unselect current feature

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
            customTooltip : function (feature) {
                return feature.properties.title;
            },
            createOffscreenIndicators: false,
            features: [],
            markerColorOK: '#5D909F',
            markerColorWARN: '#CB3337',
            markerSimpleSymbol: 'circle',
            distanceToGroup: 400,
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

        var $tooltip = null; // tooltip element
        var $groupTooltip = null; // tooltip element
        this.$nodeMap = null; // map element

        var _tooltip = {
            TEMPLATE : ['<div class="hover-tooltip marker-tooltip">'+
                    '<div class="tooltip-arrow-border"></div>'+
                    '<div class="tooltip-arrow"></div>'+
                    '<div class="tooltip-content"></div>'+
                '</div>'].join(),
            GROUP_TEMPLATE : ['<div class="group-tooltip marker-tooltip">'+
                    '<div class="tooltip-arrow-border"></div>'+
                    '<div class="tooltip-arrow"></div>'+
                    '<div class="tooltip-content"></div>'+
                '</div>'].join(),
            show:function(markerElement, htmlContent, isGroup){
                isGroup = (isGroup === undefined ? false:isGroup);

                var contentElement = isGroup ? $groupTooltip : $tooltip;

                $('.tooltip-content', contentElement).html(htmlContent || '');
                _tooltip._updateContainerPositon(contentElement, markerElement);
                contentElement.
                    show().
                    data('markerElement', markerElement);
                if(isGroup){
                    $('.tooltip-content', contentElement).wrapInner('<div class="scroll-container">');
                    if( $('.scroll-container', contentElement)['jScrollPane'] ){
                        $('.scroll-container', contentElement).jScrollPane();
                    }
                }
            },
            hide:function(isGroup){
                isGroup = (isGroup === undefined ? false:isGroup);
                var content = isGroup ? $groupTooltip : $tooltip;
                content.
                    hide().
                    removeData('markerElement');
            },
            updatePositon: function(){
                var markerElement = $tooltip.data('markerElement');
                var markerElementOfGroup = $groupTooltip.data('markerElement');
                if(markerElement){
                    _tooltip._updateContainerPositon($tooltip, markerElement);
                }
                if(markerElementOfGroup){
                    _tooltip._updateContainerPositon($groupTooltip, markerElementOfGroup);
                }
            },
            updateMarkerElementOfGroup:function(markerElement){
                $groupTooltip.data('markerElement', markerElement);
            },
            _updateContainerPositon: function(tooltipContainer, markerElement){
                var position = $(markerElement).position();
                position.left -= (tooltipContainer.outerWidth() / 2);
                tooltipContainer.css(position);
            }
        };

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
            var distanceToGroup = this.attr.distanceToGroup;
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
                return distance <= distanceToGroup;
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

            // First feature filter: check all features are valid.
            var self = this;
            features = $.grep(features, function (ft) {
                return self.isCorrectFeature(ft);
            });

            //<editor-fold defaultstate="collapsed" desc="Feature external processing">


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

            //</editor-fold>


            // Auto group markers?
            if (this.attr.map.groupMarkers) {
                features = this.markerAutogroup(features,this.attr.private.map);
            }

            //<editor-fold defaultstate="collapsed" desc="Marker layer and marker factory">


            // Create layer
            var markerLayer = mapbox.markers.layer().features(features);
            // Create marker
            markerLayer.factory($.proxy(function(feature) {
                var dom = null;
                if (typeof feature.properties.customMarkerBuilder === 'function') {
                    dom = feature.properties.customMarkerBuilder(feature);
                    $(dom).addClass('marker-custom');
                }
                // Use default feature builder
                else {
                    dom = mapbox.markers.simplestyle_factory(feature);
                }
                feature.isGroup = (feature.properties.submarkers.length>0);
                feature.isSelected = this.isSelected(feature);

                if(feature.isGroup && feature.isSelected){
                    _tooltip.updateMarkerElementOfGroup(dom);
                }

                if(feature.isGroup){
                    $.map(feature.properties.submarkers, $.proxy(function(f){
                        f.isSelected = this.isSelected(f);
                        return f;
                    }, this) );
                }

                $(dom).click($.proxy(function () {
                    var item = feature.item;
                    if(feature.isGroup){
                        item = feature.properties.submarkers[0].item;
                        feature.properties.submarkers[0].isSelected = true;
                    }

                    this.markerClicked(null, this, feature);
                    if (item) {
                        this.trigger('itemselected', { item: item });
                    }
                    _tooltip.hide(true);
                }, this));

                if(this.attr.map.showTooltip){
                    var customTooltip = this.attr.customTooltip;
                    $(dom).hover($.proxy(function(){
                        var content = feature.properties.title;

                        if( $.isFunction(customTooltip) ){
                            content = customTooltip(feature, feature.isSelected);
                        }else if( customTooltip ){
                            content = customTooltip;
                        }
                        _tooltip.show(dom, content, (feature.isSelected && feature.isGroup));
                    },this), $.proxy(function(){
                        _tooltip.hide();
                    },this));
                    var forceHover = function(){
                        $(dom).trigger('mouseover');
                    };

                    if(feature.isGroup && feature.isSelected){
                        window.setTimeout(forceHover,100);
                    }
                }

                return dom;
            }, this));

            markerLayer.key (function (f) {
                return f.properties.title;
            });

            this.attr.private.map.removeLayer('markers');
            this.attr.private.map.addLayer(markerLayer);
            this.attr.private.markerLayer = markerLayer;
        };

        // Checks if the feature is correct to show, this is, it has to have
        // title and position, at the very least
        // Receives: Feature to test (GeoJson object)
        // Returns: True, if valid, false otherwise
        this.isCorrectFeature = function (feature) {
            // Feature must have a title
            if (feature.properties.title === undefined) return false;
            // Title cannot be empty
            if (feature.properties.title === '') return false;
            // Feature must have location
            if (feature.geometry.coordinates === undefined) return false;
            // Feature mush have at least two coordinates
            var loc = feature.geometry.coordinates;
            if (loc.length < 2) return false;
            // Coordinates must be defined as numbers
            if (typeof loc[0] !== 'number') return false;
            if (typeof loc[1] !== 'number') return false;
            return true;
        };

        // Receives: The new feature GeoJson object to add.
        // Returns: Nothing.
        // Does: Adds the feature to the default markerlayer.
        this.addFeature = function (event, feature) {

            if (this.isCorrectFeature(feature)) {
                if (typeof feature.properties.submarkers === 'undefined') {
                    feature.properties.submarkers = [];
                    feature.properties.isGroup = false;
                }

                this.attr.private.markerLayer.add_feature(feature);
                if (this.attr.createOffscreenIndicators) {
                    this.updateOffscreenIndicators();
                }
            }
            else {
                console.warn('Requested new feature has some missing fields (\n\
                    minimum are title and location): ' + JSON.stringify(feature));

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
            var title='';
            if (typeof obj === 'object') title = $(obj).attr('alt');
            else title = obj;

            var features = this.attr.private.markerLayer.features();
            var getFeature = function(features){
                var feature = null;
                for(var v, i=features.length;i--;){
                    v = features[i];
                    if(v.properties.submarkers.length){
                        feature = getFeature(v.properties.submarkers);
                    }else{
                        feature = (v.properties.title === title) ? v : feature;
                    }
                    if(feature){
                        break;
                    }
                }
                return feature;
            };
            return getFeature(features);
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
            // Skips preprocessor, not to recalculate groups
            var skipPreprocessor = true;
            if (ft) {
                ft = ft.properties.submarkers[0] || ft;

                if (typeof this.attr.markerClicked.onClickFn !== 'undefined') {
                    this.attr.markerClicked.onClickFn(ft, this.attr.private.selected, dom);

                    this.attr.private.selected = ft;
                    this.setFeatures(this.attr.private.markerLayer.features(), skipPreprocessor);
                }
                if (this.attr.markerClicked.center) {
                    // Feature coordinates are reversed!
                    this.centerMap(ft.geometry.coordinates[1], ft.geometry.coordinates[0]);
                }
            }
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
            var markers = this.attr.private.markerLayer.markers();
            var dimensions = this.attr.private.map.dimensions;

            $.each(this.select('selectOffscreenIndicator'), function(key, value) {
                $(value).hide();
                $(value).html('0');
                $(value).attr('title');
                $(value).data('locations', []);
            });

            $.each(markers, $.proxy(function(i, markerData){
                var marker = markerData.data;
                var element = $(markerData.element);
                var locator = '.';
                var position = element.position();
                var markerDimesion = {w:element.width()};
                var count = 1;

                if (position.top < markerDimesion.w) locator += 'n';
                else if (position.top > dimensions.y) locator += 's';

                if (position.left > dimensions.x) locator += 'e';
                else if (position.left < markerDimesion.w) locator += 'w';

                locator += 'markers';

                if (marker.properties.isGroup === true) {
                    count = marker.properties.submarkers.length;
                    count = count === 0 ? 1 : count;
                }

                if (locator !== '.markers') {
                    this.attr.selectOffscreen = locator;
                    count += parseInt(this.select('selectOffscreen').html());
                    this.select('selectOffscreen').
                        html(count).
                        show().
                        attr('last', marker.properties.title).
                        data('locations').push(markerData.location);
                }
            }, this));
        };

        this.isSelected = function(feature){
            var currentSelected = this.attr.private.selected;
            var isSelected = false;
            if(currentSelected){
                if(feature.isGroup){
                    $.each(feature.properties.submarkers, function(index, f){
                        var tmpSelected = (f.properties.title === currentSelected.properties.title);
                        if(tmpSelected){
                            isSelected = true;
                        }
                    });
                }else{
                    isSelected = (feature.properties.title === currentSelected.properties.title);
                }
            }
            return isSelected;
        };

        //</editor-fold>

        // =====================================================================
        // Component Initializer
        // =====================================================================

        this.setComponent = function () {
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
                    var locations = $.merge([], $(this).data('locations'));
                    var location = locations.pop();
                    var updater = function(){
                        self.updateOffscreenIndicators();
                        _tooltip.updatePositon();
                    };
                    var panLimits;
                    if(locations.length){
                        //MM está defindo en MapBox
                        panLimits = new MM.Extent(location, locations.pop());
                        panLimits.encloseLocations(locations);
                        self.attr.private.map.setExtent(panLimits);
                    }else if(location){
                        self.attr.private.map.center(location, false);
                    }
                    window.setTimeout(updater,100);
                });
            }

            // Map callbacks ===================================================

            //<editor-fold defaultstate="collapsed" desc="Callbacks">

            var features = this.attr.private.markerLayer.features();
            this.attr.private.map.addCallback('zoomed', function () {
                _tooltip.hide(true);
                var map = self.attr.private.map;
                // Auto group markers?
                if (self.attr.map.groupMarkers) {
                    var features = self.attr.private.markerLayer.features();
                    features = self.markerAutogroup(features,map);
                    self.setFeatures(features,false);
                }
                self.attr.whenZoomed(features);
            });
            this.attr.private.map.addCallback('panned', function () {
                _tooltip.updatePositon();
                self.attr.whenPanned(features);
            });
            if (this.attr.createOffscreenIndicators){
                this.attr.private.map.addCallback('resized', $.proxy(this.updateOffscreenIndicators,this));
                this.attr.private.map.addCallback('zoomed', $.proxy(this.updateOffscreenIndicators,this));
                this.attr.private.map.addCallback('panned', $.proxy(this.updateOffscreenIndicators,this));
            }

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

                var coordinate;
                var f = this.getFeatureByTitle(title);
                if(f){
                    coordinate = f.geometry.coordinates;
                    this.centerMap(coordinate[1],coordinate[0]);
                }else{
                    throw 'Event center-on-feature / Feature not found: '+title;
                }
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

            this.on('update-selected-feature', function (event, callback) {
                if (this.attr.private.selected) {
                    var cur = this.attr.private.selected;
                    callback(cur);
                    this.selected = null;
                    this.setFeatures(this.attr.private.markerLayer.features());
                }
            });

            this.on('autocenter', function () {
                var feature = this.attr.private.markerLayer.features[0];
                if (typeof feature !== 'undefined') {
                    var loc = feature.geometry.coordinates;
                    this.centerMap(loc[1],loc[0]);
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
                    if (o.value.format !== undefined && o.value.features !== undefined) {
                        values = this.dataFormats[o.value.format](o.value.features);
                    }
                }
                this.setFeatures(values);
            });

            this.on('tooltip-group-hide', function(){
                _tooltip.hide(true);
            });

            var markerColorOK = this.attr.markerColorOK;
            var markerColorWARN = this.attr.markerColorWARN;
            var markersimbol = this.attr.markerSimpleSymbol;
            var getMarkerColor
            if (this.attr.getMarkerColor && $.isFunction(this.attr.getMarkerColor)) {
                getMarkerColor = this.attr.getMarkerColor;
            };

            this.dataFormats = {
                asset: function (features) {
                    return $.map(features, function(f) {
                        var location = f.asset && f.asset.location;
                        var markercolor = markerColorOK;

                        if (getMarkerColor) markercolor = getMarkerColor(f);
                        else if (f.errors !== undefined && f.errors.length > 0) {
                            markercolor = markerColorWARN;
                        }
                        if (location) {
                            return {
                                geometry: { coordinates:
                                    [location.longitude,
                                     location.latitude]
                                },
                                properties: {
                                    'marker-color': markercolor,
                                    'marker-symbol': markersimbol,
                                    'title': f.asset.name
                                },
                                item: f
                            };
                        }
                    });
                }
            };
        };

        this.after('initialize', function() {
            this.$node.addClass('m2m-mapviewer fit');
            this.$nodeMap = $('<div>').addClass('mapbox').appendTo(this.$node);
            $tooltip = $(_tooltip.TEMPLATE).prependTo(this.$node);
            $groupTooltip = $(_tooltip.GROUP_TEMPLATE).prependTo(this.$node);

            this.setComponent();
            this.setAPI();
            // =================================================================
        });

        // =====================================================================

    } // </function Component()>

    return ComponentManager.create('mapViewer', Component, DataBinding);

}); // </function(ComponentManager)>




