define(
    [
        'components/component_manager',
        'libs/mapbox'
    ],

    function(ComponentManager) {

        return ComponentManager.create('minimap', Minimap);

        function Minimap() {
            var mapM;
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

                // Event listener
                this.on(this.attr.listenTo,function (event, markerModel) {
                    this.markerLayer = mapbox.markers.layer().features([markerModel]);
                    this.mapM.removeLayer('markers');
                    this.mapM.addLayer(this.markerLayer);
                    this.attr.center = {
                        lat: markerModel.geometry.coordinates[1],
                        lon: markerModel.geometry.coordinates[0]
                    };
                    this.mapM.centerzoom(this.attr.center, this.attr.zoomValue);
                });
                
                // center on marker if required
                this.on('center', function (event) {
                    event.stopPropagation();
                    this.mapM.centerzoom(this.attr.center, this.attr.zoomValue);
                });
            });
        }
    }
);
