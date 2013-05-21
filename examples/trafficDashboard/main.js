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
        'components/widget_lights',
        'components/widget_battery'
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
                    'title': 'AssetSemaphore1'
                }
            },
            {
                'geometry': { coordinates: [ 8.63, 50.09 ] },
                'properties': {
                    'marker-color': '#DF0101',
                    'marker-symbol': 'circle',
                    'title': 'AssetSemaphore2',
                    'description': 'Semaphore'
                }
            },
            {
                'geometry': { coordinates: [ 8.61, 50.111 ] },
                'properties': {
                    'marker-color': '#DF0101',
                    'marker-symbol': 'circle',
                    'title': 'AssetSemaphore3'
                }
            },
            
            {
                'geometry': { coordinates: [ 8.691902, 50.088759 ] },
                'properties': {
                    'marker-color': '#DF0101',
                    'marker-symbol': 'circle',
                    'title': 'AssetSemaphore4'
                }
            },
            {
                'geometry': { coordinates: [ 8.467712, 50.125861 ] },
//                'geometry': { coordinates: [ 8.467712, 50.0 ] },
                'properties': {
                    'marker-color': '#088A85',
                    'marker-symbol': 'circle',
                    'title': 'AssetSemaphore5'
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
        
        var center_germany = { lat: 50.1, lon: 8.625 };
        var zoom_germany = 13;

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

        var compList = [
            {
                component: 'OverviewSubpanel',
                className: 'detail-element-header',
                iconClass: 'dot red',
                text: 'AssetSemaphore2',
                caption: 'Inclination change +10'
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
            /*{
                component: 'detailPanel',
                header: 'Battery Level',
                id: 'battery-level',
                items: [
                    {
                        component: 'batteryWidget',
                        className: 'battery-widget'
                    }    
                ]
            },*/
            {
                component: 'detailPanel',
                header: 'Last Location',
                id: 'last-location',
                items: [minimap]
            }

        ];

        // LOADER ==========================================

        requirejs(['components/jquery_plugins'], function() {

            $('.dashboard').m2mdashboard({
                mainContent: [
                    {
                        component: 'map',
                        showZoomButtons: true,
                        hoveringTooltip: true,
                        debug: false,
                        center: center_germany,
                        zoomInitial: zoom_germany,
                        zoomMin: 5,
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
                        },
                        {
                            component: 'pagedPanel',
                            className: 'panel-detail',
                            insertionPoint: '.panel-content-details',
//                            header: 'Asset details',
                            ID: 'panel-detail',
                            allwaysVisible: [0],
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
//                swapPanels('');
                $('.panel-list').slideDown();
                $('.panel-detail').slideUp();
            });

            $('.overview-subpanel .text').on('click',function (event) {
                console.log("Element: " + $(this).attr('class'));
                var data = {
                    properties: {
                        title: $(event.target).html()
                    }
                };
                $('.dashboard').trigger('updateMinimap', data);
                //swapPanels($(this).attr('class'));
            });

            // Update widgets
            $('.temperature-widget').trigger('drawTemperature');
            $('.pitch-widget').trigger('drawPitch');
            $('.lights-widget').trigger('drawLights');
            //$('.battery-widget').trigger('drawBattery');

            var swapPanels = function (locator) {
                console.log("Swap locator is: " + locator);
                $('.panel-list').slideToggle();
                $('.panel-detail').slideToggle();
            };

            // MOCK ============================================================
            
            // Fix count 
            $('.overview-count').html('3');
            
            var infoUpdater = function (id) {
                console.log('Received update request for device: ' + id);
            };
            
            $('.dashboard').on('updateMinimap', function (event, data) {
                // Make sure correct panel is displayed
                $('.panel-list').slideUp();
                $('.panel-detail').slideDown();
//                $('.panel-list').trigger('update-view');    
//                $('.panel-detail').trigger('update-view'); 
                $('.paged-panel').trigger('update-view');
                
                var callingElement = data.properties.title;
                console.log('Received element name: ' + callingElement);
                $('.detail-element-header .text').html(callingElement);
                if (callingElement === 'AssetSemaphore1') {
                    $('.temperature-widget').trigger('drawTemperature',15.3);
                    $('.pitch-widget').trigger('drawPitch',90);                    
                    $('.detail-element-header .text').html(callingElement);
                    $('.detail-element-header .caption').html('No problems detected');
                }
                else if (callingElement === 'AssetSemaphore2') {
                    $('.temperature-widget').trigger('drawTemperature',15.1);
                    $('.pitch-widget').trigger('drawPitch',75);
                    $('.detail-element-header .text').html(callingElement);
                    $('.detail-element-header .caption').html('Inclination change +10');
                }
                else if (callingElement === 'AssetSemaphore3') {
                    $('.temperature-widget').trigger('drawTemperature',15.7);
                    $('.pitch-widget').trigger('drawPitch', 23);
                    $('.detail-element-header .text').html(callingElement);
                    $('.detail-element-header .caption').html('Voltage < 10V<br/>Inclination change +10');
                }
                else if (callingElement === 'AssetSemaphore4') {
                    $('.temperature-widget').trigger('drawTemperature',14.8 );
                    $('.pitch-widget').trigger('drawPitch', 90);
                    $('.detail-element-header .text').html(callingElement);
                    $('.detail-element-header .caption').html('No red light for +5m');
                }
                else if (callingElement === 'AssetSemaphore5') {
                    $('.temperature-widget').trigger('drawTemperature',14.8);
                    $('.pitch-widget').trigger('drawPitch', 90);
                    $('.detail-element-header .text').html(callingElement);
                    $('.detail-element-header .caption').html('No problems detected');
                }
                else {
                    console.log('Received unexpected asset id');
                }
            });
            
        }); // requirejs
    }
);
