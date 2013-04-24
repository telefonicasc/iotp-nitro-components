requirejs.config({
    baseUrl: '/m2m-nitro-components'
});

define(
    [
        'components/dashboard/dashboard',
        'components/minimap',
        'components/dashboard/overview_subpanel',
        'components/paged_panel',
        'components/detail_panel',
        'components/map'
    ],
  
    function() {

        // CONFIG: This config should override the one provided by default below (for testing)
        var features = [
            {
                'geometry': { coordinates: [ -3.662782, 40.515528 ] },
                'properties': {
                    'marker-color': '#DF0101',
                    'marker-symbol': 'rail-underground',
                    'title': 'Ronda de la Comunicacion'
                }
            },{
                'geometry': { coordinates: [ -3.6665, 40.51535 ] },
                'properties': {
                    'marker-color': '#0101DF',
                    'marker-symbol': 'industrial',
                    'title': 'Telefonica I+D'
                }
            },{
                'geometry': { coordinates: [ -3.664282, 40.513367 ] },
                'properties': {
                    'marker-color': '#01DF01',
                    'marker-symbol': 'garden',
                    'title': 'Rotonda'
                }
            }
        ]

        var center = { lat: 40.51535, lon: -3.6665 };
        var zoom = 15;

        var minimap = {
            component: 'minimap',
            zoomValue: 16,
            movable: false,
            markerModel: {
                geometry: { coordinates: [ -3.6665, 40.51535 ] },
                properties: {
                    'marker-color': '#FF0000',
                    'marker-symbol': 'industrial',
                    'title': 'Telefonica I+D'
                }
            }
        };

        var detailsPanel = {
            component: 'detail-panel',
            id: 'panel-details',
            header: 'Asset details',
            items: [minimap]
        }

        var dynamicComponent = {
            component: 'OverviewSubpanel',
            iconClass: 'dot black',
            text: 'Zero',
            caption: 'Dynamic subpanel'
        };

        // LOADER ==========================================

        requirejs(['components/jquery_plugins'], function() {

            $('.dashboard').m2mdashboard({
                mainContent: [
                    {
                        component: 'map',
                        showZoomButtons: true,
                        hoveringTooltip: true,
                        debug: true,
                        center: { lat: 40.51535, lon: -3.6665 },
                        zoomInitial: 15,
                        zoomMin: 10,
                        zoomMax: 20,
                        centerOnClick: true,
                        markerClickEventTarget: '.mapbox-mini',
                        markerClickEvent: 'updateMinimap',
                        features: []
                    }
                ],
                overviewPanel: {
                    title: 'Traffic Lights',
                    count: 3,
                    items: [
                        {
                            component: 'pagedPanel',
                            header: 'Panel List',
                            ID: 'panel-list',
                            items:[],
                            triggers: [
                            {
                                name: 'test',
                                task: function (ev, elem, items) { 
                                    console.log('test!!');
                                }
                            }    
                                
                            ]
                        },
                        {
                            component: 'pagedPanel',
                            header: 'Panel Details',
                            ID: 'panel-detail',
                            items: [ minimap ]
                        }
                    ]
                },
                data: function() {

                }
            });

            // Initial events ======================================================

            // Process feature updates
            $(this).on('update-dashboard', function (event, features, center, zoom) {
                // Update map
                $('.mapbox').trigger('update-marker-features', [features, center, zoom]);
                
                // Update sidebar
                var details = new Array();
                for (var i = 0; i < features.length; i++) {
                    var newItem = {
                        component: 'OverviewSubpanel',
                        iconClass: 'dot red',
                        text: features[i].properties['title'],
                        caption: 'TODO'
                    };
                    details.push(newItem);
                }
                $('#panel-list').trigger('load-items', [details]);
            });

            // (DEBUG) Send the initial trigger
            $(this).trigger('update-dashboard', [features, center, zoom]);


            /*
            // expect map marker announcements
            var annTgr = 'announce-features';
            var locator = window;
            // This function should receive the marker models
            $(this).on (annTgr, function (event, data) {
                debugger;    
            });
            // send the trigger
            $('.mapbox').trigger('announce-markers', [locator, annTgr]);
            */

            // Update paged panel, to adjust components on load
            $('.paged-panel').trigger('update-view');


        }); // requirejs
    }
);
