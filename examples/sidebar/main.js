requirejs.config({
    baseUrl: '/m2m-nitro-components'
});

define(
    [
        'components/dashboard/dashboard',
        'components/minimap',
        'components/dashboard/overview_subpanel',
        'components/paged_panel'
    ],
  
    function() {
  
        requirejs(['components/jquery_plugins'], function() {

            $('.dashboard').m2mdashboard({
                mainContent: [],
                overviewPanel: {
                    title: 'Sidebar details task',
                    items: [
                        {
                            component: 'pagedPanel',
                            //insertionPoint: '.paged-content',
                            items: [
                                {
                                    component: 'minimap',
                                    zoomValue: 16,
                                    movable: true,
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
                                    iconClass: 'dot blue',
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
