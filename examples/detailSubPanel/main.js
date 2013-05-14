requirejs.config({
    baseUrl: '/m2m-nitro-components'
});

define(
    [
        'components/dashboard/dashboard',
        'components/dashboard/overview_subpanel',
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
                            component: 'detailPanel',
                            header: 'Header 1',
                            id: 'hdr-1',
                            items: [
                                {
                                    component: 'OverviewSubpanel',
                                    iconClass: 'dot red',
                                    text: 'Sub Token 1',
                                    caption: 'Token red'    
                                },
                                {
                                    component: 'OverviewSubpanel',
                                    iconClass: 'dot green',
                                    text: 'Sub Token 2',
                                    caption: 'Token green' 
                                }
                            ]
                        },
                        {
                            component: 'detailPanel',
                            header: 'Header 2',
                            id: 'hdr-2',
                            items: [
                                {
                                    component: 'OverviewSubpanel',
                                    iconClass: 'dot red',
                                    text: 'Sub Token 3',
                                    caption: 'Token red'    
                                },
                                {
                                    component: 'OverviewSubpanel',
                                    iconClass: 'dot green',
                                    text: 'Sub Token 4',
                                    caption: 'Token green' 
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
