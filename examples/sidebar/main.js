requirejs.config({
    baseUrl: '/m2m-nitro-components'
});

define(
    [
        'components/dashboard/dashboard',
        'components/minimap',
        'components/dashboard/overview_subpanel',
        'components/paged_panel',
        'components/detail_panel'
    ],
  
    function() {
  
        requirejs(['components/jquery_plugins'], function() {

            $('.dashboard').m2mdashboard({
                mainContent: [],
                overviewPanel: {
                    title: 'Sidebar details: IDAS-8815',
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
                                            caption: 'Subpanel comp2'
                                        }
                                    ]
                                },
                                /*{
                                    component: 'OverviewSubpanel',
                                    iconClass: 'dot red',
                                    text: 'First component',
                                    caption: 'Always visible on first page'    
                                },*/
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
