requirejs.config({
  baseUrl: '/m2m-nitro-components'
});

define(
  [
    'components/dashboard/dashboard',
    'components/map'
  ],
  
  function() {
  
    requirejs(['components/jquery_plugins'], function() {

      $('.dashboard').m2mdashboard({
        mainContent: [{
          component: 'map',
          contenido: 'sdlfjsldjkflsdjfsdf'
        }],
        overviewPanel: {},
        data: function() {

        }
      });

    });
  }

);
