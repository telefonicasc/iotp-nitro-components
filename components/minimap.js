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
                movable: false,
                markerModel: null
            });

            this.after('initialize', function() {
                var mapM;
                this.$node.addClass('fit-minimap');
                this.$nodeMap = $('<div>').addClass('mapbox-mini').appendTo(this.$node);
            
                // Create layer showing map
                var layer = mapbox.layer().id(this.attr.mapId);
                // Create mapbox, without handlers, to prevent zooming and panning
                console.log(this.$nodeMap[0]);
                if (this.attr.movable == false) {
                    this.mapM = mapbox.map(this.$nodeMap[0], layer, null, []);
                }
                else {
                    this.mapM = mapbox.map(this.$nodeMap[0],layer);
                }

                // Center map
                var center = {
                    lat: this.attr.markerModel.geometry.coordinates[1],
                    lon: this.attr.markerModel.geometry.coordinates[0]
                }
                //debugger;
                this.mapM.centerzoom(center, this.attr.zoomValue);
                // Create marker layer
                this.markerLayer = mapbox.markers.layer();
                this.mapM.addLayer(this.markerLayer);
                // Add marker
                this.markerLayer.features([this.attr.markerModel]);

                // => Disable tooltips
                var interaction = mapbox.markers.interaction(this.markerLayer);
                interaction.showOnHover(false);
            });
        }
    }
);
