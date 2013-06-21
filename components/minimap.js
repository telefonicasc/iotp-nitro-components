define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'libs/mapbox'
    ],

    function(ComponentManager, DataBinding) {

//        return ComponentManager.create('minimap', Minimap, DataBinding);

        function Minimap() {
            var markerLayer;

            this.defaultAttrs({
                mapId: 'keithtid.map-w594ylml',
                zoomValue: 16,
                movable: false,
                listenTo: 'updateMinimap',
                containerClass: 'mapbox-mini',
                center: { lat: 50.45, lon: 7.48 }
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
                    this.mapM = mapbox.map(this.$nodeMap[0],layer);
                }
                
                // Create marker layer
                this.markerLayer = mapbox.markers.layer();
                this.mapM.addLayer(this.markerLayer);
                // Add marker
                if (typeof this.attr.markerModel === 'object') {
                    this.markerLayer.features([this.attr.markerModel]);
                    this.attr.center = {
                        lat: this.attr.markerModel.geometry.coordinates[1],
                        lon: this.attr.markerModel.geometry.coordinates[0]
                    };
                }
                
                this.mapM.centerzoom(this.attr.center, this.attr.zoomValue);

                this.updateValue = function (markerModel) {
                    this.markerLayer = mapbox.markers.layer().features([markerModel]);
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
                this.on(this.attr.listenTo, function (event, markerModel) {
                    this.updateValue(markerModel);
                });
                
                // center on marker if required
                this.on('center', function (event) {
                    event.stopPropagation();
                    this.mapM.centerzoom(this.attr.center, this.attr.zoomValue);
                });
                
                // Expects something like: "{"name":"Tank-501340596","location":{"altitude":0,"latitude":40.513538,"longitude":-3.663769}}"
                this.on('valueChange', function (e, o) {
                    e.stopPropagation();
                    var markerModel = o.value.markerModel === undefined? null : o.value.markerModel;
                    var values = o.value;
                    if (markerModel !== null) this.updateValue(markerModel);
                    else if ($.isPlainObject(values)) {
                        // Create marker model from asset
                        var f = {
                            geometry: {
                                coordinates: [
                                    values.asset.location.longitude,
                                    values.asset.location.latitude
                                ]
                            },
                            properties: {
                                'title': values.asset.name,
                                'caption': values.asset.description,
                                'marker-color': '#0F0',
                                'marker-symbol': 'circle',
                                'marker-size': 'medium'
                            }
                        };
                        this.updateValue(f);
                    }
                });
            });
        }
        
        return ComponentManager.create('minimap', Minimap, DataBinding);
    }
);
