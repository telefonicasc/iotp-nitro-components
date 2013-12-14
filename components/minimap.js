/**
This component use **[Mapbox](https://www.mapbox.com/mapbox.js/)** librari for draw map witch one marker
Create Map with one element


@name minimap
@mixin DataBinding

@option {String} mapId -- Mapbox user Id
@option {String} markerColor '#5C8F9E' Marker Color
@option {Number} zoomValue 16 Zoom Value
@option {Boolean} movable false Movable map
@option {String} listenTo 'updateMinimap' Evento for update value
@option {String} containerClass 'mapbox-mini' Css class nae of container
@option {Object} center {lat:50.45,lon:7.48} Center in this location

*/
define(
        [
            'components/component_manager',
            'components/mixin/data_binding',
            'libs/mapbox'
        ],
        function(ComponentManager, DataBinding) {

            function Minimap() {
                var markerLayer;

                this.defaultAttrs({
                    mapId: 'keithtid.map-w594ylml',
                    markerColor: '#5C8F9E',
                    zoomValue: 16,
                    movable: false,
                    listenTo: 'updateMinimap',
                    containerClass: 'mapbox-mini',
                    center: {lat: 50.45, lon: 7.48}
                });

                this.after('initialize', function() {
                    var self = this;
                    var mapM;
                    this.$node.addClass('fit-minimap');
                    this.$nodeMap = $('<div>').addClass(self.attr.containerClass).appendTo(this.$node);

                    // Create layer showing map
                    var layer = mapbox.layer().id(this.attr.mapId);
                    // Create mapbox, without handlers, to prevent zooming and panning
                    if (this.attr.movable === false) {
                        this.mapM = mapbox.map(this.$nodeMap[0], layer, null, []);
                    }
                    else {
                        this.mapM = mapbox.map(this.$nodeMap[0], layer);
                    }

                    // Create marker layer
                    this.markerLayer = mapbox.markers.layer();
                    this.mapM.addLayer(this.markerLayer);
                    // Add marker
                    if (typeof this.attr.markerModel === 'object') {
                        this.markerLayer.features([this.attr.markerModel]);
                        if( $.isFunction(this.attr.markerModel.properties.customMarkerBuilder) ){
                            this.markerLayer.factory(this.attr.markerModel.properties.customMarkerBuilder);
                        }
                        this.attr.center = {
                            lat: this.attr.markerModel.geometry.coordinates[1],
                            lon: this.attr.markerModel.geometry.coordinates[0]
                        };
                    }

                    this.mapM.centerzoom(this.attr.center, this.attr.zoomValue);

                    this.updateValue = function(markerModel) {
                        var customMarkerBuilder = markerModel.properties.customMarkerBuilder;
                        this.markerLayer = mapbox.markers.layer().features([markerModel]);
                        if( $.isFunction(customMarkerBuilder) ){
                            this.markerLayer.factory(customMarkerBuilder);
                        }

                        this.mapM.removeLayer('markers');
                        this.mapM.addLayer(this.markerLayer);
                        this.attr.center = {
                            lat: markerModel.geometry.coordinates[1],
                            lon: markerModel.geometry.coordinates[0]
                        };
                        this.mapM.centerzoom(this.attr.center, this.attr.zoomValue);
                    };

                    // Event listener
                    // Deprecated! use value change instead
                    this.on(this.attr.listenTo, function(event, markerModel) {
//                    this.updateValue(markerModel);
                    });

                    // center on marker if required
                    this.on('center', function(event) {
                        event.stopPropagation();
                        this.mapM.centerzoom(this.attr.center, this.attr.zoomValue);
                    });


                    this.on('changeColor', function(event, color) {
                        this.attr.markerColor = color;
                    });

                    var markerColor = this.attr.markerColor;
                    // Expects something like: "{"name":"Tank-501340596","location":{"altitude":0,"latitude":40.513538,"longitude":-3.663769}}"
                    this.on('valueChange', function(e, o) {
                        e.stopPropagation();
                        if (!o.value) {
                            return;
                        }
                        var markerModel = o.value.markerModel === undefined ? null : o.value.markerModel;
                        var values = o.value;
                        if (markerModel !== null){
                            this.updateValue(markerModel);
                        }
                        else if ($.isPlainObject(values) && values.location.longitude !== "") {
                            // Create marker model from asset
                            var f = {
                                geometry: {
                                    coordinates: [
                                        values.location.longitude,
                                        values.location.latitude
                                    ]
                                },
                                properties: {
                                    'title': values.name,
                                    'caption': values.description,
                                    'marker-color': markerColor,
                                    'marker-symbol': 'circle',
                                    'marker-size': 'medium'
                                }
                            };
                            this.updateValue(f);

                        }
                    });

                    this.on('draw', function(){
                        this.mapM.draw();
                    });
                });
            }

            return ComponentManager.create('minimap', Minimap, DataBinding);
        }
);
