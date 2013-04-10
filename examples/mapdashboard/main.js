
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
                useToolTipFormatter: true,
                showZoomButtons: true,
				center: { lat: 40.515, lon: -3.667 },
	  			zoomInitial: 14,
				zoomMin: 1,
				zoomMax: 22,
				markers: [
				    { 
                        lat:40.515,
                        lon:-3.665,
                        symbol: 'police',
                        title: 'Marker 1'
                    }, 
					{ 
                        lat:40.515, 
                        lon:-3.670, 
                        color:'#DC1010',
                        title: 'Marker 2'
                    },
					{ 
                        lat:40.515, 
                        lon:-3.675, 
                        color:'#0040FF', 
                        symbol: 'triangle',
                        title: 'Marker 3',
                        description: 'This is marker 3'
                    }
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
                $(this).trigger('triggerTest',{text:'token'});
                $(this).trigger('echo');
            }
        );
               
        $('#testButton').on(
            'triggerTest', 
            function (param) {
                console.log('Main.js received event :"triggerTest" at ' + Date() + ' ' + param.text);
            }
        );

        $(this).on(
            'echo-test',
            function () {
                console.log('Main.js :: trigger["echo-test"]');
            }
        );
    }
);
