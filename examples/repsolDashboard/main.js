

requirejs.config({
    baseUrl: '../../'
});

define(
[
    'components/dashboard/dashboard',
    'components/mapViewer',
    'components/minimap',
    'components/dashboard/overview_subpanel',
    'components/paged_panel',
    'components/paged_detail',
    'components/detail_panel',
    'components/widget_temperature',
    'components/widget_battery'
],
    
function() {

    requirejs(['components/jquery_plugins'], function() {
            
        var markerColors = {
            ok: '#5E91A0',
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
            assetsURL = '/m2m/v2/services/repsolDemo/assets';
            assetsDetailedURL = assetsURL + '?detailed=1';
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
            // Update asset info
            updateSelectedAssetInfo(feature);
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
        // Service methods
        // =====================================================================
        
        var showDetails = function() {
            $('.panel-detail').show();
            $('.panel-list').hide();
            $('.panel-detail').trigger('update-view');
        };

        var hideDetails = function() {
            $('.panel-list').show();
            $('.panel-detail').hide();
        };
        
        //<editor-fold defaultstate="collapsed" desc="Service specific methods">
        
        var updateAssetView = function (info) {
            // Update vidget data
            $.each(info.data.sensorData, function (k,v) {
                try {
                    if (v.ms.p === 'temperature') {
                        $('.temperature-widget').trigger('drawTemperature', parseFloat(v.ms.v));
                    }                    
                    else if (v.ms.p === 'batteryCharge') {
                        $('.battery-widget').trigger('drawBattery-voltage', parseFloat(v.ms.v));
                    }
                    else if (v.ms.p === 'fillLevel') {
                        $('.battery-widget').trigger('drawBattery-level', v.ms.v);
                    }
                }
                catch (err) {}
            });
            
            // Has errors?
            var errors = 0;
            // TODO
            
            // Update panel-detail-header
            var assetName = info.data.asset.name;
            $('.panel-detail .detail-element-header .text').html(assetName);
            // Get asset errors, if any
            if (parseInt($('.warning-item .text:contains("' + assetName + '")').length) !== 0) {
                $('.panel-detail .detail-element-header .icon').removeClass('marker-blue');
                $('.panel-detail .detail-element-header .icon').addClass('marker-red');
                var errors = $('.warning-item .text:contains("' + assetName + '")').siblings('.caption').html();
                $('.panel-detail .detail-errors').html(errors);
            }
            else {
                $('.panel-detail .detail-element-header .icon').removeClass('marker-red');
                $('.panel-detail .detail-element-header .icon').addClass('marker-blue');
                $('.panel-detail .detail-errors').html('No problems detected');
            }
            var last_update = 'Last update: ';
            if (info.data.sensorData.length > 0)
                last_update += info.data.sensorData[0].st;
            else
                last_update += 'unknown';
            $('.panel-detail .detail-element-header .caption').html(last_update);
            
            // Update minimap
            var color = errors === 0 ? markerColors.ok : markerColors.err;
            var feature = {
                geometry: {
                    coordinates: [
                        info.data.asset.location.longitude,
                        info.data.asset.location.latitude
                    ]
                },
                properties: {
                    title: info.data.asset.name,
                   'marker-color': color,  
                   'marker-symbol': 'fuel',  
                   'marker-size': 'medium',
                   isGroup: false,
                   submarkers: []
                }
            };
            $('.minimap').trigger('minimap-update', feature);
            
            // Show info panel
            $('.dashboard').trigger('show-details');
            
        };
        
        var updateSelectedAssetInfo = function (feature) {
            var assetName = feature.properties.title;
            var assetInfoURL = assetsURL + '/' + assetName;
            requestApiData(assetInfoURL,updateAssetView);
        };
        
        
        //</editor-fold>
        
        // =====================================================================
        // Dashboard component load
        // =====================================================================
        
        //<editor-fold defaultstate="collapsed" desc="Component list">
        var detailPanelComponents = [
            {
                component: 'OverviewSubpanel',
                className: 'detail-element-header',
                iconClass: 'marker-red',
                text: '',
                caption: ''
            },
            {
                component: 'detailPanel',
                header: 'Physical conditions',
                id: 'physical-conditions',
                items: [
                    {
                        component: 'temperatureWidget',
                        className: 'temperature-widget'
                    }
                ]
            },
            {
                component: 'detailPanel',
                header: 'Battery Level',
                id: 'battery-level',
                items: [
                    {
                        component: 'batteryWidget',
                        className: 'battery-widget'
                    }
                ]
            },
            {
                component: 'detailPanel',
                header: 'Last Location',
                id: 'last-location',
                items: [
                    {
                        component: 'minimap',
                        mapId: 'keithtid.map-z1eeg2ge',
                        zoomValue: 16,
                        movable: true,
                        listenTo: 'minimap-update',
                        containerClass: 'minimap'
                    }
                ]
            }
        ];
        //</editor-fold>
                
        //<editor-fold defaultstate="collapsed" desc="Load dashboard">
        
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
                    center: false,
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
                            'marker-color':'#F00',
                            'marker-symbol':'fuel',
                            'title': 'ERROR!'
                        }
                    }
                ]
            }],
            overviewPanel: {
                title: 'Tanks with warnings',
                count: 0,
                items: [
                    {
                        component: 'pagedPanel',
                        className: 'panel-list',
                        header: '',
                        ID: 'panel-list',
                        items: []
                    },
                    {
                        component: 'pagedPanel',
                        className: 'panel-detail',
                        extraHeaderGap: 50,
                        alwaysVisible: [0, 1],
                        items: detailPanelComponents
                    }
                ]
            },
            data: function() {}
        });
        
        //</editor-fold>
            
        // =====================================================================
        // Startup
        // =====================================================================

        var template_error_details = '<div class="detail-errors"></div>';
        $('.detail-element-header').after(template_error_details);
        
        // Init widgets
        $('.temperature-widget').trigger('drawTemperature');
        $('.battery-widget').trigger('drawBattery');

        /* On load, do api rest call to get devices and set mapbox markers. */
        loadMarkersFromService();
        
        $('.panel-detail').hide();
        $('.overview-count').html(0);
        
        // API =================================================================
        $('.dashboard').on('show-details', showDetails);
        $('.dashboard').on('hide-details', hideDetails);
        $('.overview-header').on('click', hideDetails);


    });
});
