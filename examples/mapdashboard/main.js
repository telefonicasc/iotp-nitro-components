
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
                showZoomButtons: true,
                hoveringTooltip: true,
                debug: true,
				center: { lat: 40.515, lon: -3.667 },
	  			zoomInitial: 15,
				zoomMin: 10,
				zoomMax: 20,
                unselectedSymbol: 'circle',
                selectedSymbol: 'star-stroked',
                unselectedColor: '#0040FF',
                selectedColor: '#DC1010',
                centerOnClick: true,
                features: [
                    {   
                        geometry: { coordinates: [ -3.665, 40.515] },
                        properties: {
                            'id': 1,
                            'marker-color':'#000',
                            'marker-symbol':'police',
                            'title': 'Marker 1',
                            'status': 'ok'

                        }                        
                    },
                    {
                        geometry: { coordinates: [ -3.670, 40.515] },
                        properties: {
                            'id':2,
                            'marker-color':'#DC1010',
                            'marker-symbol':'circle',
                            'title': 'Marker 2',
                            'status': 'ok'
                        }
                    },
                    {
                        geometry: { coordinates: [ -3.675, 40.515] },
                        properties: {
                            'id':3,
                            'marker-color':'#0040FF',
                            'marker-symbol':'triangle',
                            'title':'Marker 3',
                            'status': 'error'
                        }
                    }
                ],
            }],
                overviewPanel: {},
                data: function() {}
            });
        });

        $('#testButton').on(
            'click', 
            function () {
                console.log("Test button clicked");
                $(this).trigger('echo-test');
                $('.mapbox').trigger('update-marker-views',{title: 'Marker 1'});
                $('.mapbox').trigger('update-marker-model',{title: 'Marker 1'});
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
