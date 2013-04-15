define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {

        return ComponentManager.create('minimap', Minimap);

        function Minimap() {
            var mapM;
            var markerLayer;
        

            this.defaultAttrs({
                mapId: 'keithtid.map-w594ylml',
                zoomValue: 16,
                markerModel: null
            });

            this.after('initialize', function() {

                var mapM;
                this.$node.addClass('fit-minimap');
                this.$nodeMap = $('<div>').addClass('mapbox-mini').appendTo(this.$node);
            
                // Create layer showing map
                var layer = mapbox.layer.id(this.attr.mapId);
                // Create mapbox, without handlers, to prevent zooming and panning
                this.mapM = mapbox.map(this.$nodeMap[0], layer, null, []);

                // Center map
                this.mapM.centerzoom(
                    {
                        /* Note: Device coordinates are lon/lat at deviceModel */
                        this.attr.markerModel.geometry.coordinates[1],
                        this.attr.markerModel.geometry.coordinates[0],
                    },
                    this.attr.zoomValue);

                // Create marker layer
                this.markerLayer = mapbox.markers.layer();
                this.mapM.addLayer(this.markerLayer);
                // Add marker
                this.markerLayer.features([markerModel]);
                

                // => Disable tooltips
                var interaction = mapbox.markers.interaction(this.markerLayer);
                interaction.showOnHover(false);
            });
        }
    }
);
