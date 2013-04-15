requirejs.config({
    baseUrl: '/m2m-nitro-components'
});

define(
    [
        'components/dashboard/dashboard',
        'components/minimap'
    ],
  
    function() {
  
        requirejs(['components/jquery_plugins'], function() {

            $('.dashboard').m2mdashboard({
                mainContent: [{
                    component: 'map',
                    contenido: 'sdlfjsldjkflsdjfsdf'
                }],
                overviewPanel: {
                    title: 'Sidebar details task',
                    items: [
                        {
                            component:'minimap'     
                        }
                    ], 
                },
                data: function() {

                }
            });

        });
    }

);
