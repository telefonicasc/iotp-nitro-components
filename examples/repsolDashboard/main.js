

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
        
      
        //</editor-fold>
        
        // =====================================================================
        // Service methods
        // =====================================================================
        
       
        //<editor-fold defaultstate="collapsed" desc="Service specific methods">
        
        var customTooltip = function (feature, isSelected) {
            if (typeof feature.properties.submarkers !== 'undefined') {
                if (feature.properties.submarkers.length === 0) {
                    return '<h2>' + feature.properties.title + '</h2>';
                }
                else {
                    var submarkers = feature.properties.submarkers;
                    // cool things go here
                    if (!isSelected) {
                        var warns = 0;
                        $.each(submarkers, function (k,v) {
                            if (v.properties['marker-color'] === markerColors.err) warns += 1;
                        });
                        var ok = $('<h2>')
                            .addClass('tooltip-unselected')
                            .addClass('tooltip-unselected-ok')
                            .html(submarkers.length - warns);
                        var errors = $('<h2>')
                            .addClass('tooltip-unselected')
                            .addClass('tooltip-unselected-errors')
                            .html(warns);

                        var content = $('<div>').append(errors).append(ok);
                        return content.html();
                    }
                    else {
                        var html = '<h2>';
                        $.each(submarkers, function (k,v) {
                            var selClass;
                            if (v.properties['marker-color'] === markerColors.err) {
                                selClass += ' tooltip-selected-error';
                            }
                            else {
                                selClass += ' tooltip-selected-ok';
                            }
                            var elem = $('<h3>')
                                    .addClass('tooltip-selector')
                                    .addClass(selClass)
                                    .html(v.properties.title);
                            html = $(html).append(elem);
                        });
                        return '<h2>'+html.html()+'</h2>';
                    }
                }
            }
            else return '<h2>' + feature.properties.title + "</h2>";
        };
        
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
            
            // Update panel-detail-header
            var assetName = info.data.asset.name;
            $('.panel-detail .detail-element-header .text').html(assetName);
            // errors not defined
            $('.panel-detail .detail-element-header .icon').removeClass('marker-red');
            $('.panel-detail .detail-element-header .icon').addClass('marker-blue');
            $('.panel-detail .detail-errors').html('No problems detected');
            
            var last_update = 'Last update: ';
            if (info.data.sensorData.length > 0) last_update += info.data.sensorData[0].st;
            else last_update += 'unknown';
            $('.panel-detail .detail-element-header .caption').html(last_update);
            
            // Show info panel
            $('.dashboard').trigger('show-details');
            $('.panel-detail').trigger('update');
        };
        
        var updateSelectedAssetInfo = function (feature) {
            var assetName = feature.properties.title;
            var assetInfoURL = assetsURL + '/' + assetName;
            requestApiData(assetInfoURL,updateAssetView);
        };
        
        var updateMinimap = function (f,m) {
//            var data = {};
//            data.value = f;
//            data.value.markerModel = m;
//            $('.minimap').trigger('valueChange', data);
        };
        
        var loadData = function (callback) {
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
                acc.selected = { name: '', fillHistorical: []};
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
        };
        
        var modelFillLevel = function (f) {
            var data = $('.dashboard').data().m2mValue.historic;  
            var historic = { fillLevel : [] };
            var found = false;
            var i = 0;
            if (f.historic !== undefined) return historic;

            while (!found && i < data.length) {
                if (data[i].asset === f.asset.name) found = true;
                else i += 1;
            }

            if (!found) return historic;

            $.each(data[i].data, function (k,v){
                var entry = {date : Date.parse(v.st), value: v.ms.v};
                historic.fillLevel.push(entry);
            });
            return historic;
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
                    valueField: 'fillLevel',
                    className: 'chart',
                    marginRight: 45,
                    marginBottom: 8,
                    grid: true,
                    axisy: true,
                    model: modelFillLevel,
                    charts: [{
                        type: 'areaChart',
                        tooltip: true,
                        model: 'fillLevel',
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
                    model: function (v) {
                        if (v.detailed !== undefined) 
                            return v.detailed.data[0].asset;
                        else return v.asset;
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
                initialZoom: 14,
                zoomButtons: true,
                showTooltip: true,
                groupMarkers: true
            },
            markerClicked: {
                center: false,
                onClickFn: markerClicked
            },
            customTooltip: customTooltip,
            createOffscreenIndicators: true,
            markerSimpleSymbol: 'fuel',
            features: []
        };        
        
        //</editor-fold>
                
        $('.dashboard').m2mdashboard({            
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
                    }
                ]
            },                    
            detailsPanel: {
                marginTop: 16,
                items: [{
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
                }]
            },      
            data: loadData
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
        
        $('.overview-count').html(0);

        $('.dashboard').on('expanded', function () {
            $('.panel-detail').trigger('update');
        });
        
        $(document).on('click', '.tooltip-selector', function() {
            var m2mValue = $('.dashboard').data().m2mValue;
            var data = m2mValue.detailed.data;
            var title = $(this).html();
            // find correct data
            var i = 0;
            var value = null;
            while (i < data.length && value === null) {
                if (data[i].asset.name === title) value = {item : data[i], data: data[i] };
                else i++;
            }
            if (value !== null) {
                updateAssetView(value);
                $('.dashboard').trigger('itemselected',value);
            }
        });

        //</editor-fold>
    });
});
