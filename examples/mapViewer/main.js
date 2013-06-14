

/* Test.........................................................................
        
$('.mapbox').trigger('add-feature', 
    [{
        geometry: { coordinates: [ -3.675, 40.515] },
        properties: {
            'id':3,
            'marker-color':'#0040FF',
            'marker-symbol':'triangle',
            'title':'Marker 3',
            'status': 'error'
        }
    }]
);
*/

requirejs.config({
    baseUrl: '../../'
});

define(
    [
    'components/dashboard/dashboard',
    'components/mapViewer'
    ],
    
    function() {

        requirejs(['components/jquery_plugins'], function() {
        
        $('.dashboard').m2mdashboard({
            mainContent: [{
                component: 'mapViewer',
                map: {
                    id: 'keithtid.map-w594ylml',
                    center: {lat: 40.515, lon: -3.665},
                    maxZoom: 20,
                    minZoom: 4,
                    initialZoom: 15,
                    zoomButtons: true,
                    showTooltip: true
                },
                markerClicked: {
                    center: true,
                    onClickFn: function (f, previous, dom) {
                        // Change marker size
                        if (f.properties['marker-size'] === 'large') {
                            f.properties['marker-size'] = 'medium';
                        }
                        else f.properties['marker-size'] = 'large';
                        if (previous !== null) {
                            previous.properties['marker-size'] = 'medium';
                        }
                        console.log('Marker clicked: ' + f);
                    }
                },
                customTooltip: function (feature) {
                    return '<h2 style="color:red; background-color:black;">Custom: ' 
                            + feature.properties.title + " !</h2>";
                },
                whenZoomed: function (f) {
                    console.log('zoomed!');
                },
                whenPanned: function (f) {
                    console.log('panned!');
                },
                featuresPreprocessor: function (f,map) {
                    console.log('Preprocessing features: ' + f);
                    return f;
                },
                createOffscreenIndicators: true,
                features: [
                    {   
                        geometry: { coordinates: [ -3.665, 40.515] },
                        properties: {
                            'marker-color':'#000',
                            'marker-symbol':'police',
                            'title': 'Marker 1'
                        }
                    },
                    {
                        geometry: { coordinates: [ -3.670, 40.515] },
                        properties: {
                            'marker-color':'#DC1010',
                            'marker-symbol':'circle',
                            'title': 'Marker 2'
                        }
                    }
                ]
            }],
                overviewPanel: {},
                data: function() {}
            });
            
            $('.dashboard').on('feature-announcement', function (event, features) {
                console.log('Anounced features: ' + features);
            });  
            
        });
            
          
            
    }
);