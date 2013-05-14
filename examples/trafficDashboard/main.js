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
        'components/map'
    ],
  
    function() {

        /*
        var swapPanels = function (locator) {
            console.log("Swap locator: " + locator);
        };
        */
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
                    'title': 'Rotonda__1'
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

        var details = {
            component:'pagedPanel',
            name:'pagedDet',
            header:'Asset Details',
            ID:'details',
            items: [
                {
                    component: 'OverviewSubpanel',
                    iconClass: 'dot black',
                    text: 'Detailed asset 1',
                    caption: 'More info pending'
                },
                {
                    component: 'OverviewSubpanel',
                    iconClass: 'dot black',
                    text: 'Detailed asset 2',
                    caption: 'More info pending'
                }    
            ]
        
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
                component: 'OverviewSubpanel',
                className: 'elem2',
                iconClass: 'dot red',
                text: 'Second element',
                caption: 'Sample error 2'
            },
            {
                component: 'OverviewSubpanel',
                className: 'elem3',
                iconClass: 'dot red',
                text: 'Third element',
                caption: 'Sample error 3'
            }
            //, details
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
                            className: 'panel-list',
                            insertionPoint: '.panel-content-list',
                            header: 'Panel List',
                            ID: 'panel-list',
                            items: compList,
                        }
                        ,
                        {
                            component: 'pagedPanel',
                            className: 'panel-detail',
                            insertionPoint: '.panel-content-details',
                            header: 'Panel Details',
                            ID: 'panel-detail',
                            items: [ ]
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
                $('.panel-detail').trigger('load-items', [details]);
            });

            // (DEBUG) Send the initial trigger
            $(this).trigger('update-dashboard', [features, center, zoom]);

            // Hide details on load
            $('.panel-detail').hide();

            // Update paged panel, to adjust components on load
            $('.paged-panel').trigger('update-view');
            
            $(window).bind('resize', function () {
                $('.panel-list').trigger('update-view');    
                $('.panel-detail').trigger('update-view');    
            }); 
        
            $('.overview-subpanel').on('click',function () {
                console.log("Element: " + $(this).attr('class'));
                swapPanels('test');
            });

        }); // requirejs
    }
);
