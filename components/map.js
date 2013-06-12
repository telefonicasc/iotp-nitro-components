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
            'components/component_manager',
            'libs/mapbox'
        ],
        function(ComponentManager) {

            return ComponentManager.create('map', Map);

            function Map() {

                /* === Mapbox map component instance === */
                var mapC = null;

                /* === Component default attributes === */
                this.defaultAttrs({
                    mapId: 'keithtid.map-w594ylml',
                    center: {lat: 40.414431, lon: -3.703696},
                    zoomInitial: 15,
                    zoomMin: 15,
                    zoomMax: 20,
                    showZoomButtons: true,
                    features: [],
                    markers: [],
                    markerAnnounceTrigger: 'announce-trigger',
                    markerClickEventTarget: '',
                    markerClickEvent: 'marker-clicked',
                    hoveringTooltip: true,
                    centerOnClick: true,
                    unselectedSymbol: 'circle-stroked',
                    unselectedColor: '#0000FF',
                    selectedSymbol: 'circle',
                    selectedColor: '#00FF00',
                    selected: 0
                });

                /* Groups markers in groups if necessary */
                this.processFeatures = function(map, features) {
                    var currentGroup = 0;
                    var markerGroup = [];
                    var markers = [];
                    var hasGroups = false;

                    console.log('Processing features -----------------------');
                    
                    // set all groups to -1
                    $.each(features, function (k,v){
                        v.properties.group = -1;                        
                    });

                    $.each(features, function(k, current) {
                        if (current.properties.group < 0) {
                            var marker = {
                                name: current.properties.title,
                                lat: current.geometry.coordinates[0],
                                lon: current.geometry.coordinates[1],
                                group: current.properties.group,
                                point: map.locationPoint({
                                    lat: current.geometry.coordinates[0],
                                    lon: current.geometry.coordinates[1]
                                })
                            };

                            var compare = function(marker, candidate) {
                                if (typeof candidate.properties.group === 'undefined') {
                                    candidate.properties.group = -1;
                                }

                                var otherMarker = {
                                    name: candidate.properties.title,
                                    lat: candidate.geometry.coordinates[0],
                                    lon: candidate.geometry.coordinates[1],
                                    group: candidate.properties.group,
                                    point: map.locationPoint({
                                        lat: candidate.geometry.coordinates[0],
                                        lon: candidate.geometry.coordinates[1]
                                    })
                                };

                                var diffX = otherMarker.point.x - marker.point.x;
                                var diffY = otherMarker.point.y - marker.point.y;
                                var distance = diffX * diffX + diffY * diffY;
                                if (distance > 0 && distance < 500 && otherMarker.group < 0) {
                                    if (current.properties.group < 0) {
                                        current.properties.group = currentGroup;
                                        markerGroup.push(current);
                                    }
                                    candidate.properties.group = currentGroup;
                                    markerGroup.push(candidate);
                                }
                            };
                            // Compare with others
                            $.each(features, function(k, v) {
                                if (v.properties.group < 0) {
                                    compare(marker, v);                                    
                                }
                            });
                            
                            if (markerGroup.length > 0) {
                                // calculate group center
                                var lat = 0;
                                var lon = 0;
                                var inc = function(v) {
                                    lat += v.geometry.coordinates[1];
                                    lon += v.geometry.coordinates[0];
                                };
                                $.each(markerGroup, function(k, v) {
                                    inc(v);
                                });

                                var center = {lat: lat / markerGroup.length, lon: lon / markerGroup.length};
                                // create marker to push
                                var groupMarker = {
                                    geometry: {
                                        coordinates: [center.lon, center.lat]
                                    },
                                    properties: {
                                        'marker-color': '#CB3337',
                                        'marker-symbol': markerGroup.length,
                                        title: 'Group ' + currentGroup,
                                        groupID: currentGroup,
                                        isGroup: true
                                    }
                                };
                                markers.push(groupMarker);
                                hasGroups = true;
                            }
                            
                            else {
                                current.properties.isGroup = false;
                                current.properties.group = currentGroup;
                                markers.push(current);
                            }
                            markerGroup = [];
                            currentGroup += 1;
                        }
                    });
                    if (hasGroups) {
                        // setFeatures modifies the attr, and we need it intact!
                        var currentFeatures = features;
                        this.setFeatures(markers);
                        this.attr.features = currentFeatures;
                    }
                    else {
                        this.setFeatures(features);
                    }
                };

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
                    var interaction = mapbox.markers.interaction(this.markerLayer);
                    this.mapC.addLayer(this.markerLayer);
                    // ==> Remove hovering tooltips?
                    interaction.showOnHover(this.attr.hoveringTooltip);

                    // ============================= \\
                    // >> Set map marker features << \\
                    // ============================= \\
                    this.setFeatures = function(features, center, zoom) {
                        if (typeof zoom !== 'undefined' && zoom != null)
                            self.attr.zoomInitial = zoom;
                        if (typeof center !== 'undefined' && center != null)
                            self.attr.center = center;
                        if (typeof features !== 'undefined' && features != null)
                            self.attr.features = features;

                        // Set feature id/props
                        for (var i = 0; i < self.attr.features.length; i++) {
                            // AUTO ID
                            self.attr.features[i].properties['_marker_id'] = '_marker_' + i;
                            if (self.attr.features[i].properties['marker-color'] == null) {
                                self.attr.features[i].properties['marker-color'] = self.attr.unselectedColor;
                            }
                            if (self.attr.features[i].properties['marker-symbol'] == null) {
                                self.attr.features[i].properties['marker-symbol'] = self.attr.unselectedSymbol;
                            }
                        }
                        self.mapC.removeLayer('markers');
                        self.markerLayer = mapbox.markers.layer().features(self.attr.features);

                        this.markerLayer.factory(
                            function(model) {
                                var elem = mapbox.markers.simplestyle_factory(model);
                                // Adds the id to the class, to be able to recover it later
                                if (model.properties.isGroup === true) {
                                    $(elem).addClass('marker-group');
                                }
                                $(elem).addClass(model.properties['_marker_id']);
                                
                                var onClick = function(event) {
//                                    debugger
                                    var modelIndex = self.findMarker($(elem).attr('class'));
                                    var model = self.attr.features[modelIndex];
                                    // Update markers
                                    self.trigger('update-marker-views', {id: $(elem).attr('class')});

                                    // Model includes img src
                                    model.properties['img'] = elem.src;
                                    // Trigger the event specified
                                    if (self.attr.markerClickEventTarget != '') {
                                        $(self.attr.markerClickEventTarget).trigger(self.attr.markerClickEvent, model);
                                    }
                                    else {
                                        self.trigger(self.attr.markerClickEvent, model);
                                    }
                                    if ($(elem).attr('class').indexOf('marker-group') >= 0) {
                                        self.mapC.zoom(15);
                                    }
                                };
                               
                                MM.addEvent(elem, 'click', function (mouseEvent) {
                                    onClick(mouseEvent, test);
                                });
                                
                                // Elem se ha actualizado, por lo que este nodo ya no existe!!
                                return elem;
                            }
                        ); 
                            
                        self.mapC.addLayer(self.markerLayer);
                        self.mapC.centerzoom(center, zoom);
                        var interactionLayer = mapbox.markers.interaction(self.markerLayer);
                        
                        
                    };

                    // ==> Create features
                    self.setFeatures();

                    this.on('update-marker-color', function(event, featureName, color) {
                        var callback = function(key, value) {
                            console.log(featureName + '>' + value.properties.title + ':' + color);
                            if (value.properties.title === featureName) {
                                value.properties['marker-color'] = color;
                            }
                        };
                        $.each(this.attr.features, callback);
                        // update data
                        this.setFeatures(this.attr.features);
                    });

                    // =========================== \\
                    // >> Handles model updates << \\
                    // =========================== \\
                    this.on('update-marker-features', function(event, features, center, zoom) {
                        this.setFeatures(features, center, zoom);
                    });

                    // =================================== \\
                    // >> Handles model partial updates << \\
                    // =================================== \\
                    this.on('add-marker-feature', function(event, feature) {
                        var exists = false;
                        var callback = function(key, value) {
                            if (value.properties.title === feature.properties.title) {
                                exists = true;
                            }
                        };

                        $.each(this.attr.features, callback);

                        if (!exists) {
                            this.attr.features.push(feature);
                            this.setFeatures(this.attr.features, this.attr.center, this.attr.zoomInitial);
                        }
                    });

                    // ================ \\
                    // >> Center map << \\
                    // ================ \\
                    this.on('center-map', function(event, latitude, longitude) {
                        console.log('Centering map');
                        this.mapC.center({lat: latitude, lon: longitude});
                    });

                    // ============================ \\
                    // >> Marker update on click << \\
                    // ============================ \\
                    this.on('update-marker-views', function(event, payload) {
                        var sel = self.attr.selected;
                        i = self.findMarker(payload.id);
                        if (i < 0) {
                            console.error('marker not found!!');
                            return null;
                        }
                        // => Update unselected marker
                        self.attr.features[sel].properties['marker-size'] = 'medium';

                        // => Update selected marker
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

                    // ======================================================== \\
                    // >> Trigger to request to announce the current markers << \\
                    // ======================================================== \\
                    this.on('announce-markers', function(event, locator, trigger_name) {
                        //self.announce(locator, trigger_name);
                        var tn = trigger_name == null ? markerAnnounceTrigger : trigger_name;
                        if (locator == null) {
                            this.trigger(tn, [this.attr.features, this.mapC.getExtent(), this.mapC.getCenter()]);
                        }
                        else {
                            $(locator).trigger(tn, [this.attr.features, this.mapC.getExtent(), this.mapC.getCenter()]);
                        }
                    });

                    var self = this;
                    this.mapC.addCallback('zoomed', function() {
                        $(self.node).trigger('mapbox-zoomed');
                        self.processFeatures(self.mapC, self.attr.features);
                    });

                    this.mapC.addCallback('panned', function() {
                        $(self.node).trigger('mapbox-panned');
                    });

                    // ======================================== \\
                    // >> Finds a marker given it's id/class << \\
                    // ======================================== \\
                    this.findMarker = function(markerid) {
                        var i = 0;
                        var found = false;
                        // Find marker to update
                        while (i < self.attr.features.length && !found) {
                            var current = self.attr.features[i];
                            if (markerid.indexOf(self.attr.features[i].properties._marker_id) >= 0) {
                                found = true;
                            }
                            else
                                i++;
                        }
                        if (!found)
                            return -1;
                        else
                            return i;
                    };

                }); // </this.after(...,function)>

            } // </function Map()>

        } // </function(ComponentManager)>
);
