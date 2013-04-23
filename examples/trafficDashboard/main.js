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
                        features: [
                            {
                                geometry: { coordinates: [ -3.662782, 40.515528 ] },
                                properties: {
                                    'marker-color':'#DF0101',
                                    'marker-symbol':'rail-underground',
                                    'title': 'Ronda de la Comunicacion',
                                }
                            },
                            {
                                geometry: { coordinates: [ -3.6665, 40.51535 ] },
                                properties: {
                                    'marker-color':'#0101DF',
                                    'marker-symbol':'industrial',
                                    'title': 'Telefonica I+D'
                                }
                            }
                        ]
                    }
                ],
                overviewPanel: {
                    title: 'Traffic Lights',
                    items: [
                        {
                            component: 'pagedPanel',
                            //insertionPoint: '.paged-content',
                            items: [
                                {
                                    component: 'detailPanel',
                                    header: 'Detail Panel',
                                    id: 'DT-Panel',
                                    items: [
                                        {
                                            component: 'OverviewSubpanel',
                                            iconClass: 'dot black',
                                            text: 'First',
                                            caption: 'Subpanel comp 1'
                                        },
                                        {
                                            component: 'OverviewSubpanel',
                                            iconClass: 'dot red',
                                            text: 'Second',
                                            caption: 'Subpanel comp 2'
                                        }
                                    ]
                                },
                                {
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
                                },
                                {
                                    component: 'OverviewSubpanel',
                                    iconClass: 'dot green',
                                    text: 'Token A',
                                    caption: 'First Paged Token'    
                                },
                                {
                                    component: 'OverviewSubpanel',
                                    iconClass: 'dot blue',
                                    text: 'Token B',
                                    caption: 'Second Paged Token' 
                                }
                            ]
                        }                        
                    ]
                },
                data: function() {

                }
            });

        });
    }
);
