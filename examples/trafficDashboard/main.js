// =============================================================================
// Telefonica I+D
// -----------------------------------------------------------------------------
// Notes:
//  * Change assetsURL if necessary to be able to access device data
//  * When moved to kermit,
// =============================================================================

requirejs.config({
    baseUrl: '../../'
});

define(
        [
            'components/dashboard/dashboard',
            'components/minimap',
            'components/dashboard/overview_subpanel',
            'components/dashboard/overview_subpanel_list',
            'components/paged_container',
            'components/detail_panel',
            'components/map',
            'components/mapViewer',
            'components/widget_temperature',
            'components/widget_pitch',
            'components/widget_lights',
            'components/widget_battery'
        ],
        function() {

            requirejs(['components/jquery_plugins'], function() {
                var markerColorWarn = '#CB3337';
                var markerColorOk = '#5E91A0';
                var useKermit = false;
                var centerOnLoad = false;
                var centerOnClick = false;

                /* Testing URL */
                var assetsURL;
                var assetsDetailedURL;
                if (!useKermit) {
                    assetsURL = '/m2m/v2/services/TrafficLightsDE/assets';
                    assetsDetailedURL = assetsURL + '?detailed=1';
                }
                else {
                    var service = Kermit.$injector.get('$user').credential.serviceName;
                    assetsURL = '/secure/m2m/v2/services/' + service + '/assets';
                    assetsDetailedURL = assetsURL + '?detailed=1';
                }

                /* Gallus, germany */
                // var initialCenter = {lat: 50.103749, lon: 8.641774};
                var initialCenter = {lat: 50.456729, lon: 7.485};

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
                //@TODO exportar a m2m-dashboard
                var getErrors = function(sensorData){
                    var errors = [];
                    $.each(sensorData, function(index, value) {
                        if ('ms' in value) {
                            // Evaluate error conditions
                            if (value.ms.p === 'voltage' && window.parseInt(value.ms.v) < 10) {
                                errors.push('Voltage < 10V');
                            }
                            else if (value.ms.p === 'pitch') {
                                var pitch = parseInt(value.ms.v);
                                if (pitch < 80 || pitch > 100) {
                                    errors.push('Inclination change +10');
                                }
                            }
                            else if (value.ms.p === 'greenLight' && value.ms.v === 'error') {
                                errors.push('Green light error');
                            }
                            else if (value.ms.p === 'yellowLight' && value.ms.v === 'error') {
                                errors.push('Yellow light error');
                            }
                            else if (value.ms.p === 'redLight' && value.ms.v === 'error') {
                                errors.push('Red light error');
                            }
                        }
                        var a = null;
                    });
                    return errors;
                };

                //@TODO exportar a m2m-dashboard
                var generateErrorText = function(sensorData) {
                    var errors = getErrors(sensorData).join(' <br/> ');
                    return errors;
                };
                //@TODO export to m2m-dashboard
                var updateAssetInfoFn = function (response) {
                    var assetName = response.data.asset.name;
                    var erromsg;

                    // Update selected element name
                    $('.panel-detail .detail-element-header .text').html(assetName);
                    if(response.data.errors.length){
                        erromsg = generateErrorText(response.data.sensorData);
                        $('.detail-errors').html(erromsg);
                    }
                    var last_update = 'Last update: ';
                    if (response.data.sensorData.length > 0)
                        last_update += response.data.sensorData[0].st;
                    else
                        last_update += 'unknown';
                    $('.panel-detail .detail-element-header .caption').html(last_update);
                    // Get asset data
                    $.each(response.data.sensorData, function(index, value) {
                        if ('ms' in value) {
                            if (value.ms.p === 'temperature') {
                                $('.temperature-widget').trigger('drawTemperature', parseFloat(value.ms.v));
                            }
                            else if (value.ms.p === 'pitch') {
                                $('.pitch-widget').trigger('drawPitch', parseInt(value.ms.v));
                            }
                            else if (value.ms.p === 'voltage') {
                                $('.battery-widget').trigger('drawBattery-voltage', parseFloat(value.ms.v));
                            }
                            else if (value.ms.p === 'batteryStatus') {
                                $('.battery-widget').trigger('drawBattery-level', value.ms.v);
                            }
                        }
                    });

                };

                var updateCenter = function () {
                    var url = assetsURL + '?detailed=1';
                    var fn = function (response) {
                        if (response.count != 0) {
                            var lat = response.data[0].asset.location.latitude;
                            var lon = response.data[0].asset.location.longitude;
                            $('.mapbox').trigger('center-map', [lat,lon]);
                        }
                        else {
                            console.log('No data found!');
                        }
                    };

                    requestApiData(url,fn);

                    updateOffscreenIndicators();
                };
                var createTooltip = function (feature, isSelected) {
                    var ele = $('<h2>');
                    var submarkers = feature.properties.submarkers;
                    var warns = 0;

                    if (submarkers && submarkers.length){
                        if (!isSelected) {
                            $.each(submarkers, function (k,v) {
                                if (v.properties['marker-color'] === markerColorWarn){
                                    warns += 1;
                                }
                            });
                            var ok = $('<h2>')
                                .addClass('tooltip-unselected')
                                .addClass('tooltip-unselected-ok')
                                .html(submarkers.length - warns);
                            var errors = $('<h2>')
                                .addClass('tooltip-unselected')
                                .addClass('tooltip-unselected-errors')
                                .html(warns);
                            ele = $('<div>').append(errors).append(ok);
                        }
                        else {
                            ele = $('div');
                            var listElement = $('<ul>').appendTo(ele);
                            $.each(submarkers, function (k,v) {
                                var selClass = '';
                                if (v.properties['marker-color'] === markerColorWarn) {
                                    selClass += ' tooltip-unselected-error';
                                }
                                else {
                                    selClass += ' tooltip-unselected-ok';
                                }
                                var elem = $('<li>')
                                        .addClass('tooltip-selector')
                                        .addClass(selClass)
                                        .html(v.properties.title);
                                listElement.append(elem);
                            });
                        }
                    }else{
                        ele.html(feature.properties.title);
                    }

                    return ele.html();

                };
                // =============================================================
                // Prepare dashboard
                // =============================================================

                //<editor-fold defaultstate="collapsed" desc="Component list">
                var compList = [
                    {
                        component: 'OverviewSubpanel',
                        className: 'detail-element-header'
                    },
                    {
                        component: 'container',
                        className: 'detail-errors'
                    },
                    {
                        component: 'detailPanel',
                        header: 'Physical conditions',
                        id: 'physical-conditions',
                        items: [
                            {
                                component: 'temperatureWidget',
                                className: 'temperature-widget'
                            },
                            {
                                component: 'pitchWidget',
                                className: 'pitch-widget'
                            }
                        ]
                    },
                    {
                        component: 'detailPanel',
                        header: 'Light color',
                        id: 'light-color',
                        items: [
                            {
                                component: 'lightsWidget',
                                className: 'lights-widget'
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
                                listenTo: 'itemselected'
                            }
                        ]
                    }
                ];
                //</editor-fold>

                // For kermit install.js
                //dashboard.m2mdashboard({
                $('.dashboard').m2mdashboard({
                    mainContent: [
                        {
                            component: 'mapViewer',
                            map: {
                                id: 'keithtid.map-w594ylml',
                                center: initialCenter,
                                maxZoom: 20,
                                minZoom: 5,
                                initialZoom: 13,
                                zoomButtons: true,
                                showTooltip: true,
                                groupMarkers: true
                            },
                            markerClicked: {
                                center: centerOnClick
                            },
                            customTooltip: createTooltip,
                            createOffscreenIndicators: true,
                            model: function(features) {
                                return $.map(features, function(f) {
                                    var markerColor = (f.errors.length) ? markerColorWarn : markerColorOk;
                                    var location = f.asset && f.asset.location;
                                    var marker;
                                    if (location) {
                                        marker = {
                                            geometry: {
                                                coordinates: [location.longitude, location.latitude]
                                            },
                                            properties: {
                                                'marker-color': markerColor,
                                                'marker-symbol': 'circle',
                                                'title': f.asset.name
                                            },
                                            item:f
                                        };
                                    }

                                    return marker;
                                });

                            }
                        }
                    ],
                    detailsPanel:{
                        items:[
                            {
                                component: 'pagedContainer',
                                className: 'panel-detail',
                                alwaysVisible:[0,1],
                                items: compList
                            }
                        ]
                    },
                    overviewPanel: {
                        title: 'Lights with warnings',
                        // count: 10,//@TODO esto no funciona porque Dashboard no lo lee
                        items: [
                            {
                                component: 'pagedContainer',
                                className: 'panel-list',
                                header: '',
                                ID: 'panel-list',
                                selectElements: '.repeat-container',
                                items: [
                                    {
                                        component: 'OverviewSubpanelList',
                                        iconClass: 'marker-red',
                                        className: 'panel-list',
                                        ID: 'panel-list',
                                        text: function(data) {
                                            var value = '';
                                            if(data && data.asset){
                                                value = data.asset.name;
                                            }
                                            return value;
                                        },
                                        caption: function(data) {
                                            var value = '';
                                            if(data && data.sensorData){
                                                value = generateErrorText(data.sensorData);
                                            }
                                            return value;
                                        },
                                        filter : function(item){
                                            return (item.errors.length>0);
                                        }
                                    }

                                ]
                            }

                        ]
                    },
                    data: function(cb) {
                            var onLoadData = function(assets){
                                $.each(assets.data, function(i, item){
                                    item.errors = getErrors(item.sensorData);
                                });
                                cb(assets.data);
                                if (centerOnLoad) updateCenter();

                                $('.dashboard .paged-container').trigger('update');
                            }
                            requestApiData('data/assets.json', onLoadData);
/*
                            window.setInterval(function () {
                                requestApiData('data/assets.json', onLoadData);
                            }, 5000);
                            */
                    },
                    itemData: function(item, cb) {
                            var results = [];
                            var paintLights = function(response) {
                                results.push(response);
                                if(results.length === 3){
                                    $('.lights-widget').trigger('paintLights', [results[0], results[1], results[2]]);
                                }
                            };
                            var selectFeature = function(errors){
                                return function (sel, prev) {
                                    if (sel !== prev) {
                                        var currentColor = sel.properties['marker-color'];
                                        sel.properties['customMarkerBuilder'] = function(a, b){
                                            var div = $('<div />').addClass('marker');
                                            var cls = (errors.length ?
                                                'marker-red-selected-large' : 'marker-blue-selected-large');
                                            div.addClass(cls);

                                            return div[0];
                                        };
                                        $('.mapbox-mini').trigger('valueChange',{
                                            value: {
                                                markerModel:sel
                                            }
                                        });
                                        if (prev !== null) {
                                            prev.properties['marker-size'] = 'medium';
                                            delete prev.properties['customMarkerBuilder'];
                                        }
                                    }
                                };
                            };

                            requestApiData('data/AssetSemaphore.json', function(data){
                                data.data.errors = getErrors(data.data.sensorData);
                                $('.panel-detail').show();
                                $('.panel-list').hide();
                                $('.panel-detail').trigger('update-view');
                                updateAssetInfoFn(data);
                                $('.mapbox').trigger('select-feature', [data.data.asset.name, selectFeature( data.data.errors)]);
                                $('.detail-element-header .icon').
                                    removeClass('marker-red-selected').
                                    removeClass('marker-blue-selected');
                                $('.detail-element-header .icon').
                                    addClass( data.data.errors.length?'marker-red-selected':'marker-blue-selected' );
                            });
                            requestApiData('data/redLight.json', paintLights);
                            requestApiData('data/greenLight.json', paintLights);
                            requestApiData('data/yellowLight.json', paintLights);
                    }
                }
            );

                $('.panel-detail').hide();

                // Update widgets
                $('.temperature-widget').trigger('drawTemperature');
                $('.pitch-widget').trigger('drawPitch');
                $('.lights-widget').trigger('drawLights');
                $('.battery-widget').trigger('drawBattery');


                // =============================================================
                // Trigger listeners
                // =============================================================

                $('.fit-minimap').parent().siblings('.detail-panel-header').click(
                    function () {
                        $('.mapbox-mini').trigger('center');
                    }
                );
                $('.dashboard').on('click', '.overview-header', function() {
                    //$('.panel-detail').hide();
                    $('.panel-list').show();
                    $('.paged-container').trigger('update');
                    $('.mapbox').trigger('unselect-feature', function(feature){
                        feature.properties['marker-size'] = 'medium';
                        delete feature.properties['customMarkerBuilder'];
                    });

                });
                $('.dashboard').on('valueChange', function(e,data){
                    var count = data.value.length;
                    $('.dashboard-overview-panel .overview-count', this).text(count);
                });
                $('.dashboard-details-panel').on('expanded', function(){
                    $( this ).trigger('resize');
                    $('.panel-detail').trigger('update');
                });
                $('.dashboard').on('pageChanged', '.panel-detail', function(){
                    $('.mapbox-mini').trigger('draw');
                });

            }); // requirejs
        }
);
