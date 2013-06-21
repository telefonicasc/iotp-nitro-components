

requirejs.config({
    baseUrl: '../../'
});

define(
[
    'components/dashboard/dashboard',
    'components/mapViewer',
    'components/minimap',
    'components/dashboard/overview_subpanel',
    'components/paged_container',
    'components/detail_panel',
    'components/widget_temperature',
    'components/widget_battery',
    'components/chart/bar_chart',
    'components/chart/area_chart',
    'components/chart/radar_chart',
    'components/chart/range_selection_chart'
],
    
function() {

    requirejs(['components/jquery_plugins'], function() {

        //<editor-fold defaultstate="collapsed" desc="Variables">
        
        var useKermit = false;
        var markerColors = {
            ok: '#5D909F',
            err: '#CB3337'
        };
        
        var mock = {"totalRegistered":[
                {"date":1356994800000,"value":25},
                {"date":1357081200000,"value":32},
                {"date":1357081200000,"value":12},
                {"date":1357081200000,"value":45},
                {"date":1357081200000,"value":29}
        ]};
    
        // DEBUG only:
        //<editor-fold defaultstate="collapsed" desc="Full mock">
        
//        var mock = {
//           "totalRegistered":[
//              {
//                 "date":1356994800000,
//                 "value":25
//              },
//              {
//                 "date":1357081200000,
//                 "value":32
//              },
//              {
//                 "date":1357167600000,
//                 "value":39
//              },
//              {
//                 "date":1357254000000,
//                 "value":45
//              },
//              {
//                 "date":1357340400000,
//                 "value":53
//              },
//              {
//                 "date":1357426800000,
//                 "value":58
//              },
//              {
//                 "date":1357513200000,
//                 "value":66
//              },
//              {
//                 "date":1357599600000,
//                 "value":72
//              },
//              {
//                 "date":1357686000000,
//                 "value":77
//              },
//              {
//                 "date":1357772400000,
//                 "value":84
//              },
//              {
//                 "date":1357858800000,
//                 "value":89
//              },
//              {
//                 "date":357945200000,
//                 "value":97
//              },
//              {
//                 "date":1358031600000,
//                 "value":104
//              },
//              {
//                 "date":1358118000000,
//                 "value":109
//              },
//              {
//                 "date":1358204400000,
//                 "value":115
//              },
//              {
//                 "date":1358290800000,
//                 "value":123
//              }
//           ]
//        };
        //</editor-fold>
        
        //</editor-fold>
    
        //<editor-fold defaultstate="collapsed" desc="Methods">
            
        // =====================================================================    
        /* Service URL setup */
        // =====================================================================
        
        //<editor-fold defaultstate="collapsed" desc="AssetURL & AssetsDetailedURL">
//        alert(document.location.hostname);
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
        
        var assets2markers = function (assetDetailedList) {
            var markers = [];
            $.each(assetDetailedList, function (k,v) {
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
                markers.push(f);
            });
            return markers;
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
                // Some features might not be valid, so I request an autocenter
                // instead of a regular center
                $('.mapbox').trigger('autocenter');                
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
            
            // Show info panel
            $('.dashboard').trigger('show-details');
            $('.panel-detail').trigger('update');
            this.updateMinimap(null, m);
        };
        
        var updateSelectedAssetInfo = function (feature) {
            var assetName = feature.properties.title;
            var assetInfoURL = assetsURL + '/' + assetName;
            requestApiData(assetInfoURL,updateAssetView);            
        };
        
        var updateMinimap = function (f,m) {
            var data = {};
            data.value = f;
            data.value.markerModel = m;
            $('.minimap').trigger('valueChange', data);
        };
        
        //</editor-fold>
        
        
        // =====================================================================
        // Dashboard component load
        // =====================================================================
        
        //</editor-fold>
        
        //<editor-fold defaultstate="collapsed" desc="Load dashboard">
        
        //<editor-fold defaultstate="collapsed" desc="Components">
        
        var detailedHeader = {
                component: 'OverviewSubpanel',
                className: 'detail-element-header',
                iconClass: 'marker-red',
                text: '',
                caption: ''
            };
            
        var detailedConditions = {
                component: 'detailPanel',
                header: 'Physical conditions',
                id: 'physical-conditions',
                items: [
                    {
                        component: 'temperatureWidget',
                        className: 'temperature-widget'
                    }
                ]
            };
        
        var detailedFillLevel = {
                component: 'detailPanel',
                header: 'Fill level',
                items: [
                    {
                        component: 'chartContainer',
                        rangeField: 'totalRegistered',
                        valueField: 'totalRegistered',
                        className: 'chart',
                        marginRight: 45,
                        marginBottom: 8,
                        grid: true,
                        axisy: true,
                        model: function (f) {
                            return f.selected.mock;
                        },
                        charts: [{
                            type: 'areaChart',
                            tooltip: true,
                            model: 'totalRegistered',
                            rangeField: 'totalRegistered',
                            cssClass: 'cyan'
                        }]
                    }
                ]
            };
        
        var detailedBattery = {
                component: 'detailPanel',
                header: 'Battery Level',
                id: 'battery-level',
                items: [
                    {
                        component: 'batteryWidget',
                        className: 'battery-widget'
                    }
                ]
            };  
            
        var detailedMinimap = {
                component: 'detailPanel',
                header: 'Last Location',
                id: 'last-location',
                items: [
                    {
                        component: 'minimap',
                        mapId: 'keithtid.map-z1eeg2ge',
                        zoomValue: 16,
                        movable: true,
                        model: function (v) {debugger
                            return v.item.asset;
                        },
                        containerClass: 'minimap'
                    }
                ]
            };
            
        var mainMap = {
                component: 'mapViewer',
                model: 'detailed',
                map: {
                    id: 'keithtid.map-w594ylml',
                    center: {lat: 40.515, lon: -3.665 },
                    maxZoom: 18,
                    minZoom: 5,
                    initialZoom: 15,
                    zoomButtons: true,
                    showTooltip: true,
                    groupMarkers: true
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
                markerSimpleSymbol: 'fuel',
                features: []
            };        
        
        //</editor-fold>
                
        $('.dashboard').m2mdashboard({
            
            //<editor-fold defaultstate="collapsed" desc="Configuration">
            mainContent: [mainMap],
            
            overviewPanel: {
                title: 'Tanks with warnings',
                count: 0,
                items: [
                    {
                        component: 'pagedContainer',
                        className: 'panel-list',
                        header: '',
                        items: []
                    },
                    {
                        component: 'pagedContainer',
                        className: 'panel-detail',
                        alwaysVisible: [0, 1],
                        items: [ 
                            detailedHeader,
                            detailedConditions,
                            detailedFillLevel,
                            detailedBattery,
                            detailedMinimap
                        ]
                    }
                ]
            },
            //</editor-fold>
            
            //<editor-fold defaultstate="collapsed" desc="Data binding">
        
            data: function(callback) {
                
                var acc = {count:0, historic: []};
                
                var updateHistoric = function (data) {
                    if (acc.count < acc.assetList.data.length) {
                        if (data !== undefined) acc.historic.push(data);
                        var url = assetsURL + '/' + acc.assetList.data[acc.count].asset.name 
                                + '/data?attribute=fillLevel&limit=10';
                        acc.count += 1;
                        var handleError = function () {
                            console.warn('Update historic query failure: ' + url);
                            updateHistoric();
                        };
                        $.getJSON(url, updateHistoric).fail(handleError);
                    }
                    else {
                        if (data !== undefined) acc.historic.push(data);
                        callback(acc);
                    }
                };
                
                $.getJSON(assetsURL, function(data) {
                    acc.assetList = data;
                    acc.selected = { name: '', fillHistorical: [], mock: mock};
                    $.getJSON(assetsDetailedURL, function (data) {
                        acc.detailed = data;
                        acc.detailed.format = 'asset';
                        // Generate features
                        acc.detailed.features = [];
                        $.each(acc.detailed.data, function (k,v) {
                            acc.detailed.features.push(v);
                        });
                        
                        updateHistoric();
                    });                    
                });
            }
            //</editor-fold>
        });
        
        //</editor-fold>
            
        //<editor-fold defaultstate="collapsed" desc="Startup & Event handlers">
        // =====================================================================
        // Startup
        // =====================================================================

        var template_error_details = '<div class="detail-errors"></div>';
        $('.detail-element-header').after(template_error_details);
        
        // Init widgets
        $('.temperature-widget').trigger('drawTemperature');
        $('.battery-widget').trigger('drawBattery');

        // On load, do api rest call to get devices and set mapbox markers. 
        // loadMarkersFromService();
        
        $('.panel-detail').hide();
        $('.overview-count').html(0);
        
        // API =================================================================
        $('.dashboard').on('show-details', showDetails);
        $('.dashboard').on('hide-details', hideDetails);
        $('.overview-header').on('click', hideDetails);
        $('.dashboard').on('itemselected', function (k,v) { 
            updateMinimap(v,assets2markers(v)[0]) 
        });
        //</editor-fold>
    });
});
