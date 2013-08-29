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
        'components/tooltip',
        'components/dashboard/map_marker_group_tooltip',
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
                fitBounds: true,

                fitBoundsOnce: false,

                /** Show zoom control */
                zoomControl: true,

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
                },

                /**
                 * Default tooltip component
                 */
                tooltip: {
                    component: 'Tooltip',
                    items: [{
                        html: '',
                        className: 'tooltip-arrow-border'
                    }, {
                        html: '',
                        className: 'tooltip-arrow'
                    }, {
                        tpl: '{{value.marker.title}}'
                    }]
                },

                /**
                 * Tooltip for marker groups
                 */
                groupTooltip: {
                    component: 'Tooltip',
                    model: function(data) {
                        var byClass = {};
                        $.each( (data && data.markers) || [], function(i, marker) {
                            var className = marker.options.marker.cssClass;
                            className = className || 'default';
                            byClass[className] = byClass[className] || 0;
                            byClass[className]++;
                        });
                        return {
                            classes: $.map(byClass, function(count, className) {
                                return {
                                    count: count,
                                    className: 'group-count ' +
                                        (className === 'default' ?
                                        '' : className)
                                };
                            })
                        };
                    },
                    items: [{
                        html: '',
                        className: 'tooltip-arrow-border'
                    }, {
                        html: '',
                        className: 'tooltip-arrow'
                    }, {
                        tpl: '{{#value.classes}}' +
                                '<div class="{{className}}">{{count}}</div>' +
                             '{{/value.classes}}'
                    }]
                },

                /**
                 * Tooltip displayed when you
                 */
                groupClickTooltip: {
                    component: 'MapMarkerGroupTooltip'
                }
            });

            this.after('initialize', function() {
                this.$node.addClass('m2m-dashboardmap fit');
                this.$mapbox = $('<div>').addClass('mapbox')
                        .appendTo(this.$node);

                this.markers = [];
                this.createMap();
                this.createTooltip();
                this.on('valueChange', this.updateData);
                this.on('itemselected', this.onItemSelected);
            });

            this.mapIsLoaded = false;

            // Create mapbox components and layers
            this.createMap = function() {
                var options = {
                        zoomControl: this.attr.zoomControl,
                        attributionControl: false
                    };
                this.map = L.mapbox.map(this.$mapbox[0],
                    this.attr.mapboxId, options);
                this.offscreen = new L.Control.Offscreen();
                this.map.addControl(this.offscreen);

                this.markersLayer = L.markerClusterGroup({
                    maxClusterRadius: this.attr.maxGroupRadius,
                    iconCreateFunction: this.attr.groupIconFunction,
                    showCoverageOnHover: false,
                    zoomToBoundsOnClick: false
                }).addTo(this.map);

                if(this.attr.fitBoundsOnce) this.attr.fitBounds = false;

                this.map.on('movestart', $.proxy(function(e) {
                    this.$tooltip.trigger('hide');
                    this.$groupTooltip.trigger('hide');
                }, this));

                this.map.on('move', $.proxy(this.fixGroupClickTooltip, this));
                this.map.on('moveend', $.proxy(this.fixGroupClickTooltip, this));

                this.map.on('load', $.proxy(function(e) {
                    this.mapIsLoaded = true;
                }, this));

                this.markersLayer.on('click', $.proxy(function(e) {
                    this.onMarkerClick(e, e.layer.options.item);
                }, this));


                this.markersLayer.on('mouseover', $.proxy(function(e) {
                    this.showTooltip('tooltip', e.layer._icon, e.layer.options);
                }, this));

                this.markersLayer.on('mouseout', $.proxy(function(e) {
                    this.$tooltip.trigger('hide');
                }, this));

                this.markersLayer.on('clustermouseover', $.proxy(function(e) {
                    if (!this.$groupClickTooltip.is(':visible')) {
                        this.showTooltip('groupTooltip', e.layer._icon,
                                { markers: e.layer.getAllChildMarkers() });
                    }
                }, this));

                this.markersLayer.on('clustermouseout', $.proxy(function(e) {
                    this.$groupTooltip.trigger('hide');
                }, this));

                this.markersLayer.on('clusterclick', $.proxy(function(e) {
                    if( this.$groupClickTooltip.is(':visible') ){
                        this.$groupClickTooltip.trigger('hide');
                    }else{
                        this.showTooltip('groupClickTooltip', e.layer._icon,
                            { markers: e.layer.getAllChildMarkers() });
                    }

                }, this));
            };

            this.fixGroupClickTooltip = function(){
                this.$groupClickTooltip.trigger('fix');
            }

            this.createTooltip = function() {
                var tooltips = ['tooltip', 'groupTooltip', 'groupClickTooltip'];
                $(tooltips).each($.proxy(function(i, tooltipName) {
                    var attr = this.attr[tooltipName],
                        tooltipCmp = attr.component || 'component';
                    this['$' + tooltipName] = $('<div>').appendTo(this.$node);
                    tooltipCmp = ComponentManager.get(tooltipCmp);
                    if (tooltipCmp) {
                        tooltipCmp.attachTo(this['$' + tooltipName], attr);
                    }
                }, this));
            };

            this.showTooltip = function(tooltipName, marker, data) {
                var tooltip = this['$' + tooltipName],
                    position = $(marker).offset();

                tooltip.trigger('parentChange', {
                    value: data
                });
                tooltip.css({
                    left: position.left - tooltip.width() / 2,
                    top: position.top + $(marker).height()
                });
                tooltip.trigger('show', marker);
            };

            // Updates markers with the data comming from a valueChange
            this.updateData = function(e, o) {
                var data = o.value || [],
                    bounds = [];

                if (data && !$.isArray(data)) {
                    data = [data];
                }
                this.removeMarkers();
                this.$groupClickTooltip.trigger('hide');
                $.each(data, $.proxy(function(i, item) {
                    var markerItem = this.attr.markerFactory(item),
                        position = [markerItem.latitude, markerItem.longitude],
                        icon = this.attr.iconFunction(markerItem),
                        marker = L.marker(position, {
                            icon: icon, item: item, marker: markerItem
                        });

                    bounds.push(position);
                    this.markers.push(marker);
                }, this));
                if( this.mapIsLoaded ){
                    if ( (this.attr.fitBounds || this.attr.fitBoundsOnce) && bounds.length) this.map.fitBounds(bounds);
                    this.offscreen.update(this.markers);
                    this.attr.fitBoundsOnce = false;
                }
                $.each(this.markers, $.proxy(function(i,marker){
                    marker.addTo(this.markersLayer);
                }, this));

            };

            // Remove all the markers from the map
            this.removeMarkers = function() {
                this.markersLayer.clearLayers();
                this.markers = [];
            };

            // When a marker is clicked we trigger item selected
            this.onMarkerClick = function(e, item) {
                this.trigger('itemselected', { item: item });
                this.$groupClickTooltip.trigger('hide');
            };

            // When an item is selected adds 'selected' css class to
            // the marker
            this.onItemSelected = function(e, o) {
                var item = o.item,
                    marker = this.getMarkerForItem(item);

                this.$node.find('.marker.selected').removeClass('selected');
                this.$groupClickTooltip.trigger('itemselected', {'item':item, 'silent':true});
                if (marker) {
                    $(marker._icon).addClass('selected');
                    this.map.panTo(marker._latlng);
                    this.offscreen.update();
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
