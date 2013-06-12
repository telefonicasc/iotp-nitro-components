

requirejs.config({
    baseUrl: '/m2m-nitro-components'
});

define(
[
'components/dashboard/dashboard',
'components/mapViewer'
],
    
function() {

    requirejs(['components/jquery_plugins'], function() {
            
        var markerColors = {
            ok: '#000',
            err: '#F00'
        };
        var useKermit = false;    
            
        // =====================================================================    
        /* Service URL setup */
        // =====================================================================
        
        //<editor-fold defaultstate="collapsed" desc="AssetURL & AssetsDetailedURL">

        var assetsURL;
        var assetsDetailedURL;
        if (!useKermit) {
            assetsURL = 'http://localhost:8080/MockApi/mock/assets';
            assetsDetailedURL = 'http://localhost:8080/MockApi/mock/assets?detailed=1';
        }
        else {
            var service = Kermit.$injector.get('$user').credential.serviceName;
            assetsURL = '/secure/m2m/v2/services/' + service + '/assets';
            assetsDetailedURL = assetsURL + '?detailed=1';
        }
        
        //</editor-fold>
        
        // =====================================================================
        // Configure & basic functions
        // =====================================================================
        
        //<editor-fold defaultstate="collapsed" desc="Basic">

        var requestApiData = function (url, callback) {
            if (useKermit) {
                API.http.request({method:'GET', url:url})
                    .success(function (data,status,headers,config) {
                        callback(data);
                    })
                    .error(function (data,status,headers,config) {
                        console.error("Can't access to API REST.");
                    });
            }
            else {
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'json',
                    success: function(response) {
                        callback(response);
                    },
                    error: function (request, errorText, errorThrown) {
                        console.log('error: ' + errorThrown);
                    }
                });
            }
        };
        
        var setAssetMarkers = function (restResponse) {
            var features = [];
            $.each(restResponse.data, function (k,v) {
                var f = {
                    geometry: {
                        coordinates: [
                            v.asset.location.longitude,
                            v.asset.location.latitude
                        ]
                    },
                    properties: {
                        'title': v.asset.name,
                        'caption': v.asset.description,
                        'marker-color': markerColors.ok,
                        'marker-symbol': 'fuel',
                        'marker-size': 'medium'
                    }
                };
                features.push(f);
            });
            if (features.length > 0) {
                $('.mapbox').trigger('set-features', [features]);
                var center = {
                    lat: features[0].geometry.coordinates[1],
                    lon: features[0].geometry.coordinates[0]
                };
                $('.mapbox').trigger('center-map', [center.lat, center.lon]);
            }
        };
        
        var loadMarkersFromService = function () {
            requestApiData(assetsDetailedURL,setAssetMarkers);
        };
        
        var markerClicked = function (feature, previous, dom) {
            if (feature.properties['marker-size'] === 'large') {
                feature.properties['marker-size'] = 'medium';
            }
            else feature.properties['marker-size'] = 'large';
            if (previous !== null) {
                previous.properties['marker-size'] = 'medium';
            }
        };
        
        var customTooltip = function (feature) {
            return feature.properties.title;
        };
        
        var whenZoomed = function (features) {
            
        };
        
        var whenPanned = function (features) {
            
        };
        
        var featuresPreprocessor = function (features, map) {
            return features;
        };
        
        //</editor-fold>
        
        // =====================================================================
        // Dashboard component load
        // =====================================================================
        
        $('.dashboard').m2mdashboard({
            mainContent: [{
                component: 'mapViewer',
                map: {
                    id: 'keithtid.map-w594ylml',
                    center: {lat: 40.515, lon: -3.665 },
                    maxZoom: 18,
                    minZoom: 12,
                    initialZoom: 15,
                    zoomButtons: true,
                    showTooltip: true
                },
                markerClicked: {
                    center: true,
                    onClickFn: markerClicked
                },
                customTooltip: customTooltip,
                whenZoomed: whenZoomed,
                whenPanned: whenPanned,
                featuresPreprocessor: featuresPreprocessor,
                createOffscreenIndicators: true,
                features: [
                    {   
                        geometry: { coordinates: [ -3.664929, 40.51654] },
                        properties: {
                            'marker-color':'#000',
                            'marker-symbol':'fuel',
                            'title': 'Marker 1'
                        }
                    },
                    {
                        geometry: { coordinates: [ -3.66052, 40.513587] },
                        properties: {
                            'marker-color':'#000',
                            'marker-symbol':'fuel',
                            'title': 'Marker 2'
                        }
                    }
                ]
            }],
            overviewPanel: {},
            data: function() {}
        });
            
        // =================================================================
        // Startup
        // =================================================================

        /* On load, do api rest call to get devices and set mapbox markers. */
        loadMarkersFromService();

    });
});
