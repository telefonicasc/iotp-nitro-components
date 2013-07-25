/**
 * @component DashboardMap
 *
 * Map component for dashboards using mapbox
 *
 * @event_in itemselected When it is received, the css class 'selected' is
 *   added to the marker of the selected item

 * @event_in valueChange map markers are updated with the data in the event
 *
 * @event_out itemselected Is triggered when a marker is clicked
 *
 * @mixins DataBinding
 * @style dashboard_map.less
 */

define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'libs/leaflet.markercluster-src',
        'libs/leaflet.offscreen-src'
    ],

    function(ComponentManager, DataBinding) {

        function DashboardMap() {

            this.defaultAttrs({

                /** Mapbox id for the map */
                mapboxId: 'keithtid.map-w594ylml',

                /** Maximum distance to group markers */
                maxGroupRadius: 20,

                /** fit bounds of markers when update **/
                fitBound:true,

                /**
                 *  Factory function to translate from input data items to
                 *  the format the marker is specting.
                 *  {
                 *    latitude: 40.5,
                 *    longitude: -3,
                 *    cssClass: 'red',
                 *    title: 'Marker 1'
                 *  }
                 *
                 *  By default it just expects items to be in that format
                 */
                markerFactory: function(item) {
                    return item;
                },

                /**
                 * Function to create the icon for the marker.
                 * By default it creates a div with css class 'marker'
                 * and the 'cssClass' attribute of the marker
                 */
                iconFunction: function(marker) {
                    return L.divIcon({
                        className: 'marker ' + marker.cssClass,
                        iconSize: null
                    });
                },
                /**
                 *  Function to create the icon for a marker group
                 *  By default it creates a div with css classes
                 *  'marker', 'group', and all the child item css classes.
                 *  The content of the div is the number of markers in
                 *  the group
                 */
                groupIconFunction: function(cluster) {
                    var classes = [];
                    $.each(cluster.getAllChildMarkers(), function(i, item) {
                        var cssClass = item.options.marker.cssClass;
                        if (classes.indexOf(cssClass) < 0) {
                            classes.push(item.options.marker.cssClass);
                        }
                    });
                    return L.divIcon({
                        html: cluster.getChildCount(),
                        className: 'marker group ' + classes.join(' '),
                        iconSize: null
                    });
                }
            });

            this.after('initialize', function() {
                this.$node.addClass('m2m-dashboardmap fit');
                this.$mapbox = $('<div>').addClass('mapbox')
                        .appendTo(this.$node);

                this.markers = [];
                this.createMap();
                this.on('valueChange', this.updateData);
                this.on('itemselected', this.onItemSelected);
            });

            // Create mapbox components and layers
            this.createMap = function() {
                this.map = L.mapbox.map(this.$mapbox[0], this.attr.mapboxId);
                this.offscreen = new L.Control.Offscreen();
                this.map.addControl(this.offscreen);

                this.markersLayer = L.markerClusterGroup({
                    maxClusterRadius: this.attr.maxGroupRadius,
                    iconCreateFunction: this.attr.groupIconFunction,
                    showCoverageOnHover: false,
                    zoomToBoundsOnClick: false
                }).addTo(this.map);
            };

            // Updates markers with the data comming from a valueChange
            this.updateData = function(e, o) {
                var data = o.value || [],
                    bounds = [];

                this.removeMarkers();
                $.each(data, $.proxy(function(i, item) {
                    var markerItem = this.attr.markerFactory(item),
                    position = [markerItem.latitude, markerItem.longitude],
                        icon = L.divIcon({
                                className: 'marker ' + markerItem.cssClass,
                                iconSize: null
                            }),
                        marker = L.marker(position, {
                            icon: icon, item: item, marker: markerItem
                        });

                    bounds.push(position);
                    marker.addTo(this.markersLayer);
                    marker.on('click', $.proxy(function(e) {
                        this.onMarkerClick(e, e.target.options.item);
                    }, this));
                    this.markers.push(marker);
                }, this));
                if(this.attr.fitBound) this.map.fitBounds(bounds);
                this.offscreen.update(this.markers);
            };

            // Remove all the markers from the map
            this.removeMarkers = function() {
                this.markersLayer.clearLayers();
                this.markers = [];
            };

            // When a marker is clicked we trigger item selected
            this.onMarkerClick = function(e, item) {
                this.trigger('itemselected', { item: item });
            };

            // When an item is selected adds 'selected' css class to
            // the marker
            this.onItemSelected = function(e, o) {
                var item = o.item,
                    marker = this.getMarkerForItem(item);
                this.$node.find('.marker.selected').removeClass('selected');
                if (marker) {
                    $(marker._icon).addClass('selected');
                }
            };

            // Return the marker for a data item
            this.getMarkerForItem = function(item) {
                return $.grep(this.markers, function(marker) {
                    return marker.options.item === item;
                })[0];
            };
        }

        return ComponentManager.create('DashboardMap', DashboardMap,
            DataBinding);
    }
);
