requirejs.config({
    baseUrl: '/m2m-nitro-components'
});

define(
    [
        'components/dashboard/dashboard',
        'components/minimap',
        'components/dashboard/overview_subpanel',
        'components/paged_panel',
        'components/paged_detail',
        'components/detail_panel',
        'components/map',
        'components/widget_temperature',
        'components/widget_pitch',
        'components/widget_lights'
    ],
  
    function() {

        /*
        var swapPanels = function (locator) {
            console.log("Swap locator: " + locator);
        };
        */
        // CONFIG: This config should override the one provided by default below (for testing)
        //
        // Config germany 
        var features_germany = [
            {
                'geometry': { coordinates: [ 8.645, 50.113 ] },
                'properties': {
                    'marker-color': '#088A85',
                    'marker-symbol': 'circle',
                    'title': 'Asset Semaphore 1'
                }
            },
            {
                'geometry': { coordinates: [ 8.63, 50.09 ] },
                'properties': {
                    'marker-color': '#DF0101',
                    'marker-symbol': 'circle',
                    'title': 'Asset Semaphore 2'
                }
            },
            {
                'geometry': { coordinates: [ 8.61, 50.111 ] },
                'properties': {
                    'marker-color': '#DF0101',
                    'marker-symbol': 'circle',
                    'title': 'Asset Semaphore 3'
                }
            },
            {
                'geometry': { coordinates: [ 8.691902, 80.088759 ] },
                'properties': {
                    'marker-color': '#DF0101',
                    'marker-symbol': 'circle',
                    'title': 'Asset Semaphore 4'
                }
            },
            {
                'geometry': { coordinates: [ 8.467712, 80.125861 ] },
                'properties': {
                    'marker-color': '#088A85',
                    'marker-symbol': 'circle',
                    'title': 'Asset Semaphore 5'
                }
            }
        ];

        var warnings_germany = [
            {
                component: 'OverviewSubpanel',
                iconClass: 'dot red',
                text: 'AssetSemaphore2',
                caption: 'Inclination change: +10'
            },
            {
                component: 'OverviewSubpanel',
                iconClass: 'dot red',
                text: 'AssetSemaphore3',
                caption: 'Voltage < 10V'
            },
            {
                component: 'OverviewSubpanel',
                iconClass: 'dot red',
                text: 'AssetSemaphore4',
                caption: 'No red light for +5 min'
            }
        ];
        
        var center_germany = { lat: 50.094596, lon: 8.645854 };
        var zoom_germany = 12;

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
                    'title': 'Rotonda__1'
                }
            }
        ]

        var center = { lat: 40.51535, lon: -3.6665 };
        var zoom = 15;

        var minimap = {
            component: 'minimap',
            zoomValue: 16,
            movable: true,
            markerModel: {
                geometry: { coordinates: [ 8.61, 50.111 ] },
                properties: {
                    'marker-color': '#FF0000',
                    'marker-symbol': 'circle',
                    'title': 'AssetSemaphore3'
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

        var compList = [
            {
                component: 'OverviewSubpanel',
                className: 'elem1',
                iconClass: 'dot red',
                text: 'First element',
                caption: 'Sample error 1'
            },
            {
                component: 'detailPanel',
                header: 'Physical conditions',
                id: 'physical-conditions',
                items: [
                    {
                        component: 'temperatureWidget',
                        className: 'temperature-widget' 
                    },
                    {
                        component: 'pitchWidget',
                        className: 'pitch-widget'
                    }
                ]
            },
            {
                component: 'detailPanel',
                header: 'Light color',
                id: 'light-color',
                items: [
                    {
                        component: 'lightsWidget',
                        className: 'lights-widget'
                    }    
                ]
            },
            {
                component: 'detailPanel',
                header: 'Last Location',
                id: 'last-location',
                items: [minimap]
                
            }

        ];

        // LOADER ==========================================

        requirejs(['components/jquery_plugins'], function() {

            var self = this;

            var swapPanels = function (locator) {
                console.log("Swap locator is: " + locator);
                $('.panel-list').slideToggle();
                $('.panel-detail').slideToggle();
            };

            $('.dashboard').m2mdashboard({
                mainContent: [
                    {
                        component: 'map',
                        showZoomButtons: true,
                        hoveringTooltip: true,
                        debug: true,
                        center: center_germany,
                        zoomInitial: 12,
                        zoomMin: 10,
                        zoomMax: 20,
                        centerOnClick: true,
                        markerClickEventTarget: '.mapbox-mini',
                        markerClickEvent: 'updateMinimap',
                        features: features_germany
                    }
                ],
                overviewPanel: {
                    title: 'Lights with warnings',
                    count: 3,
                    items: [
                        {
                            component: 'pagedPanel',
                            className: 'panel-list',
                            insertionPoint: '.panel-content-list',
                            header: '',
                            ID: 'panel-list',
                            items: warnings_germany
                        }
                        ,
                        {
                            component: 'pagedPanel',
                            className: 'panel-detail',
                            insertionPoint: '.panel-content-details',
                            header: 'Asset details',
                            ID: 'panel-detail',
                            items: compList
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
                $('.panel-list').trigger('load-items', [details]);
            });

            // (DEBUG) Send the initial trigger
            //$(this).trigger('update-dashboard', [features_germany, center_germany, zoom_germany]);

            // Hide details on load
            $('.panel-detail').hide();

            // Update paged panel, to adjust components on load
            $('.paged-panel').trigger('update-view');
            
            $(window).bind('resize', function () {
                $('.panel-list').trigger('update-view');    
                $('.panel-detail').trigger('update-view');    
            }); 
       
            $('.overview-header').on('click', function () {
                swapPanels('');
            
            });

            $('.overview-subpanel').on('click',function () {
                console.log("Element: " + $(this).attr('class'));
                swapPanels($(this).attr('class'));
            });

            // Update widgets
            $('.temperature-widget').trigger('drawTemperature');
            $('.pitch-widget').trigger('drawPitch');
            $('.lights-widget').trigger('drawLights');

        }); // requirejs
    }
);
