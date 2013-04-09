
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
                    contenido: 'Contenido de ejemplo',
				    center: { lat: 40.515512, lon: -3.65 }, 
	  			    zoomInitial: 14,
				    zoomMin: 1,
				    zoomMax: 22,
                    hostDiv: 'dashmap',
				    markers: [
				        { lat:40.5155,lon:-3.6650 }, 
					    { lat:40.5125, lon:-3.6660, color:'#DC1010' },
					    { lat:40.51, lon:-3.665, color:'#0040FF' }
				    ]
                }],
                overviewPanel: {},
                data: function() {}
            });
        });

        $('#testButton').on(
            'click', 
            function () {
                console.log("Test button clicked");
                $(this).trigger('triggerTest');
                //$('#-zoom-14').trigger('triggerTest');
                //console.log($('#-zoom-14').html());
            }
        );

        $('#testButton').on(
            'addMarker', 
            function () {
                console.log('this works');
            }
        );
       
        $('#testButton').on(
            'triggerTest', 
            function () {
                console.log('Main.js received event :"triggerTest" at ' + Date());
            }
        );
    }
);
